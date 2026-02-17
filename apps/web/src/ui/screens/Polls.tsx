import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";
import Card from "../components/Card";
import { LuChartBarBig } from "react-icons/lu";

type ClubBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  colorKey: string;
  isActive: boolean;
  createdAt?: string;
};

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

export default function Polls() {
  const [books, setBooks] = useState<ClubBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ clubBooks: ClubBook[] }>("/club-books")
      .then((res) => setBooks(Array.isArray(res?.clubBooks) ? res.clubBooks : []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const { active, previous } = useMemo(() => {
    const act = books.filter((b) => !!b.isActive);
    const prev = books.filter((b) => !b.isActive);
    return { active: act, previous: prev };
  }, [books]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-black/5 grid place-items-center">
          <LuChartBarBig className="w-5 h-5 text-neutral-900" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Enquetes</h1>
          <p className="text-sm text-neutral-600">Escolha o livro do mes para ver ou criar enquetes</p>
        </div>
      </div>

      <div className="grid gap-3">
        {loading ? <div className="text-sm text-neutral-500 p-4">Carregando livros...</div> : null}

        {!loading && books.length === 0 ? (
          <Card>
            <div className="p-6 text-center text-neutral-500">Nenhum livro do mes encontrado para exibir enquetes.</div>
          </Card>
        ) : null}

        {active.length ? <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-1 pt-2">Atual</div> : null}
        {active.map((b) => {
          const hex = clubColorHex(b.colorKey);
          return (
            <Link key={b.id} to={`/enquetes/livro/${encodeURIComponent(b.id)}`}>
              <Card>
                <div className="p-4 flex items-center gap-4 hover:bg-black/[0.02] transition">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="w-12 h-12 rounded-2xl object-cover border border-black/10 shrink-0" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-2xl border border-black/10 grid place-items-center font-black text-lg shrink-0"
                      style={{ backgroundColor: hexWithAlpha(hex, "40") }}
                    >
                      {b.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-base font-black truncate">{b.title}</div>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">ATIVO</span>
                    </div>
                    <div className="text-sm text-neutral-600 truncate">{b.author}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black/5 grid place-items-center">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}

        {previous.length ? <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-1 pt-2">Anteriores</div> : null}
        {previous.map((b) => {
          const hex = clubColorHex(b.colorKey);
          return (
            <Link key={b.id} to={`/enquetes/livro/${encodeURIComponent(b.id)}`}>
              <Card>
                <div className="p-4 flex items-center gap-4 hover:bg-black/[0.02] transition">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="w-12 h-12 rounded-2xl object-cover border border-black/10 shrink-0" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-2xl border border-black/10 grid place-items-center font-black text-lg shrink-0"
                      style={{ backgroundColor: hexWithAlpha(hex, "22") }}
                    >
                      {b.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-black truncate">{b.title}</div>
                    <div className="text-sm text-neutral-600 truncate">{b.author}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black/5 grid place-items-center">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
