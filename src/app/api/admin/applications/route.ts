import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureAdminTables } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const statusFilter = (searchParams.get("status") || "ALL").trim();
    const streamFilter = (searchParams.get("stream") || "ALL").trim();

    const sql = getDb();
    await ensureAdminTables(sql);

    // Fetch all student records with their corresponding challan payment info
    const rows = await sql`
      SELECT 
        s."id",
        s."applicationNo",
        s."cnic",
        s."fullName",
        s."fatherName",
        s."gender",
        s."mobileNo",
        s."email",
        s."province",
        s."district",
        s."degreeLevel",
        s."instituteName",
        s."boardUniversity",
        s."rollNumber",
        s."passingYear",
        s."totalMarks",
        s."obtainedMarks",
        s."percentage",
        s."status",
        s."matricRollNumber",
        s."matricBoard",
        s."matricInstitute",
        s."matricPassingYear",
        s."matricTotalMarks",
        s."matricObtainedMarks",
        s."matricPercentage",
        s."interRollNumber",
        s."interBoard",
        s."interInstitute",
        s."interPassingYear",
        s."interTotalMarks",
        s."interObtainedMarks",
        s."interPercentage",
        s."gradUniversity",
        s."gradRollNumber",
        s."gradProgram",
        s."gradScore",
        s."createdAt",
        s."updatedAt",
        c."psid",
        c."amount" as "challanAmount",
        c."isPaid",
        c."transactionId" as "tid",
        c."receiptUrl",
        c."verifiedByAdmin",
        c."updatedAt" as "paymentSubmittedAt"
      FROM "students" s
      LEFT JOIN "challans" c ON s."id" = c."studentId"
      ORDER BY s."createdAt" DESC
    `;

    await sql.end({ timeout: 2 });

    // Live Summary Stats calculated from actual database records
    let totalRevenue = 0;
    let pendingVerification = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    rows.forEach((row) => {
      const st = (row.status || "").toUpperCase();
      if (st === "APPROVED" || row.verifiedByAdmin || (row.isPaid && st !== "REJECTED")) {
        approvedCount++;
        totalRevenue += parseFloat(row.challanAmount || 475) || 475;
      } else if (st === "REJECTED") {
        rejectedCount++;
      } else {
        // PAYMENT_PENDING or UNDER_REVIEW
        pendingVerification++;
      }
    });

    const stats = {
      totalApplications: rows.length,
      totalRevenue: totalRevenue,
      pendingVerification: pendingVerification,
      approvedCount: approvedCount,
      rejectedCount: rejectedCount,
    };

    // Filter applications by search and filters
    let filtered: any[] = [...rows];

    if (search) {
      filtered = filtered.filter((row) => {
        const name = (row.fullName || "").toLowerCase();
        const cnic = (row.cnic || "").toLowerCase();
        const tid = (row.tid || "").toLowerCase();
        const roll = (row.rollNumber || "").toLowerCase();
        const appNo = (row.applicationNo || "").toLowerCase();
        const phone = (row.mobileNo || "").toLowerCase();
        const email = (row.email || "").toLowerCase();

        return (
          name.includes(search) ||
          cnic.includes(search) ||
          tid.includes(search) ||
          roll.includes(search) ||
          appNo.includes(search) ||
          phone.includes(search) ||
          email.includes(search)
        );
      });
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((row) => {
        const st = (row.status || "").toUpperCase();
        if (statusFilter === "APPROVED") return st === "APPROVED";
        if (statusFilter === "REJECTED") return st === "REJECTED";
        if (statusFilter === "UNDER_REVIEW") return st === "UNDER_REVIEW";
        if (statusFilter === "PAYMENT_PENDING") return st === "PAYMENT_PENDING" || !st;
        return true;
      });
    }

    if (streamFilter !== "ALL") {
      filtered = filtered.filter((row) => {
        const level = (row.degreeLevel || "").toLowerCase();
        if (streamFilter === "Matric") return level.includes("matric");
        if (streamFilter === "Intermediate") return level.includes("inter");
        if (streamFilter === "Undergraduate") return level.includes("undergrad") || level.includes("uni");
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      stats,
      applications: filtered,
      count: filtered.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[admin/applications error]:", error);
    return NextResponse.json(
      { error: "Failed to load candidate applications", details: error?.message },
      { status: 500 }
    );
  }
}
