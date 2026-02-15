import { prisma } from "./db.js";

async function main() {
  const seeds = [
    { title: "Dom Casmurro", author: "Machado de Assis" },
    { title: "1984", author: "George Orwell" },
    { title: "A Hora da Estrela", author: "Clarice Lispector" },
  ];
  for (const b of seeds) {
    await prisma.book.create({ data: b }).catch(() => {});
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

