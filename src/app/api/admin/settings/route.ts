import { NextRequest, NextResponse } from "next/server";
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
      settings: {
        announcement_banner:
          settings.announcement_banner ||
          "Application is Open! Last Date to Apply: 25 October 2026. Apply now for Student Laptop Online.",
        merit_criteria: settings.merit_criteria || { matric: 70, inter: 65, university: 65 },
        test_schedules: settings.test_schedules || [
          {
            id: "ts_1",
            stream: "Matriculation (SSC)",
            date: "Sunday, 15 November 2026",
            time: "10:00 AM - 11:30 AM",
            venue: "Designated BISE Regional Centers & Online Portal",
            status: "Published",
          },
          {
            id: "ts_2",
            stream: "Intermediate (HSSC)",
            date: "Sunday, 22 November 2026",
            time: "11:00 AM - 12:30 PM",
            venue: "Divisional Examination Centers & Online Portal",
            status: "Published",
          },
          {
            id: "ts_3",
            stream: "University / Degree",
            date: "Sunday, 29 November 2026",
            time: "02:00 PM - 03:30 PM",
            venue: "HEC / University IT Labs & Online Portal",
            status: "Published",
          },
        ],
      },
    });
  } catch (error: any) {
    console.error("[admin/settings GET error]:", error);
    return NextResponse.json(
      { error: "Failed to load settings", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
    }

    const sql = getDb();
    await ensureAdminTables(sql);

    const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    const now = new Date();

    await sql`
      INSERT INTO "site_settings" ("key", "value", "updatedAt")
      VALUES (${key}, ${stringValue}, ${now})
      ON CONFLICT ("key") DO UPDATE SET
        "value" = ${stringValue},
        "updatedAt" = ${now}
    `;

    await sql.end({ timeout: 2 });

    return NextResponse.json({
      success: true,
      key,
      value,
      message: `Setting '${key}' saved successfully.`,
    });
  } catch (error: any) {
    console.error("[admin/settings POST error]:", error);
    return NextResponse.json(
      { error: "Failed to save settings", details: error?.message },
      { status: 500 }
    );
  }
}
