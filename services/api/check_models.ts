
import { GoogleGenerativeAI } from "@google/generative-ai";

async function checkModelCapabilities() {
    const key = process.env.GEMINI_API_KEY || "";
    if (!key) {
        console.error("GEMINI_API_KEY not found");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Model Capabilities:");
            data.models.forEach((m: any) => {
                console.log(`\nName: ${m.name}`);
                console.log(`Supported Methods: ${JSON.stringify(m.supportedGenerationMethods)}`);
                console.log(`Version: ${m.version}`);
                console.log(`Display Name: ${m.displayName}`);
            });
        } else {
            console.log("No models found response:", data);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

checkModelCapabilities();
