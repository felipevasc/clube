import { PrismaClient } from './src/generated/prisma/index.js';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
    const events = await prisma.clubEvent.findMany({
        orderBy: { startAt: 'desc' },
        select: { id: true, title: true, city: true, startAt: true }
    });
    fs.writeFileSync('event_lists.json', JSON.stringify(events, null, 2));
    console.log(`Saved ${events.length} events`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
