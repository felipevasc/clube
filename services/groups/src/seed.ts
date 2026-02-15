import { prisma } from "./db.js";

async function main() {
  // Seed a default group owned by "alice" (users service also seeds "alice").
  const existing = await prisma.group.findFirst({ where: { name: "Clube MVP" } });
  if (existing) return;

  const group = await prisma.group.create({
    data: {
      name: "Clube MVP",
      description: "Grupo seed para o MVP do Clube.",
      ownerId: "alice",
    },
  });
  await prisma.membership.create({
    data: { groupId: group.id, userId: "alice", role: "owner" },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

