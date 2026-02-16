import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import Book3D from "../components/Book3D";
import { api } from "../../lib/api";
import BookEditModal from "./BookEditModal";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  synopsis?: string | null
};

export default function BookDetail() {
  const { id } = useParams();
  const bookId = String(id || "");
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setBook(null);
      if (!bookId) {
        setError("Link inválido.");
        setLoading(false);
        return;
      }
      try {
        const out = await api<{ book: Book }>(`/books/${encodeURIComponent(bookId)}`);
        if (!alive) return;
        setBook(out.book || null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Não foi possível carregar este livro.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [bookId]);

  const detailStyle =
    ({
      ["--book-w" as any]: "156px",
      ["--book-h" as any]: "230px",
      ["--book-d" as any]: "20px",
    } as CSSProperties);

  return (
    <div className="space-y-4">

      <Link
        to="/livros"
        className="inline-flex items-center gap-2 text-xs font-black px-3 py-2 rounded-2xl bg-white/70 border border-black/10 hover:bg-white transition"
      >
        <span aria-hidden>{"<-"}</span> Voltar para Estante
      </Link>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-black">Livro</div>
            {!loading && !error && book ? (
              <Link
                to={`/books/${book.id}/edit`}
                className="text-xs font-black px-3 py-2 rounded-2xl bg-white/70 border border-black/10 hover:bg-white transition"
              >
                Editar
              </Link>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-3 text-sm text-neutral-600">Carregando...</div>
          ) : error ? (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          ) : book ? (
            <div className="mt-4 space-y-4">
              <div className="bookshelf-scene perspective-shelf">
                <div className="bookshelf">
                  <div className="shelf">
                    <div className="shelf-books shelf-books--center">
                      <Book3D book={book} className="book-3d--detail" style={detailStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 space-y-4">
                <div>
                  <div className="text-xl font-black leading-tight">{book.title}</div>
                  <div className="text-sm text-neutral-600">por {book.author}</div>
                </div>

                {book.synopsis && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Sinopse</div>
                    <div className="text-sm text-neutral-700 leading-relaxed font-serif whitespace-pre-wrap italic">
                      {book.synopsis}
                    </div>
                  </div>
                )}

                <div className="pt-2 text-xs font-semibold text-neutral-500 border-t border-black/5">
                  Dica: na Estante, passe o mouse para puxar o livro para fora.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-neutral-600">Não encontrado.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
