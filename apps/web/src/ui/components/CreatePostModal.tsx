import { useEffect, useRef, useState, useMemo } from "react";
import { api } from "../../lib/api";
import PrimaryButton from "./PrimaryButton";
import Avatar from "./Avatar";
import EmojiPickerButton from "./EmojiPickerButton";

type ClubBook = { id: string; title: string; author: string; colorKey: string; isActive: boolean };

export default function CreatePostModal({
    isOpen,
    onClose,
    onSuccess,
    userId, // Assuming we pass userId for the avatar, or fetch it
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId?: string;
}) {
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
    const [clubBookId, setClubBookId] = useState<string>("");
    const [aiImages, setAiImages] = useState<Record<string, string>>({}); // originalUrl -> aiUrl
    // Changed: Track a set of all selected URLs (original AND/OR ai)
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
    const [aiGeneratedUrls, setAiGeneratedUrls] = useState<Set<string>>(new Set());

    const toggleSelection = (url: string) => {
        setSelectedUrls(prev => {
            const next = new Set(prev);
            if (next.has(url)) {
                next.delete(url);
            } else {
                next.add(url);
            }
            return next;
        });
    };
    const [transforming, setTransforming] = useState<Record<string, boolean>>({});
    const [showAiPrompt, setShowAiPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiGenerating, setAiGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const aiPromptRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Fetch books when modal opens
            Promise.all([
                api<{ clubBooks: ClubBook[] }>("/club-books").catch(() => ({ clubBooks: [] as ClubBook[] })),
                api<{ clubBook: ClubBook | null }>("/club-books/active").catch(() => ({ clubBook: null as any })),
            ]).then(([listOut, activeOut]) => {
                const rows = Array.isArray(listOut?.clubBooks) ? listOut.clubBooks : [];
                setClubBooks(rows);
                const activeId = String(activeOut?.clubBook?.id || "");
                setClubBookId((prev) => {
                    if (prev && rows.some((b) => b.id === prev)) return prev;
                    return activeId || "";
                });
            });
        }
    }, [isOpen]);

    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    useEffect(() => {
        if (files.length === 0) {
            setPreviews([]);
            return;
        }
        const urls = files.map(f => URL.createObjectURL(f));
        setPreviews(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [files]);

    const canPost = useMemo(() => text.trim().length > 0 || files.length > 0, [text, files]);

    const uploadImage = async (f: File) => {
        const res = await fetch("/api/uploads", {
            method: "POST",
            headers: { "content-type": f.type || "application/octet-stream" },
            body: f,
            credentials: "include",
        });
        const txt = await res.text();
        const json = txt ? JSON.parse(txt) : null;
        if (!res.ok) throw new Error(String(json?.error || res.statusText));
        const url = String(json?.url || "");

        // If a club book is selected, trigger AI transformation
        if (clubBookId) {
            triggerTransform(url);
        }

        return url;
    };

    const triggerTransform = async (url: string) => {
        if (!clubBookId) return;
        setTransforming(prev => ({ ...prev, [url]: true }));
        try {
            const res = await api<{ url: string }>("/ai/transform", {
                method: "POST",
                body: JSON.stringify({ imageUrl: url, clubBookId })
            });
            if (res.url) {
                setAiImages(prev => ({ ...prev, [url]: res.url }));
                // Auto-select the AI version when ready (keep original selected too if user wants)
                setSelectedUrls(prev => {
                    const next = new Set(prev);
                    next.add(res.url);
                    return next;
                });
            }
        } catch (err) {
            console.error("AI Transform Error:", err);
        } finally {
            setTransforming(prev => ({ ...prev, [url]: false }));
        }
    };

    const generateAiImage = async () => {
        if (!aiPrompt.trim() || !clubBookId || aiGenerating) return;
        setAiGenerating(true);
        try {
            const res = await api<{ url: string }>("/ai/generate-image", {
                method: "POST",
                body: JSON.stringify({ prompt: aiPrompt.trim(), clubBookId })
            });
            if (res.url) {
                setUploadedUrls(prev => [...prev, res.url]);
                setSelectedUrls(prev => new Set(prev).add(res.url));
                setAiGeneratedUrls(prev => new Set(prev).add(res.url));
                setAiPrompt("");
                setShowAiPrompt(false);
            }
        } catch (err) {
            console.error("AI Generate Error:", err);
            alert("Erro ao gerar imagem. Tente novamente.");
        } finally {
            setAiGenerating(false);
        }
    };

    const base64ToBlob = (base64: string): Blob => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const sendPost = async () => {
        setLoading(true);
        try {
            // 1. We rely on 'uploadedUrls' state which is populated by on-change. 
            // No need to re-upload 'files'.

            // 2. Build the list of selected URLs (mix of already uploaded originals and potential base64 AI images)
            const resolvedUrls: string[] = [];

            // We need to preserve the order based on uploadedUrls (which tracks the "slots")
            for (const originalUrl of uploadedUrls) {
                // If original is selected, it's already a deployed URL
                if (selectedUrls.has(originalUrl)) {
                    resolvedUrls.push(originalUrl);
                }

                // If AI version is selected
                const aiUrl = aiImages[originalUrl];
                if (aiUrl && selectedUrls.has(aiUrl)) {
                    // Check if it's a data URI (base64)
                    if (aiUrl.startsWith('data:')) {
                        try {
                            // Convert to blob and upload
                            const blob = base64ToBlob(aiUrl);
                            // Cast to File to satisfy the type, or just pass blob if uploadImage handles it
                            // adapting uploadImage to accept Blob
                            const file = new File([blob], "ai-generated-image.png", { type: blob.type });
                            const newUrl = await uploadImage(file);
                            resolvedUrls.push(newUrl);
                        } catch (err) {
                            console.error("Failed to upload AI image:", err);
                            // Fallback? If we fail to upload, maybe don't include it or try sending base64 (risk of failure)
                        }
                    } else {
                        // Already a URL (if we change logic later to return URLs from AI)
                        resolvedUrls.push(aiUrl);
                    }
                }
            }

            if (resolvedUrls.length === 0 && text.trim().length === 0) {
                // Nothing to post
                setLoading(false);
                return;
            }

            await api("/posts", {
                method: "POST",
                body: JSON.stringify({
                    text,
                    images: resolvedUrls.length > 0 ? resolvedUrls : undefined,
                    imageUrl: resolvedUrls[0],
                    clubBookId: clubBookId || undefined
                }),
            });
            setText("");
            setFiles([]);
            setUploadedUrls([]);
            setAiImages({});
            setSelectedUrls(new Set());
            setAiGeneratedUrls(new Set());
            if (fileInputRef.current) fileInputRef.current.value = "";
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to send post:", err);
            alert("Erro ao criar post. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const insertEmoji = (emoji: string) => {
        const el = textareaRef.current;
        if (!el) {
            setText(prev => prev + emoji);
            return;
        }

        const start = el.selectionStart || 0;
        const end = el.selectionEnd || 0;
        const currentText = text;
        const before = currentText.substring(0, start);
        const after = currentText.substring(end);

        const newText = before + emoji + after;
        setText(newText);

        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl !overflow-visible flex flex-col max-h-[90dvh] animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-900 font-medium px-2 py-1"
                    >
                        Cancelar
                    </button>
                    <div className="font-bold text-base">Novo Post</div>
                    <button
                        onClick={sendPost}
                        disabled={!canPost || loading}
                        className={`font-bold text-sm px-4 py-1.5 rounded-full transition-all ${canPost && !loading
                            ? "bg-black text-white hover:bg-neutral-800"
                            : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Postando..." : "Postar"}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Book Context Selector - Top of content */}
                    {clubBooks.length > 0 && (
                        <div className="px-4 pt-4 pb-2">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-lg">📚</span>
                                </div>
                                <select
                                    value={clubBookId}
                                    onChange={(e) => setClubBookId(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl appearance-none cursor-pointer hover:border-sun-500 hover:bg-sun-50/30 transition-all text-sm font-semibold text-neutral-700 outline-none focus:ring-2 focus:ring-sun-500/20 focus:border-sun-500"
                                >
                                    <option value="">Sobre qual livro você quer falar?</option>
                                    {clubBooks.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.title} {b.isActive ? "(Leitura Atual)" : ""}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400 group-hover:text-sun-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            {clubBookId && (
                                <div className="mt-1 flex justify-end">
                                    <span className="text-[10px] items-center flex gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                        ✨ Modo IA Habilitado
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-4 space-y-4 pt-0">
                        <div className="flex gap-3 mt-2">
                            {/* Placeholder for Avatar if we had it, or just use a generic one */}
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0 grid place-items-center">
                                👤
                            </div>
                            <div className="flex-1 flex flex-col">
                                <textarea
                                    ref={textareaRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full min-h-[120px] resize-none outline-none text-base placeholder:text-neutral-400 mt-2"
                                    placeholder={clubBookId ? "Escreva seu comentário sobre o livro..." : "No que você está pensando?"}
                                    autoFocus
                                />
                                <div className="flex justify-end pr-2">
                                    <EmojiPickerButton onEmojiSelect={insertEmoji} align="right" />
                                </div>
                            </div>
                        </div>

                        {/* Image Previews & AI Selection */}
                        {uploadedUrls.length > 0 && (
                            <div className="space-y-6">
                                {uploadedUrls.map((url, idx) => {
                                    const isAiGenerated = aiGeneratedUrls.has(url);
                                    const aiUrl = aiImages[url];
                                    const isTransforming = transforming[url];

                                    return (
                                        <div key={url} className="space-y-2 border-b border-neutral-50 pb-4 last:border-0">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                                    {isAiGenerated ? "✨ Gerada por IA" : `Imagem ${idx + 1}`}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setUploadedUrls(prev => prev.filter(u => u !== url));
                                                        setSelectedUrls(prev => {
                                                            const next = new Set(prev);
                                                            next.delete(url);
                                                            if (aiUrl) next.delete(aiUrl);
                                                            return next;
                                                        });
                                                        if (isAiGenerated) {
                                                            setAiGeneratedUrls(prev => {
                                                                const next = new Set(prev);
                                                                next.delete(url);
                                                                return next;
                                                            });
                                                        }
                                                    }}
                                                    className="text-red-500 text-[10px] font-bold uppercase hover:underline"
                                                >
                                                    Remover
                                                </button>
                                            </div>

                                            {isAiGenerated ? (
                                                /* AI-generated: simple full-width card, no transform option */
                                                <div
                                                    onClick={() => toggleSelection(url)}
                                                    className={`relative rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${selectedUrls.has(url) ? 'border-sun-500 scale-[1.01] shadow-lg' : 'border-transparent opacity-60'}`}
                                                >
                                                    <img src={url} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedUrls.has(url) ? 'bg-sun-500 border-sun-500' : 'border-white bg-black/20'}`}>
                                                            {selectedUrls.has(url) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-sun-500 px-2 py-0.5 rounded-full text-[8px] font-black text-black uppercase">✨ IA</div>
                                                </div>
                                            ) : (
                                                /* Uploaded: Original + AI transform side-by-side */
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Original */}
                                                    <div
                                                        onClick={() => toggleSelection(url)}
                                                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${selectedUrls.has(url) ? 'border-sun-500 scale-[1.02] shadow-lg z-10' : 'border-transparent opacity-60'}`}
                                                    >
                                                        <img src={url} className="w-full h-full object-cover" />
                                                        <div className="absolute top-2 right-2">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedUrls.has(url) ? 'bg-sun-500 border-sun-500' : 'border-white bg-black/20'}`}>
                                                                {selectedUrls.has(url) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase">Original</div>
                                                    </div>

                                                    {/* AI Styled */}
                                                    <div
                                                        onClick={() => aiUrl && toggleSelection(aiUrl)}
                                                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer bg-neutral-100 flex items-center justify-center ${aiUrl && selectedUrls.has(aiUrl) ? 'border-sun-500 scale-[1.02] shadow-lg z-10' : 'border-transparent opacity-60'}`}
                                                    >
                                                        {isTransforming ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-6 h-6 border-2 border-sun-500 border-t-transparent rounded-full animate-spin" />
                                                                <span className="text-[8px] font-black text-neutral-400 uppercase animate-pulse text-center px-2">Estilizando...</span>
                                                            </div>
                                                        ) : aiUrl ? (
                                                            <>
                                                                <img src={aiUrl} className="w-full h-full object-cover" />
                                                                <div className="absolute top-2 right-2 pointer-events-none">
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedUrls.has(aiUrl) ? 'bg-sun-500 border-sun-500' : 'border-white bg-black/20'}`}>
                                                                        {selectedUrls.has(aiUrl) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-2 left-2 bg-sun-500 px-2 py-0.5 rounded-full text-[8px] font-black text-black uppercase">IA Style</div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); triggerTransform(url); }}
                                                                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-sun-500 hover:text-white transition active:scale-90"
                                                                    title="Regerar"
                                                                >
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 px-4 text-center">
                                                                <span className="text-[8px] font-bold text-neutral-400 uppercase">
                                                                    {clubBookId ? "Pronto para IA" : "Selecione um livro"}
                                                                </span>
                                                                {clubBookId && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); triggerTransform(url); }}
                                                                        className="px-3 py-1 bg-sun-500 text-black text-[9px] font-black rounded-full hover:bg-sun-400 transition transform active:scale-95 shadow-lg shadow-sun-500/20"
                                                                    >
                                                                        ESTILIZAR
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Tools Area */}
                        <div className="pt-2">
                            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                {/* Book Selector Removed from here */}
                            </div>

                            <div className="border-t border-neutral-100 pt-4 flex items-center gap-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={async (e) => {
                                        const newFiles = Array.from(e.target.files || []);
                                        setFiles(prev => [...prev, ...newFiles]);

                                        for (const f of newFiles) {
                                            try {
                                                const url = await uploadImage(f);
                                                setUploadedUrls(prev => [...prev, url]);
                                                setSelectedUrls(prev => new Set(prev).add(url));
                                            } catch (err) {
                                                console.error("Upload error:", err);
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-neutral-500 hover:text-sun-500 transition flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">Fotos</span>
                                </button>

                                {/* AI Generate Image Button */}
                                {clubBookId && (
                                    <button
                                        onClick={() => {
                                            setShowAiPrompt(prev => !prev);
                                            setTimeout(() => aiPromptRef.current?.focus(), 100);
                                        }}
                                        className={`flex items-center gap-1.5 transition text-sm font-medium ${showAiPrompt ? "text-sun-500" : "text-neutral-500 hover:text-sun-500"
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                        </svg>
                                        Gerar IA
                                    </button>
                                )}
                            </div>

                            {/* AI Prompt Input */}
                            {showAiPrompt && clubBookId && (
                                <div className="mt-3 p-3 bg-gradient-to-r from-sun-50 to-amber-50 rounded-xl border border-sun-200/50">
                                    <p className="text-[10px] font-bold text-sun-700 uppercase tracking-wider mb-2">
                                        ✨ Descreva a imagem que deseja gerar
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            ref={aiPromptRef}
                                            type="text"
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") generateAiImage(); }}
                                            placeholder="Ex: uma cena no jardim com flores ao pôr do sol..."
                                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-sun-200 bg-white outline-none focus:ring-2 focus:ring-sun-500/30 focus:border-sun-400 placeholder:text-neutral-400"
                                            disabled={aiGenerating}
                                        />
                                        <button
                                            onClick={generateAiImage}
                                            disabled={!aiPrompt.trim() || aiGenerating}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${aiPrompt.trim() && !aiGenerating
                                                ? "bg-sun-500 text-black hover:bg-sun-400 shadow-lg shadow-sun-500/20 active:scale-95"
                                                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                                }`}
                                        >
                                            {aiGenerating ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    Gerando...
                                                </span>
                                            ) : "Gerar"}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-sun-600/70 mt-1.5">
                                        A IA criará uma imagem inspirada no universo do livro selecionado
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
