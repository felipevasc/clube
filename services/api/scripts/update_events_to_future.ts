
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0); // 7 PM

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 8);
    nextWeek.setHours(19, 0, 0, 0);

    console.log("Updating events to future dates...");

    const events = await prisma.clubEvent.findMany();
    console.log(`Found ${events.length} events.`);

    for (const event of events) {
        // If event is in the past, move it to tomorrow (or randomly next week)
        if (event.startAt < now) {
            console.log(`Updating event ${event.title} (${event.id}) from ${event.startAt} to ${tomorrow}`);
            await prisma.clubEvent.update({
                where: { id: event.id },
                data: {
                    startAt: tomorrow.toISOString(),
                    endAt: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(), // +3 hours
                },
            });
            // Toggle date for next one to have variety (optional, but keep simple for now)
        } else {
            console.log(`Event ${event.title} is already in future: ${event.startAt}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
