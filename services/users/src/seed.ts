import { prisma } from "./db.js";

async function main() {
  await prisma.user.upsert({
    where: { id: "alice" },
    create: {
      id: "alice",
      name: "Alice",
      bio: "Leitora voraz. MVP seed.",
      avatarUrl: ""
    },
    update: {},
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

