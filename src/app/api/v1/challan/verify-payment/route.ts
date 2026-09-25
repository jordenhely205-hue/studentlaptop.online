import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate input payload
    const parseResult = verifyPaymentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: Invalid payment verification data.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { psid, transactionId, receiptUrl } = parseResult.data;

    // 2. Find the challan record by PSID
    const challan = await prisma.challan.findUnique({
      where: { psid },
      include: { student: true },
    });

    if (!challan) {
      return NextResponse.json(
        {
          success: false,
          error: "No challan found for the provided PSID.",
        },
        { status: 404 }
      );
    }

    // 3. Ensure transactionId is unique and hasn't been submitted previously across accounts
    const existingTx = await prisma.challan.findFirst({
      where: {
        transactionId: transactionId.trim(),
        NOT: { id: challan.id },
      },
    });

    if (existingTx) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Transaction ID (TID) has already been submitted for another application. Duplicate transaction IDs are strictly prohibited.",
        },
        { status: 409 }
      );
    }

    // 4. Update challan details and candidate status to UNDER_REVIEW
    const updated = await prisma.$transaction(async (tx) => {
      const updatedChallan = await tx.challan.update({
        where: { id: challan.id },
        data: {
          transactionId: transactionId.trim(),
          receiptUrl: receiptUrl.trim(),
        },
      });

      const updatedStudent = await tx.student.update({
        where: { id: challan.studentId },
        data: {
          status: "UNDER_REVIEW",
        },
      });

      return { challan: updatedChallan, student: updatedStudent };
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment verification submitted successfully. Your application status is now UNDER_REVIEW.",
      applicationNo: updated.student.applicationNo,
      status: updated.student.status,
      psid: updated.challan.psid,
      transactionId: updated.challan.transactionId,
    });
  } catch (error: any) {
    console.error("Error in /api/v1/challan/verify-payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit payment verification.",
      },
      { status: 500 }
    );
  }
}
