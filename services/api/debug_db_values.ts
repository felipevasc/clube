
import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Dumping ChannelMessage raw values...");

    // Use raw query to get actual strings stored in SQLite
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, text, "createdAt" as rawCreatedAt FROM "ChannelMessage"`);

    console.log(`Found ${rows.length} messages.`);

    for (const row of rows) {
        console.log(`[${row.id}] ${row.text} | Raw: '${row.rawCreatedAt}'`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
