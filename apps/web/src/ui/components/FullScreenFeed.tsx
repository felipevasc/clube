import { useEffect, useRef, useState } from "react";
import { FeedPost } from "./FeedList";
import Avatar from "./Avatar";
import { clubColorHex } from "../lib/clubColors";

type FullScreenFeedProps = {
    posts: FeedPost[];
    initialPostId: string | null;
    onClose: () => void;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
};

export default function FullScreenFeed({
    posts,
    initialPostId,
    onClose,
    onLike,
    onComment,
}: FullScreenFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to initial post on mount
    useEffect(() => {
        if (initialPostId && containerRef.current) {
            const el = document.getElementById(`fs-post-${initialPostId}`);
            if (el) {
                el.scrollIntoView({ behavior: "auto" });
            }
        }
    }, [initialPostId]);

    return (
        <div className="fixed inset-0 z-50 bg-black text-white">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                style={{ zIndex: 100 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            {/* Snap Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {posts.map((post) => (
                    <FullScreenPost
                        key={post.id}
                        post={post}
                        onLike={onLike}
                        onComment={onComment}
                    />
                ))}
            </div>
        </div>
    );
}

function FullScreenPost({
    post,
    onLike,
    onComment
}: {
    post: FeedPost;
    onLike: (id: string) => void;
    onComment: (id: string) => void;
}) {
    const hasLiked = post.viewerReaction?.type === "like";
    // Prepare images array
    const images = post.images && post.images.length > 0 ? post.images : post.imageUrl ? [post.imageUrl] : [];

    const [currIndex, setCurrIndex] = useState(0);

    // Reset index if post changes (though key mapping should handle this)
    useEffect(() => {
        setCurrIndex(0);
    }, [post.id]);

    const scrollToImage = (idx: number) => {
        setCurrIndex(idx);
    };

    return (
        <div
            id={`fs-post-${post.id}`}
            className="h-full w-full snap-start relative flex items-center justify-center bg-neutral-900"
        >
            {/* Background Image / Media */}
            {images.length > 0 ? (
                <div className="absolute inset-0">
                    {/* Blurry Background (based on current image) */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110 transition-all duration-700"
                        style={{ backgroundImage: `url(${images[currIndex]})` }}
                    />

                    {/* Main Image Carousel */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        {/* We use a simple transform to slide */}
                        <div
                            className="flex h-full transition-transform duration-300 ease-out"
                            style={{
                                transform: `translateX(-${currIndex * 100}%)`,
                                width: `${images.length * 100}%`
                            }}
                        >
                            {images.map((img, i) => (
                                <div key={i} className="relative w-full h-full flex-shrink-0 flex items-center justify-center">
                                    <img
                                        src={img}
                                        alt={`Post content ${i + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

                    {/* Carousel Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-32 left-0 w-full flex justify-center gap-1.5 z-20">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); scrollToImage(i); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currIndex ? "bg-white w-2.5" : "bg-white/40"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Areas (Invisible buttons for tapping left/right) */}
                    {images.length > 1 && (
                        <>
                            <div
                                className="absolute top-20 bottom-32 left-0 w-1/4 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currIndex > 0) setCurrIndex(currIndex - 1);
                                }}
                            />
                            <div
                                className="absolute top-20 bottom-32 right-0 w-1/4 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currIndex < images.length - 1) setCurrIndex(currIndex + 1);
                                }}
                            />
                        </>
                    )}
                </div>
            ) : (
                // Text-only post background
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-neutral-800">
                    <p className="text-2xl font-medium text-center text-neutral-300 italic">
                        "{post.text}"
                    </p>
                </div>
            )}

            {/* Interaction Side Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
                {/* Like */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                        className={`p-3 rounded-full backdrop-blur-lg transition-transform active:scale-90 ${hasLiked ? 'text-red-500 bg-white/10' : 'text-white bg-black/20'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                    <span className="text-xs font-semibold">{post._count?.likes || 0}</span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onComment(post.id); }}
                        className="p-3 rounded-full text-white bg-black/20 backdrop-blur-lg hover:bg-white/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </button>
                    <span className="text-xs font-semibold">{post._count?.comments || 0}</span>
                </div>

                {/* Share */}
                <button className="p-3 rounded-full text-white bg-black/20 backdrop-blur-lg hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                </button>

                {/* More Options */}
                <button className="p-3 rounded-full text-white bg-black/20 backdrop-blur-lg hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-black/90 to-transparent pt-20 pointer-events-none">
                <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                    <div className="p-[2px] rounded-full bg-white">
                        <Avatar user={post.user || { id: post.userId, name: post.userId }} size={40} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white shadow-sm">{post.user?.name || "Usuário"}</span>
                        {post.clubBook && (
                            <span className="text-xs flex items-center gap-1 text-white/80">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: clubColorHex(post.clubBook.colorKey) }}></span>
                                Lendo {post.clubBook.title}
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-white/90 text-[15px] leading-relaxed max-w-[85%] line-clamp-3 pointer-events-auto">
                    {post.text}
                </p>
                <div className="flex gap-2 text-[11px] text-white/50 mt-2">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Visual Indicator of Scroll */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce opacity-50 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>

        </div>
    );
}
