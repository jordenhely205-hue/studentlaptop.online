import { NextRequest, NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cnic } = body;

    if (!cnic) {
      return NextResponse.json({ error: "CNIC is required" }, { status: 400 });
    }

    const cleanCnic = cnic.toString().trim();
    const dbUrl = getDatabaseUrl();

    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });

      const existing = await sql`
        SELECT "id", "applicationNo", "fullName" 
        FROM "students" 
        WHERE "cnic" = ${cleanCnic} 
        LIMIT 1
      `;

      await sql.end({ timeout: 2 });

      if (existing && existing.length > 0) {
        return NextResponse.json(
          {
            exists: true,
            error: "An application with this CNIC already exists.",
            applicationNo: existing[0].applicationNo,
          },
          { status: 409 }
        );
      }

      return NextResponse.json({ exists: false, valid: true });
    } catch (dbErr: any) {
      console.error("Neon DB CNIC lookup error:", dbErr);
      return NextResponse.json({ error: "Database query failed", details: dbErr?.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to verify CNIC", details: error?.message }, { status: 500 });
  }
}
