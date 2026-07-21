import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
// import * as path from "path";

function loadEnv() {
  const envPath = "c:/Users/SHERY/Desktop/Modeon/.env.local";
  if (!fs.existsSync(envPath)) {
    console.error("No .env.local found at", envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    env[key] = val;
  });
  return env;
}

async function test() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Supabase URL:", url);
  console.log("Supabase Anon Key length:", anonKey ? anonKey.length : 0);

  if (!url || !anonKey) {
    console.error("Missing credentials in env!");
    return;
  }

  const supabase = createClient(url, anonKey);
  console.log("Sending OTP to test@gmail.com...");
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: "test@gmail.com",
    });

    if (error) {
      console.log("API returned error:");
      console.dir(error, { depth: null });
      if ((error as any).cause) {
        console.log("Underlying Cause:");
        console.dir((error as any).cause, { depth: null });
      }
    } else {
      console.log("Success! Data:", data);
    }
  } catch (err) {
    console.error("Caught unexpected exception:");
    console.dir(err, { depth: null });
  }
}

test();
