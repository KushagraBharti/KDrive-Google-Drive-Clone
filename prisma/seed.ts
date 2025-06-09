// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create a dummy “root” folder for user “demo-user”
  await prisma.folder.create({
    data: {
      name: "Root",
      parentId: null,
      ownerId: "demo-user",
      children: {
        create: [
          { name: "Documents", ownerId: "demo-user" },
          { name: "Photos",    ownerId: "demo-user" },
        ],
      },
    },
  });
  console.log("Seeding complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
