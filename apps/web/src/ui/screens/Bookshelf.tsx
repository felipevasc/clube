import { useEffect, useMemo, useRef, useState } from "react";
import Book3D from "../components/Book3D";
import { api } from "../../lib/api";
import BookshelfAddModal from "./BookshelfAddModal";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  createdAt: string;
};

type ShelfItem = { kind: "add" } | { kind: "book"; book: Book };

function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function AddBook3D({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="book-3d book-3d--add" aria-label="Adicionar livro">
      <div className="book-cover" aria-hidden>
        <div className="book-add__content">
          <div className="book-add__plus">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="book-add__label">Adicionar livro</div>
        </div>
      </div>
      <div className="book-spine" aria-hidden />
      <div className="book-top" aria-hidden />
    </button>
  );
}

function booksPerShelf(width: number): number {
  // As requested: 2–3 books per shelf depending on device width.
  if (width < 390) return 2;
  return 3;
}

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [perShelf, setPerShelf] = useState(6);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ books: Book[] }>("/books");
      setBooks(Array.isArray(data?.books) ? data.books : []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a estante.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const recalc = () => {
      setPerShelf(booksPerShelf(el.clientWidth));
    };

    recalc();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", recalc);
      return () => window.removeEventListener("resize", recalc);
    }

    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shelves = useMemo(() => {
    const items: ShelfItem[] = [{ kind: "add" }, ...books.map((b) => ({ kind: "book" as const, book: b }))];
    return chunk(items, Math.max(2, perShelf));
  }, [books, perShelf]);

  return (
    <div className="space-y-4">
      <BookshelfAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={(newBook) => {
          setBooks((prev) => [newBook, ...prev]);
        }}
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Estante</h1>
          <p className="text-sm text-neutral-600">Sua coleção de livros</p>
        </div>
        {!loading && !error && (
          <div className="text-xs font-semibold text-neutral-600 tabular-nums">
            {books.length} livro{books.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm text-red-700">
          <div className="font-black">Erro</div>
          <div className="mt-1">{error}</div>
          <button
            onClick={fetchBooks}
            className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-black bg-white/70 border border-black/10 hover:bg-white transition"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div ref={sceneRef} className="bookshelf-scene perspective-shelf">
        <div className="bookshelf">
          {shelves.map((items, shelfIndex) => (
            <div key={shelfIndex} className="shelf">
              <div className="shelf-books">
                {items.map((it) =>
                  it.kind === "add" ? (
                    <AddBook3D key="add" onClick={() => setIsAddModalOpen(true)} />
                  ) : (
                    <Book3D key={it.book.id} book={it.book} href={`/books/${encodeURIComponent(it.book.id)}`} />
                  )
                )}
              </div>
            </div>
          ))}

          {loading && <div className="bookshelf-loading">Decorando a estante...</div>}

          {!loading && !error && books.length === 0 && (
            <div className="bookshelf-empty">Sua estante está vazia. Comece pelo primeiro livro.</div>
          )}
        </div>
      </div>
    </div>
  );
}

