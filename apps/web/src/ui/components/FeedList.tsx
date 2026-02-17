import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import BookChip from "./BookChip";
import { api } from "../../lib/api";
import { clubColorHex } from "../lib/clubColors";
import FullScreenFeed from "./FullScreenFeed";
import { LuTrash2 } from "react-icons/lu";
import ConfirmModal from "./ConfirmModal";

type ReactionType = "like" | "love" | "laugh" | "wow" | "sad" | "clap";

const REACTIONS: Array<{ type: ReactionType; emoji: string; label: string }> = [
  { type: "like", emoji: "❤️", label: "Curtir" },
  { type: "love", emoji: "😍", label: "Amei" },
  { type: "laugh", emoji: "😂", label: "Rindo" },
  { type: "wow", emoji: "😮", label: "Uau" },
  { type: "sad", emoji: "😢", label: "Triste" },
  { type: "clap", emoji: "👏", label: "Aplausos" },
];

export type FeedPost = {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string | null;
  images?: string[] | null;
  clubBookId?: string | null;
  clubBook?: { id: string; title: string; author: string; colorKey: string } | null;
  createdAt: string;
  _count?: { likes: number; comments: number };
  reactions?: Record<string, number>;
  viewerReaction?: { type: ReactionType } | null;
  user?: { id: string; name: string; avatarUrl?: string };
  comments?: Array<{ id: string; userId: string; text: string; createdAt: string; user?: { id: string; name: string } }>;
};

type PostDetail = FeedPost & {
  comments: Array<{ id: string; userId: string; text: string; createdAt: string; user?: { id: string; name: string; avatarUrl?: string } }>;
  reactions?: Record<string, number>;
  viewerReaction?: { type: ReactionType } | null;
};

function reactionEmoji(t: ReactionType | null | undefined): string {
  const r = REACTIONS.find((x) => x.type === t);
  return r?.emoji || "❤️";
}

function reactionsTotal(reactions: Record<string, number> | null | undefined): number {
  if (!reactions) return 0;
  return Object.values(reactions).reduce((a, b) => a + Number(b || 0), 0);
}

function topReactions(reactions: Record<string, number> | null | undefined) {
  const rows = Object.entries(reactions || {}).map(([type, count]) => ({
    type: type as ReactionType,
    count: Number(count || 0),
  }));
  rows.sort((a, b) => b.count - a.count);
  return rows.filter((r) => r.count > 0).slice(0, 3);
}

// Icons
const Icons = {
  Heart: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  HeartFilled: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ef4444" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  Comment: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  ),
  Share: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
  More: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
  )
};

export default function FeedList({
  clubBookId,
  userId,
  refreshToken,
  showBookChip = true,
}: {
  clubBookId?: string;
  userId?: string;
  refreshToken?: number;
  showBookChip?: boolean;
}) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [pickerFor, setPickerFor] = useState<string>("");
  const [detailId, setDetailId] = useState<string>("");
  const [detail, setDetail] = useState<PostDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [fullScreenPostId, setFullScreenPostId] = useState<string | null>(null);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ id: string; isAdmin: boolean } | null>(null);
  const [menuFor, setMenuFor] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>("");

  useEffect(() => {
    api<{ user: { id: string; isAdmin: boolean } }>("/me")
      .then(res => setCurrentUser(res.user))
      .catch(console.warn);
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      await api(`/posts/${encodeURIComponent(postId)}`, { method: "DELETE" });
      setConfirmDeleteId("");
      refresh();
    } catch (e: any) {
      alert("Erro ao remover post: " + e.message);
    }
  };

  const feedPath = useMemo(() => {
    const qs = new URLSearchParams();
    if (clubBookId) qs.set("clubBookId", clubBookId);
    if (userId) qs.set("userId", userId);
    return `/feed${qs.toString() ? `?${qs.toString()}` : ""}`;
  }, [clubBookId, userId]);

  const refresh = async () => {
    const out = await api<{ posts: FeedPost[] }>(feedPath);
    setPosts(out.posts);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPath, refreshToken]);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      setCommentText("");
      return;
    }
    let alive = true;
    setDetailLoading(true);
    api<{ post: PostDetail }>(`/posts/${encodeURIComponent(detailId)}`)
      .then((out) => {
        if (!alive) return;
        setDetail(out.post);
      })
      .finally(() => {
        if (!alive) return;
        setDetailLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [detailId]);

  const react = async (postId: string, type: ReactionType) => {
    setPickerFor("");
    await api(`/posts/${encodeURIComponent(postId)}/react`, { method: "POST", body: JSON.stringify({ type }) });
    await refresh();
    if (detailId === postId) {
      const out = await api<{ post: PostDetail }>(`/posts/${encodeURIComponent(postId)}`);
      setDetail(out.post);
    }
  };

  return (
    <div className="pb-10">
      {posts.map((p) => {
        const bookColor = p.clubBook ? clubColorHex(p.clubBook.colorKey) : null;
        const images = p.images && p.images.length > 0 ? p.images : p.imageUrl ? [p.imageUrl] : [];
        console.log("Post:", p.id, "Images:", p.images, "ImageUrl:", p.imageUrl, "Computed:", images);

        return (
          <article
            key={p.id}
            className="bg-white border-b border-neutral-100 last:border-0 pb-4 mb-2 relative"
          >
            {bookColor && (
              <div
                className="absolute top-0 bottom-0 left-0 w-[3px] z-10"
                style={{ backgroundColor: bookColor }}
                title={`Post sobre ${p.clubBook?.title}`}
              />
            )}

            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between pl-5"> {/* Increased left padding for the border */}
              <Link to={`/profile/${p.userId}`} className="flex items-center gap-3">
                <Avatar user={p.user || { id: p.userId, name: p.userId }} size={32} />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-neutral-900">{p.user?.name || p.userId}</div>
                  {showBookChip && p.clubBook ? (
                    <div className="text-xs text-neutral-500 mt-0.5">{p.clubBook.title}</div>
                  ) : (
                    <div className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                  )}
                </div>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuFor(menuFor === p.id ? "" : p.id)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Mais opções"
                >
                  <Icons.More />
                </button>

                {menuFor === p.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuFor("")} />
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-black/5 py-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                      {currentUser?.isAdmin && (
                        <button
                          onClick={() => {
                            setMenuFor("");
                            setConfirmDeleteId(p.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LuTrash2 size={16} />
                          Remover Post
                        </button>
                      )}
                      {/* Outras opções podem entrar aqui */}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Media */}

            {/* Media */}
            {images.length > 0 && (
              <div
                className="w-full bg-neutral-100 overflow-hidden aspect-[4/5] relative"
                onClick={(e) => {
                  // Default to first image if not clicked deeply
                  setFullScreenPostId(p.id);
                  setClickedImageIndex(0);
                }}
              >
                {images.length === 1 ? (
                  <img
                    src={images[0]}
                    alt="Post content"
                    className="w-full h-full object-cover cursor-pointer"
                    loading="lazy"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullScreenPostId(p.id);
                      setClickedImageIndex(0);
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-0.5 w-full h-full cursor-pointer">
                    {/* First image (Left, spans all rows) */}
                    <div className={`relative h-full ${images.length === 2 ? "row-span-1" : images.length === 3 ? "row-span-2" : "row-span-3"}`}>
                      <img
                        src={images[0]}
                        alt="Post content 1"
                        className="w-full h-full object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullScreenPostId(p.id);
                          setClickedImageIndex(0);
                        }}
                      />
                    </div>

                    {/* Right column images */}
                    <div className={`flex flex-col gap-0.5 h-full ${images.length === 2 ? "row-span-1" : images.length === 3 ? "row-span-2" : "row-span-3"}`}>
                      {images.slice(1, 4).map((img, idx) => (
                        <div key={idx} className="relative h-full flex-1 overflow-hidden">
                          <img
                            src={img}
                            alt={`Post content ${idx + 2}`}
                            className="w-full h-full object-cover"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullScreenPostId(p.id);
                              setClickedImageIndex(idx + 1);
                            }}
                          />
                          {/* Overlay on the last visible item if there are more */}
                          {idx === 2 && images.length > 4 && (
                            <div
                              className="absolute inset-0 bg-black/50 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFullScreenPostId(p.id);
                                setClickedImageIndex(idx + 1);
                              }}
                            >
                              <span className="text-white font-bold text-xl">+{images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => react(p.id, "like")}
                  className="hover:scale-110 active:scale-95 transition"
                >
                  {p.viewerReaction ? <Icons.HeartFilled /> : <Icons.Heart />}
                </button>
                <button
                  onClick={() => setDetailId(p.id)}
                  className="hover:scale-110 active:scale-95 transition text-neutral-700"
                >
                  <Icons.Comment />
                </button>
                <button className="hover:scale-110 active:scale-95 transition text-neutral-700 -rotate-45 relative top-[-2px]">
                  <Icons.Share />
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setFullScreenPostId(p.id)}
                  className="hover:scale-110 active:scale-95 transition text-neutral-700"
                  title="Ver em tela cheia"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
              </div>

              {/* Likes count */}
              < div className="mt-2 text-sm font-semibold text-neutral-900" >
                {reactionsTotal(p.reactions)} curtidas
              </div>

              {/* Caption */}
              {
                (p.text || "").trim() ? (
                  <div className="mt-1 text-sm leading-relaxed text-neutral-900">
                    <span className="font-bold mr-1">{p.user?.name || p.userId}</span>
                    {p.text}
                  </div>
                ) : null
              }

              {/* View Comments Link */}
              {
                (p._count?.comments || 0) > 0 && (
                  <button
                    onClick={() => setDetailId(p.id)}
                    className="mt-1 text-sm text-neutral-500 hover:text-neutral-700"
                  >
                    Ver todos os {p._count?.comments} comentários
                  </button>
                )
              }

              {/* Time (if not in header or if redundant) */}
              <div className="mt-1 text-[10px] uppercase text-neutral-400 tracking-wide">
                {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
              </div>
            </div >
          </article >
        );
      })}

      {
        posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-lg font-bold text-neutral-900">Ainda não há posts</div>
            <p className="text-neutral-500 max-w-xs mt-2">Seja o primeiro a compartilhar algo interessante com o clube!</p>
          </div>
        ) : null
      }

      {/* Post Detail / Comments Modal */}
      {
        detailId ? (
          <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailId("")} />

            <div className="relative w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl h-[90dvh] sm:h-[80vh] flex flex-col animate-in slide-in-from-bottom-10">
              {/* Modal Header */}
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                <div className="w-8" /> {/* Spacer */}
                <div className="font-bold">Comentários</div>
                <button onClick={() => setDetailId("")} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {detailLoading ? (
                  <div className="flex justify-center py-8"><span className="animate-spin text-2xl">⏳</span></div>
                ) : detail ? (
                  <>
                    {/* Original Post content context (optional, maybe just caption) */}
                    <div className="flex gap-3 pb-4 border-b border-neutral-100">
                      <Avatar
                        user={detail.user || { id: detail.userId, name: detail.userId }}
                        size={32}
                      />
                      <div>
                        <div className="text-sm">
                          <span className="font-bold mr-1">{detail.user?.name || detail.userId}</span>
                          <span>{detail.text}</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">{new Date(detail.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Comments */}
                    {detail.comments.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-sm">Nenhum comentário ainda.</div>
                    ) : (
                      detail.comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                          <Avatar user={c.user || { id: c.userId, name: c.userId }} size={32} />
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-bold mr-1">{c.user?.name || c.userId}</span>
                              {c.text}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-neutral-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                              <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-900">Responder</button>
                            </div>
                          </div>
                          <button className="self-start mt-1 text-neutral-400 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          </button>
                        </div>
                      ))
                    )}
                  </>
                ) : null}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-neutral-100 bg-white items-center flex gap-2">
                <Avatar user={{ id: "me", name: "Eu" }} size={32} />
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 bg-transparent text-sm outline-none px-2"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      // Send comment
                    }
                  }}
                />
                <button
                  disabled={!commentText.trim()}
                  onClick={async () => {
                    if (!detail || !commentText.trim()) return;
                    await api(`/posts/${encodeURIComponent(detail.id)}/comments`, {
                      method: "POST",
                      body: JSON.stringify({ text: commentText }),
                    });
                    setCommentText("");
                    // Refresh details
                    const out = await api<{ post: PostDetail }>(`/posts/${encodeURIComponent(detail.id)}`);
                    setDetail(out.post);
                    refresh(); // update comments count in feed
                  }}
                  className="text-sun-600 font-bold text-sm disabled:opacity-50 hover:text-sun-700"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
      {
        fullScreenPostId && (
          <FullScreenFeed
            posts={posts}
            initialPostId={fullScreenPostId}
            initialImageIndex={clickedImageIndex}
            onClose={() => setFullScreenPostId(null)}
            onLike={(id) => react(id, "like")}
            onComment={(id) => setDetailId(id)}
          />
        )
      }

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Remover Post"
        message="Você tem certeza que deseja remover este post? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        isDestructive
        onConfirm={() => handleDeletePost(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId("")}
      />
    </div >
  );
}

