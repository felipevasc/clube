import { useEffect, useRef, useState } from "react";
import Book3D from "../components/Book3D";
import { api } from "../../lib/api";
import BookshelfAddModal from "./BookshelfAddModal";
import ClubBookAddModal from "./ClubBookAddModal";
import BookReader, { type RelatedData } from "../components/BookReader";
import ConfirmModal from "../components/ConfirmModal";

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
  genre?: string;
  synopsis?: string;
  indicationComment?: string;
  createdAt: string;
  createdByUser?: { id: string; name: string; avatarUrl?: string };
};

function HorizontalShelf({
  title,
  books,
  onAdd,
  onSelectBook,
  addVariant = "yellow"
}: {
  title: string;
  books: any[];
  onAdd: () => void;
  onSelectBook: (book: any, rect: DOMRect) => void;
  addVariant?: "yellow" | "rose" | "mint" | "azure";
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
    <div className="shelf-wrapper">
      <div className="shelf-row">
        {/* Subtle Engraved Title at the top-center of the inner shelf back-wall */}
        <div className="shelf-title-container">
          <h3 className="shelf-title">
            {title}
          </h3>
        </div>

        <div
          ref={scrollRef}
          className="shelf-scroll-container"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          <div className="shelf-books-row">
            {/* Add Book Placeholder */}
            <AddBook3D onClick={onAdd} variant={addVariant} />

            {books.map((b) => {
              const isClubBook = 'month' in b;
              const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
              const ribbonText = isClubBook ? months[(b.month - 1) % 12] : undefined;

              const isSuspense = String(b.genre || "").toUpperCase().includes("SUSPENSE") ||
                title.toUpperCase().includes("SUSPENSE");

              // Colors based on genre: Suspense (Yellow), Romance/Others (Pink)
              const ribbonColor = isClubBook
                ? (isSuspense ? '#fff9db' : '#fff0f6') // Light yellow vs Light pink
                : undefined;

              const ribbonTextColor = isClubBook
                ? (isSuspense ? '#856404' : '#a61e4d') // Dark amber vs Dark ruby
                : undefined;

              return (
                <div
                  key={b.id}
                  className="shelf-book-wrapper"
                  onClick={(e) => {
                    if (!isDragging) {
                      e.preventDefault();
                      onSelectBook(b, e.currentTarget.getBoundingClientRect());
                    }
                  }}
                >
                  <Book3D
                    book={b}
                    href="#"
                    ribbonText={ribbonText}
                    ribbonColor={ribbonColor}
                    ribbonTextColor={ribbonTextColor}
                  />
                </div>
              );
            })}

            {/* End Padding */}
            <div className="shelf-end-spacer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AddBook3D({ onClick, variant = "yellow" }: { onClick: () => void; variant?: "yellow" | "rose" | "mint" | "azure" }) {
  const variantClass = variant !== "yellow" ? `book-3d--add--${variant}` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`book-3d book-3d--add book-add-rotation ${variantClass}`}
      aria-label="Adicionar livro"
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
  const [currentUser, setCurrentUser] = useState<{ id: string; isAdmin: boolean } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addContext, setAddContext] = useState<{ genre?: string; city?: string } | null>(null);
  const [addClubBookCity, setAddClubBookCity] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<{ book: Book | ClubBook; initialRect: DOMRect | null } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ book: Book | ClubBook; type: "book" | "club-book" } | null>(null);
  const [relatedData, setRelatedData] = useState<RelatedData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [fortalRes, brasRes, romanceRes, suspenseRes, meRes] = await Promise.all([
        api<{ clubBooks: ClubBook[] }>("/club-books?city=FORTALEZA"),
        api<{ clubBooks: ClubBook[] }>("/club-books?city=BRASILIA"),
        api<{ books: Book[] }>("/books?category=Romance"),
        api<{ books: Book[] }>("/books?category=Suspense"),
        api<{ user: { id: string; isAdmin: boolean } }>("/me").catch(() => ({ user: { id: "", isAdmin: false } }))
      ]);

      const sortByDate = (a: ClubBook, b: ClubBook) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      };

      setLidosFortaleza(fortalRes.clubBooks.sort(sortByDate));
      setLidosBrasilia(brasRes.clubBooks.sort(sortByDate));
      setIndRomance(romanceRes.books);
      setIndSuspense(suspenseRes.books);
      setCurrentUser(meRes.user);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  const handleBookAdded = () => {
    loadData();
    setAddContext(null);
    setAddClubBookCity(null);
  };

  const deleteBook = async (book: Book | ClubBook, type: "book" | "club-book") => {
    try {
      if (type === "club-book") {
        let idToDelete = "";
        if ("bookId" in book) {
          idToDelete = book.id;
        } else {
          const found = [...lidosFortaleza, ...lidosBrasilia].find(cb => cb.bookId === book.id);
          if (found) idToDelete = found.id;
        }

        if (idToDelete) {
          await api(`/club-books/${idToDelete}`, { method: "DELETE" });
        }
      } else {
        await api(`/books/${book.id}`, { method: "DELETE" });
      }
      setConfirmDelete(null);
      loadData();
      setSelectedBook(null);
    } catch (e: any) {
      console.error(e);
      alert("Erro ao excluir: " + (e.message || "Erro desconhecido"));
    }
  };

  const handleDelete = (book: Book, type: "book" | "club-book") => {
    setConfirmDelete({ book, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="bookshelf-loading-pill">
          Organizando prateleiras...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bookshelf-page-wrapper">
      <BookReader
        book={selectedBook?.book || null}
        initialRect={selectedBook?.initialRect || null}
        onClose={() => { setSelectedBook(null); setRelatedData(null); }}
        currentUserId={currentUser?.id}
        isAdmin={currentUser?.isAdmin}
        onDelete={selectedBook?.book ? (() => handleDelete(selectedBook.book, lidosFortaleza.find(b => b.bookId === selectedBook.book.id) || lidosBrasilia.find(b => b.bookId === selectedBook.book.id) ? "club-book" : "book")) : undefined}
        relatedData={relatedData}
      />

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

      <div className="bookshelf-perspective-wrapper">
        <div className="bookshelf-scene">
          <div className="bookshelf-clean-wrapper">
            <div className="bookshelf-container">
              <div className="margaridas-header-container">
                <h2 className="margaridas-header">
                  ESTANTE
                </h2>
              </div>
              <HorizontalShelf
                title="Fortaleza"
                books={lidosFortaleza}
                onAdd={() => setAddClubBookCity("FORTALEZA")}
                onSelectBook={(book, rect) => {
                  setSelectedBook({ book, initialRect: rect });
                  const bookId = book.bookId || book.id;
                  api<RelatedData>(`/books/${bookId}/related`).then(setRelatedData).catch(() => { });
                }}
                addVariant="mint"
              />

              <HorizontalShelf
                title="Brasília"
                books={lidosBrasilia}
                onAdd={() => setAddClubBookCity("BRASILIA")}
                onSelectBook={(book, rect) => {
                  setSelectedBook({ book, initialRect: rect });
                  const bookId = book.bookId || book.id;
                  api<RelatedData>(`/books/${bookId}/related`).then(setRelatedData).catch(() => { });
                }}
                addVariant="azure"
              />

              <HorizontalShelf
                title="Romance"
                books={indRomance}
                onAdd={() => setAddContext({ genre: "ROMANCE" })}
                onSelectBook={(book, rect) => {
                  setSelectedBook({ book, initialRect: rect });
                  const bookId = book.id;
                  api<RelatedData>(`/books/${bookId}/related`).then(setRelatedData).catch(() => { });
                }}
                addVariant="rose"
              />

              <HorizontalShelf
                title="Suspense"
                books={indSuspense}
                onAdd={() => setAddContext({ genre: "SUSPENSE" })}
                onSelectBook={(book, rect) => {
                  setSelectedBook({ book, initialRect: rect });
                  const bookId = book.id;
                  api<RelatedData>(`/books/${bookId}/related`).then(setRelatedData).catch(() => { });
                }}
                addVariant="yellow"
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Excluir Livro"
        message={`Tem certeza que deseja excluir "${confirmDelete?.book?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isDestructive
        onConfirm={() => confirmDelete && deleteBook(confirmDelete.book, confirmDelete.type)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
