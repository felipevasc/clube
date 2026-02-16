import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import Avatar from "../components/Avatar";
import FeedList from "../components/FeedList";
import { api, getAuthenticatedUser } from "../../lib/api";
import { LuArrowLeft, LuPencil, LuUpload, LuImage } from "react-icons/lu";

type User = { id: string; name: string; bio: string; avatarUrl: string; coverUrl?: string };

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = getAuthenticatedUser();
  const isMe = !userId || userId === currentUser;

  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const endpoint = userId ? `/users/${userId}` : "/me";
      const out = await api<{ user: User }>(endpoint);
      setUser(out.user);
      setName(out.user.name);
      setBio(out.user.bio || "");
      setAvatarUrl(out.user.avatarUrl || "");
      setCoverUrl(out.user.coverUrl || "");
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  const handleUpload = async (file: File, type: "avatar" | "cover") => {
    const setter = type === "avatar" ? setUploadingAvatar : setUploadingCover;
    setter(true);
    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: {
          "content-type": file.type || "application/octet-stream",
          "x-file-name": file.name || "arquivo",
        },
        body: file,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      if (type === "avatar") setAvatarUrl(url);
      else setCoverUrl(url);
    } catch (e) {
      console.error("Upload failed", e);
      alert("Falha no upload da imagem");
    } finally {
      setter(false);
    }
  };

  if (loading && !user) {
    return <div className="p-8 text-center text-neutral-500 animate-pulse font-black">Carregando perfil...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-neutral-500 font-black">Usuário não encontrado</div>;
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="relative">
        <div className="h-40 w-full rounded-b-3xl bg-neutral-200 overflow-hidden relative border-b border-black/5">
          {user.coverUrl ? (
            <img src={user.coverUrl} className="w-full h-full object-cover" alt="Capa" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sun-300 to-sun-500" />
          )}

          {!isMe && (
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-card grid place-items-center hover:bg-white transition"
            >
              <LuArrowLeft size={20} />
            </button>
          )}
        </div>

        <div className="px-4 -mt-12 relative flex items-end justify-between">
          <div className="p-1 rounded-[2rem] bg-white shadow-card">
            <Avatar user={user} size={80} />
          </div>

          {isMe && (
            <button
              onClick={() => setEditing(true)}
              className="mb-2 px-4 py-2 rounded-2xl bg-white shadow-card border border-black/5 text-xs font-black flex items-center gap-2 hover:bg-neutral-50 transition"
            >
              <LuPencil size={14} />
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-1">
        <h1 className="text-xl font-black tracking-tight">{user.name}</h1>
        <p className="text-sm text-neutral-500 font-medium">@{user.id}</p>
        {user.bio && <p className="mt-3 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{user.bio}</p>}
      </div>

      <div className="px-4">
        <div className="flex gap-4 border-b border-black/5 overflow-x-auto no-scrollbar">
          <button className="py-3 px-1 border-b-2 border-sun-500 text-sm font-black whitespace-nowrap">Posts</button>
          <button className="py-3 px-1 border-b-2 border-transparent text-sm font-bold text-neutral-400 whitespace-nowrap">Estante</button>
          <button className="py-3 px-1 border-b-2 border-transparent text-sm font-bold text-neutral-400 whitespace-nowrap">Sobre</button>
        </div>
      </div>

      <FeedList userId={user.id} showBookChip={true} />

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card>
            <div className="w-80 md:w-96 p-6 space-y-4">
              <h2 className="text-lg font-black">Editar Perfil</h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 ml-1">Nome</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200 transition"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 ml-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full min-h-24 resize-none rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200 transition"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 ml-1">Foto de Perfil</label>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar")}
                    />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="w-full h-24 rounded-2xl border-2 border-dashed border-black/10 bg-neutral-50 flex flex-col items-center justify-center gap-2 hover:bg-neutral-100 transition disabled:opacity-50 overflow-hidden relative"
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      ) : null}
                      <LuUpload size={20} className="text-neutral-400 relative z-10" />
                      <span className="text-[10px] font-black text-neutral-500 relative z-10">
                        {uploadingAvatar ? "Subindo..." : "Upload"}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 ml-1">Capa</label>
                    <input
                      type="file"
                      ref={coverInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "cover")}
                    />
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="w-full h-24 rounded-2xl border-2 border-dashed border-black/10 bg-neutral-50 flex flex-col items-center justify-center gap-2 hover:bg-neutral-100 transition disabled:opacity-50 overflow-hidden relative"
                    >
                      {coverUrl ? (
                        <img src={coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      ) : null}
                      <LuImage size={20} className="text-neutral-400 relative z-10" />
                      <span className="text-[10px] font-black text-neutral-500 relative z-10">
                        {uploadingCover ? "Subindo..." : "Upload"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 text-sm font-bold text-neutral-500 hover:text-neutral-700 transition"
                >
                  Cancelar
                </button>
                <PrimaryButton
                  onClick={async () => {
                    await api("/me", {
                      method: "PUT",
                      body: JSON.stringify({ name, bio, avatarUrl, coverUrl })
                    });
                    setEditing(false);
                    await refresh();
                  }}
                >
                  Salvar
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
