import { db } from "./db";
import crypto from "crypto";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

// Initialize Resend
// Note: If no RESEND_API_KEY is found, we fall back to a mock handler so development is never blocked.
const resendApiKey = process.env.RESEND_API_KEY || "re_mock";
const resend = resendApiKey !== "re_mock" && !resendApiKey.includes("your_")
  ? new Resend(resendApiKey)
  : null;

// Startup diagnostic — printed once when the module is first imported
console.log("[OTP Service] RESEND_API_KEY loaded:", resendApiKey !== "re_mock" ? `${resendApiKey.slice(0, 8)}...` : "NOT SET (mock mode)");
console.log("[OTP Service] RESEND_FROM_EMAIL:", process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev (default)");
console.log("[OTP Service] Resend client initialised:", resend !== null);

/**
 * Hash an OTP string using SHA-256.
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
export function compareOtpHashes(hashA: string, hashB: string): boolean {
  const bufA = Buffer.from(hashA, "hex");
  const bufB = Buffer.from(hashB, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates, stores, and dispatches a 6-digit verification OTP.
 * Enforces a 60-second rate limiting cooldown on resend attempts.
 */
export async function sendOtp(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date();

    // 1. Rate Limiting check
    const existingOtp = await db.verificationOtp.findUnique({
      where: { email },
    });

    if (existingOtp) {
      const secondsSinceCreation = (now.getTime() - existingOtp.createdAt.getTime()) / 1000;
      if (secondsSinceCreation < 60) {
        const secondsRemaining = Math.ceil(60 - secondsSinceCreation);
        return { 
          success: false, 
          error: `Please wait ${secondsRemaining} seconds before requesting a new code.` 
        };
      }
    }

    // 2. Generate cryptographically random 6-digit OTP
    const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const hashedOtp = hashOtp(otp);
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiration

    // 3. Upsert record to database
    await db.verificationOtp.upsert({
      where: { email },
      update: {
        hashedOtp,
        expiresAt,
        createdAt: now,
      },
      create: {
        email,
        hashedOtp,
        expiresAt,
        createdAt: now,
      },
    });

    // 4. Build luxury HTML email matching the Modeon brand
    const htmlEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Modeon Verification Code</title>
          <style>
            body {
              background-color: #F5F3EF;
              color: #111111;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border: 1px solid #E5E2DD;
              text-align: center;
            }
            .logo {
              font-family: 'Cormorant Garamond', Georgia, serif;
              font-size: 28px;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              margin-bottom: 30px;
              color: #111111;
            }
            .title {
              font-size: 16px;
              font-weight: 500;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #6B6862;
              margin-bottom: 20px;
            }
            .otp-box {
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 0.25em;
              color: #C9A96E;
              background-color: #FBFBFA;
              border: 1px dashed #C9A96E;
              padding: 20px;
              margin: 30px 0;
              display: inline-block;
            }
            .expiry-text {
              font-size: 13px;
              color: #6B6862;
              margin-top: 20px;
              line-height: 1.6;
            }
            .footer {
              font-size: 11px;
              color: #A3A099;
              margin-top: 40px;
              border-t: 1px solid #E5E2DD;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">M O D E O N</div>
            <div class="title">Verification Code</div>
            <p style="font-size: 14px; line-height: 1.6; color: #111111;">
              Please use the following single-use verification code to complete your authentication.
            </p>
            <div class="otp-box">${otp}</div>
            <p class="expiry-text">
              This code is valid for <strong>5 minutes</strong>.<br />
              If you did not request this verification, please disregard this email.
            </p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} MODEON. Quietly made. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // 5. Send code
    if (resend) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Modeon Auth <onboarding@resend.dev>";
      console.log(`[OTP] Calling Resend API — from: "${fromEmail}" to: "${email}"`);

      const { data, error: resendError } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Your Modeon verification code",
        html: htmlEmailContent,
      });

      if (resendError) {
        // Log the full Resend error object so nothing is hidden
        console.error("[OTP] Resend API returned an error:", JSON.stringify(resendError, null, 2));
        throw new Error(`Resend API error: ${resendError.message ?? JSON.stringify(resendError)}`);
      }

      console.log(`[OTP] Email successfully dispatched. Resend message id: ${data?.id ?? "(no id returned)"}`);
    } else {
      // Offline/Mock Fallback Mode: Log code in console and write to temporary file
      console.log(`\n==============================================`);
      console.log(`[OTP MOCK DELIVERY] to: ${email}`);
      console.log(`Verification Code: ${otp}`);
      console.log(`==============================================\n`);

      // Write to scratch directory
      const scratchDir = path.join(process.cwd(), ".gemini", "scratch");
      if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true });
      }
      fs.writeFileSync(path.join(scratchDir, "OTP_LOG.txt"), `Email: ${email} | Code: ${otp} | Sent: ${new Date().toISOString()}\n`, { flag: "a" });
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[OTP Service Error]:", err);
    return { success: false, error: "Failed to dispatch verification code." };
  }
}
