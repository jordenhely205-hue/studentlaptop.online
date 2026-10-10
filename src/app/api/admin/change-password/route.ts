import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureAdminTables } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const sql = getDb();
    await ensureAdminTables(sql);

    // Fetch existing admin user
    const [admin] = await sql`
      SELECT id, email, password 
      FROM "admin_users" 
      WHERE email = 'admin@studentlaptop.online' 
      LIMIT 1
    `;

    const defaultPass = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || "admin123";
    const storedPass = admin ? admin.password : defaultPass;

    if (currentPassword !== storedPass) {
      await sql.end({ timeout: 2 });
      return NextResponse.json(
        { error: "Current password is incorrect. Please verify and try again." },
        { status: 401 }
      );
    }

    const now = new Date();

    // Update password in Postgres
    await sql`
      INSERT INTO "admin_users" ("id", "email", "password", "name", "role", "updatedAt")
      VALUES ('admin_root', 'admin@studentlaptop.online', ${newPassword}, 'Super Administrator', 'superadmin', ${now})
      ON CONFLICT ("email") DO UPDATE SET
        "password" = ${newPassword},
        "updatedAt" = ${now}
    `;

    await sql.end({ timeout: 2 });

    return NextResponse.json({
      success: true,
      message: "Admin password has been updated successfully.",
    });
  } catch (error: any) {
    console.error("[admin/change-password error]:", error);
    return NextResponse.json(
      { error: "Failed to update admin password", details: error?.message },
      { status: 500 }
    );
  }
}
