import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/services/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { compareOtpHashes, hashOtp } from "@/lib/services/otp-service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  otp: z.string().length(6).optional(),
  isOtpLogin: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        isOtpLogin: { label: "Is OTP Login", type: "text" }
      },
      async authorize(credentials) {
        console.log("[Auth.js] authorize call. email:", credentials?.email, "isOtpLogin:", credentials?.isOtpLogin);
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          console.warn("[Auth.js] validation failed for credentials:", parsed.error.issues);
          return null;
        }

        const { email, password, otp, isOtpLogin } = parsed.data;

        // 1. OTP Verification Flow
        if (isOtpLogin === "true") {
          if (!otp) {
            console.warn("[Auth.js] OTP token was not provided in OTP login credentials.");
            return null;
          }

          console.log("[Auth.js] retrieving OTP record from database for:", email);
          const activeOtp = await db.verificationOtp.findUnique({
            where: { email }
          });

          if (!activeOtp) {
            console.warn("[Auth.js] no active OTP record found for email:", email);
            return null;
          }

          if (new Date() > activeOtp.expiresAt) {
            console.warn("[Auth.js] active OTP code has expired for email:", email);
            return null;
          }

          console.log("[Auth.js] executing timing-safe OTP verification check...");
          const enteredHash = hashOtp(otp);
          const isMatch = compareOtpHashes(activeOtp.hashedOtp, enteredHash);

          if (!isMatch) {
            console.warn("[Auth.js] incorrect OTP token mismatch for email:", email);
            return null;
          }

          console.log("[Auth.js] OTP matched. Purging verification code database record...");
          await db.verificationOtp.delete({
            where: { email }
          });

          // Fetch or provision user
          let user = await db.user.findUnique({
            where: { email }
          });

          if (!user) {
            console.log("[Auth.js] provisioning new user account for:", email);
            user = await db.user.create({
              data: {
                email,
                name: email.split("@")[0],
                role: "CUSTOMER"
              }
            });
          }

          console.log("[Auth.js] OTP user authenticated successfully:", email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          } as unknown as { id: string; name: string | null; email: string; role: string };
        }

        // 2. Standard Password Login Flow
        if (!password) {
          console.warn("[Auth.js] password field was not provided in standard login.");
          return null;
        }

        console.log("[Auth.js] looking up user email in DB:", email);
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          console.warn("[Auth.js] user lookup returned null for email:", email);
          return null;
        }
        if (!user.password) {
          console.warn("[Auth.js] user has no password (perhaps OAuth user):", email);
          return null;
        }

        console.log("[Auth.js] comparing passwords for email:", email);
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.warn("[Auth.js] password comparison failed for email:", email);
          return null;
        }

        console.log("[Auth.js] user successfully authorized:", email, "role:", user.role);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as unknown as { id: string; name: string | null; email: string; role: string };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("[Auth.js] jwt callback. token:", token.email, "user is present:", !!user);
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "CUSTOMER";
        console.log("[Auth.js] jwt session variables assigned. role:", token.role);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[Auth.js] session callback. user email:", session.user?.email);
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
        console.log("[Auth.js] session values assigned. id:", session.user.id, "role:", (session.user as { role?: string }).role);
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET || "modeon_quiet_luxury_secret_authjs_key_10203040",
  pages: {
    signIn: "/login",
  }
});
