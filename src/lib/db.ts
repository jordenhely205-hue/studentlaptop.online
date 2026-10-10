import postgres from "postgres";

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  ).trim();
}

export function getDb() {
  const url = getDatabaseUrl();
  return postgres(url, {
    ssl: "require",
    max: 1,
    connect_timeout: 10,
  });
}

// Ensures all essential tables (admin_users, site_settings) exist in Neon Postgres
export async function ensureAdminTables(sql: ReturnType<typeof postgres>) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" VARCHAR(255) PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255),
        "role" VARCHAR(50) DEFAULT 'admin',
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "key" VARCHAR(100) PRIMARY KEY,
        "value" TEXT NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Seed default admin if missing
    await sql`
      INSERT INTO "admin_users" ("id", "email", "password", "name", "role")
      VALUES ('admin_root', 'admin@studentlaptop.online', 'admin123', 'Super Administrator', 'superadmin')
      ON CONFLICT ("email") DO NOTHING
    `;

    // Seed default announcement banner if missing
    await sql`
      INSERT INTO "site_settings" ("key", "value")
      VALUES ('announcement_banner', 'Application is Open! Last Date to Apply: 25 October 2026. Apply now for Student Laptop Online.')
      ON CONFLICT ("key") DO NOTHING
    `;

    // Seed default merit criteria if missing
    await sql`
      INSERT INTO "site_settings" ("key", "value")
      VALUES ('merit_criteria', '{"matric": 70, "inter": 65, "university": 65}')
      ON CONFLICT ("key") DO NOTHING
    `;
  } catch (err) {
    console.warn("[ensureAdminTables warning]:", err);
  }
}
