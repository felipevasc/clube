
import { prisma } from "../src/db.js";

async function main() {
    const events = await prisma.clubEvent.findMany();
    console.log(JSON.stringify(events.map(e => ({
        title: e.title,
        city: e.city,
        startAt: e.startAt,
        endAt: e.endAt
    })), null, 2));
}

main();
