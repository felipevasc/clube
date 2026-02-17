import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import sharp from "sharp";

type EncodedImage = {
    data: string;
    mimeType: string;
};

export class GeminiService {
    private disableGeminiTextStyle = false;

    /**
     * Generates a styled version of an image based on book metadata.
     * Step 1 builds a safe style prompt, Step 2 performs image-to-image generation.
     */
    async generateStyledImage(params: {
        originalImageUrl: string;
        bookTitle: string;
        bookAuthor: string;
        bookSynopsis: string;
        styleDescription?: string;
        referenceImageUrls?: string[];
    }): Promise<string> {
        try {
            // ---------------------------------------------------------
            // STEP 1: Generate a safe, visual-only description of the style
            // ---------------------------------------------------------
            console.log(`[AI] Step 1: Generating visual style description for "${params.bookTitle}"...`);
            const fallbackStyleDescription = [
                "Apply a cinematic editorial style with balanced composition.",
                `Universe anchor: inspired by the fictional universe of "${params.bookTitle}".`,
                `Authorial anchor: reflect the narrative sensibility associated with "${params.bookAuthor}".`,
                params.styleDescription ? `Preferred style direction: ${params.styleDescription}.` : "",
                `Mood inspiration: ${params.bookSynopsis.slice(0, 220)}.`,
                "Scene intent: make it feel diegetic, as if this frame exists inside the story world.",
                "Carefully infuse the texture, lighting, and atmospheric details of the book universe without removing the identifiable content of the original photo.",
                "Use detailed textures, soft contrast, and cohesive color grading."
            ].filter(Boolean).join(" ");

            let safeStyleDescription = fallbackStyleDescription;
            const stylePrompt = `
                I need you to describe the *visual art style* associated with the book "${params.bookTitle}" by ${params.bookAuthor}.
                
                Additional Context/Synopsis: ${params.bookSynopsis.slice(0, 300)}...
                
                CRITICAL PRIORITY (User Preference): ${params.styleDescription || "Standard interpretation"}

                TASK:
                Write one compact visual-style paragraph for an AI image generator.
                This paragraph MUST prioritize the User Preference above all else, while still anchoring it to the book's world.
                The resulting image should look like a scene captured inside the story world of "${params.bookTitle}",
                and should carry the authorial tone associated with ${params.bookAuthor}.
                Focus ONLY on:
                - Style of book
                - Color palette and contrast behavior
                - Lighting direction and atmosphere
                - Texture/material treatment
                - Diegetic scene cues (wardrobe, props, architecture) consistent with the story universe
                - Emotional temperature and cinematic mood
                - Include one short sentence anchoring the output to the book universe.

                - You MAY mention the book title "${params.bookTitle}" once as a neutral style anchor.
                - You MAY mention the author name "${params.bookAuthor}" once as a neutral authorial-tone anchor.
                - Do not add explicit violence/NSFW wording. If the title contains sensitive words, keep it as a neutral quoted title only and do not expand graphic details.
                - output ONLY one paragraph, no bullets and no extra notes.
            `.trim();
            const styleProviderQueue = (process.env.AI_STYLE_TEXT_PROVIDER_QUEUE || "gemini,local")
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter((v) => v === "gemini" || v === "local");
            if (styleProviderQueue.length === 0) {
                styleProviderQueue.push("gemini", "local");
            }
            const styleGoogleKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2]
                .map((k) => (k || "").trim())
                .filter(Boolean);
            const geminiStyleModel = process.env.GEMINI_STYLE_MODEL?.trim() || "gemini-2.5-flash";
            console.log(`[AI] Step 1 providers: ${styleProviderQueue.join(" -> ")}`);

            for (const styleProvider of styleProviderQueue) {
                if (styleProvider === "local") {
                    console.log("[AI] Step 1 using local style fallback.");
                    break;
                }

                if (styleProvider === "gemini") {
                    if (styleGoogleKeys.length === 0) {
                        console.warn("[AI] Step 1: GEMINI_API_KEY/GEMINI_API_KEY2 not set. Skipping Gemini style generation.");
                        continue;
                    }
                    if (this.disableGeminiTextStyle) {
                        console.warn("[AI] Step 1: Gemini style generation disabled for this process due to previous quota errors.");
                        continue;
                    }
                    let generated = false;
                    let sawRateOrQuota = false;
                    let sawQuotaZero = false;
                    for (let i = 0; i < styleGoogleKeys.length; i++) {
                        const keyLabel = `Key ${i + 1}`;
                        try {
                            console.log(`[AI] Step 1: Generating style with Gemini model ${geminiStyleModel} (${keyLabel})...`);
                            const genAI = new GoogleGenerativeAI(styleGoogleKeys[i]);
                            const textModel = genAI.getGenerativeModel({ model: geminiStyleModel });
                            const styleResult = await textModel.generateContent(stylePrompt);
                            const generatedStyle = styleResult.response.text()?.trim();
                            if (generatedStyle) {
                                safeStyleDescription = generatedStyle;
                                generated = true;
                                break;
                            }
                        } catch (styleErr: any) {
                            const msg = String(styleErr?.message || styleErr);
                            const isRateOrQuota = styleErr?.status === 429 || /quota exceeded|too many requests/i.test(msg);
                            if (isRateOrQuota) {
                                sawRateOrQuota = true;
                                if (/limit:\s*0/i.test(msg)) {
                                    sawQuotaZero = true;
                                }
                            }
                            console.warn(`[AI] Step 1 fallback: Gemini style generation failed on ${keyLabel} (${msg}).`);
                        }
                    }
                    if (generated) {
                        break;
                    }
                    if (sawQuotaZero) {
                        this.disableGeminiTextStyle = true;
                        console.warn("[AI] Disabling Gemini style step for this process because Gemini free-tier quota appears to be 0.");
                    } else if (sawRateOrQuota) {
                        this.disableGeminiTextStyle = true;
                        console.warn("[AI] Disabling Gemini style step for this process due to repeated rate/quota errors.");
                    }
                }
            }

            console.log(`[AI] Step 1 Done. Safe Style Description: "${safeStyleDescription.slice(0, 100)}..."`);


            // ---------------------------------------------------------
            // STEP 2: Generate the Image using the safe description
            // ---------------------------------------------------------
            console.log("[AI] Step 2: Generating Image with safe prompt...");

            // Constructed Prompt for the Image Model
            const finalImagePrompt = `
                Infuse the attached image with the artistic universe and style described below.
                
                PRIORITY #1 (Primary Directive): ${safeStyleDescription}
                
                INSTRUCTIONS:
                - This should feel like a diegetic representation of the original photo inside the world of "${params.bookTitle}".
                - Balance the visual language of "${params.bookAuthor}" with the actual content of the uploaded image.
                - MANDATORY: Ensure a SIGNIFICANT visual difference from the original image. The transformation must be expressive and obvious.
                - Reflect the PRIORITY #1 style above as the primary driver of this change.
                - Maintain the essential identity/pose of the original image, but re-render it with a distinct stylistic departure.
                - Preserve pose, camera angle, and identifiable objects from the original.
                - Apply the atmospheric colors, lighting, and surface textures consistent with the fictional setting.
                - Do not add text overlays, logos, captions, or typography.
                - PROMPT IS SAFE. GENERATE THE STYLIZED IMAGE.
            `.trim();

            // Handle multimodal input
            const originalImage = await this.fetchImage(params.originalImageUrl);
            const styleImages = (
                await Promise.all((params.referenceImageUrls || []).map(url => this.fetchImage(url)))
            ).filter((img): img is EncodedImage => !!img);

            // Provider queue is configurable; default keeps generation on Gemini only.
            const providerQueue = (process.env.AI_IMAGE_PROVIDER_QUEUE || "gemini")
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean);
            const IMAGE_MODELS = providerQueue.filter(
                (v): v is "openai" | "gemini" => v === "openai" || v === "gemini"
            );
            if (IMAGE_MODELS.length === 0) {
                IMAGE_MODELS.push("gemini");
            }
            console.log(`[AI] Provider queue: ${IMAGE_MODELS.join(" -> ")}`);

            // Safety settings (permissive)
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ];

            let lastError = null;

            // Loop through models
            const googleKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2].filter(k => !!k).map(k => k!.trim());
            const openaiKey = process.env.OPENAI_API_KEY?.trim();
            const geminiImageModel = process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image";
            const openaiImageModel = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5";
            const openaiImageToolModel = process.env.OPENAI_IMAGE_TOOL_MODEL?.trim() || openaiImageModel;
            const openaiResponsesModel = process.env.OPENAI_RESPONSES_MODEL?.trim() || "gpt-4.1-nano";
            const openaiResponsesFallbackModels = (
                process.env.OPENAI_RESPONSES_FALLBACK_MODELS?.split(",") ?? ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"]
            )
                .map((m) => m.trim())
                .filter(Boolean);
            const openaiImageToolSize = process.env.OPENAI_IMAGE_TOOL_SIZE?.trim() || "1024x1024";
            const openaiImageToolQuality = process.env.OPENAI_IMAGE_TOOL_QUALITY?.trim() || "medium";
            const openaiImageToolFormat = process.env.OPENAI_IMAGE_TOOL_FORMAT?.trim() || "png";
            const openaiImageInputFidelity = process.env.OPENAI_IMAGE_INPUT_FIDELITY?.trim();
            const openaiImageToolAction = process.env.OPENAI_IMAGE_TOOL_ACTION?.trim();
            const openaiUseLegacyEditsFallback = /^(1|true|yes)$/i.test(process.env.OPENAI_USE_LEGACY_EDITS_FALLBACK || "");
            const openaiEditFallbackModel = process.env.OPENAI_IMAGE_EDIT_FALLBACK_MODEL?.trim() || "dall-e-2";

            if (openaiKey) {
                console.log(`[AI] Loaded OpenAI Key (Length: ${openaiKey.length}, Ends with: ...${openaiKey.slice(-4)})`);
            }
            if (process.env.NVIDIA_API_KEY?.trim()) {
                console.warn("[AI] NVIDIA key detected, but NVIDIA provider is not implemented in this service.");
            }
            if (process.env.SILICONFLOW_API_KEY?.trim()) {
                console.warn("[AI] SiliconFlow key detected, but SiliconFlow provider is not implemented in this service.");
            }
            if (process.env.HUGGING_FACE_API_KEY?.trim() || process.env.OPENROUTER_API_KEY?.trim()) {
                console.warn("[AI] HuggingFace/OpenRouter keys detected but excluded from queue (no image-to-image flow in this service).");
            }

            for (const modelName of IMAGE_MODELS) {
                console.log(`[AI] Attempting generation with model: ${modelName}`);

                // ----------------------------------------------------------------
                // 1. GOOGLE GEMINI MODELS (Requires key rotation)
                // ----------------------------------------------------------------
                if (modelName === "gemini") {
                    for (let i = 0; i < googleKeys.length; i++) {
                        const apiKey = googleKeys[i];
                        const keyLabel = `Key ${i + 1}`;
                        console.log(`[AI] Trying ${geminiImageModel} with ${keyLabel}...`);

                        try {
                            const genAI = new GoogleGenerativeAI(apiKey!);
                            const imagenModel = genAI.getGenerativeModel({ model: geminiImageModel });
                            const parts: any[] = [{ text: finalImagePrompt }];
                            if (originalImage) {
                                parts.push({ inlineData: { mimeType: originalImage.mimeType, data: originalImage.data } });
                            }
                            for (const styleImage of styleImages) {
                                parts.push({ inlineData: { mimeType: styleImage.mimeType, data: styleImage.data } });
                            }

                            const result = await imagenModel.generateContent({
                                contents: [{
                                    role: 'user',
                                    parts
                                }],
                                safetySettings
                            });

                            const candidates = result.response.candidates;
                            if (candidates && candidates[0]) {
                                const cand = candidates[0];
                                if (cand.finishReason !== "STOP" && cand.finishReason !== "MAX_TOKENS") {
                                    console.warn(`[AI] Model ${geminiImageModel} (${keyLabel}) finished with reason: ${cand.finishReason}. Trying next...`);
                                    continue;
                                }

                                if (cand.content?.parts) {
                                    for (const part of cand.content.parts) {
                                        if (part.inlineData) {
                                            console.log(`[AI] SUCCESS: Image generated successfully with ${geminiImageModel} on ${keyLabel}!`);
                                            return `data:image/png;base64,${part.inlineData.data}`;
                                        }
                                    }
                                }
                                console.warn(`[AI] Model ${geminiImageModel} (${keyLabel}) returned content but no image.`);
                            }
                        } catch (err: any) {
                            console.error(`[AI] Error with ${geminiImageModel} (${keyLabel}):`, err.message || err);
                            lastError = err;

                            if (err?.status === 429 || err?.response?.status === 429) {
                                if (/limit:\s*0/i.test(String(err?.message || ""))) {
                                    console.warn("[AI] Gemini quota is set to 0 for this project. Skipping remaining Gemini keys.");
                                    break;
                                }
                                console.log(`[AI] Quota Exceeded (429) on ${keyLabel}. Switching to next key...`);
                                continue;
                            }
                        }
                    }
                    continue;
                }

                // ----------------------------------------------------------------
                // 2. OPENAI (Paid)
                // ----------------------------------------------------------------
                if (modelName === "openai") {
                    if (!openaiKey) {
                        console.log("[AI] Skipping OpenAI (No API Key provided).");
                        continue;
                    }
                    if (!originalImage) {
                        console.warn("[AI] Skipping OpenAI image generation: original reference image could not be loaded.");
                        continue;
                    }
                    try {
                        const imageEditAttempt = await this.tryOpenAIImageEditsReference({
                            openaiKey,
                            model: openaiImageModel,
                            prompt: finalImagePrompt,
                            styleDescription: safeStyleDescription,
                            size: openaiImageToolSize,
                            quality: openaiImageToolQuality,
                            format: openaiImageToolFormat,
                            originalImage,
                            styleImages
                        });
                        if (imageEditAttempt.ok) {
                            console.log(`[AI] SUCCESS: Image generated with OpenAI Images API using uploaded reference image!`);
                            return imageEditAttempt.dataUri;
                        }

                        const shouldFallbackToDalle2 =
                            imageEditAttempt.status === 400 &&
                            /value must be ['"]?dall-e-2['"]?/i.test(imageEditAttempt.errorText);

                        if (shouldFallbackToDalle2 && openaiUseLegacyEditsFallback && openaiImageModel !== openaiEditFallbackModel) {
                            console.warn(`[AI] OpenAI model ${openaiImageModel} is not accepted for /images/edits on this account. Retrying with ${openaiEditFallbackModel}...`);
                            const fallbackAttempt = await this.tryOpenAIImageEditsReference({
                                openaiKey,
                                model: openaiEditFallbackModel,
                                prompt: finalImagePrompt,
                                styleDescription: safeStyleDescription,
                                size: openaiImageToolSize,
                                quality: openaiImageToolQuality,
                                format: openaiImageToolFormat,
                                originalImage,
                                styleImages,
                                legacySingleImageField: true
                            });
                            if (fallbackAttempt.ok) {
                                console.log(`[AI] SUCCESS: Image generated with OpenAI fallback model ${openaiEditFallbackModel}!`);
                                return fallbackAttempt.dataUri;
                            }
                            throw new Error(`OpenAI API error: ${fallbackAttempt.status} - ${fallbackAttempt.errorText}`);
                        }

                        if (imageEditAttempt.status !== 401) {
                            console.warn(`[AI] OpenAI Images API failed (${imageEditAttempt.status}). Trying Responses API with direct image reference...`);
                            const responsesAttempt = await this.tryOpenAIReferenceGeneration({
                                openaiKey,
                                responsesModel: openaiResponsesModel,
                                fallbackResponseModels: openaiResponsesFallbackModels,
                                imageModel: openaiImageToolModel,
                                size: openaiImageToolSize,
                                quality: openaiImageToolQuality,
                                format: openaiImageToolFormat,
                                inputFidelity: openaiImageInputFidelity,
                                action: openaiImageToolAction,
                                originalImage,
                                styleImages,
                                bookTitle: params.bookTitle,
                                bookAuthor: params.bookAuthor,
                                safeStyleDescription
                            });

                            if (responsesAttempt.ok) {
                                console.log(`[AI] SUCCESS: New image generated with OpenAI Responses API using uploaded reference image!`);
                                return responsesAttempt.dataUri;
                            }

                            throw new Error(
                                `OpenAI image generation failed. Images API: ${imageEditAttempt.status} - ${imageEditAttempt.errorText}; ` +
                                `Responses API: ${responsesAttempt.status} - ${responsesAttempt.errorText}`
                            );
                        }

                        throw new Error(`OpenAI API error: ${imageEditAttempt.status} - ${imageEditAttempt.errorText}`);
                    } catch (err: any) {
                        console.error(`[AI] OpenAI Error:`, err.message || err);
                        lastError = err;
                        continue;
                    }
                }
            }


            console.error("[AI] All models failed to generate an image.");
            if (lastError) console.error("Last error details:", JSON.stringify(lastError, null, 2));

            return params.originalImageUrl;
        } catch (error) {
            console.error("AI Generation Error:", error);
            // Log full error structure including response if available
            console.error("AI Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            if ((error as any).response) {
                try {
                    console.error("AI Error Response Body:", JSON.stringify((error as any).response, null, 2));
                } catch (e) { }
            }
            return params.originalImageUrl;
        }
    }

    /**
     * Generates an inspiration image from scratch based on a user prompt
     * and the book's universe context (text-to-image, no input image needed).
     */
    async generateInspirationImage(params: {
        userPrompt: string;
        bookTitle: string;
        bookAuthor: string;
        bookSynopsis: string;
        styleDescription?: string;
        referenceImageUrls?: string[];
    }): Promise<string> {
        try {
            // ---------------------------------------------------------
            // STEP 1: Build a detailed visual generation prompt
            // ---------------------------------------------------------
            console.log(`[AI-Inspire] Step 1: Building visual prompt for "${params.bookTitle}" with user input: "${params.userPrompt.slice(0, 80)}..."`);

            let visualPrompt = [
                `Create an original illustration that belongs to the fictional universe of "${params.bookTitle}" by ${params.bookAuthor}.`,
                `The image should depict: ${params.userPrompt}.`,
                `The visual style, color palette, lighting, and atmosphere should feel diegetic — as if this scene was captured from inside the story world of "${params.bookTitle}".`,
                params.bookSynopsis ? `Story context: ${params.bookSynopsis.slice(0, 250)}.` : "",
                params.styleDescription ? `Additional style direction: ${params.styleDescription}.` : "",
                "Use rich textures, cinematic composition, and cohesive color grading.",
                "Do not add any text, logos, captions, watermarks, or typography.",
                "The result should feel like a high-quality editorial photograph or illustration.",
            ].filter(Boolean).join(" ");

            // Try to enhance prompt with Gemini text model
            const styleGoogleKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2]
                .map((k) => (k || "").trim())
                .filter(Boolean);
            const geminiStyleModel = process.env.GEMINI_STYLE_MODEL?.trim() || "gemini-2.5-flash";

            if (styleGoogleKeys.length > 0 && !this.disableGeminiTextStyle) {
                const enhancePrompt = `
                    I need you to write a detailed visual prompt for an AI image generator.
                    
                    CONTEXT:
                    - Book: "${params.bookTitle}" by ${params.bookAuthor}
                    - Synopsis: ${params.bookSynopsis.slice(0, 300)}
                    ${params.styleDescription ? `- Style reference: ${params.styleDescription}` : ""}
                    
                    USER REQUEST: The user wants an image showing: "${params.userPrompt}"
                    
                    TASK:
                    Write one detailed visual-description paragraph for an AI image generator.
                    The image should feel like it exists INSIDE the universe of "${params.bookTitle}".
                    Combine the user's request with the book's world seamlessly.
                    Focus on:
                    - Specific scene composition matching the user's request
                    - Color palette and lighting consistent with the book's atmosphere
                    - Textures, props, and environment details from the book's universe
                    - Cinematic mood and emotional temperature
                    - Make it feel diegetic, as if photographed inside the story world
                    
                    Do not add violence/NSFW. Output ONLY one paragraph, no bullets or extra notes.
                `.trim();

                for (let i = 0; i < styleGoogleKeys.length; i++) {
                    try {
                        const genAI = new GoogleGenerativeAI(styleGoogleKeys[i]);
                        const textModel = genAI.getGenerativeModel({ model: geminiStyleModel });
                        const result = await textModel.generateContent(enhancePrompt);
                        const enhanced = result.response.text()?.trim();
                        if (enhanced) {
                            visualPrompt = enhanced;
                            console.log(`[AI-Inspire] Step 1 Done. Enhanced prompt: "${visualPrompt.slice(0, 100)}..."`);
                            break;
                        }
                    } catch (err: any) {
                        console.warn(`[AI-Inspire] Step 1: Gemini enhancement failed on Key ${i + 1}: ${err.message || err}`);
                    }
                }
            }

            // ---------------------------------------------------------
            // STEP 2: Generate the image (text-to-image)
            // ---------------------------------------------------------
            console.log("[AI-Inspire] Step 2: Generating image from prompt...");

            const providerQueue = (process.env.AI_IMAGE_PROVIDER_QUEUE || "gemini")
                .split(",").map((v) => v.trim().toLowerCase())
                .filter((v): v is "openai" | "gemini" => v === "openai" || v === "gemini");
            if (providerQueue.length === 0) providerQueue.push("gemini");

            const googleKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY2].filter(k => !!k).map(k => k!.trim());
            const openaiKey = process.env.OPENAI_API_KEY?.trim();
            const geminiImageModel = process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image";
            const openaiImageModel = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5";

            // Fetch style reference images if available
            const styleImages = (
                await Promise.all((params.referenceImageUrls || []).map(url => this.fetchImage(url)))
            ).filter((img): img is EncodedImage => !!img);

            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ];

            let lastError: any = null;

            for (const provider of providerQueue) {
                // --- GEMINI ---
                if (provider === "gemini") {
                    for (let i = 0; i < googleKeys.length; i++) {
                        const keyLabel = `Key ${i + 1}`;
                        console.log(`[AI-Inspire] Trying ${geminiImageModel} with ${keyLabel}...`);
                        try {
                            const genAI = new GoogleGenerativeAI(googleKeys[i]);
                            const model = genAI.getGenerativeModel({ model: geminiImageModel });
                            const parts: any[] = [{ text: visualPrompt }];
                            for (const si of styleImages) {
                                parts.push({ inlineData: { mimeType: si.mimeType, data: si.data } });
                            }

                            const result = await model.generateContent({
                                contents: [{ role: "user", parts }],
                                safetySettings
                            });

                            const candidates = result.response.candidates;
                            if (candidates?.[0]?.content?.parts) {
                                for (const part of candidates[0].content.parts) {
                                    if (part.inlineData) {
                                        console.log(`[AI-Inspire] SUCCESS with ${geminiImageModel} on ${keyLabel}!`);
                                        return `data:image/png;base64,${part.inlineData.data}`;
                                    }
                                }
                            }
                        } catch (err: any) {
                            console.error(`[AI-Inspire] Error with ${geminiImageModel} (${keyLabel}):`, err.message || err);
                            lastError = err;
                            if (err?.status === 429) continue;
                        }
                    }
                    continue;
                }

                // --- OPENAI ---
                if (provider === "openai" && openaiKey) {
                    console.log(`[AI-Inspire] Trying OpenAI ${openaiImageModel}...`);
                    try {
                        const form = new FormData();
                        form.set("model", openaiImageModel);
                        form.set("prompt", this.truncateUtf8(visualPrompt, 4000));
                        form.set("n", "1");
                        form.set("size", process.env.OPENAI_IMAGE_TOOL_SIZE?.trim() || "1024x1024");
                        form.set("quality", process.env.OPENAI_IMAGE_TOOL_QUALITY?.trim() || "medium");
                        form.set("response_format", "b64_json");

                        const response = await fetch("https://api.openai.com/v1/images/generations", {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
                            body: JSON.stringify({
                                model: openaiImageModel,
                                prompt: this.truncateUtf8(visualPrompt, 4000),
                                n: 1,
                                size: process.env.OPENAI_IMAGE_TOOL_SIZE?.trim() || "1024x1024",
                                quality: process.env.OPENAI_IMAGE_TOOL_QUALITY?.trim() || "medium",
                                response_format: "b64_json"
                            })
                        });

                        if (response.ok) {
                            const data: any = await response.json();
                            const b64 = data?.data?.[0]?.b64_json;
                            if (b64) {
                                console.log(`[AI-Inspire] SUCCESS with OpenAI ${openaiImageModel}!`);
                                return `data:image/png;base64,${b64}`;
                            }
                        } else {
                            const errText = await response.text().catch(() => "");
                            console.error(`[AI-Inspire] OpenAI error ${response.status}: ${errText.slice(0, 200)}`);
                            lastError = new Error(errText);
                        }
                    } catch (err: any) {
                        console.error(`[AI-Inspire] OpenAI error:`, err.message || err);
                        lastError = err;
                    }
                }
            }

            console.error("[AI-Inspire] All providers failed to generate image.");
            throw lastError || new Error("Failed to generate inspiration image");
        } catch (error) {
            console.error("[AI-Inspire] Error:", error);
            throw error;
        }
    }

    private async tryOpenAIImageEditsReference(params: {
        openaiKey: string;
        model: string;
        prompt: string;
        styleDescription: string;
        size: string;
        quality: string;
        format: string;
        originalImage: EncodedImage;
        styleImages: EncodedImage[];
        legacySingleImageField?: boolean;
    }): Promise<{ ok: true; dataUri: string } | { ok: false; status: number; errorText: string }> {
        const openaiEditsUrl = "https://api.openai.com/v1/images/edits";
        const isDallE2 = params.model === "dall-e-2";
        const sourceImage = isDallE2 ? await this.toPngImage(params.originalImage) : params.originalImage;
        const prompt = isDallE2 ? this.buildShortDallePrompt(params.styleDescription) : params.prompt;
        const legacySingleImageField = !!params.legacySingleImageField;
        const sourceImageExt = this.extensionForMime(sourceImage.mimeType);
        const formOptions: Record<string, string> = {
            n: "1",
            response_format: "b64_json"
        };
        if (params.size) formOptions.size = params.size;
        if (!isDallE2 && params.quality) formOptions.quality = params.quality;
        if (!isDallE2 && params.format) formOptions.output_format = params.format;

        if (isDallE2) {
            console.log(`[AI] Using short prompt for dall-e-2 (${Buffer.byteLength(prompt, "utf8")} bytes).`);
        }
        console.log(
            `[AI] Using OpenAI image edits (${openaiEditsUrl}, model=${params.model}) with uploaded image as primary reference.` +
            ` Additional style refs: ${Math.min(params.styleImages.length, 3)}.`
        );

        let lastStatus = 0;
        let lastErrorText = "No error text";

        for (let attempt = 0; attempt < 8; attempt++) {
            const form = new FormData();
            form.set("model", params.model);
            form.set("prompt", prompt);
            for (const [key, value] of Object.entries(formOptions)) {
                form.set(key, value);
            }

            const imageFieldName = legacySingleImageField ? "image" : "image[]";
            form.append(
                imageFieldName,
                new Blob([Buffer.from(sourceImage.data, "base64")], { type: sourceImage.mimeType }),
                `source.${sourceImageExt}`
            );

            if (!legacySingleImageField) {
                for (let i = 0; i < Math.min(params.styleImages.length, 3); i++) {
                    const ref = params.styleImages[i];
                    const ext = this.extensionForMime(ref.mimeType);
                    form.append(
                        "image[]",
                        new Blob([Buffer.from(ref.data, "base64")], { type: ref.mimeType }),
                        `reference-${i + 1}.${ext}`
                    );
                }
            }

            const response = await fetch(openaiEditsUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${params.openaiKey}`
                },
                body: form
            });

            if (!response.ok) {
                lastStatus = response.status;
                lastErrorText = await response.text().catch(() => "No error text");

                if (response.status !== 400) {
                    break;
                }

                let badParam: string | null = null;
                try {
                    const parsed = JSON.parse(lastErrorText);
                    if (typeof parsed?.error?.param === "string") {
                        badParam = parsed.error.param;
                    }
                } catch {
                    // ignore parse errors
                }

                if (!badParam || !(badParam in formOptions)) {
                    break;
                }

                delete formOptions[badParam];
                console.warn(`[AI] OpenAI image edits did not accept "${badParam}". Retrying without it...`);
                continue;
            }

            const data: any = await response.json();
            const b64 = data?.data?.[0]?.b64_json;
            const directUrl = data?.data?.[0]?.url;
            if (b64) {
                return { ok: true, dataUri: `data:${this.mimeForOutputFormat(params.format)};base64,${b64}` };
            }
            if (directUrl) {
                const imgResp = await fetch(directUrl);
                if (!imgResp.ok) {
                    return { ok: false, status: imgResp.status, errorText: `OpenAI image download failed: ${imgResp.status}` };
                }
                const imgBuf = await imgResp.arrayBuffer();
                const base64 = Buffer.from(imgBuf).toString("base64");
                const mimeType = this.normalizeImageMime(imgResp.headers.get("content-type"));
                return { ok: true, dataUri: `data:${mimeType};base64,${base64}` };
            }

            return { ok: false, status: 500, errorText: "OpenAI: No valid image data found in response." };
        }

        return { ok: false, status: lastStatus || 500, errorText: lastErrorText };
    }

    private buildReferenceGenerationPrompt(styleDescription: string, bookTitle: string, bookAuthor: string): string {
        const prompt = [
            "Generate a stylized version of the reference image that belongs to the book universe.",
            `Book universe anchor: "${bookTitle}".`,
            `Authorial anchor: "${bookAuthor}".`,
            "Translate the photo's atmosphere into a diegetic moment from this universe.",
            `PRIMARY STYLE DIRECTIVE: ${styleDescription}`,
            "MANDATORY: Ensure a SIGNIFICANT and expressive visual transformation from the source image.",
            "The output MUST reflect the PRIMARY STYLE DIRECTIVE above as the highest priority.",
            "Maintain the core identity of the original scene but guarantee an obvious stylistic departure.",
            "Do not add text, logos, or captions.",
            "The new image is a representation of the uploaded image within the book's universe.",
        ].join(" ");
        return this.truncateUtf8(prompt.replace(/\s+/g, " ").trim(), 2200);
    }

    private extractImageGenerationResult(data: any): string | null {
        const output = Array.isArray(data?.output) ? data.output : [];
        for (const item of output) {
            if (item?.type === "image_generation_call" && typeof item?.result === "string") {
                return item.result;
            }
        }
        return null;
    }

    private async tryOpenAIReferenceGeneration(params: {
        openaiKey: string;
        responsesModel: string;
        fallbackResponseModels?: string[];
        imageModel: string;
        size: string;
        quality: string;
        format: string;
        inputFidelity?: string;
        action?: string;
        originalImage: EncodedImage;
        styleImages: EncodedImage[];
        bookTitle: string;
        bookAuthor: string;
        safeStyleDescription: string;
    }): Promise<{ ok: true; dataUri: string } | { ok: false; status: number; errorText: string }> {
        const responsesUrl = "https://api.openai.com/v1/responses";
        const responseModels = Array.from(
            new Set([params.responsesModel, ...(params.fallbackResponseModels || [])].map((m) => m.trim()).filter(Boolean))
        );

        const generationPrompt = this.buildReferenceGenerationPrompt(
            params.safeStyleDescription,
            params.bookTitle,
            params.bookAuthor
        );
        const inputContent: any[] = [
            { type: "input_text", text: generationPrompt },
            { type: "input_image", image_url: `data:${params.originalImage.mimeType};base64,${params.originalImage.data}` },
            ...params.styleImages.slice(0, 3).map((img) => ({
                type: "input_image",
                image_url: `data:${img.mimeType};base64,${img.data}`
            }))
        ];

        const sendRequest = async (responseModel: string, toolOptions: Record<string, any>) =>
            fetch(responsesUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${params.openaiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: responseModel,
                    input: [{ role: "user", content: inputContent }],
                    tools: [{ type: "image_generation", ...toolOptions }],
                    tool_choice: { type: "image_generation" }
                })
            });

        let lastStatus = 0;
        let lastErrorText = "No error text";

        for (const responseModel of responseModels) {
            console.log(
                `[AI] Using OpenAI Responses API (${responsesUrl}, responseModel=${responseModel}, toolModel=${params.imageModel})...`
            );

            const toolOptions: Record<string, any> = { model: params.imageModel };
            if (params.size) toolOptions.size = params.size;
            if (params.quality) toolOptions.quality = params.quality;
            if (params.format) toolOptions.output_format = params.format;
            if (params.inputFidelity) toolOptions.input_fidelity = params.inputFidelity;
            if (params.action) toolOptions.action = params.action;

            let response: Response | null = null;
            for (let attempt = 0; attempt < 10; attempt++) {
                response = await sendRequest(responseModel, toolOptions);
                if (response.ok) break;

                lastStatus = response.status;
                lastErrorText = await response.text().catch(() => "No error text");

                const verificationBlocked =
                    response.status === 403 &&
                    /must be verified to use the model/i.test(String(lastErrorText));
                if (verificationBlocked) {
                    console.warn(`[AI] Response model ${responseModel} requires org verification. Trying next fallback model...`);
                    response = null;
                    break;
                }

                if (response.status !== 400) {
                    break;
                }

                let badParam: string | null = null;
                try {
                    const parsed = JSON.parse(lastErrorText);
                    if (typeof parsed?.error?.param === "string") {
                        badParam = parsed.error.param;
                    }
                } catch {
                    // ignore parse issues
                }
                if (!badParam) {
                    const m = String(lastErrorText).match(/tools\[0\]\.([a-zA-Z0-9_]+)/);
                    if (m) badParam = `tools[0].${m[1]}`;
                }

                const key = typeof badParam === "string" ? badParam.replace(/^tools\[0\]\./, "") : "";
                if (!key || !(key in toolOptions)) {
                    break;
                }

                delete toolOptions[key];
                console.warn(`[AI] OpenAI Responses did not accept tools[0].${key}. Retrying without it...`);
            }

            if (!response || !response.ok) {
                continue;
            }

            const data: any = await response.json();
            const b64 = this.extractImageGenerationResult(data);
            if (!b64) {
                lastStatus = 502;
                lastErrorText = "Responses API returned no image_generation output.";
                continue;
            }

            const mime = params.format === "jpeg" || params.format === "jpg" ? "image/jpeg" : "image/png";
            return { ok: true, dataUri: `data:${mime};base64,${b64}` };
        }

        return { ok: false, status: lastStatus || 500, errorText: lastErrorText };
    }

    private extensionForMime(mimeType: string): string {
        if (mimeType.includes("png")) return "png";
        if (mimeType.includes("webp")) return "webp";
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
        return "png";
    }

    private mimeForOutputFormat(format: string | undefined): string {
        const normalized = String(format || "").toLowerCase();
        if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
        if (normalized === "webp") return "image/webp";
        return "image/png";
    }

    private normalizeImageMime(contentType: string | null): string {
        const raw = String(contentType || "").toLowerCase();
        if (raw.includes("image/png")) return "image/png";
        if (raw.includes("image/webp")) return "image/webp";
        if (raw.includes("image/jpeg") || raw.includes("image/jpg")) return "image/jpeg";
        return "image/png";
    }

    private async toPngImage(image: EncodedImage): Promise<EncodedImage> {
        const originalMime = image.mimeType || "unknown";
        console.log(`[AI] Normalizing source image (${originalMime}) to RGBA PNG for OpenAI edits compatibility.`);
        const pngBuffer = await sharp(Buffer.from(image.data, "base64"))
            .ensureAlpha()
            .png()
            .toBuffer();
        return {
            data: pngBuffer.toString("base64"),
            mimeType: "image/png"
        };
    }

    private buildShortDallePrompt(styleDescription: string): string {
        const compact = [
            "Restyle this image.",
            "Keep the same subject, framing and composition.",
            "Do not add objects.",
            "Apply this style:",
            styleDescription,
            "Adjust only colors, lighting and texture."
        ].join(" ");

        // DALL-E 2 edit endpoint has a strict prompt size cap.
        return this.truncateUtf8(compact.replace(/\s+/g, " ").trim(), 900);
    }

    private truncateUtf8(input: string, maxBytes: number): string {
        if (Buffer.byteLength(input, "utf8") <= maxBytes) return input;
        let out = "";
        for (const ch of input) {
            const next = out + ch;
            if (Buffer.byteLength(next, "utf8") > maxBytes) break;
            out = next;
        }
        return out;
    }

    private async fetchImage(url: string): Promise<EncodedImage | null> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            return {
                data: Buffer.from(buffer).toString("base64"),
                mimeType: this.normalizeImageMime(response.headers.get("content-type"))
            };
        } catch (e) {
            console.error(`Failed to fetch image from ${url}:`, e);
            return null;
        }
    }
}

export const aiService = new GeminiService();
