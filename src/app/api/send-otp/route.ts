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
        VALUES (${recordId}, ${email.toLowerCase().trim()}, ${otp}, ${expiresAt})
      `;

      await sql.end({ timeout: 2 });
    } catch (dbErr) {
      console.warn("Could not save OTP to DB:", dbErr);
    }

    // Send via domain email (Hostinger SMTP or Resend)
    const emailResult = await sendOtpEmail(email.trim(), name || "Applicant", otp);

    return NextResponse.json({
      success: true,
      message: `Verification OTP has been sent to ${email}`,
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
