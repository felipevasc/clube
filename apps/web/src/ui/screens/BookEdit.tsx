import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";

type Book = {
    id: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    synopsis?: string | null
};

export default function BookEdit() {
    const { id } = useParams();
    const bookId = String(id || "");
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [synopsis, setSynopsis] = useState("");

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const titleInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!bookId) return;
            setLoading(true);
            try {
                const out = await api<{ book: Book }>(`/books/${encodeURIComponent(bookId)}`);
                if (!alive) return;
                const b = out.book;
                if (b) {
                    setTitle(b.title || "");
                    setAuthor(b.author || "");
                    setCoverUrl(b.coverUrl || "");
                    setSynopsis(b.synopsis || "");
                }
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar o livro.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [bookId]);

    const uploadCover = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const res = await api<{ url: string }>("/uploads", {
            method: "POST",
            headers: {
                "content-type": file.type || "application/octet-stream",
                "x-file-name": file.name || "capa",
            },
            body: buffer as any,
        });
        return String(res?.url || "");
    };

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const url = await uploadCover(file);
            setCoverUrl(url);
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
        if (!bookId) return;

        setSubmitting(true);
        setError("");
        try {
            await api(`/books/${encodeURIComponent(bookId)}`, {
                method: "PUT",
                body: JSON.stringify({ title, author, coverUrl, synopsis }),
            });
            nav(-1); // Go back
        } catch (err: any) {
            console.error(err);
            setError(String(err?.message || "Erro ao salvar."));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="py-12 text-center text-sm text-neutral-600">
                Carregando informações do livro...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => nav(-1)}
                    className="w-10 h-10 rounded-2xl bg-white/70 border border-black/10 hover:bg-white transition grid place-items-center shadow-sm"
                    title="Voltar"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="text-2xl font-black text-neutral-900">Editar Livro</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Título</label>
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-4 focus:ring-sun-200 focus:outline-none transition font-semibold"
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
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-4 focus:ring-sun-200 focus:outline-none transition font-semibold"
                                    placeholder="Ex: J.R.R. Tolkien"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Capa</label>
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

                                <div className="flex items-start gap-4">
                                    <div className="relative group rounded-xl overflow-hidden border border-black/10 aspect-[2/3] w-28 bg-neutral-100 shrink-0 shadow-card">
                                        {coverUrl ? (
                                            <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-1 h-28 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:border-sun-400 hover:text-sun-600 hover:bg-sun-50 transition gap-1 disabled:opacity-60"
                                    >
                                        {uploading ? (
                                            <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="text-xs font-bold">Alterar Capa</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 flex flex-col">
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Sinopse / Conteúdo</label>
                            <textarea
                                value={synopsis}
                                onChange={(e) => setSynopsis(e.target.value)}
                                className="flex-1 w-full px-4 py-3 rounded-xl bg-neutral-100 border-transparent focus:bg-white focus:ring-4 focus:ring-sun-200 focus:outline-none transition font-serif text-lg leading-relaxed min-h-[300px] resize-none"
                                placeholder="Escreva a sinopse ou o conteúdo do livro aqui..."
                            />
                        </div>
                    </div>

                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">{error}</div>}

                    <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
                        <button
                            type="button"
                            onClick={() => nav(-1)}
                            className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 font-black border border-black/10 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="px-8 py-3 rounded-xl bg-sun-500 hover:bg-sun-400 text-black font-black shadow-lg shadow-sun-500/20 active:scale-95 transition disabled:opacity-50"
                        >
                            {submitting ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
