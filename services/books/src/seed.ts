import { prisma } from "./db.js";

async function main() {
  const seeds = [
    {
      title: "O Pequeno Príncipe",
      author: "Antoine de Saint-Exupéry",
      coverUrl: "/api/media/seed-little-prince.png",
      synopsis: "Um piloto cai no deserto do Saara e encontra um pequeno príncipe que veio de outro asteroide. Uma fábula poética e filosófica sobre o que é verdadeiramente importante na vida.",
    },
    {
      title: "O Alquimista",
      author: "Paulo Coelho",
      coverUrl: "/api/media/seed-alchemist.png",
      synopsis: "Santiago, um jovem pastor, viaja da Espanha para o deserto egípcio em busca de um tesouro escondido. Uma jornada de autoconhecimento e fé em busca da 'Lenda Pessoal'.",
    },
    {
      title: "Harry Potter e a Pedra Filosofal",
      author: "J.K. Rowling",
      coverUrl: "/api/media/seed-harry-potter.png",
      synopsis: "Harry descobre que é um bruxo no seu 11º aniversário e entra para a Escola de Magia e Bruxaria de Hogwarts, onde faz amigos e descobre o segredo da pedra filosofal.",
    },
    {
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      coverUrl: "/api/media/seed-hobbit.png",
      synopsis: "Bilbo Bolseiro é convocado por Gandalf para uma aventura épica com treze anões para recuperar o Reino de Erebor do temível dragão Smaug.",
    },
    {
      title: "Orgulho e Preconceito",
      author: "Jane Austen",
      coverUrl: "/api/media/seed-pride-prejudice.png",
      synopsis: "A história de Elizabeth Bennet e do arrogante Sr. Darcy, explorando as complexidades das relações sociais, caráter e sentimentos no século XIX.",
    },
    {
      title: "O Grande Gatsby",
      author: "F. Scott Fitzgerald",
      coverUrl: "/api/media/seed-gatsby.png",
      synopsis: "Nos anos 20, o misterioso milionário Jay Gatsby dedica sua vida a reconquistar Daisy Buchanan, em meio ao brilho e à decadência da era do jazz.",
    },
    {
      title: "Admirável Mundo Novo",
      author: "Aldous Huxley",
      coverUrl: "/api/media/seed-brave-new-world.png",
      synopsis: "Uma distopia onde a sociedade é controlada por manipulação genética e condicionamento, buscando a estabilidade e a felicidade a qualquer custo.",
    },
  ];
  for (const b of seeds) {
    await prisma.book.upsert({
      where: { title_author: { title: b.title, author: b.author } },
      update: b,
      create: b,
    }).catch((e) => console.error(`Error seeding ${b.title}:`, e));
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

