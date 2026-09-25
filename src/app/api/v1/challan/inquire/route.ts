import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeCnic } from "@/lib/psid";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const psid = searchParams.get("psid")?.trim();
    const cnic = searchParams.get("cnic")?.trim();
    const applicationNo = searchParams.get("applicationNo")?.trim();

    if (!psid && !cnic && !applicationNo) {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'psid', 'cnic', or 'applicationNo' parameter must be provided.",
        },
        { status: 400 }
      );
    }

    let challan = null;

    if (psid) {
      challan = await prisma.challan.findUnique({
        where: { psid },
        include: { student: true },
      });
    } else if (applicationNo) {
      const student = await prisma.student.findUnique({
        where: { applicationNo },
        include: { challan: true },
      });
      if (student && student.challan) {
        challan = { ...student.challan, student };
      }
    } else if (cnic) {
      const sanitized = sanitizeCnic(cnic);
      const student = await prisma.student.findUnique({
        where: { cnic: sanitized },
        include: { challan: true },
      });
      if (student && student.challan) {
        challan = { ...student.challan, student };
      }
    }

    if (!challan || !challan.student) {
      return NextResponse.json(
        {
          success: false,
          error: "No record found matching the provided inquiry details.",
        },
        { status: 404 }
      );
    }

    const { student } = challan;

    // Banking 1-Bill inquiry format
    return NextResponse.json({
      success: true,
      inquiry: {
        psid: challan.psid,
        applicationNo: student.applicationNo,
        fullName: student.fullName,
        fatherName: student.fatherName,
        cnic: student.cnic,
        degreeLevel: student.degreeLevel,
        instituteName: student.instituteName,
        boardUniversity: student.boardUniversity,
        amount: challan.amount,
        dueDate: challan.dueDate.toISOString(),
        isPaid: challan.isPaid,
        status: student.status,
        transactionId: challan.transactionId,
        receiptUrl: challan.receiptUrl,
        verifiedByAdmin: challan.verifiedByAdmin,
        createdAt: challan.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error in /api/v1/challan/inquire:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform consumer inquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
