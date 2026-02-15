import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onBookAdded: (book: any) => void;
};

export default function BookshelfAddModal({ isOpen, onClose, onBookAdded }: Props) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const titleInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        setError("");

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        const t = window.setTimeout(() => titleInputRef.current?.focus(), 0);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
            window.clearTimeout(t);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            // Upload to /api/uploads which accepts raw body
            // We need to read file as ArrayBuffer or just pass it if fetch supports it
            const buffer = await file.arrayBuffer();
            const res = await api<{ url: string }>("/uploads", {
                method: "POST",
                headers: {
                    "content-type": file.type || "application/octet-stream",
                    "x-file-name": file.name // Gateway uses this for safe filename
                },
                body: buffer as any
            });
            setCoverUrl(res.url);
        } catch (err: any) {
            console.error(err);
            setError("Erro ao enviar imagem.");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !author.trim()) return;

        setSubmitting(true);
        setError("");
        try {
            const res = await api<{ book: any }>("/books", {
                method: "POST",
                body: JSON.stringify({ title, author, coverUrl }),
            });
            onBookAdded(res.book);
            onClose();
            // Reset form
            setTitle("");
            setAuthor("");
            setCoverUrl("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao criar livro.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="bookshelf-add-title"
                className="relative w-full max-w-sm rounded-3xl bg-white/90 shadow-2xl overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                    <h2 id="bookshelf-add-title" className="text-lg font-black text-neutral-800">Novo Livro</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Título</label>
                        <input
                            ref={titleInputRef}
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-500 focus:outline-none transition font-semibold"
                            placeholder="Ex: O Hobbit"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Autor</label>
                        <input
                            type="text"
                            required
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-500 focus:outline-none transition font-semibold"
                            placeholder="Ex: J.R.R. Tolkien"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Capa (Opcional)</label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {coverUrl ? (
                            <div className="relative group rounded-xl overflow-hidden border border-black/10 aspect-[2/3] w-24 mx-auto bg-neutral-100">
                                <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setCoverUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                >
                                    <span className="text-white text-xs font-bold">Remover</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full py-4 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:border-sun-400 hover:text-sun-600 hover:bg-sun-50 transition gap-1"
                            >
                                {uploading ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs font-semibold">Enviar imagem de capa</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {error && <div className="text-red-500 text-xs font-semibold text-center">{error}</div>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="w-full py-3 rounded-xl bg-sun-500 hover:bg-sun-400 text-black font-black shadow-lg shadow-sun-500/20 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {submitting ? "Salvando..." : "Adicionar à Estante"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
