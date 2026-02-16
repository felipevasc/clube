import { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import Avatar from "../components/Avatar";
import ChatBubbles from "../components/ChatBubbles";
import BookChip from "../components/BookChip";
import { api } from "../../lib/api";
import { CLUB_COLORS, clubColorHex, type ClubColorKey } from "../lib/clubColors";

type ClubBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  colorKey: string;
  city: string;
  month: number;
  year: number;
  createdByUserId: string;
  createdAt: string;
};

type Book = { id: string; title: string; author: string };

type Msg = { id: string; clubBookId: string; userId: string; text: string; createdAt: string };
type Artifact = {
  id: string;
  clubBookId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedByUserId: string;
  createdAt: string;
};

type User = { id: string; name: string; avatarUrl?: string };

function extOf(name: string): string {
  const n = String(name || "");
  const i = n.lastIndexOf(".");
  if (i < 0) return "";
  return n.slice(i + 1).toLowerCase().slice(0, 8);
}

function formatBytes(n: number): string {
  const v = Number(n || 0);
  if (!v) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let x = v;
  while (x >= 1024 && i < units.length - 1) {
    x /= 1024;
    i++;
  }
  const dec = i === 0 ? 0 : i === 1 ? 0 : 1;
  return `${x.toFixed(dec)} ${units[i]}`;
}

function fileBadge(name: string, mime: string): string {
  const e = extOf(name);
  const m = String(mime || "").toLowerCase();
  if (m.startsWith("image/")) return "IMG";
  if (m === "application/pdf" || e === "pdf") return "PDF";
  if (e === "zip" || e === "rar" || e === "7z" || m.includes("zip")) return "ZIP";
  if (e === "epub") return "EPUB";
  if (e === "mobi") return "MOBI";
  if (e === "doc" || e === "docx") return "DOC";
  if (e === "ppt" || e === "pptx") return "PPT";
  if (e === "xls" || e === "xlsx") return "XLS";
  if (m.startsWith("text/") || e === "txt" || e === "md") return "TXT";
  return e ? e.toUpperCase() : "ARQ";
}

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

export default function BookOfMonth() {
  const [selectedCity, setSelectedCity] = useState<string>("FORTALEZA");
  const [clubBooks, setClubBooks] = useState<ClubBook[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const selected = useMemo(() => clubBooks.find((b) => b.id === selectedId) || null, [clubBooks, selectedId]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const active = useMemo(() =>
    clubBooks.find((b) => b.city === selectedCity && b.month === currentMonth && b.year === currentYear) || null,
    [clubBooks, selectedCity, currentMonth, currentYear]);

  const [clubMsg, setClubMsg] = useState("");

  const [viewerId, setViewerId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const [chatText, setChatText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const [uploading, setUploading] = useState(false);
  const artifactInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [bookQ, setBookQ] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [chosenBook, setChosenBook] = useState<Book | null>(null);
  const [colorKey, setColorKey] = useState<ClubColorKey>("mel");
  const [createCity, setCreateCity] = useState<string>("FORTALEZA");
  const [createMonth, setCreateMonth] = useState<number>(currentMonth);
  const [createYear, setCreateYear] = useState<number>(currentYear);
  const [creating, setCreating] = useState(false);
  const [createBookTitle, setCreateBookTitle] = useState("");
  const [createBookAuthor, setCreateBookAuthor] = useState("");
  const [createBookMsg, setCreateBookMsg] = useState("");
  const [createBookLoading, setCreateBookLoading] = useState(false);

  const refreshClubBooks = async (city: string) => {
    try {
      const out = await api<{ clubBooks: ClubBook[] }>(`/club-books?city=${encodeURIComponent(city)}`);
      const rows = Array.isArray(out?.clubBooks) ? out.clubBooks : [];
      setClubBooks(rows);

      const activeId = rows.find((b) => b.month === currentMonth && b.year === currentYear)?.id || "";
      setSelectedId((prev) => {
        if (prev && rows.some((b) => b.id === prev)) return prev;
        return activeId || (rows[0]?.id || "");
      });
    } catch (e: any) {
      setClubMsg(e?.message || "Não foi possível carregar o livro do mês.");
      setClubBooks([]);
      setSelectedId("");
    }
  };

  const refreshSelected = async (clubBookId: string) => {
    const [mOut, aOut] = await Promise.all([
      api<{ messages: Msg[] }>(`/club-books/${encodeURIComponent(clubBookId)}/messages`).catch(() => ({ messages: [] })),
      api<{ artifacts: Artifact[] }>(`/club-books/${encodeURIComponent(clubBookId)}/artifacts`).catch(() => ({ artifacts: [] })),
    ]);
    const msgs = Array.isArray(mOut?.messages) ? mOut.messages : [];
    const arts = Array.isArray(aOut?.artifacts) ? aOut.artifacts : [];
    setMessages(msgs);
    setArtifacts(arts);

    const ids = Array.from(new Set([...msgs.map((m) => m.userId), ...arts.map((a) => a.uploadedByUserId)].filter(Boolean)));
    const missing = ids.filter((id) => !usersById[id]);
    if (missing.length) {
      const entries = await Promise.all(
        missing.map(async (id) => {
          try {
            const u = await api<{ user: User }>(`/users/${encodeURIComponent(id)}`);
            return [id, u.user] as const;
          } catch {
            return [id, { id, name: id } as User] as const;
          }
        })
      );
      setUsersById((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    }
  };

  const searchBooks = async () => {
    const q = bookQ.trim();
    try {
      const out = await api<{ books: Book[] }>(`/books${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setBooks(out?.books || []);
    } catch (e: any) {
      setBooks([]);
      setCreateBookMsg(e?.message || "Não foi possível buscar livros.");
    }
  };

  useEffect(() => {
    refreshClubBooks(selectedCity);
    api<{ user: User }>("/me")
      .then((out) => setViewerId(String(out?.user?.id || "")))
      .catch(() => setViewerId(""));
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedId) return;
    refreshSelected(selectedId).then(() => {
      // keep chat anchored after the first paint
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" }), 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const t = setInterval(() => refreshSelected(selectedId), 3500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selectedHex = clubColorHex(selected?.colorKey);

  const openCreate = async () => {
    setCreateOpen(true);
    setClubMsg("");
    setCreateBookMsg("");
    setCreateBookTitle("");
    setCreateBookAuthor("");
    setChosenBook(null);
    setBookQ("");
    setBooks([]);
    setColorKey("mel");
    setCreateCity(selectedCity);
    setCreateMonth(currentMonth);
    setCreateYear(currentYear);
    await searchBooks();
  };

  const createClubBook = async () => {
    if (!chosenBook) return;
    setCreating(true);
    setClubMsg("");
    try {
      await api("/club-books", {
        method: "POST",
        body: JSON.stringify({
          bookId: chosenBook.id,
          colorKey,
          city: createCity,
          month: createMonth,
          year: createYear
        }),
      });
      setCreateOpen(false);
      await refreshClubBooks(selectedCity);
    } catch (e: any) {
      setClubMsg(e?.message || "Não foi possível criar o livro do mês.");
    } finally {
      setCreating(false);
    }
  };

  // Manual activation removed, scheduling is month-based.

  const createBook = async () => {
    const title = createBookTitle.trim();
    const author = createBookAuthor.trim();
    if (!title || !author) {
      setCreateBookMsg("Informe título e autor.");
      return;
    }
    setCreateBookLoading(true);
    setCreateBookMsg("");
    try {
      const out = await api<{ book: Book }>("/books", { method: "POST", body: JSON.stringify({ title, author }) });
      const b = out?.book;
      if (!b?.id) throw new Error("Resposta inválida do servidor.");
      setBooks((prev) => [b, ...(prev || []).filter((x) => x.id !== b.id)]);
      setChosenBook(b);
      setCreateBookTitle("");
      setCreateBookAuthor("");
    } catch (e: any) {
      setCreateBookMsg(e?.message || "Não foi possível adicionar o livro.");
    } finally {
      setCreateBookLoading(false);
    }
  };

  const sendMessage = async () => {
    const t = chatText.trim();
    if (!t || !selectedId) return;
    setSendingMsg(true);
    try {
      await api(`/club-books/${encodeURIComponent(selectedId)}/messages`, { method: "POST", body: JSON.stringify({ text: t }) });
      setChatText("");
      await refreshSelected(selectedId);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
    } finally {
      setSendingMsg(false);
    }
  };

  const uploadAny = async (f: File) => {
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "content-type": f.type || "application/octet-stream", "x-file-name": f.name || "arquivo" },
      body: f,
      credentials: "include",
    });
    const txt = await res.text();
    const json = txt ? JSON.parse(txt) : null;
    if (!res.ok) throw new Error(String(json?.error || res.statusText));
    return { url: String(json?.url || ""), mime: String(json?.mime || f.type || "application/octet-stream"), size: Number(json?.size || f.size || 0) };
  };

  const onPickArtifact = async (f: File | null) => {
    if (!f || !selectedId) return;
    setUploading(true);
    try {
      const up = await uploadAny(f);
      await api(`/club-books/${encodeURIComponent(selectedId)}/artifacts`, {
        method: "POST",
        body: JSON.stringify({
          fileName: f.name || "arquivo",
          mimeType: up.mime,
          size: up.size,
          url: up.url,
        }),
      });
      await refreshSelected(selectedId);
    } finally {
      setUploading(false);
      if (artifactInputRef.current) artifactInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {clubMsg ? (
        <Card>
          <div className="p-4">
            <div className="text-sm text-red-700 font-semibold">{clubMsg}</div>
          </div>
        </Card>
      ) : null}
      <Card>
        <div
          className="p-4"
          style={{
            background: `radial-gradient(900px 340px at 20% 0%, ${hexWithAlpha(selectedHex, "30")}, transparent 60%), radial-gradient(700px 300px at 90% 40%, ${hexWithAlpha(
              selectedHex,
              "22"
            )}, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.92))`,
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl shadow-card grid place-items-center font-black text-lg border border-black/5" style={{ backgroundColor: selectedHex }}>
                L
              </div>
              <div className="flex-1">
                <div className="text-sm font-black">Livro do mes</div>
                <div className="text-xs text-neutral-600">chat + artefatos + referencia para posts</div>
              </div>
              <button
                onClick={openCreate}
                className="text-xs font-black px-3 py-2 rounded-xl bg-white/80 border border-black/10 hover:bg-white transition"
              >
                Cadastrar
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 self-start">
              <button
                onClick={() => setSelectedCity("FORTALEZA")}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${selectedCity === "FORTALEZA" ? "bg-white shadow-card border border-black/5" : "text-neutral-500 hover:text-neutral-700"
                  }`}
              >
                Fortaleza
              </button>
              <button
                onClick={() => setSelectedCity("BRASILIA")}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${selectedCity === "BRASILIA" ? "bg-white shadow-card border border-black/5" : "text-neutral-500 hover:text-neutral-700"
                  }`}
              >
                Brasilia
              </button>
            </div>
          </div>

          {selected ? (
            <div className="mt-4 rounded-3xl border border-black/10 bg-white/70 p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-3xl border border-black/10 shadow-card grid place-items-center font-black" style={{ backgroundColor: hexWithAlpha(selectedHex, "35") }}>
                  <span className="text-lg">{selected.title.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-base font-black leading-tight truncate">{selected.title}</div>
                    {selected.month === currentMonth && selected.year === currentYear ? (
                      <span className="text-[11px] font-black rounded-full px-2 py-1 border" style={{ backgroundColor: hexWithAlpha(selectedHex, "18"), borderColor: hexWithAlpha(selectedHex, "55") }}>
                        ATIVO
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-neutral-700">{selected.author}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    {selected.month}/{selected.year} — {selected.city}
                  </div>
                  <div className="mt-2">
                    <BookChip clubBook={{ id: selected.id, title: selected.title, author: selected.author, colorKey: selected.colorKey }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-neutral-700">
              Nenhum livro do mes cadastrado ainda. Clique em <span className="font-black">Cadastrar</span> para criar o primeiro.
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-black">Historico ({selectedCity})</div>
            {active ? <div className="text-xs text-neutral-600">Ativo: {active.title}</div> : null}
          </div>
          <div className="mt-3 grid gap-2">
            {clubBooks.map((b) => {
              const hex = clubColorHex(b.colorKey);
              const activeNow = b.isActive;
              const selectedNow = b.id === selectedId;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(b.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`w-full text-left rounded-2xl border px-3 py-3 transition cursor-pointer ${selectedNow ? "bg-white" : "bg-white/70 hover:bg-white"
                    }`}
                  style={{ borderColor: selectedNow ? hexWithAlpha(hex, "70") : "rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl border border-black/10 grid place-items-center font-black" style={{ backgroundColor: hexWithAlpha(hex, "28") }}>
                      {(b.title || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-black truncate">{b.title}</div>
                        {b.month === currentMonth && b.year === currentYear ? (
                          <span className="text-[10px] font-black rounded-full px-2 py-1 border" style={{ backgroundColor: hexWithAlpha(hex, "16"), borderColor: hexWithAlpha(hex, "55") }}>
                            ATIVO
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-neutral-600 truncate">{b.author}</div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase">{b.month}/{b.year}</div>
                    </div>
                    <div className="shrink-0 text-[10px] font-black px-2 py-1 rounded bg-black/5">
                      {(b.city || "???").slice(0, 3)}
                    </div>
                  </div>
                </div>
              );
            })}
            {clubBooks.length === 0 ? <div className="text-sm text-neutral-600">Nada por aqui ainda.</div> : null}
          </div>
        </div>
      </Card>

      {selected ? (
        <>
          <Card>
            <div className="p-4">
              <div className="text-sm font-black">Chat do livro</div>
              <div className="mt-3 rounded-3xl border border-black/10 bg-white/70 overflow-hidden">
                <div className="p-3 max-h-[50dvh] overflow-auto overscroll-contain chat-wallpaper">
                  {messages.length === 0 ? (
                    <div className="py-6 text-center text-sm text-neutral-600">Sem mensagens ainda. Comece a conversa.</div>
                  ) : null}

                  <ChatBubbles
                    messages={messages}
                    usersById={usersById}
                    viewerId={viewerId}
                    accentHex={selectedHex}
                    className="space-y-2"
                  />

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

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-black">Artefatos</div>
                <div className="flex items-center gap-2">
                  <input
                    ref={artifactInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => onPickArtifact(e.target.files?.[0] || null)}
                  />
                  <button
                    onClick={() => artifactInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-black px-3 py-2 rounded-xl bg-white/80 border border-black/10 hover:bg-white transition disabled:opacity-50"
                  >
                    {uploading ? "Enviando..." : "Enviar arquivo"}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {artifacts.map((a) => {
                  const u = usersById[a.uploadedByUserId] || { id: a.uploadedByUserId, name: a.uploadedByUserId };
                  const isImg = String(a.mimeType || "").toLowerCase().startsWith("image/");
                  const badge = fileBadge(a.fileName, a.mimeType);
                  const hex = clubColorHex(selected.colorKey);
                  const href = `${a.url}?download=1&name=${encodeURIComponent(a.fileName)}`;
                  return (
                    <a
                      key={a.id}
                      href={href}
                      className="relative rounded-3xl border border-black/10 bg-white/70 hover:bg-white transition overflow-hidden"
                      title={`${a.fileName} (${formatBytes(a.size)})`}
                    >
                      <div className="aspect-square border-b border-black/5 bg-white grid place-items-center">
                        {isImg ? (
                          <img src={a.url} alt={a.fileName} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-3xl grid place-items-center font-black border border-black/10"
                            style={{ backgroundColor: hexWithAlpha(hex, "22") }}
                          >
                            <span className="text-xs">{badge}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-black truncate">{a.fileName}</div>
                        <div className="mt-1 text-[11px] text-neutral-600">{formatBytes(a.size)}</div>
                      </div>

                      <div className="absolute top-2 left-2 flex items-center gap-2 rounded-full px-2 py-1 border border-black/10 bg-white/85 backdrop-blur">
                        <div className="w-6 h-6">
                          <Avatar user={u} size={24} />
                        </div>
                        <div className="text-[10px] font-black max-w-[86px] truncate">{u.name}</div>
                      </div>
                    </a>
                  );
                })}
                {artifacts.length === 0 ? (
                  <div className="col-span-2 text-sm text-neutral-600">Nenhum arquivo ainda. Envie o primeiro.</div>
                ) : null}
              </div>
            </div>
          </Card>
        </>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-20">
          <button onClick={() => setCreateOpen(false)} className="absolute inset-0 bg-black/20" aria-label="Fechar" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-hidden rounded-t-[32px] border-t border-black/10 bg-[rgba(255,255,255,0.92)] backdrop-blur-xl">
            <div className="px-4 py-3 border-b border-black/5 flex items-center gap-3">
              <div className="w-10 h-1.5 rounded-full bg-black/10 mx-auto" />
            </div>
            <div className="max-h-[calc(85dvh-54px)] overflow-auto">
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-sm font-black">Cadastrar livro do mes</div>
                  <div className="text-xs text-neutral-600">Escolha o livro, a cidade e o periodo.</div>
                </div>
                {clubMsg ? <div className="text-sm text-red-600">{clubMsg}</div> : null}

                <div className="rounded-3xl border border-black/10 bg-white/70 p-3">
                  <div className="text-xs font-semibold text-neutral-600">Buscar livro</div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={bookQ}
                      onChange={(e) => setBookQ(e.target.value)}
                      className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                      placeholder="Titulo/autor..."
                    />
                    <button
                      onClick={searchBooks}
                      className="rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition"
                    >
                      Buscar
                    </button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {books.slice(0, 10).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setChosenBook(b)}
                        className={`text-left rounded-2xl border px-3 py-3 transition ${chosenBook?.id === b.id ? "bg-white" : "bg-white/70 hover:bg-white"
                          }`}
                      >
                        <div className="text-sm font-black">{b.title}</div>
                        <div className="text-xs text-neutral-600">{b.author}</div>
                      </button>
                    ))}
                    {books.length === 0 ? <div className="text-sm text-neutral-600">Nenhum livro encontrado.</div> : null}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/70 p-3">
                  <div className="text-xs font-semibold text-neutral-600">Cadastrar novo livro</div>
                  <div className="mt-2 grid gap-2">
                    <input
                      value={createBookTitle}
                      onChange={(e) => setCreateBookTitle(e.target.value)}
                      className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                      placeholder="Título"
                    />
                    <input
                      value={createBookAuthor}
                      onChange={(e) => setCreateBookAuthor(e.target.value)}
                      className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                      placeholder="Autor"
                    />
                    {createBookMsg ? <div className="text-sm text-red-600">{createBookMsg}</div> : null}
                    <button
                      onClick={createBook}
                      disabled={createBookLoading}
                      className="rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition disabled:opacity-60"
                    >
                      {createBookLoading ? "Criando..." : "Adicionar livro"}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-neutral-600">Cor</div>
                    <div className="text-[11px] text-neutral-600">{CLUB_COLORS.find((c) => c.key === colorKey)?.label}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-8 gap-2">
                    {CLUB_COLORS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setColorKey(c.key)}
                        className={`w-8 h-8 rounded-2xl border transition ${colorKey === c.key ? "ring-4 ring-sun-200" : "hover:scale-[1.03]"}`}
                        style={{ backgroundColor: c.hex, borderColor: "rgba(0,0,0,0.12)" }}
                        title={c.label}
                        aria-label={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/70 p-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-neutral-700">Cidade</div>
                    <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/5">
                      <button
                        onClick={() => setCreateCity("FORTALEZA")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition ${createCity === "FORTALEZA" ? "bg-white shadow-card" : "text-neutral-500"
                          }`}
                      >
                        Fortaleza
                      </button>
                      <button
                        onClick={() => setCreateCity("BRASILIA")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition ${createCity === "BRASILIA" ? "bg-white shadow-card" : "text-neutral-500"
                          }`}
                      >
                        Brasilia
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-neutral-700">Mes / Ano</div>
                    <div className="flex items-center gap-2">
                      <select
                        value={createMonth}
                        onChange={(e) => setCreateMonth(Number(e.target.value))}
                        className="rounded-xl border border-black/10 bg-white px-2 py-1 text-xs font-black outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                        ))}
                      </select>
                      <select
                        value={createYear}
                        onChange={(e) => setCreateYear(Number(e.target.value))}
                        className="rounded-xl border border-black/10 bg-white px-2 py-1 text-xs font-black outline-none"
                      >
                        {[2025, 2026, 2027].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <PrimaryButton disabled={!chosenBook || creating} onClick={createClubBook}>
                  {creating ? "Criando..." : "Criar livro do mes"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
