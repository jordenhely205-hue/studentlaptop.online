import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, cnic, status } = body;

    if (!studentId && !cnic) {
      return NextResponse.json({ error: "Student ID or CNIC is required" }, { status: 400 });
    }

    const validStatuses = ["APPROVED", "REJECTED", "UNDER_REVIEW", "PAYMENT_PENDING"];
    const targetStatus = (status || "").toUpperCase();

    if (!validStatuses.includes(targetStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const sql = getDb();
    const now = new Date();

    // Find student
    let student = null;
    if (studentId) {
      const [s] = await sql`SELECT id, cnic, "fullName" FROM "students" WHERE id = ${studentId} LIMIT 1`;
      student = s;
    } else if (cnic) {
      const [s] = await sql`SELECT id, cnic, "fullName" FROM "students" WHERE cnic = ${cnic.trim()} LIMIT 1`;
      student = s;
    }

    if (!student) {
      await sql.end({ timeout: 2 });
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    // Update Student Status
    await sql`
      UPDATE "students"
      SET "status" = ${targetStatus},
          "updatedAt" = ${now}
      WHERE "id" = ${student.id}
    `;

    // Update Challan Status based on approval
    if (targetStatus === "APPROVED") {
      await sql`
        UPDATE "challans"
        SET "isPaid" = true,
            "verifiedByAdmin" = true,
            "updatedAt" = ${now}
        WHERE "studentId" = ${student.id}
      `;
    } else if (targetStatus === "REJECTED") {
      await sql`
        UPDATE "challans"
        SET "verifiedByAdmin" = false,
            "updatedAt" = ${now}
        WHERE "studentId" = ${student.id}
      `;
    } else if (targetStatus === "PAYMENT_PENDING") {
      await sql`
        UPDATE "challans"
        SET "isPaid" = false,
            "verifiedByAdmin" = false,
            "updatedAt" = ${now}
        WHERE "studentId" = ${student.id}
      `;
    }

    await sql.end({ timeout: 2 });

    return NextResponse.json({
      success: true,
      studentId: student.id,
      fullName: student.fullName,
      status: targetStatus,
      message: `Candidate status updated to ${targetStatus} successfully.`,
    });
  } catch (error: any) {
    console.error("[admin/applications/status error]:", error);
    return NextResponse.json(
      { error: "Failed to update candidate status", details: error?.message },
      { status: 500 }
    );
  }
}
