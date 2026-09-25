import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_INSTITUTES } from "@/lib/institutes-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const type = searchParams.get("type") || undefined;
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 50);

    let results: Array<{ id?: string; name: string; city: string; province: string; type: string }> = [];

    try {
      const whereClause: any = {};

      if (type) {
        whereClause.type = { equals: type, mode: "insensitive" };
      }

      if (query.length > 0) {
        whereClause.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { province: { contains: query, mode: "insensitive" } },
        ];
      }

      results = await prisma.instituteDataset.findMany({
        where: whereClause,
        take: limit,
        orderBy: { name: "asc" },
      });
    } catch (dbError) {
      console.warn("DB query failed or table not seeded yet, using in-memory dataset:", dbError);
    }

    // Fallback to static dataset if database had 0 results or table wasn't seeded yet
    if (!results || results.length === 0) {
      const lowerQuery = query.toLowerCase();
      const filtered = INITIAL_INSTITUTES.filter((item) => {
        if (type && item.type.toLowerCase() !== type.toLowerCase()) return false;
        if (!query) return true;
        return (
          item.name.toLowerCase().includes(lowerQuery) ||
          item.city.toLowerCase().includes(lowerQuery) ||
          item.province.toLowerCase().includes(lowerQuery)
        );
      }).slice(0, limit);

      results = filtered.map((inst, index) => ({
        id: `static-${index}`,
        name: inst.name,
        city: inst.city,
        province: inst.province,
        type: inst.type,
      }));
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      institutes: results,
    });
  } catch (error: any) {
    console.error("Error in /api/v1/institutes/search:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search educational institutions.",
      },
      { status: 500 }
    );
  }
}
