import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import ChatBubbles from "../components/ChatBubbles";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";

type ClubBook = { id: string; bookId: string; title: string; author: string; colorKey: string };
type Channel = { id: string; name: string; type: string; cityCode?: string | null };
type User = { id: string; name: string; avatarUrl?: string };
type Msg = { id: string; userId: string; text: string; createdAt: string; fromUserId?: string }; // Adpat to both models

export default function MessageThread() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = window.location.pathname;

  const threadType = useMemo(() => {
    if (location.includes("/canal/")) return "channel";
    if (location.includes("/dm/")) return "dm";
    return "book";
  }, [location]);

  const [viewer, setViewer] = useState<User | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [clubBook, setClubBook] = useState<ClubBook | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatText, setChatText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const viewerId = viewer?.id || "";

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
    api<{ user: User }>("/me").then(out => setViewer(out.user)).catch(() => { });
  }, []);

  // Fetch Header Data & Initial Messages
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        let fetchedMsgs: Msg[] = [];
        if (threadType === "book") {
          const books = await api<{ clubBooks: ClubBook[] }>("/club-books");
          const b = books.clubBooks.find(x => x.id === id);
          if (alive) setClubBook(b || null);
          const msgs = await api<{ messages: Msg[] }>(`/club-books/${id}/messages?limit=80&order=desc`);
          if (alive) {
            const sorted = msgs.messages.reverse();
            setMessages(sorted);
            fetchedMsgs = sorted;
          }
        } else if (threadType === "channel") {
          const chans = await api<{ channels: Channel[] }>("/channels");
          const c = chans.channels.find(x => x.id === id);
          if (alive) setChannel(c || null);
          const msgs = await api<{ messages: Msg[] }>(`/channels/${id}/messages?limit=80`);
          if (alive) {
            setMessages(msgs.messages);
            fetchedMsgs = msgs.messages;
          }
        } else if (threadType === "dm") {
          const other = await api<{ user: User }>(`/users/${id}`);
          if (alive) setTargetUser(other.user);
          const msgs = await api<{ messages: any[] }>(`/direct-messages/${id}`);
          // Normalize DM model (fromUserId -> userId)
          const norm = msgs.messages.map(m => ({ ...m, userId: m.fromUserId }));
          if (alive) {
            setMessages(norm);
            fetchedMsgs = norm;
          }
        }

        // Load users for initial messages
        if (alive && fetchedMsgs.length > 0) {
          const uids = fetchedMsgs.map(m => m.userId).filter(Boolean);
          await ensureUsers(uids);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [id, threadType]);

  const sendMessage = async () => {
    const t = chatText.trim();
    if (!t || !id) return;
    setSending(true);
    try {
      let url = "";
      if (threadType === "book") url = `/club-books/${id}/messages`;
      else if (threadType === "channel") url = `/channels/${id}/messages`;
      else if (threadType === "dm") url = `/direct-messages/${id}`;

      const out = await api<{ message: any }>(url, {
        method: "POST",
        body: JSON.stringify({ text: t }),
      });

      const newMsg = { ...out.message, userId: out.message.fromUserId || out.message.userId };
      setMessages(prev => [...prev, newMsg]);
      setChatText("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const title = clubBook?.title || channel?.name || targetUser?.name || "...";
  const subtitle = clubBook?.author || (channel ? "Canal de voz" : "Conversa privada");
  const hex = clubBook ? clubColorHex(clubBook.colorKey) : "#fbbf24"; // Default sun-500

  return (
    <div className="h-[calc(100dvh-180px)] flex flex-col">
      <div className="shrink-0 mb-2">
        <Card>
          <div className="p-3 sm:p-4 bg-white/90">
            <div className="flex items-center gap-3">
              <button onClick={() => nav("/mensagens")} className="shrink-0 w-10 h-10 rounded-2xl bg-white border border-black/10 grid place-items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black border border-black/5">
                {title.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black truncate">{title}</div>
                <div className="text-xs text-neutral-500 truncate">{subtitle}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Card>
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto chat-wallpaper p-3 space-y-4">
              <ChatBubbles messages={messages} usersById={usersById} viewerId={viewerId} accentHex={hex} isGroup={threadType !== "dm"} />
            </div>

            <div className="p-3 border-t border-black/5 bg-white/80">
              <div className="flex gap-2">
                <textarea
                  value={chatText}
                  onChange={e => setChatText(e.target.value)}
                  className="flex-1 bg-white border border-black/10 rounded-2xl p-2 text-sm outline-none resize-none"
                  placeholder="Escreva sua mensagem..."
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !chatText.trim()}
                  className="w-12 h-12 rounded-2xl bg-sun-500 flex items-center justify-center disabled:opacity-50"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


