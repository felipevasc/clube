import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import FeedList from "../components/FeedList";
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

function fmtDateTime(v: string | null | undefined): string {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function fmtDate(v: string | null | undefined): string {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function ClubBookRoom() {
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
  const [sp, setSp] = useSearchParams();
  const tabRaw = String(sp.get("tab") || "posts");
  const tab = tabRaw === "arquivos" || tabRaw === "posts" ? tabRaw : "posts";

  const [clubBook, setClubBook] = useState<ClubBook | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [bookError, setBookError] = useState("");

  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [uploading, setUploading] = useState(false);
  const artifactInputRef = useRef<HTMLInputElement | null>(null);

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
        if (!b) {
          setBookError("Livro não encontrado.");
        }
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

  const refreshFiles = async () => {
    if (!clubBookId) return;
    const aOut = await api<{ artifacts: Artifact[] }>(`/club-books/${encodeURIComponent(clubBookId)}/artifacts`).catch(() => ({
      artifacts: [] as Artifact[],
    }));
    const arts = Array.isArray(aOut?.artifacts) ? aOut.artifacts : [];
    setArtifacts(arts);

    const ids = Array.from(new Set([...arts.map((a) => a.uploadedByUserId)].filter(Boolean)));
    const missing = ids.filter((uid) => !usersById[uid]);
    if (missing.length) {
      const entries = await Promise.all(
        missing.map(async (uid) => {
          try {
            const u = await api<{ user: User }>(`/users/${encodeURIComponent(uid)}`);
            return [uid, u.user] as const;
          } catch {
            return [uid, { id: uid, name: uid } as User] as const;
          }
        })
      );
      setUsersById((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    }
  };

  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubBookId]);

  useEffect(() => {
    if (!clubBookId) return;
    const t = setInterval(() => refreshFiles(), 4500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubBookId]);

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
    if (!f || !clubBookId) return;
    setUploading(true);
    try {
      const up = await uploadAny(f);
      await api(`/club-books/${encodeURIComponent(clubBookId)}/artifacts`, {
        method: "POST",
        body: JSON.stringify({
          fileName: f.name || "arquivo",
          mimeType: up.mime,
          size: up.size,
          url: up.url,
        }),
      });
      await refreshFiles();
    } finally {
      setUploading(false);
      if (artifactInputRef.current) artifactInputRef.current.value = "";
    }
  };

  const hex = clubColorHex(clubBook?.colorKey);
  const tabBtn = (key: string, label: string) => {
    const active = tab === key;
    return (
      <button
        onClick={() => setSp({ tab: key })}
        className={`flex-1 text-center py-2 text-xs font-black rounded-2xl border transition ${active ? "bg-white" : "bg-white/70 hover:bg-white"}`}
        style={{ borderColor: active ? hexWithAlpha(hex, "70") : "rgba(0,0,0,0.10)" }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => nav("/livros")}
              className="shrink-0 rounded-2xl px-3 py-2 text-xs font-black bg-white/70 border border-black/10 hover:bg-white transition"
              title="Voltar"
            >
              Voltar
            </button>
            <div className="flex-1">
              <div className="text-sm font-black">Livro</div>
              {loadingBook ? (
                <div className="text-xs text-neutral-600">Carregando...</div>
              ) : bookError ? (
                <div className="text-xs text-red-600">{bookError}</div>
              ) : clubBook ? (
                <div className="text-xs text-neutral-600">
                  Definido em {fmtDate(clubBook.activatedAt)} {clubBook.isActive ? "• ATIVO" : ""}
                </div>
              ) : null}
            </div>
          </div>

          {clubBook ? (
            <div className="mt-3 rounded-3xl border border-black/10 bg-white/70 p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-3xl border border-black/10 shadow-card grid place-items-center font-black" style={{ backgroundColor: hexWithAlpha(hex, "35") }}>
                  <span className="text-lg">{clubBook.title.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-black leading-tight truncate">{clubBook.title}</div>
                  <div className="text-xs text-neutral-700 truncate">{clubBook.author}</div>
                  {clubBook.activatedAt ? <div className="mt-1 text-[11px] text-neutral-500">{fmtDateTime(clubBook.activatedAt)}</div> : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex gap-2">
            {tabBtn("posts", "Postagens")}
            {tabBtn("arquivos", "Arquivos")}
          </div>

          <div className="mt-3">
            <button
              onClick={() => nav(`/mensagens/${encodeURIComponent(String(clubBookId))}`)}
              className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white/80 border border-black/10 hover:bg-white transition"
              disabled={!clubBookId}
              title="Abrir conversa deste livro"
            >
              Abrir conversa (Mensagens)
            </button>
          </div>
        </div>
      </Card>

      {tab === "posts" ? (
        <FeedList clubBookId={clubBookId} showBookChip={false} />
      ) : (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-black">Arquivos</div>
              <div className="flex items-center gap-2">
                <input ref={artifactInputRef} type="file" className="hidden" onChange={(e) => onPickArtifact(e.target.files?.[0] || null)} />
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
                        <div className="w-16 h-16 rounded-3xl grid place-items-center font-black border border-black/10" style={{ backgroundColor: hexWithAlpha(hex, "22") }}>
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
              {artifacts.length === 0 ? <div className="col-span-2 text-sm text-neutral-600">Nenhum arquivo ainda.</div> : null}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
