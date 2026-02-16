import { prisma } from "./db.js";

async function main() {
  const user = await prisma.user.upsert({
    where: { id: "alice" },
    create: {
      id: "alice",
      name: "Alice",
      bio: "Leitora voraz. MVP seed.",
      avatarUrl: ""
    },
    update: {},
  });

  await prisma.userCity.upsert({
    where: { userId_city: { userId: "alice", city: "FORTALEZA" } },
    create: { userId: "alice", city: "FORTALEZA" },
    update: {},
  });
  await prisma.userCity.upsert({
    where: { userId_city: { userId: "alice", city: "BRASILIA" } },
    create: { userId: "alice", city: "BRASILIA" },
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

