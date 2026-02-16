import { useEffect, useRef, useState } from "react";
import Book3D from "../components/Book3D";
import { api } from "../../lib/api";
import BookshelfAddModal from "./BookshelfAddModal";
import ClubBookAddModal from "./ClubBookAddModal";
import BookReader from "../components/BookReader";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  createdAt: string;
  synopsis?: string;
  genre?: string;
};

type ClubBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  city: string;
  month: number;
  year: number;
};

function HorizontalShelf({
  title,
  books,
  onAdd,
  onSelectBook
}: {
  title: string;
  books: any[];
  onAdd: () => void;
  onSelectBook: (book: any) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="relative">
      <div className="shelf relative overflow-visible !pb-10">
        {/* Subtle Engraved Title at the top-center of the inner shelf back-wall */}
        <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none select-none z-0">
          <h3 className="text-[14px] sm:text-xs font-black uppercase tracking-[0.3em] text-black/40 pointer-events-none"
            style={{
              // Improved "Baixo Relevo" (Engraved) effect: 
              // Darker shadow on top/left, subtle highlight on bottom/right
              textShadow: '-1.5px -1.5px 2px rgba(0,0,0,0.5), 0.5px 0.5px 0.5px rgba(255,255,255,0.08)',
              opacity: 0.65
            }}>
            {title}
          </h3>
        </div>

        <div
          ref={scrollRef}
          className="relative overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-4 z-10"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="shelf-books !justify-start min-w-max">
            {/* Add Book Placeholder */}
            <AddBook3D onClick={onAdd} />

            {books.map((b) => (
              <div
                key={b.id}
                className="shrink-0"
                onClick={(e) => {
                  if (!isDragging) {
                    e.preventDefault();
                    onSelectBook(b);
                  }
                }}
              >
                <Book3D book={b} href="#" />
              </div>
            ))}

            {/* End Padding */}
            <div className="w-16 h-10 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AddBook3D({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="book-3d book-3d--add"
      aria-label="Adicionar livro"
      style={{ transform: "rotateZ(-1deg)" }}
    >
      <div className="book-3d__book" aria-hidden>
        <div className="book-3d__front">
          <div className="book-add__content">
            <div className="book-add__plus">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="book-add__label">Adicionar</div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Bookshelf() {
  const [lidosFortaleza, setLidosFortaleza] = useState<ClubBook[]>([]);
  const [lidosBrasilia, setLidosBrasilia] = useState<ClubBook[]>([]);
  const [indRomance, setIndRomance] = useState<Book[]>([]);
  const [indSuspense, setIndSuspense] = useState<Book[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addContext, setAddContext] = useState<{ genre?: string; city?: string } | null>(null);
  const [addClubBookCity, setAddClubBookCity] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [fortalRes, brasRes, romanceRes, suspenseRes] = await Promise.all([
        api<{ clubBooks: ClubBook[] }>("/club-books?city=FORTALEZA"),
        api<{ clubBooks: ClubBook[] }>("/club-books?city=BRASILIA"),
        api<{ books: Book[] }>("/books?genre=ROMANCE"),
        api<{ books: Book[] }>("/books?genre=SUSPENSE"),
      ]);

      setLidosFortaleza(fortalRes.clubBooks || []);
      setLidosBrasilia(brasRes.clubBooks || []);
      setIndRomance(romanceRes.books || []);
      setIndSuspense(suspenseRes.books || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a estante.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleBookAdded = () => {
    fetchAll();
    setAddContext(null);
    setAddClubBookCity(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <BookReader book={selectedBook} onClose={() => setSelectedBook(null)} />

      <BookshelfAddModal
        isOpen={!!addContext}
        onClose={() => setAddContext(null)}
        onBookAdded={handleBookAdded}
        initialGenre={addContext?.genre}
      />

      <ClubBookAddModal
        isOpen={!!addClubBookCity}
        city={addClubBookCity || "FORTALEZA"}
        onClose={() => setAddClubBookCity(null)}
        onBookAdded={handleBookAdded}
      />

      <div className="perspective-shelf px-2 mt-4">
        <div className="bookshelf-scene">
          {error && (
            <div className="absolute top-20 inset-x-4 z-50 rounded-3xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm text-red-700">
              <div className="font-black">Erro</div>
              <div className="mt-1">{error}</div>
              <button onClick={fetchAll} className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-black bg-white/70 border border-black/10 hover:bg-white transition">
                Tentar novamente
              </button>
            </div>
          )}

          <div className="bookshelf !bg-transparent !border-0 !shadow-none !p-0">
            <div className="bookshelf min-h-[500px] py-10 px-0 flex flex-col gap-2 relative">
              {/* Refined Engraved Header inside the top padding area */}
              <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none select-none z-10">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[0.6em] text-black/30"
                  style={{
                    textShadow: '-1px -1px 2px rgba(0,0,0,0.5), 0.5px 0.5px 1px rgba(255,255,255,0.1)',
                    opacity: 0.6
                  }}>
                  Estante
                </h2>
              </div>
              <HorizontalShelf
                title="Livros Lidos Fortaleza"
                books={lidosFortaleza}
                onAdd={() => setAddClubBookCity("FORTALEZA")}
                onSelectBook={setSelectedBook}
              />

              <HorizontalShelf
                title="Livros Lidos Brasília"
                books={lidosBrasilia}
                onAdd={() => setAddClubBookCity("BRASILIA")}
                onSelectBook={setSelectedBook}
              />

              <HorizontalShelf
                title="Indicações Romance"
                books={indRomance}
                onAdd={() => setAddContext({ genre: "ROMANCE" })}
                onSelectBook={setSelectedBook}
              />

              <HorizontalShelf
                title="Indicações Suspense"
                books={indSuspense}
                onAdd={() => setAddContext({ genre: "SUSPENSE" })}
                onSelectBook={setSelectedBook}
              />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-x-0 bottom-8 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-black/5 text-xs font-black animate-pulse">
            Organizando prateleiras...
          </div>
        </div>
      )}
    </div>
  );
}
