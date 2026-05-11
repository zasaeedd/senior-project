// example: server/index.ts
import { prisma } from './prisma.config';

async function main() {
  const users = await prisma.appUser.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());