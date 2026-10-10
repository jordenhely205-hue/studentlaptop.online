import { NextRequest, NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";

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
      const dbUrl = getDatabaseUrl();
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });

      // 1. Strict Duplicate CNIC Check
      const existing = await sql`
        SELECT "id", "applicationNo" 
        FROM "students" 
        WHERE "cnic" = ${cleanCnic} 
        LIMIT 1
      `;

      if (existing && existing.length > 0) {
        await sql.end({ timeout: 2 });
        return NextResponse.json(
          { error: "An application with this CNIC already exists." },
          { status: 409 }
        );
      }

      const studentId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const challanId = `chl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date();
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      // 2. Insert Student (Strict insert without overwriting existing records)
      try {
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
        `;
      } catch (insertErr: any) {
        // Handle unique constraint violation (code 23505)
        if (insertErr?.code === "23505" || insertErr?.message?.includes("unique")) {
          await sql.end({ timeout: 2 });
          return NextResponse.json(
            { error: "An application with this CNIC already exists." },
            { status: 409 }
          );
        }
        throw insertErr;
      }

      // 3. Insert Challan Voucher Record
      await sql`
        INSERT INTO "challans" (
          "id", "psid", "amount", "dueDate", "isPaid", "verifiedByAdmin", "studentId", "createdAt", "updatedAt"
        )
        VALUES (
          ${challanId}, ${psid}, 475.00, ${dueDate}, false, false, ${studentId}, ${now}, ${now}
        )
      `;

      await sql.end({ timeout: 2 });
    } catch (dbErr: any) {
      console.error("Neon DB application submission error:", dbErr);
      if (dbErr?.code === "23505" || dbErr?.message?.includes("unique")) {
        return NextResponse.json(
          { error: "An application with this CNIC already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to store application in database", details: dbErr?.message },
        { status: 500 }
      );
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
