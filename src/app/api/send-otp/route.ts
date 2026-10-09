import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";

const NEON_DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

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

    // Store in Neon Postgres
    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(NEON_DB_URL, { ssl: "require", max: 1 });
      const recordId = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await sql`
        INSERT INTO "otp_verifications" ("id", "email", "otp", "expiresAt")
        VALUES (${recordId}, ${cleanEmail}, ${otp}, ${expiresAt})
      `;

      await sql.end({ timeout: 2 });
    } catch (dbErr) {
      console.warn("Could not save OTP to DB:", dbErr);
    }

    // Send via Zoho Mail SMTP / Resend
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
        });
      }

      return NextResponse.json(
        {
          error: "Failed to dispatch verification OTP to your email address.",
          details: emailResult.error,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification OTP has been sent to ${cleanEmail}`,
      provider: emailResult.provider,
    });
  } catch (error: any) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      { error: "Failed to dispatch verification OTP", details: error?.message },
      { status: 500 }
    );
  }
}
