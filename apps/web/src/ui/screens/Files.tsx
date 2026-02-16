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
            <div className="text-sm font-black">Repositórios</div>
            <div className="mt-1 text-xs text-neutral-600">Selecione um repositório para ver os arquivos</div>
          </div>
          <div className="text-xs text-neutral-600 tabular-nums">{rows.length}</div>
        </div>
        {loading ? <div className="mt-3 text-sm text-neutral-600">Carregando...</div> : null}
        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        {rows.map((b) => {
          const hex = clubColorHex(b.colorKey);
          const meta = metaByBook[b.id] || { count: 0, lastAt: "" };
          // const time = meta.lastAt ? fmtListTime(meta.lastAt) : fmtListTime(b.activatedAt || b.createdAt);

          return (
            <button
              key={b.id}
              onClick={() => nav(`/arquivos/${encodeURIComponent(String(b.id))}`)}
              className="group relative w-full aspect-[10/9] flex flex-col items-center justify-center p-3 bg-white border border-black/10 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition overflow-hidden"
            >
              {/* Background Decoration */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 100%, ${hexWithAlpha(hex, "15")}, transparent 70%)`
                }}
              />

              <div
                className="relative shrink-0 w-14 h-14 mb-3 rounded-2xl border border-black/5 shadow-sm grid place-items-center"
                style={{
                  background:
                    `linear-gradient(135deg, ${hexWithAlpha(hex, "20")}, ${hexWithAlpha(hex, "05")})`,
                  color: hex
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-sm opacity-90">
                  <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                </svg>
              </div>

              <div className="relative w-full text-center">
                <div className="text-[14px] leading-tight font-bold text-neutral-900 truncate px-1">{b.title}</div>
                <div className="mt-1 text-[11px] text-neutral-500 truncate px-2">{b.author}</div>
              </div>

              <div className="mt-2 text-[10px] font-medium text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-black/5">
                {meta.count} itens
              </div>
            </button>
          );
        })}

        {!loading && rows.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-sm text-neutral-500">
            Nenhum repositório encontrado.
          </div>
        ) : null}
      </div>
    </div>
  );
}

