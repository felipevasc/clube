import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import CategorySelector from "../components/CategorySelector";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onBookAdded: (book: any) => void;
    initialGenre?: string;
};

export default function BookshelfAddModal({ isOpen, onClose, onBookAdded, initialGenre }: Props) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [indicationComment, setIndicationComment] = useState("");
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [aiStyleDescription, setAiStyleDescription] = useState("");
    const [aiStyleImageUrls, setAiStyleImageUrls] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [searchingCovers, setSearchingCovers] = useState(false);
    const [proposedCovers, setProposedCovers] = useState<string[]>([]);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && initialGenre) {
            api<{ categories: any[] }>("/categories").then(res => {
                const cat = res.categories.find(c => c.name.toUpperCase() === initialGenre.toUpperCase());
                if (cat) setCategoryIds([cat.id]);
            });
        }
    }, [isOpen, initialGenre]);

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setAuthor("");
            setCoverUrl("");
            setCategoryIds([]);
            setIndicationComment("");
            return;
        }
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
            const buffer = await file.arrayBuffer();
            const res = await api<{ url: string }>("/uploads", {
                method: "POST",
                headers: {
                    "content-type": file.type || "application/octet-stream",
                    "x-file-name": file.name
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

    async function handleSearchCovers() {
        if (!title.trim() && !author.trim()) return;
        setSearchingCovers(true);
        setError("");
        try {
            const res = await api<{ covers: string[] }>(`/books/search-covers?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
            setProposedCovers(res.covers);
            if (res.covers.length === 0) {
                setError("Nenhuma capa encontrada.");
            }
        } catch (err: any) {
            console.error(err);
            setError("Erro ao buscar capas.");
        } finally {
            setSearchingCovers(false);
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
                body: JSON.stringify({
                    title,
                    author,
                    coverUrl,
                    synopsis,
                    indicationComment,
                    categoryIds,
                    aiStyleDescription,
                    aiStyleImageUrls
                }),
            });
            onBookAdded(res.book);
            onClose();
            setTitle("");
            setAuthor("");
            setCoverUrl("");
            setSynopsis("");
            setIndicationComment("");
            setCategoryIds([]);
            setAiStyleDescription("");
            setAiStyleImageUrls([]);
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
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="bookshelf-add-title"
                className="relative w-full max-w-sm max-h-[90vh] flex flex-col rounded-3xl bg-white/90 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between shrink-0">
                    <h2 id="bookshelf-add-title" className="text-lg font-black text-neutral-800">Novo Livro</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    <div className="flex gap-4">
                        <div className="shrink-0">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Capa</label>
                            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 aspect-[2/3] rounded-xl border-2 border-dashed border-neutral-300 overflow-hidden bg-neutral-50 flex flex-col items-center justify-center text-neutral-400 hover:border-sun-400 hover:text-sun-500 hover:bg-sun-50 transition shadow-sm group"
                            >
                                {coverUrl ? (
                                    <img src={coverUrl} className="w-full h-full object-cover transition group-hover:opacity-75" />
                                ) : (
                                    <>
                                        {uploading ? (
                                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        )}
                                        <span className="text-[8px] font-bold uppercase mt-1 text-center px-1">Upload</span>
                                    </>
                                )}
                            </button>
                            <div className="mt-2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[8px] font-bold uppercase text-neutral-600 transition"
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSearchCovers}
                                    disabled={searchingCovers || (!title.trim() && !author.trim())}
                                    className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-sun-500 hover:text-black text-neutral-500 transition disabled:opacity-50 flex items-center justify-center"
                                    title="Buscar Capas"
                                >
                                    {searchingCovers ? (
                                        <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Título</label>
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-300 focus:outline-none transition font-semibold text-sm"
                                    placeholder="Ex: O Hobbit"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Autor</label>
                                <input
                                    type="text"
                                    required
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-300 focus:outline-none transition font-semibold text-sm"
                                    placeholder="Ex: J.R.R. Tolkien"
                                />
                            </div>
                        </div>
                    </div>

                    {
                        proposedCovers.length > 0 && (
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Capas Encontradas</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {proposedCovers.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setCoverUrl(url)}
                                            className={`shrink-0 w-20 aspect-[2/3] rounded-lg overflow-hidden border-2 transition ${coverUrl === url ? 'border-sun-500 ring-2 ring-sun-200' : 'border-transparent'}`}
                                        >
                                            <img src={url} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sinopse</label>
                        <textarea
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-300 focus:outline-none transition font-medium min-h-[80px] resize-none text-xs"
                            placeholder="Breve descrição do livro..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Quer deixar um comentário sobre este livro?</label>
                        <textarea
                            value={indicationComment}
                            onChange={(e) => setIndicationComment(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-300 focus:outline-none transition font-medium min-h-[60px] resize-none text-xs"
                            placeholder="Escreva uma dedicatória ou motivo da indicação..."
                        />
                    </div>

                    <CategorySelector
                        selectedIds={categoryIds}
                        onChange={setCategoryIds}
                    />

                    <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-sun-500 flex items-center justify-center text-[8px] text-white font-bold italic">AI</span>
                            <h3 className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">Estilo Visual Personalizado</h3>
                        </div>

                        <p className="text-[9px] text-neutral-500 leading-tight">
                            Descreva e envie referências para que a IA transforme as fotos postadas pelos leitores deste livro.
                        </p>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Informações adicionais do estilo do livro</label>
                            <textarea
                                value={aiStyleDescription}
                                onChange={(e) => setAiStyleDescription(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-2 focus:ring-sun-300 focus:outline-none transition font-medium min-h-[60px] resize-none text-xs"
                                placeholder="Ex: Tons quentes, pintura digital, místico..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Imagens de Referência IA (máx 3)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {aiStyleImageUrls.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-black/5 bg-neutral-100 group">
                                        <img src={url} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setAiStyleImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[8px] font-bold"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                                {aiStyleImageUrls.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";
                                            input.onchange = async (e: any) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploading(true);
                                                try {
                                                    const buffer = await file.arrayBuffer();
                                                    const res = await api<{ url: string }>("/uploads", {
                                                        method: "POST",
                                                        headers: {
                                                            "content-type": file.type || "application/octet-stream",
                                                            "x-file-name": file.name
                                                        },
                                                        body: buffer as any
                                                    });
                                                    setAiStyleImageUrls(prev => [...prev, res.url]);
                                                } finally {
                                                    setUploading(false);
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 hover:border-sun-400 hover:text-sun-500 hover:bg-sun-50 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
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
                </form >
            </div >
        </div >
    );
}
