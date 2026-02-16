
const API_URL = "http://localhost:3001";

async function main() {
    const username = "admin";
    const channelId = "geral";

    console.log(`Verifying message order for channel '${channelId}'...`);

    try {
        // 1. Send 3 messages rapidly
        const texts = [`msg_order_1_${Date.now()}`, `msg_order_2_${Date.now()}`, `msg_order_3_${Date.now()}`];

        for (const text of texts) {
            await fetch(`${API_URL}/channels/${channelId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-username": username },
                body: JSON.stringify({ text })
            });
            // small delay to ensure timestamp diff
            await new Promise(r => setTimeout(r, 100));
        }

        console.log("Sent 3 messages.");

        // 2. Fetch Messages (Default limit)
        const res = await fetch(`${API_URL}/channels/${channelId}/messages?limit=10`, {
            headers: { "x-username": username }
        });

        const data: any = await res.json();
        const messages = data.messages;
        console.log(`Fetched ${messages.length} messages.`);

        if (messages.length < 3) {
            throw new Error("Not enough messages to verify order.");
        }

        // 3. Verify Order (Should be Oldest -> Newest)
        // The last 3 messages in the list should correspond to our texts in order
        const last3 = messages.slice(-3);

        const matched = last3[0].text === texts[0] &&
            last3[1].text === texts[1] &&
            last3[2].text === texts[2];

        if (matched) {
            console.log("SUCCESS: Messages are in correct chronological order (Oldest -> Newest).");
            console.log("Last 3:", last3.map((m: any) => m.text));
        } else {
            console.error("FAILURE: Messages are NOT in correct order.");
            console.log("Expected last 3:", texts);
            console.log("Actual last 3:", last3.map((m: any) => m.text));

            // Check if reversed
            if (last3[0].text === texts[2] && last3[2].text === texts[0]) {
                console.error("Diagnosis: Order is Newest -> Oldest (DESC). Needs Reversal.");
            }
            process.exit(1);
        }

    } catch (e: any) {
        console.error("Error:", e.message);
        process.exit(1);
    }
}

main();
