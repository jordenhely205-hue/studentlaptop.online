import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { INITIAL_INSTITUTES } from "../src/lib/institutes-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding InstituteDataset table...");

  const existingCount = await prisma.instituteDataset.count();
  if (existingCount > 0) {
    console.log(
      `InstituteDataset already contains ${existingCount} records. Skipping seed.`
    );
    return;
  }

  // createMany single query mein foran sara data insert kar deta hai
  await prisma.instituteDataset.createMany({
    data: INITIAL_INSTITUTES.map((inst) => ({
      name: inst.name,
      city: inst.city,
      province: inst.province,
      type: inst.type,
    })),
  });

  console.log(
    `Successfully seeded ${INITIAL_INSTITUTES.length} educational institutions and boards.`
  );
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });