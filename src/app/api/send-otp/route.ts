import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  ).trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate cryptographically secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 1. Store in Neon Postgres
    let dbSaved = false;
    let dbError = null;
    const dbUrl = getDatabaseUrl();

    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });
      const recordId = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await sql`
        INSERT INTO "otp_verifications" ("id", "email", "otp", "expiresAt")
        VALUES (${recordId}, ${cleanEmail}, ${otp}, ${expiresAt})
      `;

      await sql.end({ timeout: 2 });
      dbSaved = true;
      console.log(`[send-otp] Stored OTP for ${cleanEmail} in Postgres successfully.`);
    } catch (dbErr: any) {
      console.error("[send-otp DB Error] Failed to save OTP in Neon Postgres:", dbErr);
      dbError = dbErr?.message || String(dbErr);
    }

    // 2. Dispatch via Zoho Mail SMTP / Resend
    const emailResult = await sendOtpEmail(cleanEmail, name || "Applicant", otp);

    if (!emailResult.success) {
      console.error("[send-otp API] Email dispatch failed:", emailResult.error);

      // If running locally in development without SMTP_PASS, allow testing with logged OTP
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[DEV MODE ONLY] Generated OTP for ${cleanEmail}: ${otp}`);
        return NextResponse.json({
          success: true,
          message: `Development OTP generated: ${otp}`,
          provider: "development",
          dbSaved,
        });
      }

      return NextResponse.json(
        {
          error: "Failed to dispatch verification OTP to your email address.",
          details: emailResult.error,
          attempts: emailResult.attempts,
          debug: emailResult.debug,
          dbSaved,
          dbError,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification OTP has been sent to ${cleanEmail}`,
      provider: emailResult.provider,
      target: (emailResult as any).target,
      dbSaved,
    });
  } catch (error: any) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      { error: "Failed to dispatch verification OTP", details: error?.message },
      { status: 500 }
    );
  }
}
