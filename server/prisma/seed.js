import 'dotenv/config'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log(process.env.DATABASE_URL)

async function main() {
  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      permissions: { manageUsers: true, viewAnalytics: true, exportDesigns: true }
    }
  });

  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      permissions: { generateDesigns: true, exportDesigns: true }
    }
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
