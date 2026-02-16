import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { CLUB_COLORS, ClubColorKey } from "@clube/shared";
import { LuSearch, LuPlus, LuX, LuChevronRight, LuCalendar } from "react-icons/lu";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onBookAdded: () => void;
    city: string; // "FORTALEZA" or "BRASILIA"
};

type Step = "search" | "create_book" | "confirm";

type Book = {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    synopsis?: string;
    genre?: string;
};

export default function ClubBookAddModal({ isOpen, onClose, onBookAdded, city }: Props) {
    const [step, setStep] = useState<Step>("search");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [searching, setSearching] = useState(false);

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // New Book Form
    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newCoverUrl, setNewCoverUrl] = useState("");
    const [newGenre, setNewGenre] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirm Step
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [colorKey, setColorKey] = useState<ClubColorKey>("rubi");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const searchTimeout = useRef<number>();

    useEffect(() => {
        if (!isOpen) return;
        setStep("search");
        setSearchQuery("");
        setSearchResults([]);
        setSelectedBook(null);
        setNewTitle("");
        setNewAuthor("");
        setNewCoverUrl("");
        setNewGenre("");
        setError("");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        // Clear previous timeout
        window.clearTimeout(searchTimeout.current);

        // Show loading state
        setSearching(true);

        // Debounce search slightly (300ms) to avoid spamming as user types rapidly
        // If query is empty, it fetches default list (e.g. latest books)
        searchTimeout.current = window.setTimeout(async () => {
            try {
                const res = await api<{ books: Book[] }>(`/books?q=${encodeURIComponent(searchQuery)}`);
                setSearchResults(res.books);
            } catch (e) {
                console.error(e);
            } finally {
                setSearching(false);
            }
        }, 300);
    }, [searchQuery, isOpen]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setStep("confirm");
    };

    const handleCreateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newAuthor.trim()) return;

        setSubmitting(true);
        setError("");
        try {
            const res = await api<{ book: Book }>("/books", {
                method: "POST",
                body: JSON.stringify({
                    title: newTitle,
                    author: newAuthor,
                    coverUrl: newCoverUrl,
                    genre: newGenre,
                }),
            });
            setSelectedBook(res.book);
            setStep("confirm");
        } catch (e: any) {
            setError(e.message || "Erro ao criar livro");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedBook) return;
        setSubmitting(true);
        setError("");
        try {
            await api("/club-books", {
                method: "POST",
                body: JSON.stringify({
                    bookId: selectedBook.id,
                    title: selectedBook.title, // Gateway/Backend requires these for denormalization
                    author: selectedBook.author,
                    coverUrl: selectedBook.coverUrl || "", // Can be empty or from book
                    colorKey,
                    city,
                    month: Number(month),
                    year: Number(year),
                }),
            });
            onBookAdded();
            onClose();
        } catch (e: any) {
            setError(e.message || "Erro ao adicionar à estante");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await fetch("/api/uploads", {
                method: "POST",
                headers: {
                    "content-type": file.type || "application/octet-stream",
                    "x-file-name": file.name,
                },
                body: file,
            });
            if (!res.ok) throw new Error("Upload failed");
            const { url } = await res.json();
            setNewCoverUrl(url);
        } catch (e) {
            alert("Erro no upload");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-black text-neutral-800">
                        {step === "search" && `Adicionar em ${city === "FORTALEZA" ? "Fortaleza" : "Brasília"}`}
                        {step === "create_book" && "Novo Livro"}
                        {step === "confirm" && "Confirmar Livro do Mês"}
                    </h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 transition">
                        <LuX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === "search" && (
                        <div className="space-y-4">
                            <div className="relative">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar livro..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-sun-500 border-transparent outline-none transition font-semibold"
                                />
                                {searching && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>

                            <div className="space-y-2">
                                {searchResults.map((book) => (
                                    <button
                                        key={book.id}
                                        onClick={() => handleSelectBook(book)}
                                        className="w-full p-3 rounded-xl border border-black/5 hover:bg-neutral-50 flex items-center gap-3 text-left transition group"
                                    >
                                        <div className="w-10 h-14 bg-neutral-200 rounded-md overflow-hidden shrink-0">
                                            {book.coverUrl && <img src={book.coverUrl} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-neutral-800 group-hover:text-sun-600 transition">{book.title}</div>
                                            <div className="text-xs text-neutral-500 font-medium">{book.author}</div>
                                        </div>
                                        <LuChevronRight className="ml-auto text-neutral-300 group-hover:text-neutral-500" />
                                    </button>
                                ))}

                                {!searching && searchResults.length === 0 && (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-neutral-500 font-medium mb-4">Nenhum livro encontrado.</p>
                                        <button
                                            onClick={() => setStep("create_book")}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-bold text-neutral-700 transition"
                                        >
                                            <LuPlus size={16} />
                                            Cadastrar Novo Livro
                                        </button>
                                    </div>
                                )}
                                {!searching && searchResults.length > 0 && (
                                    <div className="pt-2 text-center">
                                        <button
                                            onClick={() => setStep("create_book")}
                                            className="text-xs font-bold text-sun-600 hover:underline"
                                        >
                                            Não achou? Cadastrar novo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "create_book" && (
                        <form onSubmit={handleCreateBook} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Título</label>
                                <input
                                    required
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-sun-500 outline-none transition font-semibold"
                                    placeholder="Ex: O Hobbit"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Autor</label>
                                <input
                                    required
                                    value={newAuthor}
                                    onChange={e => setNewAuthor(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-sun-500 outline-none transition font-semibold"
                                    placeholder="Ex: J.R.R. Tolkien"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Capa</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 rounded-xl border-2 border-dashed border-neutral-300 hover:border-sun-400 hover:bg-sun-50 flex flex-col items-center justify-center cursor-pointer transition overflow-hidden relative"
                                >
                                    {newCoverUrl ? (
                                        <img src={newCoverUrl} className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        uploading ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <span className="text-xs font-bold text-neutral-400">Clique para enviar capa</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setStep("search")} className="flex-1 py-3 font-bold text-neutral-500 hover:text-neutral-700 transition">Voltar</button>
                                <button type="submit" disabled={submitting || uploading} className="flex-1 py-3 rounded-xl bg-sun-500 hover:bg-sun-400 text-black font-black shadow-lg shadow-sun-500/20 transition disabled:opacity-50">
                                    {submitting ? "Salvando..." : "Criar Livro"}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === "confirm" && selectedBook && (
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start bg-neutral-50 p-4 rounded-2xl border border-black/5">
                                <div className="w-16 h-24 bg-neutral-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                    {selectedBook.coverUrl && <img src={selectedBook.coverUrl} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <div className="font-black text-neutral-900 leading-tight">{selectedBook.title}</div>
                                    <div className="text-sm text-neutral-500 font-bold mt-1">{selectedBook.author}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Mês</label>
                                    <select
                                        value={month}
                                        onChange={e => setMonth(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-sun-500 outline-none font-bold"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString("pt-BR", { month: "long" })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Ano</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={e => setYear(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-sun-500 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Cor da Lombada</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {CLUB_COLORS.map(c => (
                                        <button
                                            key={c.key}
                                            type="button"
                                            onClick={() => setColorKey(c.key)}
                                            className={`w-8 h-8 rounded-full border-2 transition ${colorKey === c.key ? "border-black scale-110" : "border-transparent hover:scale-105"}`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setStep("search")} className="flex-1 py-3 font-bold text-neutral-500 hover:text-neutral-700 transition">Voltar</button>
                                <button onClick={handleConfirm} disabled={submitting} className="flex-[2] py-3 rounded-xl bg-sun-500 hover:bg-sun-400 text-black font-black shadow-lg shadow-sun-500/20 transition disabled:opacity-50">
                                    {submitting ? "Adicionando..." : "Confirmar"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
