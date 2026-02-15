import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

type Artifact = { id: string; clubBookId: string; fileName: string; mimeType: string; size: number; url: string; uploadedByUserId: string; createdAt: string };

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

function safeTime(iso: string | null | undefined): number {
  if (!iso) return 0;
  const d = new Date(iso);
  const t = d.getTime();
  return Number.isFinite(t) ? t : 0;
}

function fmtListTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString();
}

export default function Files() {
  const nav = useNavigate();
  const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
  const [metaByBook, setMetaByBook] = useState<Record<string, { count: number; lastAt: string }>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(false);

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

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!clubBooks.length) return;
      setLoadingMeta(true);
      try {
        const entries = await Promise.all(
          clubBooks.map(async (b) => {
            try {
              const out = await api<{ artifacts: Artifact[] }>(`/club-books/${encodeURIComponent(String(b.id))}/artifacts`);
              const list = Array.isArray(out?.artifacts) ? out.artifacts : [];
              const lastAt = list.length ? String(list[0]?.createdAt || "") : "";
              return [String(b.id), { count: list.length, lastAt }] as const;
            } catch {
              return [String(b.id), { count: 0, lastAt: "" }] as const;
            }
          })
        );
        if (!alive) return;
        setMetaByBook(Object.fromEntries(entries));
      } finally {
        if (!alive) return;
        setLoadingMeta(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clubBooks]);

  const rows = useMemo(() => {
    const out = clubBooks.slice();
    out.sort((a, b) => {
      const am = metaByBook[a.id];
      const bm = metaByBook[b.id];
      const at = am?.lastAt ? safeTime(am.lastAt) : safeTime(a.activatedAt || a.createdAt);
      const bt = bm?.lastAt ? safeTime(bm.lastAt) : safeTime(b.activatedAt || b.createdAt);
      if (bt !== at) return bt - at;
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return String(a.title || "").localeCompare(String(b.title || ""));
    });
    return out;
  }, [clubBooks, metaByBook]);

  return (
    <div className="-mx-4 -my-4">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-black">Arquivos</div>
            <div className="mt-1 text-xs text-neutral-600">Entre em um livro para ver os arquivos</div>
          </div>
          <div className="text-xs text-neutral-600 tabular-nums">{rows.length}</div>
        </div>
        {loading ? <div className="mt-3 text-sm text-neutral-600">Carregando...</div> : null}
        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="mt-2 border-t border-black/5 divide-y divide-black/5">
        {rows.map((b) => {
          const hex = clubColorHex(b.colorKey);
          const meta = metaByBook[b.id] || { count: 0, lastAt: "" };
          const time = meta.lastAt ? fmtListTime(meta.lastAt) : fmtListTime(b.activatedAt || b.createdAt);
          return (
            <button
              key={b.id}
              onClick={() => nav(`/arquivos/${encodeURIComponent(String(b.id))}`)}
              className="w-full text-left px-4 py-3 bg-transparent hover:bg-white/70 active:bg-white/80 transition"
              style={{ minHeight: 72 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="shrink-0 w-[52px] h-[52px] rounded-2xl border border-black/10 shadow-card grid place-items-center"
                  style={{
                    background:
                      `radial-gradient(240px 90px at 20% 0%, ${hexWithAlpha(hex, "30")}, transparent 60%), ` +
                      `linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.86))`,
                  }}
                  aria-hidden="true"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3.75 7.5a2.25 2.25 0 0 1 2.25-2.25h4.5l1.5 1.5H18A2.25 2.25 0 0 1 20.25 9v7.5A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5V7.5z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[15px] leading-tight font-black truncate">{b.title}</div>
                    <div className="shrink-0 text-[11px] tabular-nums text-neutral-600">{time}</div>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 text-[13px] text-neutral-700 truncate">{b.author}</div>
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="text-[11px] text-neutral-600 tabular-nums">{meta.count} arquivo(s)</div>
                      {b.isActive ? (
                        <div className="w-2 h-2 rounded-full bg-sun-500" title="Livro ativo" aria-label="Livro ativo" />
                      ) : null}
                    </div>
                  </div>

                  {loadingMeta ? <div className="mt-1 text-[11px] text-neutral-500">Atualizando...</div> : null}
                </div>
              </div>
            </button>
          );
        })}

        {!loading && rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-neutral-600">Nenhum livro ainda.</div>
        ) : null}
      </div>
    </div>
  );
}

