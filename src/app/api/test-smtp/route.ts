import { NextRequest, NextResponse } from "next/server";
import { resolveSmtpCredentials, sendOtpEmail } from "@/lib/email";

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    ""
  ).trim();
}

export async function GET(request: NextRequest) {
  return handleDiagnostic(request);
}

export async function POST(request: NextRequest) {
  return handleDiagnostic(request);
}

async function handleDiagnostic(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let toEmail = searchParams.get("to") || "";

  if (!toEmail && request.method === "POST") {
    try {
      const body = await request.json();
      toEmail = body.to || "";
    } catch {
      // ignore
    }
  }

  // 1. Database Check
  let dbStatus = "Not Tested";
  let dbError = null;
  const dbUrl = getDatabaseUrl();

  if (dbUrl) {
    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });
      const [res] = await sql`SELECT count(*)::int as count FROM "otp_verifications"`;
      dbStatus = `Connected OK. Found ${res.count} OTP records in Neon Postgres.`;
      await sql.end({ timeout: 2 });
    } catch (err: any) {
      dbStatus = "Connection Failed";
      dbError = err?.message || String(err);
    }
  } else {
    dbStatus = "DATABASE_URL environment variable is MISSING";
  }

  // 2. SMTP Credentials Inspection
  const creds = resolveSmtpCredentials();

  // 3. Optional Test Dispatch
  let dispatchResult = null;
  if (toEmail && toEmail.includes("@")) {
    const testOtp = "998877";
    dispatchResult = await sendOtpEmail(toEmail, "Test Candidate", testOtp);
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      database: {
        configured: !!dbUrl,
        host: dbUrl ? dbUrl.split("@")[1]?.split("/")[0] || "configured" : "none",
        status: dbStatus,
        error: dbError,
      },
      smtp: {
        user: creds.user,
        configuredHost: creds.host,
        configuredPort: creds.port,
        matchedPasswordEnvKey: creds.matchedKey,
        passwordMasked: creds.maskedPass,
        hasPassword: !!creds.rawPass,
        passwordRawLength: creds.rawPass.length,
        passwordNoSpacesLength: creds.passNoSpaces.length,
      },
    },
    testDispatch: dispatchResult
      ? {
          recipient: toEmail,
          result: dispatchResult,
        }
      : "Provide ?to=your-email@example.com to trigger an actual test dispatch",
    zohoTroubleshootingGuide: {
      step1: "If you get '535 Authentication Failed': Log into accounts.zoho.com with noreply@studentlaptop.online. Go to Security -> App Passwords -> Generate a 16-character App Password (e.g. named 'Vercel OTP').",
      step2: "In Zoho Mail Admin (mailadmin.zoho.com) -> Users -> noreply@studentlaptop.online -> Mail Settings -> Email Deliverability -> Toggle 'SMTP Access' to ON.",
      step3: "In Vercel Project Settings -> Environment Variables: Set SMTP_PASS to the generated 16-character App Password (without quotes).",
    },
  });
}
