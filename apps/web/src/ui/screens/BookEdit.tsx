import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";
import CategorySelector from "../components/CategorySelector";

type Book = {
    id: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    synopsis?: string | null;
    aiStyleDescription?: string;
    categories?: { id: string; name: string }[];
    styleImages?: { url: string }[];
    indicationComment?: string | null;
};

export default function BookEdit() {
    const { id } = useParams();
    const bookId = String(id || "");
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [aiStyleDescription, setAiStyleDescription] = useState("");
    const [aiStyleImageUrls, setAiStyleImageUrls] = useState<string[]>([]);
    const [indicationComment, setIndicationComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [searchingCovers, setSearchingCovers] = useState(false);
    const [proposedCovers, setProposedCovers] = useState<string[]>([]);

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
                    setCategoryIds(b.categories?.map(c => c.id) || []);
                    setAiStyleDescription(b.aiStyleDescription || "");
                    setAiStyleImageUrls(b.styleImages?.map(si => si.url) || []);
                    setIndicationComment(b.indicationComment || "");
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
        if (!bookId) return;

        setSubmitting(true);
        setError("");
        try {
            await api(`/books/${encodeURIComponent(bookId)}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    author,
                    coverUrl,
                    synopsis,
                    categoryIds,
                    aiStyleDescription,
                    aiStyleImageUrls,
                    indicationComment
                }),
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
                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {/* Seção 1: Capa e Identidade */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center shrink-0">
                            <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Capa do Livro</label>
                            <div className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-[2/3] w-48 bg-neutral-100 cursor-pointer transition hover:scale-[1.02]" onClick={() => fileInputRef.current?.click()}>
                                {coverUrl ? (
                                    <img src={coverUrl} alt="Capa" className="w-full h-full object-cover transition group-hover:opacity-75" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-wider">Trocar Capa</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <span className="text-white text-xs font-bold px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">Upload Nova</span>
                                </div>
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                            <div className="mt-4 flex gap-2 w-48">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold text-neutral-600 uppercase transition"
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSearchCovers}
                                    disabled={searchingCovers || (!title.trim() && !author.trim())}
                                    className="flex-1 py-1.5 rounded-xl bg-neutral-100 hover:bg-sun-500 hover:text-black text-neutral-500 transition disabled:opacity-50 flex items-center justify-center"
                                    title="Buscar Capas (Web API)"
                                >
                                    {searchingCovers ? (
                                        <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto w-full">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide px-1">Título</label>
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:bg-white focus:border-sun-400 focus:ring-4 focus:ring-sun-100 focus:outline-none transition font-semibold text-lg"
                                    placeholder="Ex: O Hobbit"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide px-1">Autor</label>
                                <input
                                    type="text"
                                    required
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:bg-white focus:border-sun-400 focus:ring-4 focus:ring-sun-100 focus:outline-none transition font-semibold"
                                    placeholder="Ex: J.R.R. Tolkien"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide px-1">Sinopse / Conteúdo</label>
                                <textarea
                                    value={synopsis}
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:bg-white focus:border-sun-400 focus:ring-4 focus:ring-sun-100 focus:outline-none transition font-serif text-lg leading-relaxed min-h-[200px] resize-y"
                                    placeholder="Escreva a sinopse ou o conteúdo do livro aqui..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide px-1">Quer deixar um comentário sobre este livro?</label>
                                <textarea
                                    value={indicationComment}
                                    onChange={(e) => setIndicationComment(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:bg-white focus:border-sun-400 focus:ring-4 focus:ring-sun-100 focus:outline-none transition font-medium min-h-[100px] resize-y"
                                    placeholder="Conte-nos o que você achou deste livro e por que outros devem lê-lo..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Categorias */}
                    <div className="pt-8 border-t border-black/5 max-w-2xl mx-auto w-full">
                        <div className="mb-4">
                            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest px-1">Categorias e Organização</h3>
                        </div>
                        <CategorySelector
                            selectedIds={categoryIds}
                            onChange={setCategoryIds}
                        />
                    </div>

                    {/* Seção 3: Estilo IA */}
                    <div className="pt-8 border-t border-black/5 max-w-2xl mx-auto w-full">
                        <div className="bg-sun-50 rounded-3xl p-8 border border-sun-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sun-500 flex items-center justify-center text-white font-black italic shadow-xl shadow-sun-500/30 text-xl">AI</div>
                                <div>
                                    <h3 className="text-base font-black text-neutral-800 uppercase tracking-widest">Estilo Visual Personalizado</h3>
                                    <p className="text-xs text-sun-700 font-medium">Configure como o Gemini deve estilizar as fotos deste livro.</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-widest">Informações adicionais do estilo do livro</label>
                                    <textarea
                                        value={aiStyleDescription}
                                        onChange={(e) => setAiStyleDescription(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-sun-400 focus:ring-4 focus:ring-sun-100 focus:outline-none transition font-medium min-h-[140px] resize-y text-sm shadow-sm"
                                        placeholder="Ex: Estilo aquarela suave de Maria Sibylla Merian, tons pastéis de verde e rosa, luz matinal, estética botânica clássica..."
                                    />
                                    <div className="flex items-center gap-2 text-[11px] text-sun-600 bg-sun-100/50 w-fit px-3 py-1.5 rounded-full font-medium italic">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Dica: Seja específico sobre cores, técnica de pintura e iluminação para melhores resultados.
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-widest">Imagens de Referência IA (Humor / Vibe)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {aiStyleImageUrls.map((url, i) => (
                                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white bg-white group shadow-md transition hover:scale-[1.05]">
                                                <img src={url} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setAiStyleImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="absolute inset-0 bg-red-500/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                                                >
                                                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span className="text-[10px] font-black uppercase">Remover</span>
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
                                                            const url = await uploadCover(file);
                                                            setAiStyleImageUrls(prev => [...prev, url]);
                                                        } finally {
                                                            setUploading(false);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                                className="aspect-square rounded-2xl border-2 border-dashed border-sun-300 flex flex-col items-center justify-center text-sun-400 hover:border-sun-500 hover:text-sun-600 hover:bg-white transition bg-sun-100/30 group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-sun-100 flex items-center justify-center group-hover:bg-sun-200 transition">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                                <span className="text-[10px] font-black uppercase mt-2">Adicionar</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-sun-700 italic leading-relaxed">Envie até 3 fotos que sirvam de referência visual para o "tom" das transformações da IA.</p>
                                </div>
                            </div>
                        </div>

                        {proposedCovers.length > 0 && (
                            <div className="space-y-3 max-w-2xl mx-auto w-full">
                                <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Sugestões de Capa (API)</label>
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {proposedCovers.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setCoverUrl(url)}
                                            className={`shrink-0 w-24 aspect-[2/3] rounded-xl overflow-hidden border-4 transition ${coverUrl === url ? 'border-sun-500 ring-4 ring-sun-100 scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                                        >
                                            <img src={url} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-neutral-400 italic px-1">Selecione uma imagem acima para usar como capa ou continue com o arquivo atual.</p>
                            </div>
                        )}
                    </div>

                    {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 max-w-2xl mx-auto w-full">{error}</div>}

                    <div className="flex justify-center gap-4 pt-10 border-t border-black/5">
                        <button
                            type="button"
                            onClick={() => nav(-1)}
                            className="px-10 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 font-black border border-black/10 transition active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="px-12 py-4 rounded-2xl bg-sun-500 hover:bg-sun-400 text-black font-black shadow-xl shadow-sun-500/20 active:scale-95 transition disabled:opacity-50 min-w-[200px]"
                        >
                            {submitting ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
