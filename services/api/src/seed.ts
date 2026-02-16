import { prisma } from "./db.js";

async function main() {
    console.log("Seeding database...");

    // 1. Users (Alice)
    console.log("Seeding users...");
    await prisma.user.upsert({
        where: { id: "alice" },
        update: {},
        create: {
            id: "alice",
            name: "Alice",
            bio: "Leitora voraz.",
            avatarUrl: "",
        },
    });

    await prisma.userCity.deleteMany({ where: { userId: "alice" } });
    await prisma.userCity.createMany({
        data: [
            { userId: "alice", city: "FORTALEZA" },
            { userId: "alice", city: "BRASILIA" },
        ],
    });

    // 2. Books
    console.log("Seeding books...");
    const books = [
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

    for (const b of books) {
        await prisma.book.upsert({
            where: { title_author: { title: b.title, author: b.author } },
            update: b,
            create: b,
        }).catch((e) => console.error(`Error seeding ${b.title}:`, e));
    }

    // 3. Groups
    console.log("Seeding groups...");
    const existingGroup = await prisma.group.findFirst({ where: { name: "Clube MVP" } });
    if (!existingGroup) {
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

    // 4. Channels (for chat)
    console.log("Seeding channels...");
    // Use raw SQL for Channels as they might not be in Prisma Client if defined as raw only in original modules, 
    // but we defined them in schema.prisma for the monolith, so we can use Prisma Client!
    // Wait, I think I defined them in schema.prisma for monolith. Yes, I did.

    const channels = [
        { id: "geral", name: "Geral", type: "GLOBAL", cityCode: null },
        { id: "fortaleza", name: "Fortaleza", type: "CITY", cityCode: "FORTALEZA" },
        { id: "brasilia", name: "Brasília", type: "CITY", cityCode: "BRASILIA" },
    ];

    for (const c of channels) {
        // Check if exists
        const exists = await prisma.channel.findUnique({ where: { id: c.id } });
        if (!exists) {
            await prisma.channel.create({
                data: {
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    cityCode: c.cityCode,
                }
            });
        }
    }

    console.log("Seeding completed.");
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
