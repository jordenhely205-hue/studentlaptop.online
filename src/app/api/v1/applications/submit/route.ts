import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitApplicationSchema } from "@/lib/validations";
import { generateApplicationNo, generatePSID, sanitizeCnic } from "@/lib/psid";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate request body with strict Zod schema
    const parseResult = submitApplicationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error: Please review the submitted fields.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const sanitizedCnic = sanitizeCnic(validData.cnic);

    // 2. Pre-check CNIC uniqueness prior to opening transaction
    const existingCandidate = await prisma.student.findUnique({
      where: { cnic: sanitizedCnic },
      select: { id: true, applicationNo: true },
    });

    if (existingCandidate) {
      return NextResponse.json(
        {
          success: false,
          error: "This CNIC is already registered in the system.",
          applicationNo: existingCandidate.applicationNo,
        },
        { status: 409 }
      );
    }

    // 3. Server-side percentage calculation (rounded to 2 decimal places)
    const calculatedPercentage =
      Math.round((validData.obtainedMarks / validData.totalMarks) * 10000) / 100;

    // Configured Challan Due Date: 14 days from submission
    const challanDueDate = new Date();
    challanDueDate.setDate(challanDueDate.getDate() + 14);

    // 4. Execute atomic transaction (prisma.$transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Re-verify CNIC uniqueness inside transaction lock
      const doubleCheck = await tx.student.findUnique({
        where: { cnic: sanitizedCnic },
      });
      if (doubleCheck) {
        throw new Error("CNIC_EXISTS");
      }

      // Generate unique Application Number and 10-digit PSID with collision guards
      let applicationNo = generateApplicationNo();
      let attempts = 0;
      while (
        (await tx.student.findUnique({ where: { applicationNo } })) &&
        attempts < 5
      ) {
        applicationNo = generateApplicationNo();
        attempts++;
      }

      let psid = generatePSID();
      let psidAttempts = 0;
      while (
        (await tx.challan.findUnique({ where: { psid } })) &&
        psidAttempts < 5
      ) {
        psid = generatePSID();
        psidAttempts++;
      }

      // Create Student Record
      const student = await tx.student.create({
        data: {
          applicationNo,
          cnic: sanitizedCnic,
          fullName: validData.fullName.toUpperCase(),
          fatherName: validData.fatherName.toUpperCase(),
          dateOfBirth: new Date(validData.dateOfBirth),
          gender: validData.gender,
          mobileNo: validData.mobileNo,
          email: validData.email || null,
          province: validData.province,
          district: validData.district,
          tehsil: validData.tehsil,
          currentAddress: validData.currentAddress,
          degreeLevel: validData.degreeLevel,
          instituteName: validData.instituteName,
          boardUniversity: validData.boardUniversity,
          rollNumber: validData.rollNumber,
          passingYear: validData.passingYear,
          totalMarks: validData.totalMarks,
          obtainedMarks: validData.obtainedMarks,
          percentage: calculatedPercentage,
          status: "PAYMENT_PENDING",
        },
      });

      // Simultaneously create linked Challan record
      const challan = await tx.challan.create({
        data: {
          studentId: student.id,
          psid,
          amount: 1500.0,
          dueDate: challanDueDate,
          isPaid: false,
        },
      });

      return { student, challan };
    });

    // 5. Return payload containing candidate summary, application number, and PSID
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        applicationNo: result.student.applicationNo,
        psid: result.challan.psid,
        candidateSummary: {
          applicationNo: result.student.applicationNo,
          psid: result.challan.psid,
          fullName: result.student.fullName,
          fatherName: result.student.fatherName,
          cnic: result.student.cnic,
          degreeLevel: result.student.degreeLevel,
          instituteName: result.student.instituteName,
          boardUniversity: result.student.boardUniversity,
          obtainedMarks: result.student.obtainedMarks,
          totalMarks: result.student.totalMarks,
          percentage: result.student.percentage,
          status: result.student.status,
          challanAmount: result.challan.amount,
          challanDueDate: result.challan.dueDate.toISOString(),
          isPaid: result.challan.isPaid,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "CNIC_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          error: "This CNIC is already registered in the system.",
        },
        { status: 409 }
      );
    }

    console.error("Error in /api/v1/applications/submit:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit application. Please try again.",
      },
      { status: 500 }
    );
  }
}
