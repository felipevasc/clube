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

type Msg = { id: string; clubBookId: string; userId: string; text: string; createdAt: string };
type User = { id: string; name: string; avatarUrl?: string };

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

function safeIso(v: string | null | undefined): string {
  const s = String(v || "");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
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

function lastSeenKey(clubBookId: string): string {
  return `clube:chat:lastSeen:${encodeURIComponent(String(clubBookId || ""))}`;
}

function unreadCountApprox(clubBookId: string, lastMsg: Msg | null): number {
  if (!lastMsg?.createdAt) return 0;
  try {
    const seenIso = localStorage.getItem(lastSeenKey(clubBookId)) || "";
    const lastIso = safeIso(lastMsg.createdAt);
    if (!lastIso) return 0;
    if (!seenIso) return 1;
    const lastT = new Date(lastIso).getTime();
    const seenT = new Date(seenIso).getTime();
    if (!Number.isFinite(lastT) || !Number.isFinite(seenT)) return 0;
    return lastT > seenT ? 1 : 0;
  } catch {
    return 0;
  }
}

export default function Messages() {
  const nav = useNavigate();
  const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
  const [lastByBook, setLastByBook] = useState<Record<string, Msg | null>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLast, setLoadingLast] = useState(false);

  const [viewer, setViewer] = useState<User | null>(null);
  const viewerId = viewer?.id ? String(viewer.id) : "";
  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const ensureUsers = async (ids: string[]) => {
    const uniq = Array.from(new Set(ids.filter(Boolean)));
    const missing = uniq.filter((uid) => !usersById[uid]);
    if (!missing.length) return;
    const entries = await Promise.all(
      missing.map(async (uid) => {
        try {
          const out = await api<{ user: User }>(`/users/${encodeURIComponent(uid)}`);
          return [uid, out.user] as const;
        } catch {
          return [uid, { id: uid, name: uid } as User] as const;
        }
      })
    );
    setUsersById((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  };

  useEffect(() => {
    api<{ user: User }>("/me")
      .then((out) => {
        const u = out?.user;
        setViewer(u && u.id ? u : null);
        if (u?.id) setUsersById((prev) => ({ ...prev, [String(u.id)]: u }));
      })
      .catch(() => setViewer(null));
  }, []);

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
        setError(e?.message || "Não foi possível carregar as conversas.");
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
      setLoadingLast(true);
      try {
        const entries = await Promise.all(
          clubBooks.map(async (b) => {
            try {
              const out = await api<{ messages: Msg[] }>(
                `/club-books/${encodeURIComponent(String(b.id))}/messages?order=desc&limit=1`
              );
              const m = Array.isArray(out?.messages) ? out.messages[0] || null : null;
              return [String(b.id), m] as const;
            } catch {
              return [String(b.id), null] as const;
            }
          })
        );
        if (!alive) return;
        const byId = Object.fromEntries(entries);
        setLastByBook(byId);
        await ensureUsers(Object.values(byId).map((m) => String(m?.userId || "")).filter(Boolean));
      } finally {
        if (!alive) return;
        setLoadingLast(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clubBooks]);

  const rows = useMemo(() => {
    const out = clubBooks.slice();
    out.sort((a, b) => {
      const am = lastByBook[a.id];
      const bm = lastByBook[b.id];
      const at = am ? safeTime(am.createdAt) : safeTime(a.activatedAt || a.createdAt);
      const bt = bm ? safeTime(bm.createdAt) : safeTime(b.activatedAt || b.createdAt);
      if (bt !== at) return bt - at;
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return String(a.title || "").localeCompare(String(b.title || ""));
    });
    return out;
  }, [clubBooks, lastByBook]);

  return (
    <div className="-mx-4 -my-4">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-black">Mensagens</div>
            <div className="mt-1 text-xs text-neutral-600">Conversas por livro</div>
          </div>
          <div className="text-xs text-neutral-600 tabular-nums">{rows.length}</div>
        </div>
        {loading ? <div className="mt-3 text-sm text-neutral-600">Carregando...</div> : null}
        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="mt-2 border-t border-black/5 divide-y divide-black/5">
        {rows.map((b) => {
          const hex = clubColorHex(b.colorKey);
          const last = lastByBook[b.id] || null;
          const unread = unreadCountApprox(String(b.id), last);
          const time = last?.createdAt ? fmtListTime(last.createdAt) : "";

          const senderName = last?.userId
            ? last.userId === viewerId
              ? "Você"
              : usersById[last.userId]?.name || "Alguém"
            : "";
          const preview = last?.text ? last.text : "Sem mensagens ainda.";
          const subtitle = senderName ? `${senderName}: ${preview}` : preview;

          return (
            <button
              key={b.id}
              onClick={() => nav(`/mensagens/${encodeURIComponent(String(b.id))}`)}
              className="w-full text-left px-4 py-3 bg-transparent hover:bg-white/70 active:bg-white/80 transition"
              style={{ minHeight: 72 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-[52px] h-[52px] shrink-0">
                  <div
                    className="w-[52px] h-[52px] rounded-full border border-black/10 grid place-items-center font-black shadow-card"
                    style={{ backgroundColor: hexWithAlpha(hex, "28") }}
                  >
                    {String(b.title || "?").slice(0, 1).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-[15px] leading-tight truncate ${unread ? "font-black" : "font-semibold"}`}>
                      {b.title}
                    </div>
                    <div className={`shrink-0 text-[11px] tabular-nums ${unread ? "text-neutral-900 font-black" : "text-neutral-600"}`}>
                      {time}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-3">
                    <div className={`flex-1 min-w-0 text-[13px] truncate ${unread ? "text-neutral-900 font-semibold" : "text-neutral-700"}`}>
                      {subtitle}
                    </div>
                    {unread ? (
                      <div
                        className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-sun-500 text-neutral-900 text-[11px] font-black tabular-nums grid place-items-center shadow-card"
                        aria-label={`${unread} não lidas`}
                        title={`${unread} não lidas`}
                      >
                        {unread > 99 ? "99+" : unread}
                      </div>
                    ) : null}
                  </div>

                </div>
              </div>
            </button>
          );
        })}

        {!loading && rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-neutral-600">Nenhum livro ainda.</div>
        ) : null}
        {loadingLast && rows.length ? (
          <div className="px-4 py-2 text-xs text-neutral-500">Atualizando últimas mensagens...</div>
        ) : null}
      </div>
    </div>
  );
}

