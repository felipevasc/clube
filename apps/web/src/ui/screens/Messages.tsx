import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";

type User = { id: string; name: string; avatarUrl?: string; cities?: string[] };
type ClubBook = { id: string; bookId: string; title: string; author: string; colorKey: string; isActive: boolean; createdAt: string; activatedAt?: string | null };
type Channel = { id: string; name: string; type: string; cityCode?: string | null };
type DirectMessage = { id: string; fromUserId: string; toUserId: string; text: string; createdAt: string };
type Msg = { id: string; text: string; createdAt: string; userId: string };

export default function Messages() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"groups" | "individuals" | "books">("groups");

  const [viewer, setViewer] = useState<User | null>(null);
  const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [lastMsgs, setLastMsgs] = useState<Record<string, Msg | null>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const viewerId = viewer?.id || "";

  // Fetch Viewer
  useEffect(() => {
    api<{ user: User }>("/me").then(out => setViewer(out.user)).catch(() => { });
  }, []);

  // Fetch Data based on tab
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "books") {
          const out = await api<{ clubBooks: ClubBook[] }>("/club-books");
          if (alive) setClubBooks(out.clubBooks || []);
        } else if (activeTab === "groups") {
          const out = await api<{ channels: Channel[] }>("/channels");
          if (alive) setChannels(out.channels || []);
        } else if (activeTab === "individuals") {
          const out = await api<{ users: User[] }>("/users");
          if (alive) setAllUsers(out.users || []);
        }
      } catch (e: any) {
        if (alive) setError(e.message || "Erro ao carregar");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [activeTab]);

  // Filter Channels
  const filteredChannels = useMemo(() => {
    if (activeTab !== "groups") return [];
    return channels.filter(c => {
      if (c.type === "GLOBAL") return true;
      if (c.type === "CITY" && c.cityCode) {
        return viewer?.cities?.includes(c.cityCode);
      }
      return false;
    });
  }, [channels, viewer, activeTab]);

  const tabs = [
    { id: "groups", label: "Grupos" },
    { id: "individuals", label: "Indivíduos" },
    { id: "books", label: "Livros" },
  ] as const;

  return (
    <div className="pb-10">
      <div className="pt-2">
        <div className="text-sm font-black mb-4">Mensagens</div>

        {/* Tabs */}
        <div className="flex border-b border-black/5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition ${activeTab === t.id ? "text-sun-600 border-b-2 border-sun-500" : "text-neutral-500 hover:text-neutral-800"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {loading && <div className="p-4 text-xs text-neutral-500">Carregando...</div>}
        {error && <div className="p-4 text-xs text-red-500">{error}</div>}

        <div className="divide-y divide-black/5">
          {activeTab === "groups" && filteredChannels.map(c => (
            <button
              key={c.id}
              onClick={() => nav(`/mensagens/canal/${c.id}`)}
              className="w-full text-left px-4 py-4 flex items-center gap-4 hover:bg-white/50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-400 border border-black/5">
                #
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[15px]">{c.name}</div>
                <div className="text-xs text-neutral-500 truncate">Clique para entrar no chat</div>
              </div>
            </button>
          ))}

          {activeTab === "individuals" && allUsers.filter(u => u.id !== viewerId).map(u => (
            <button
              key={u.id}
              onClick={() => nav(`/mensagens/dm/${u.id}`)}
              className="w-full text-left px-4 py-4 flex items-center gap-4 hover:bg-white/50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-sun-100 flex items-center justify-center font-black text-sun-600 border border-sun-200">
                {u.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[15px]">{u.name}</div>
                <div className="text-xs text-neutral-500 truncate">Enviar mensagem privada</div>
              </div>
            </button>
          ))}

          {activeTab === "books" && clubBooks.map(b => (
            <button
              key={b.id}
              onClick={() => nav(`/mensagens/${b.id}`)}
              className="w-full text-left px-4 py-4 flex items-center gap-4 hover:bg-white/50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 border border-blue-200">
                {b.title.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[15px]">{b.title}</div>
                <div className="text-xs text-neutral-500 truncate">{b.author}</div>
              </div>
            </button>
          ))}

          {!loading && activeTab === "groups" && filteredChannels.length === 0 && (
            <div className="p-10 text-center text-xs text-neutral-500">
              Nenhum canal disponível para suas cidades.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

