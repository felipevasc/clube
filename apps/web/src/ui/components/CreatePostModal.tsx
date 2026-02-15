import { useEffect, useRef, useState, useMemo } from "react";
import { api } from "../../lib/api";
import PrimaryButton from "./PrimaryButton";
import Avatar from "./Avatar";

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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        return String(json?.url || "");
    };

    const sendPost = async () => {
        setLoading(true);
        try {
            const uploadedUrls = await Promise.all(files.map(uploadImage));

            await api("/posts", {
                method: "POST",
                body: JSON.stringify({
                    text,
                    images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
                    // Legacy support: also send imageUrl as the first image
                    imageUrl: uploadedUrls[0],
                    clubBookId: clubBookId || undefined
                }),
            });
            setText("");
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
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
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-200">

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
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex gap-3">
                        {/* Placeholder for Avatar if we had it, or just use a generic one */}
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0 grid place-items-center">
                            👤
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 min-h-[100px] resize-none outline-none text-base placeholder:text-neutral-400 mt-2"
                            placeholder="No que você está pensando?"
                            autoFocus
                        />
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {previews.map((url, idx) => (
                                <div key={url} className="relative rounded-xl overflow-hidden border border-neutral-100 group aspect-square">
                                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => {
                                            setFiles(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tools Area */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                            {clubBooks.length > 0 && (
                                <select
                                    value={clubBookId}
                                    onChange={(e) => setClubBookId(e.target.value)}
                                    className="appearance-none bg-neutral-50 border border-neutral-200 rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-700 outline-none focus:ring-2 focus:ring-black/5"
                                >
                                    <option value="">📚 Selecionar livro (opcional)</option>
                                    {clubBooks.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.isActive ? "🔥 " : ""}{b.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="border-t border-neutral-100 pt-4 flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files || []);
                                    setFiles(prev => [...prev, ...newFiles]);
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

                            {/* Add more attachment types here if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
