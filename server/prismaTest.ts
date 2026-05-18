import "dotenv/config";
console.log("DB URL:", process.env.DATABASE_URL);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  // Example query: list all users
  // const users = await prisma.user.findMany();
    const users = await prisma.appUser.findMany();
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });