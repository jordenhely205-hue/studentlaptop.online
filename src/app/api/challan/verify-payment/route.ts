import { NextRequest, NextResponse } from "next/server";

const NEON_DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cnic, psid, transactionId, receiptUrl } = body;

    if (!transactionId || transactionId.trim().length < 5) {
      return NextResponse.json(
        { error: "A valid Transaction ID (TID) is required." },
        { status: 400 }
      );
    }

    const cleanTid = transactionId.trim();
    const cleanCnic = (cnic || "").trim();
    const cleanPsid = (psid || "").trim();
    const now = new Date();

    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(NEON_DB_URL, { ssl: "require", max: 1 });

      let studentRow = null;
      if (cleanCnic) {
        const students = await sql`
          SELECT id FROM students WHERE cnic = ${cleanCnic} LIMIT 1
        `;
        if (students.length > 0) {
          studentRow = students[0];
        }
      }

      // Update challan record by psid or studentId
      if (cleanPsid) {
        await sql`
          UPDATE challans
          SET "isPaid" = true,
              "transactionId" = ${cleanTid},
              "receiptUrl" = ${receiptUrl || null},
              "updatedAt" = ${now}
          WHERE "psid" = ${cleanPsid}
        `;
      } else if (studentRow) {
        await sql`
          UPDATE challans
          SET "isPaid" = true,
              "transactionId" = ${cleanTid},
              "receiptUrl" = ${receiptUrl || null},
              "updatedAt" = ${now}
          WHERE "studentId" = ${studentRow.id}
        `;
      }

      // Update student status to UNDER_REVIEW
      if (studentRow) {
        await sql`
          UPDATE students
          SET "status" = 'UNDER_REVIEW',
              "updatedAt" = ${now}
          WHERE "id" = ${studentRow.id}
        `;
      } else if (cleanCnic) {
        await sql`
          UPDATE students
          SET "status" = 'UNDER_REVIEW',
              "updatedAt" = ${now}
          WHERE "cnic" = ${cleanCnic}
        `;
      }

      await sql.end({ timeout: 2 });
    } catch (dbErr) {
      console.warn("Neon DB payment verify update error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      transactionId: cleanTid,
      status: "UNDER_REVIEW",
      displayStatus: "Under Verification",
      message: "Payment submitted successfully. Your transaction is now queued for verification.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to verify payment", details: error?.message },
      { status: 500 }
    );
  }
}
