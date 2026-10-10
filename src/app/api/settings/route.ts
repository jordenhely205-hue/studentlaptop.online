import { NextResponse } from "next/server";
import { getDb, ensureAdminTables } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    await ensureAdminTables(sql);

    const rows = await sql`SELECT "key", "value" FROM "site_settings"`;
    await sql.end({ timeout: 2 });

    const settings: Record<string, any> = {};
    rows.forEach((r) => {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    });

    return NextResponse.json({
      success: true,
      announcement_banner:
        settings.announcement_banner ||
        "Application is Open! Last Date to Apply: 25 October 2026. Apply now for Student Laptop Online.",
      test_schedules: settings.test_schedules || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      announcement_banner:
        "Application is Open! Last Date to Apply: 25 October 2026. Apply now for Student Laptop Online.",
    });
  }
}
