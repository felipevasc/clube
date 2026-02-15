import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaFile,
  FaFileAudio,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFileLines,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaFileZipper,
} from "react-icons/fa6";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";
import Avatar from "../components/Avatar";

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

function fmtTimeOrDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString();
}

function extOf(name: string): string {
  const n = String(name || "");
  const i = n.lastIndexOf(".");
  if (i < 0) return "";
  return n.slice(i + 1).toLowerCase().slice(0, 8);
}

function normalizeExt(name: string): string {
  const e = extOf(name);
  if (e === "jpeg") return "jpg";
  return e;
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

function fileKind(
  name: string,
  mime: string
): "pdf" | "doc" | "sheet" | "slide" | "archive" | "video" | "audio" | "image" | "code" | "text" | "file" {
  const e = normalizeExt(name);
  const m = String(mime || "").toLowerCase();
  if (m.startsWith("image/") || ["png", "jpg", "gif", "webp", "bmp", "svg", "heic", "avif"].includes(e)) return "image";
  if (m === "application/pdf" || e === "pdf") return "pdf";
  if (m.startsWith("video/") || ["mp4", "mov", "mkv", "webm"].includes(e)) return "video";
  if (m.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg"].includes(e)) return "audio";
  if (e === "zip" || e === "rar" || e === "7z" || m.includes("zip")) return "archive";
  if (e === "doc" || e === "docx" || m.includes("word")) return "doc";
  if (e === "ppt" || e === "pptx" || m.includes("presentation")) return "slide";
  if (e === "xls" || e === "xlsx" || m.includes("sheet") || m.includes("excel")) return "sheet";
  if (["epub", "mobi"].includes(e)) return "text";
  if (
    ["js", "ts", "tsx", "jsx", "css", "scss", "html", "htm", "xml", "yml", "yaml", "json", "toml", "ini", "env", "sql"].includes(e)
  )
    return "code";
  if (m.startsWith("text/") || ["txt", "md", "csv", "json"].includes(e)) return "text";
  return "file";
}

function kindPalette(kind: ReturnType<typeof fileKind>): { bg: string; fg: string } {
  // Subtle, Dropbox-like: mostly neutral surfaces with a hint of type color.
  switch (kind) {
    case "pdf":
      return { bg: "#fff1f2", fg: "#e11d48" };
    case "doc":
      return { bg: "#eff6ff", fg: "#2563eb" };
    case "sheet":
      return { bg: "#ecfdf5", fg: "#16a34a" };
    case "slide":
      return { bg: "#fff7ed", fg: "#ea580c" };
    case "video":
      return { bg: "#eef2ff", fg: "#4f46e5" };
    case "audio":
      return { bg: "#ecfeff", fg: "#0891b2" };
    case "archive":
      return { bg: "#f3f4f6", fg: "#111827" };
    case "code":
      return { bg: "#fffbeb", fg: "#d97706" };
    case "text":
      return { bg: "#f5f5f5", fg: "#374151" };
    default:
      return { bg: "#f3f4f6", fg: "#111827" };
  }
}

function extIcon(ext: string, kind: ReturnType<typeof fileKind>): IconType {
  // Prefer extension-specific icons first (Drive-like feel).
  switch (ext) {
    case "pdf":
      return FaFilePdf;
    case "doc":
    case "docx":
    case "rtf":
    case "odt":
      return FaFileWord;
    case "xls":
    case "xlsx":
    case "csv":
    case "ods":
      return FaFileExcel;
    case "ppt":
    case "pptx":
    case "odp":
      return FaFilePowerpoint;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return FaFileZipper;
    case "mp3":
    case "wav":
    case "m4a":
    case "ogg":
    case "flac":
      return FaFileAudio;
    case "mp4":
    case "mov":
    case "mkv":
    case "webm":
      return FaFileVideo;
    case "png":
    case "jpg":
    case "gif":
    case "webp":
    case "svg":
    case "avif":
    case "heic":
      return FaFileImage;
    case "psd":
    case "ai":
      return FaFileImage;
    case "txt":
    case "md":
    case "epub":
    case "mobi":
      return FaFileLines;
    case "json":
    case "xml":
    case "yml":
    case "yaml":
    case "toml":
    case "ini":
    case "env":
    case "sql":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "css":
    case "scss":
    case "html":
    case "htm":
      return FaFileCode;
  }

  // Fallback by kind.
  switch (kind) {
    case "pdf":
      return FaFilePdf;
    case "doc":
      return FaFileWord;
    case "sheet":
      return FaFileExcel;
    case "slide":
      return FaFilePowerpoint;
    case "archive":
      return FaFileZipper;
    case "audio":
      return FaFileAudio;
    case "video":
      return FaFileVideo;
    case "image":
      return FaFileImage;
    case "code":
      return FaFileCode;
    case "text":
      return FaFileLines;
    default:
      return FaFile;
  }
}

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

export default function FilesFolder() {
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

  const [viewerId, setViewerId] = useState<string>("");
  const [usersById, setUsersById] = useState<Record<string, User>>({});

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

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
      .then((out) => setViewerId(String(out?.user?.id || "")))
      .catch(() => setViewerId(""));
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

  const refresh = async () => {
    if (!clubBookId) return;
    setLoading(true);
    setError("");
    try {
      const out = await api<{ artifacts: Artifact[] }>(`/club-books/${encodeURIComponent(clubBookId)}/artifacts`);
      const list = Array.isArray(out?.artifacts) ? out.artifacts : [];
      setArtifacts(list);
      await ensureUsers(list.map((a) => a.uploadedByUserId));
    } catch (e: any) {
      setArtifacts([]);
      setError(e?.message || "Não foi possível carregar os arquivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
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

  const onPick = async (f: File | null) => {
    if (!f || !clubBookId) return;
    setUploading(true);
    setError("");
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
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Não foi possível enviar o arquivo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const hex = clubColorHex(clubBook?.colorKey);

  return (
    <div className="-mx-4 -my-4">
      <div
        className="px-4 pt-4 pb-3 border-b border-black/5 glass"
        style={{
          background:
            `radial-gradient(900px 220px at 20% 0%, ${hexWithAlpha(hex, "2b")}, transparent 60%), ` +
            `radial-gradient(700px 220px at 90% 20%, ${hexWithAlpha(hex, "22")}, transparent 55%), ` +
            "rgba(255,255,255,0.70)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav("/arquivos")}
            className="shrink-0 w-10 h-10 rounded-2xl bg-white/80 border border-black/10 hover:bg-white transition grid place-items-center"
            title="Voltar"
            aria-label="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="shrink-0 w-10 h-10 rounded-2xl border border-black/10 grid place-items-center shadow-card"
            style={{ backgroundColor: hexWithAlpha(hex, "28") }}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3.75 7.5a2.25 2.25 0 0 1 2.25-2.25h4.5l1.5 1.5H18A2.25 2.25 0 0 1 20.25 9v7.5A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5V7.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-black truncate">{clubBook?.title || "Arquivos"}</div>
            {loadingBook ? (
              <div className="text-xs text-neutral-600">Carregando...</div>
            ) : bookError ? (
              <div className="text-xs text-red-600">{bookError}</div>
            ) : clubBook ? (
              <div className="text-xs text-neutral-600 truncate">{clubBook.author}</div>
            ) : null}
          </div>

          <input ref={fileRef} type="file" className="hidden" onChange={(e) => onPick(e.target.files?.[0] || null)} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading || !clubBookId}
            className="shrink-0 h-10 px-3 rounded-2xl bg-white/80 border border-black/10 hover:bg-white transition text-xs font-black disabled:opacity-60"
            title="Enviar arquivo"
          >
            {uploading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}

        <div className="rounded-3xl border border-black/10 bg-white/70 overflow-hidden">
          <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between gap-3">
            <div className="text-xs font-black text-neutral-800">Arquivos</div>
            <div className="text-xs text-neutral-600 tabular-nums">{artifacts.length}</div>
          </div>

          <div className="p-4">
            {loading ? <div className="text-sm text-neutral-600">Carregando arquivos...</div> : null}
            {!loading && artifacts.length === 0 ? (
              <div className="py-6 text-sm text-neutral-600">Nenhum arquivo ainda. Envie o primeiro.</div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              {artifacts.map((a) => {
                const u = usersById[a.uploadedByUserId] || { id: a.uploadedByUserId, name: a.uploadedByUserId };
                const isImg = String(a.mimeType || "").toLowerCase().startsWith("image/");
                const ext = normalizeExt(a.fileName);
                const kind = fileKind(a.fileName, a.mimeType);
                const Icon = extIcon(ext, kind);
                const pal = kindPalette(kind);
                const href = `${a.url}?download=1&name=${encodeURIComponent(a.fileName)}`;
                const mine = !!viewerId && String(a.uploadedByUserId) === String(viewerId);
                const who = mine ? "Você" : u.name;
                const typeLabel = ext ? ext.toUpperCase() : isImg ? "IMG" : "ARQ";

                return (
                  <a
                    key={a.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-3xl border border-black/10 bg-white/80 hover:bg-white transition overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
                    title={a.fileName}
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] bg-white">
                        {isImg ? (
                          <img
                            src={a.url}
                            alt={a.fileName}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-full h-full grid place-items-center"
                            style={{
                              background:
                                "radial-gradient(22px 22px at 24px 24px, rgba(0,0,0,0.035), transparent 60%), " +
                                "radial-gradient(18px 18px at 120px 80px, rgba(0,0,0,0.03), transparent 60%), " +
                                "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                            }}
                          >
                            <div
                              className="w-[76px] h-[76px] rounded-3xl ring-1 ring-black/10 shadow-[0_10px_22px_rgba(0,0,0,0.10)] grid place-items-center"
                              style={{ backgroundColor: pal.bg, color: pal.fg }}
                            >
                              <Icon size={42} aria-hidden="true" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="absolute top-2 left-2 rounded-full px-2.5 h-7 border border-black/10 bg-white/90 backdrop-blur shadow-[0_6px_16px_rgba(0,0,0,0.10)] grid place-items-center">
                        <div className="text-[10px] font-black text-neutral-900">{typeLabel}</div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div
                        className="text-[13px] font-black text-neutral-900 leading-snug"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {a.fileName}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 shrink-0 rounded-full overflow-hidden ring-1 ring-black/10">
                            <Avatar user={u} size={24} />
                          </div>
                          <div className="text-[11px] text-neutral-700 truncate">{who}</div>
                        </div>
                        <div className="shrink-0 text-[11px] text-neutral-600 tabular-nums">{formatBytes(a.size)}</div>
                      </div>

                      <div className="mt-1 text-[11px] text-neutral-500 tabular-nums">{fmtTimeOrDate(a.createdAt)}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



