import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureAdminTables } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = identifier.trim().toLowerCase();

    // Check if logging in as admin
    if (cleanEmail === "admin@studentlaptop.online" || cleanEmail === "admin") {
      const sql = getDb();
      await ensureAdminTables(sql);

      const [admin] = await sql`
        SELECT id, email, password, name, role
        FROM "admin_users"
        WHERE email = 'admin@studentlaptop.online'
        LIMIT 1
      `;

      await sql.end({ timeout: 2 });

      const defaultPass = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || "admin123";
      const expectedPassword = admin ? admin.password : defaultPass;

      if (password === expectedPassword) {
        return NextResponse.json({
          success: true,
          role: "admin",
          user: {
            email: "admin@studentlaptop.online",
            name: admin?.name || "Super Administrator",
            role: "superadmin",
          },
        });
      } else {
        return NextResponse.json({ error: "Invalid password for admin account." }, { status: 401 });
      }
    }

    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  } catch (error: any) {
    console.error("[admin/login error]:", error);
    return NextResponse.json({ error: "Authentication failed", details: error?.message }, { status: 500 });
  }
}
