import { prisma } from "./db.js";

async function main() {
  // Optional: keep empty for MVP; user-generated content.
  await prisma.post.findMany({ take: 1 });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

