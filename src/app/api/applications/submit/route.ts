import { NextRequest, NextResponse } from "next/server";

const NEON_DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      cnic,
      level,
      name,
      fatherName,
      email,
      phone,
      // Sequential Academic Info
      matricRollNumber,
      matricBoard,
      matricInstitute,
      matricPassingYear,
      matricTotalMarks,
      matricObtainedMarks,
      matricPercentage,
      interRollNumber,
      interBoard,
      interInstitute,
      interPassingYear,
      interTotalMarks,
      interObtainedMarks,
      interPercentage,
      gradUniversity,
      gradRollNumber,
      gradProgram,
      gradScore,
    } = data;

    if (!cnic || !name || !fatherName) {
      return NextResponse.json({ error: "Missing required student identity fields" }, { status: 400 });
    }

    const cleanCnic = cnic.trim();
    const appNo = `SLO-${Date.now().toString().slice(-6)}`;
    const psid = `98470${Math.floor(10000 + Math.random() * 90000)}`;

    // Normalize degreeLevel enum
    let dbDegreeLevel: "Matric" | "Intermediate" | "Undergraduate" | "Postgraduate" = "Matric";
    if (level === "Inter") dbDegreeLevel = "Intermediate";
    else if (level === "University") dbDegreeLevel = "Undergraduate";

    // Primary marks fields for students table compatibility
    const primaryRoll = gradRollNumber || interRollNumber || matricRollNumber || "N/A";
    const primaryYear = parseInt(gradProgram ? "2026" : interPassingYear || matricPassingYear || "2026", 10) || 2026;
    const primaryTotal = parseFloat(interTotalMarks || matricTotalMarks || "1100") || 1100;
    const primaryObtained = parseFloat(interObtainedMarks || matricObtainedMarks || "0") || 0;
    const primaryPct = primaryTotal > 0 ? (primaryObtained / primaryTotal) * 100 : 0;
    const primaryInst = gradUniversity || interInstitute || matricInstitute || "Recognized Institute";
    const primaryBoard = gradUniversity || interBoard || matricBoard || "Examination Board";

    try {
      const postgres = (await import("postgres")).default;
      const sql = postgres(NEON_DB_URL, { ssl: "require", max: 1 });

      const studentId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const challanId = `chl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date();
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      // Upsert Student
      await sql`
        INSERT INTO "students" (
          "id", "applicationNo", "cnic", "fullName", "fatherName", "dateOfBirth", "gender", "mobileNo", "email",
          "province", "district", "tehsil", "currentAddress", "degreeLevel", "instituteName", "boardUniversity",
          "rollNumber", "passingYear", "totalMarks", "obtainedMarks", "percentage", "status", "createdAt", "updatedAt",
          "matricRollNumber", "matricBoard", "matricInstitute", "matricPassingYear", "matricTotalMarks", "matricObtainedMarks", "matricPercentage",
          "interRollNumber", "interBoard", "interInstitute", "interPassingYear", "interTotalMarks", "interObtainedMarks", "interPercentage",
          "gradUniversity", "gradRollNumber", "gradProgram", "gradScore"
        )
        VALUES (
          ${studentId}, ${appNo}, ${cleanCnic}, ${name.trim()}, ${fatherName.trim()}, ${now}, 'Unspecified', ${phone || 'N/A'}, ${email || null},
          'Punjab', 'General', 'General', 'Pakistan', ${dbDegreeLevel}, ${primaryInst}, ${primaryBoard},
          ${primaryRoll}, ${primaryYear}, ${primaryTotal}, ${primaryObtained}, ${primaryPct}, 'PAYMENT_PENDING', ${now}, ${now},
          ${matricRollNumber || null}, ${matricBoard || null}, ${matricInstitute || null}, ${matricPassingYear || null}, ${matricTotalMarks || null}, ${matricObtainedMarks || null}, ${matricPercentage || null},
          ${interRollNumber || null}, ${interBoard || null}, ${interInstitute || null}, ${interPassingYear || null}, ${interTotalMarks || null}, ${interObtainedMarks || null}, ${interPercentage || null},
          ${gradUniversity || null}, ${gradRollNumber || null}, ${gradProgram || null}, ${gradScore || null}
        )
        ON CONFLICT ("cnic") DO UPDATE SET
          "fullName" = EXCLUDED."fullName",
          "fatherName" = EXCLUDED."fatherName",
          "mobileNo" = EXCLUDED."mobileNo",
          "email" = EXCLUDED."email",
          "degreeLevel" = EXCLUDED."degreeLevel",
          "instituteName" = EXCLUDED."instituteName",
          "boardUniversity" = EXCLUDED."boardUniversity",
          "updatedAt" = ${now}
      `;

      // Insert Challan
      await sql`
        INSERT INTO "challans" (
          "id", "psid", "amount", "dueDate", "isPaid", "verifiedByAdmin", "studentId", "createdAt", "updatedAt"
        )
        VALUES (
          ${challanId}, ${psid}, 475.00, ${dueDate}, false, false, ${studentId}, ${now}, ${now}
        )
        ON CONFLICT ("studentId") DO UPDATE SET
          "amount" = 475.00,
          "updatedAt" = ${now}
      `;

      await sql.end({ timeout: 2 });
    } catch (dbErr) {
      console.warn("Neon DB upsert error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      applicationNo: appNo,
      psid: psid,
      amount: 475,
      status: "Payment Pending",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit application", details: error?.message }, { status: 500 });
  }
}
