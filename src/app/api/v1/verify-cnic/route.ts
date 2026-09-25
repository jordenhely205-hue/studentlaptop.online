import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeCnic, isValidCnic } from "@/lib/psid";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCnic = searchParams.get("cnic");

    if (!rawCnic) {
      return NextResponse.json(
        { exists: false, error: "CNIC parameter is required" },
        { status: 400 }
      );
    }

    const cnic = sanitizeCnic(rawCnic);

    if (!isValidCnic(cnic)) {
      return NextResponse.json(
        {
          exists: false,
          error: "CNIC must be strictly 13 numerical digits",
        },
        { status: 400 }
      );
    }

    const existingStudent = await prisma.student.findUnique({
      where: { cnic },
      select: {
        id: true,
        applicationNo: true,
        status: true,
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          exists: true,
          message: "This CNIC is already registered in the system.",
          applicationNo: existingStudent.applicationNo,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        exists: false,
        message: "CNIC is available for registration.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/v1/verify-cnic:", error);
    return NextResponse.json(
      {
        exists: false,
        error: "Internal server error occurred while verifying CNIC.",
      },
      { status: 500 }
    );
  }
}
