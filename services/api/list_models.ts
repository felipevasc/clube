
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const key = process.env.GEMINI_API_KEY || "";
    if (!key) {
        console.error("GEMINI_API_KEY not found");
        return;
    }
    // REST API call to list models
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => console.log(m.name));
        } else {
            console.log("No models found or error in response structure:", data);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
