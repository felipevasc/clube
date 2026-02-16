
import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing createdAt dates...");

    // Channel Messages
    const chContext = await prisma.$queryRawUnsafe(`SELECT id, "createdAt" as raw FROM "ChannelMessage"`);
    const chRows = chContext as any[];
    console.log(`Processing ${chRows.length} channel messages...`);

    for (const row of chRows) {
        let d = new Date(row.raw);
        if (Number.isNaN(d.valueOf())) {
            // Try parsing SQL format if needed, but Date() usually handles standard formats
            // If 'Sun Feb...' it works.
            // If '2026-02-16 01:37:45' it works (in V8/Node).
            console.warn(`Could not parse date for msg ${row.id}: '${row.raw}'`);
            d = new Date(); // Fallback to now? Or keep as is?
        }

        const iso = d.toISOString();
        if (iso !== row.raw) {
            // Update using raw SQL to force string format if needed, or Prisma update
            // Prisma update expects DateTime object.
            // We want the DB to store ISO string or whatever Prisma uses (which is numeric or ISO depending on connector, but here SQLite often text).
            // Actually, let's use Prisma update, it handles the conversion to what it expects.
            await prisma.channelMessage.update({
                where: { id: row.id },
                data: { createdAt: d }
            });
            // process.stdout.write(".");
        }
    }
    console.log("\nChannel messages done.");

    // Direct Messages
    const dmContext = await prisma.$queryRawUnsafe(`SELECT id, "createdAt" as raw FROM "DirectMessage"`);
    const dmRows = dmContext as any[];
    console.log(`Processing ${dmRows.length} direct messages...`);

    for (const row of dmRows) {
        const d = new Date(row.raw);
        if (!Number.isNaN(d.valueOf())) {
            await prisma.directMessage.update({
                where: { id: row.id },
                data: { createdAt: d }
            });
        }
    }
    console.log("Direct messages done.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
