import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";

type ClubBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  colorKey: string;
  isActive: boolean;
  createdByUserId: string;
  createdAt: string;
  activatedAt?: string | null;
};

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

function fmtDate(v: string | null | undefined): string {
  if (!v) return "Sem data";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "Sem data";
  return d.toLocaleDateString();
}

export default function ClubBooks() {
  const nav = useNavigate();
  const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const out = await api<{ clubBooks: ClubBook[] }>("/club-books");
        if (!alive) return;
        setClubBooks(Array.isArray(out?.clubBooks) ? out.clubBooks : []);
      } catch (e: any) {
        if (!alive) return;
        setClubBooks([]);
        setError(e?.message || "Não foi possível carregar os livros.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const active = useMemo(() => clubBooks.find((b) => b.isActive) || null, [clubBooks]);

  const past = useMemo(() => {
    const rows = clubBooks
      .filter((b) => !b.isActive)
      // "já passaram": só os que já foram definidos como livro do mês.
      .filter((b) => !!b.activatedAt)
      .slice();
    rows.sort((a, b) => new Date(String(b.activatedAt)).getTime() - new Date(String(a.activatedAt)).getTime());
    return rows;
  }, [clubBooks]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="text-sm font-black">Livros</div>
          <div className="mt-1 text-xs text-neutral-600">Acesse postagens e arquivos por livro. As conversas ficam em Mensagens.</div>
          {loading ? <div className="mt-3 text-sm text-neutral-600">Carregando...</div> : null}
          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
        </div>
      </Card>

      {active ? (
        <Card>
          <div className="p-4">
            <div className="text-xs font-semibold text-neutral-600">Livro do mês (ativo)</div>
            <button
              onClick={() => nav(`/livros/${active.id}`)}
              className="mt-2 w-full text-left rounded-2xl border border-black/10 bg-white/70 hover:bg-white transition px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl border border-black/10 grid place-items-center font-black"
                  style={{ backgroundColor: hexWithAlpha(clubColorHex(active.colorKey), "28") }}
                >
                  {active.title.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black truncate">{active.title}</div>
                  <div className="text-xs text-neutral-600 truncate">{active.author}</div>
                </div>
                <div className="text-[11px] font-black rounded-full px-2 py-1 border border-black/10 bg-white">
                  {fmtDate(active.activatedAt || active.createdAt)}
                </div>
              </div>
            </button>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-black">Já passaram</div>
            <div className="text-xs text-neutral-600 tabular-nums">{past.length}</div>
          </div>

          <div className="mt-3 grid gap-2">
            {past.map((b) => {
              const hex = clubColorHex(b.colorKey);
              return (
                <button
                  key={b.id}
                  onClick={() => nav(`/livros/${b.id}`)}
                  className="w-full text-left rounded-2xl border border-black/10 bg-white/70 hover:bg-white transition px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl border border-black/10 grid place-items-center font-black" style={{ backgroundColor: hexWithAlpha(hex, "28") }}>
                      {b.title.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black truncate">{b.title}</div>
                      <div className="text-xs text-neutral-600 truncate">{b.author}</div>
                    </div>
                    <div className="text-[11px] font-black rounded-full px-2 py-1 border border-black/10 bg-white">
                      {fmtDate(b.activatedAt)}
                    </div>
                  </div>
                </button>
              );
            })}

            {!loading && past.length === 0 ? (
              <div className="text-sm text-neutral-600">Nenhum livro anterior ainda.</div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
