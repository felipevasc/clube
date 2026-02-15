import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import ChatBubbles from "../components/ChatBubbles";
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

export default function MessageThread() {
  const { id } = useParams();
  const paramId = String(id || "");
  const clubBookId = useMemo(() => {
    try {
      return decodeURIComponent(paramId);
    } catch {
      return paramId;
    }
  }, [paramId]);

  const nav = useNavigate();
  const [clubBook, setClubBook] = useState<ClubBook | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [bookError, setBookError] = useState("");

  const [viewer, setViewer] = useState<User | null>(null);
  const viewerId = viewer?.id ? String(viewer.id) : "";
  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatText, setChatText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<Msg[]>([]);

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
      setLoadingBook(true);
      setBookError("");
      setClubBook(null);
      if (!clubBookId) {
        setBookError("Link inválido.");
        setLoadingBook(false);
        return;
      }
      try {
        const out = await api<{ clubBooks: ClubBook[] }>("/club-books");
        if (!alive) return;
        const b = (out?.clubBooks || []).find((x) => String(x?.id || "") === clubBookId) || null;
        if (!b) setBookError("Livro não encontrado.");
        setClubBook(b);
      } catch (e: any) {
        if (!alive) return;
        setBookError(e?.message || "Não foi possível carregar este livro.");
      } finally {
        if (!alive) return;
        setLoadingBook(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clubBookId]);

  const loadTail = async () => {
    if (!clubBookId) return;
    setLoadingMsgs(true);
    try {
      const out = await api<{ messages: Msg[] }>(`/club-books/${encodeURIComponent(clubBookId)}/messages?order=desc&limit=80`);
      const tail = Array.isArray(out?.messages) ? out.messages.slice().reverse() : [];
      setMessages(tail);
      await ensureUsers(tail.map((m) => m.userId));
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" }), 0);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    loadTail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubBookId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!clubBookId) return;
    const last = messages.length ? messages[messages.length - 1] : null;
    if (!last?.createdAt) return;
    try {
      const iso = safeIso(last.createdAt) || String(last.createdAt);
      localStorage.setItem(`clube:chat:lastSeen:${encodeURIComponent(String(clubBookId))}`, iso);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubBookId, messages.length]);

  useEffect(() => {
    if (!clubBookId) return;
    const t = setInterval(async () => {
      const cur = messagesRef.current || [];
      const last = cur.length ? cur[cur.length - 1] : null;
      const after = safeIso(last?.createdAt);
      if (!after) return;
      try {
        const out = await api<{ messages: Msg[] }>(
          `/club-books/${encodeURIComponent(clubBookId)}/messages?after=${encodeURIComponent(after)}`
        );
        const next = Array.isArray(out?.messages) ? out.messages : [];
        if (!next.length) return;
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const add = next.filter((m) => !seen.has(m.id));
          return add.length ? [...prev, ...add] : prev;
        });
        await ensureUsers(next.map((m) => m.userId));
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
      } catch {
        // ignore transient polling errors
      }
    }, 3500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubBookId]);

  const sendMessage = async () => {
    const t = chatText.trim();
    if (!t || !clubBookId) return;
    setSendingMsg(true);
    try {
      const out = await api<{ message: Msg }>(`/club-books/${encodeURIComponent(clubBookId)}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: t }),
      });
      const msg = out?.message;
      setChatText("");
      if (msg?.id) {
        setMessages((prev) => [...prev, msg]);
        await ensureUsers([msg.userId]);
      } else {
        await loadTail();
      }
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
    } finally {
      setSendingMsg(false);
    }
  };

  const hex = clubColorHex(clubBook?.colorKey);

  return (
    <div className="space-y-4">
      <Card>
        <div
          className="p-4"
          style={{
            background:
              `radial-gradient(900px 220px at 20% 0%, ${hexWithAlpha(hex, "2b")}, transparent 60%), ` +
              `radial-gradient(700px 220px at 90% 20%, ${hexWithAlpha(hex, "22")}, transparent 55%), ` +
              "rgba(255,255,255,0.92)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => nav("/mensagens")}
              className="shrink-0 w-10 h-10 rounded-2xl bg-white/80 border border-black/10 hover:bg-white transition grid place-items-center"
              title="Voltar"
              aria-label="Voltar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className="shrink-0 w-10 h-10 rounded-full border border-black/10 grid place-items-center font-black shadow-card"
              style={{ backgroundColor: hexWithAlpha(hex, "28") }}
              aria-hidden="true"
            >
              {String(clubBook?.title || "C").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black truncate">{clubBook?.title || "Conversa"}</div>
              {loadingBook ? (
                <div className="text-xs text-neutral-600">Carregando...</div>
              ) : bookError ? (
                <div className="text-xs text-red-600">{bookError}</div>
              ) : clubBook ? (
                <div className="text-xs text-neutral-600 truncate">{clubBook.author}</div>
              ) : null}
            </div>
            {clubBook ? (
              <button
                onClick={() => nav(`/livros/${encodeURIComponent(String(clubBook.id))}`)}
                className="shrink-0 h-10 px-3 rounded-2xl bg-white/80 border border-black/10 hover:bg-white transition text-xs font-black"
                title="Abrir livro"
              >
                Livro
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="rounded-3xl border border-black/10 bg-white/70 overflow-hidden">
            <div className="p-3 max-h-[68dvh] overflow-auto overscroll-contain chat-wallpaper">
              {loadingMsgs ? <div className="text-sm text-neutral-600">Carregando mensagens...</div> : null}
              {!loadingMsgs && messages.length === 0 ? (
                <div className="py-6 text-center text-sm text-neutral-600">Sem mensagens ainda. Comece a conversa.</div>
              ) : null}
              <ChatBubbles messages={messages} usersById={usersById} viewerId={viewerId} accentHex={hex} className="space-y-2" />
              <div ref={chatEndRef} />
            </div>

            <div className="px-3 py-3 border-t border-black/10 bg-white/80">
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-3xl border border-black/10 bg-white px-3 py-2 focus-within:ring-4 focus-within:ring-sun-200">
                  <textarea
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed"
                    placeholder="Mensagem..."
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={sendingMsg || !chatText.trim()}
                  className="shrink-0 w-12 h-12 rounded-3xl grid place-items-center bg-sun-500 hover:bg-sun-400 transition disabled:opacity-50 shadow-card"
                  aria-label="Enviar"
                  title="Enviar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 11.7l16.3-7c.7-.3 1.4.4 1.1 1.1l-7 16.3c-.3.8-1.4.7-1.6-.1l-1.7-6.1-6.1-1.7c-.8-.2-.9-1.3-.1-1.6z"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                    <path d="M10.4 13.6L20 4.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


