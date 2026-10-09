import { NextRequest, NextResponse } from "next/server";

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
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const cleanOtp = otp.toString().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Strict validation: Must be exactly 6 digits
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { error: "Invalid verification code format. Must be a 6-digit number." },
        { status: 400 }
      );
    }

    // Query Neon PostgreSQL for matching OTP
    const dbUrl = getDatabaseUrl();
    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });

      const records = await sql`
        SELECT "id", "otp", "expiresAt" 
        FROM "otp_verifications" 
        WHERE "email" = ${cleanEmail} AND "otp" = ${cleanOtp}
        ORDER BY "createdAt" DESC 
        LIMIT 1
      `;

      await sql.end({ timeout: 2 });

      if (records && records.length > 0) {
        const record = records[0];
        const now = new Date();
        const expiresAt = new Date(record.expiresAt);

        if (expiresAt > now) {
          return NextResponse.json({ success: true, verified: true, valid: true });
        } else {
          return NextResponse.json(
            { error: "OTP code has expired. Please request a new one." },
            { status: 400 }
          );
        }
      }
    } catch (dbErr: any) {
      console.error("Neon DB query for OTP verification failed:", dbErr);
      return NextResponse.json(
        { error: "Database error during OTP verification.", details: dbErr?.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Invalid verification code. Please check your email or request a new code." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error?.message },
      { status: 500 }
    );
  }
}
