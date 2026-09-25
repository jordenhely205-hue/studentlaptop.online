import { PrismaClient } from "@prisma/client";
import { INITIAL_INSTITUTES } from "../src/lib/institutes-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding InstituteDataset table...");

  const existingCount = await prisma.instituteDataset.count();
  if (existingCount > 0) {
    console.log(`InstituteDataset already contains ${existingCount} records. Skipping seed.`);
    return;
  }

  for (const inst of INITIAL_INSTITUTES) {
    await prisma.instituteDataset.create({
      data: {
        name: inst.name,
        city: inst.city,
        province: inst.province,
        type: inst.type,
      },
    });
  }

  console.log(`Successfully seeded ${INITIAL_INSTITUTES.length} educational institutions and boards.`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
