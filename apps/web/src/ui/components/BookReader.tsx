import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Book3D from "../components/Book3D";

// --- Types ---

type EventPhoto = {
    id: string;
    url: string;
    caption?: string;
    user?: { name: string; avatarUrl?: string };
};

type RelatedEvent = {
    id: string;
    title: string;
    description: string;
    location: string;
    startAt: string;
    photos: EventPhoto[];
};

type RelatedPost = {
    id: string;
    text: string;
    imageUrl?: string;
    images: string[];
    createdAt: string;
    user: { id: string; name: string; avatarUrl?: string };
};

type RelatedPollOption = {
    id: string;
    text: string;
    type: string;
    imageUrl?: string;
    book?: { id: string; title: string; author: string; coverUrl?: string } | null;
    voteCount: number;
};

type RelatedPoll = {
    id: string;
    question: string;
    description?: string;
    imageUrl?: string;
    multiChoice: boolean;
    totalVotes: number;
    options: RelatedPollOption[];
    createdAt: string;
};

export type RelatedData = {
    events: RelatedEvent[];
    posts: RelatedPost[];
    polls: RelatedPoll[];
};

type BookReaderProps = {
    book: {
        id: string;
        title: string;
        author: string;
        synopsis?: string;
        coverUrl?: string | null;
        indicationComment?: string;
        createdAt?: string;
        createdByUser?: { id: string; name: string; avatarUrl?: string };
    } | null;
    initialRect?: DOMRect | null;
    onClose: () => void;
    onDelete?: () => void;
    currentUserId?: string;
    isAdmin?: boolean;
    relatedData?: RelatedData | null;
};

// --- Helper: Split text into "Sheets" (Front/Back pairs) ---
// Each sheet has a front content and a back content.
type SheetData = {
    front: string;
    back: string;
    index: number;
    type?: 'content' | 'dedication';
    // Store structured data for rich pages
    frontData?: any;
    backData?: any;
};

function createSheets(book: BookReaderProps['book'], relatedData?: RelatedData | null): SheetData[] {
    if (!book) return [];

    // Approx chars per page - balanced for mobile spread
    // Approx chars per page - balanced for mobile high-density layout
    const isMobile = window.innerWidth < 600;
    const CHARS_PER_PAGE = isMobile ? 300 : 600;

    const contentPages: { text: string; data?: any }[] = [];

    // First page is Indicação
    const dateStr = book.createdAt ? new Date(book.createdAt).toLocaleDateString('pt-BR') : "Data desconhecida";
    const indicatorName = book.createdByUser?.name || "Membro do Clube";
    let indicationText = `Este livro foi indicado por: ${indicatorName}, em ${dateStr}.`;

    if (book.indicationComment) {
        indicationText += `\n\n${book.indicationComment}`;
    }
    contentPages.push({ text: "DEDICATION:" + indicationText });

    // Second page starts the Synopsis chapter
    contentPages.push({ text: "SECTION:Sinopse" });

    if (!book.synopsis) {
        contentPages.push({ text: "Sem conteúdo." });
    } else {
        const words = book.synopsis.split(" ");
        let currentPage = "";
        for (const word of words) {
            if ((currentPage + word).length > CHARS_PER_PAGE) {
                contentPages.push({ text: currentPage.trim() });
                currentPage = word + " ";
            } else {
                currentPage += word + " ";
            }
        }
        if (currentPage.trim()) contentPages.push({ text: currentPage.trim() });
    }

    // --- ENCONTROS ---
    if (relatedData?.events && relatedData.events.length > 0) {
        contentPages.push({ text: "SECTION:Encontros" });

        for (const event of relatedData.events) {
            // Event cover page
            contentPages.push({
                text: "EVENT_COVER:",
                data: event
            });

            // One page per photo
            for (const photo of event.photos) {
                contentPages.push({
                    text: "EVENT_PHOTO:",
                    data: { photo, event }
                });
            }
        }
    }

    // --- PUBLICAÇÕES ---
    if (relatedData?.posts && relatedData.posts.length > 0) {
        contentPages.push({ text: "SECTION:Publicações" });

        for (const post of relatedData.posts) {
            const allImages = post.images.length > 0 ? post.images : (post.imageUrl ? [post.imageUrl] : []);

            if (allImages.length <= 1) {
                // Single image or text-only: one page
                contentPages.push({
                    text: "POST:",
                    data: post
                });
            } else {
                // First page: text + first image
                contentPages.push({
                    text: "POST:",
                    data: { ...post, images: [allImages[0]], _totalImages: allImages.length }
                });
                // One page per additional image
                for (let i = 1; i < allImages.length; i++) {
                    contentPages.push({
                        text: "POST_PHOTO:",
                        data: { imageUrl: allImages[i], post, index: i + 1, total: allImages.length }
                    });
                }
            }
        }
    }

    // --- ENQUETES ---
    if (relatedData?.polls && relatedData.polls.length > 0) {
        contentPages.push({ text: "SECTION:Enquetes" });

        for (const poll of relatedData.polls) {
            contentPages.push({
                text: "POLL:",
                data: poll
            });
        }
    }

    // We need to map linear pages to Sheets (Front/Back).
    // Sheet 0: Front = Cover/Title, Back = Page 1 (or Dedication)
    // Sheet 1: Front = Page 2, Back = Page 3
    // ...
    const sheets: SheetData[] = [];

    // Cover Sheet
    sheets.push({
        index: 0,
        front: "COVER", // Special marker
        back: contentPages[0]?.text || "",
        backData: contentPages[0]?.data
    });

    let pageIndex = 1;
    while (pageIndex < contentPages.length) {
        sheets.push({
            index: sheets.length,
            front: contentPages[pageIndex]?.text || "",
            back: contentPages[pageIndex + 1]?.text || "",
            frontData: contentPages[pageIndex]?.data,
            backData: contentPages[pageIndex + 1]?.data
        });
        pageIndex += 2;
    }

    return sheets;
}

export default function BookReader({ book, initialRect, onClose, onDelete, currentUserId, isAdmin, relatedData }: BookReaderProps) {
    const nav = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [flippedCount, setFlippedCount] = useState(0);

    useEffect(() => {
        if (book) {
            // Trigger enter animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
            setFlippedCount(0);
        } else {
            setIsVisible(false);
        }
    }, [book]);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to finish before calling onClose (which unmounts/clears book)
        setTimeout(onClose, 400);
    };

    const sheets = useMemo(() => {
        return createSheets(book, relatedData);
    }, [book, relatedData]);

    if (!book) return null;

    const handleNext = () => {
        if (flippedCount < sheets.length) setFlippedCount(p => p + 1);
    };

    const handlePrev = () => {
        if (flippedCount > 0) setFlippedCount(p => p - 1);
    };

    const totalSheets = sheets.length;
    const canEdit = isAdmin || (currentUserId && book.createdByUser?.id === currentUserId);

    return (
        <div
            className={`book-reader-overlay ${isVisible ? "open" : ""}`}
            onClick={handleClose}
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 400ms ease',
                pointerEvents: isVisible ? 'auto' : 'none'
            }}
        >
            {/* Action Buttons */}
            <div
                className={`absolute top-8 right-8 flex gap-4 z-[200] transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                {onDelete && (isAdmin || canEdit) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); handleClose(); }}
                        className="bg-red-500/80 hover:bg-red-600/90 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remover
                    </button>
                )}
                {canEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); nav(`/books/${book.id}/edit`); handleClose(); }}
                        className="bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Fechar
                </button>
            </div>

            {/* Book Scene */}
            <div
                className="book-scene"
                onClick={(e) => e.stopPropagation()}
                style={{
                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div
                    className="book-volume"
                    style={{
                        transform: flippedCount === 0 ? "translateX(0)" : "translateX(50%)"
                    }}
                >
                    <div className="book-back-cover" />
                    {sheets.map((sheet, i) => {
                        const isFlipped = i < flippedCount;
                        const zIndex = isFlipped ? i : (totalSheets - i);
                        return (
                            <div
                                key={i}
                                className={`book-sheet ${isFlipped ? "flipped" : ""}`}
                                style={{ zIndex }}
                                onClick={() => isFlipped ? handlePrev() : handleNext()}
                            >
                                <div className={`book-page book-page-front ${i === 0 ? 'book-cover-front' : ''}`}>
                                    <PageContent type="front" content={sheet.front} data={sheet.frontData} book={book} pageNumber={i === 0 ? undefined : (i * 2)} coverUrl={book.coverUrl} />
                                </div>
                                <div className="book-page book-page-back">
                                    <PageContent type="back" content={sheet.back} data={sheet.backData} book={book} pageNumber={(i * 2) + 1} coverUrl={book.coverUrl} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- Page Content Renderer ---

function PageContent({ type, content, data, book, pageNumber, coverUrl }: {
    type: 'front' | 'back';
    content: string;
    data?: any;
    book: any;
    pageNumber?: number;
    coverUrl?: string | null;
}) {
    if (content === "COVER") {
        return (
            <div className="h-full relative overflow-hidden bg-[#2a1b15]">
                {coverUrl ? (
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-contain" />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-0 text-[#eaddcd] border-2 sm:border-4 border-[#ffd700]/10 bg-gradient-to-br from-[#3e281f] to-[#2a1b15]">
                        <div className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] uppercase mb-2 sm:mb-6 text-[#ffd700]/60">Clube do Livro</div>
                        <h1 className="text-xl sm:text-4xl font-serif font-black mb-2 sm:mb-4 leading-tight shadow-sm whitespace-normal overflow-hidden">{book.title}</h1>
                        <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-[#ffd700]/30 my-2 sm:my-6" />
                        <p className="text-xs sm:text-lg font-bold uppercase tracking-[0.2em] text-[#ffd700]/80 px-2">{book.author}</p>
                        <div className="mt-auto pt-4 text-[7px] sm:text-[9px] opacity-40 uppercase tracking-[0.3em] font-medium pb-4">Toque para começar</div>
                    </div>
                )}
            </div>
        );
    }

    if (!content) return <div className="h-full bg-[#fdfbf7]" />;

    // --- Rich content types ---
    if (content === "EVENT_COVER:" && data) {
        return <EventCoverPage event={data} book={book} pageNumber={pageNumber} />;
    }
    if (content === "EVENT_PHOTO:" && data) {
        return <EventPhotoPage photo={data.photo} event={data.event} book={book} pageNumber={pageNumber} />;
    }
    if (content === "POST:" && data) {
        return <PostPage post={data} book={book} pageNumber={pageNumber} />;
    }
    if (content === "POST_PHOTO:" && data) {
        return <PostPhotoPage imageUrl={data.imageUrl} post={data.post} index={data.index} total={data.total} book={book} pageNumber={pageNumber} />;
    }
    if (content === "POLL:" && data) {
        return <PollPage poll={data} book={book} pageNumber={pageNumber} />;
    }

    const isDedication = content.startsWith("DEDICATION:");
    const isSection = content.startsWith("SECTION:");
    const finalContent = isDedication
        ? content.replace("DEDICATION:", "")
        : isSection
            ? content.replace("SECTION:", "")
            : content;

    return (
        <div className="h-full flex flex-col p-3 sm:p-10 bg-[#fdfbf7] text-neutral-800">
            {/* Page Number (Top Right) */}
            <div className="flex justify-end items-center mb-2 sm:mb-6 opacity-30">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">{pageNumber}</span>
            </div>

            {isDedication ? (
                <div className="flex-1 flex flex-col items-start justify-start p-3 sm:p-10">
                    <div className="font-serif italic text-[11px] xs:text-[13px] sm:text-[16px] md:text-[20px] leading-relaxed text-neutral-700 w-full space-y-4">
                        {finalContent.split('\n').filter(Boolean).map((line, i) => (
                            <p key={i} className={i === 0 ? "not-italic font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-neutral-500 mb-8 text-justify" : "text-justify indent-4 sm:indent-12"}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            ) : isSection ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-3 sm:p-10">
                    <div className="w-12 h-1 bg-sun-500 mb-6" />
                    <h2 className="text-3xl sm:text-5xl font-serif font-black text-neutral-900 mb-2">{finalContent}</h2>
                </div>
            ) : (
                <div className="flex-1 font-serif text-[11px] xs:text-[13px] sm:text-[16px] md:text-[20px] leading-relaxed text-justify space-y-4 sm:space-y-8 p-3 sm:p-10 overflow-hidden">
                    {finalContent.split('\n').filter(Boolean).map((p: string, idx: number) => (
                        <p key={idx} className="indent-4 sm:indent-12">{p}</p>
                    ))}
                </div>
            )}

            {/* Book Title (Bottom) */}
            <div className="flex justify-between items-center pt-2 sm:pt-8 border-t border-black/5 mt-auto">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}

// --- Event Cover Page ---
function EventCoverPage({ event, book, pageNumber }: { event: RelatedEvent; book: any; pageNumber?: number }) {
    const dateStr = new Date(event.startAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] text-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-3 sm:px-10 pt-3 sm:pt-6 opacity-30">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Encontro</span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">{pageNumber}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-12">
                {/* Decorative element */}
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                <h2 className="text-lg sm:text-3xl font-serif font-black text-neutral-900 mb-2 sm:mb-4 leading-tight">{event.title}</h2>

                <div className="w-8 h-0.5 bg-amber-300 my-2 sm:my-4" />

                <p className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-amber-700 mb-2">{dateStr}</p>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold flex items-center gap-1 justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {event.location}
                </p>

                {event.description && (
                    <p className="mt-4 sm:mt-6 font-serif italic text-[10px] sm:text-sm text-neutral-600 leading-relaxed max-h-24 sm:max-h-32 overflow-hidden">
                        {event.description.length > 200 ? event.description.slice(0, 200) + "..." : event.description}
                    </p>
                )}

                {event.photos.length > 0 && (
                    <p className="mt-3 sm:mt-4 text-[9px] sm:text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                        {event.photos.length} foto{event.photos.length > 1 ? "s" : ""} do encontro →
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-3 sm:px-10 pb-3 sm:pb-6 pt-2 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}

// --- Event Photo Page ---
function EventPhotoPage({ photo, event, book, pageNumber }: { photo: EventPhoto; event: RelatedEvent; book: any; pageNumber?: number }) {
    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] text-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-3 sm:px-10 pt-3 sm:pt-6">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase opacity-30 truncate max-w-[60%]">{event.title}</span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase opacity-30">{pageNumber}</span>
            </div>

            {/* Photo */}
            <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 min-h-0">
                <div className="relative w-full flex-1 rounded-lg sm:rounded-2xl overflow-hidden shadow-lg border border-black/10 bg-neutral-100 min-h-0">
                    <img
                        src={photo.url}
                        alt={photo.caption || "Foto do encontro"}
                        className="w-full h-full object-cover"
                    />
                    {/* Vintage photo overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Caption area */}
                <div className="w-full mt-2 sm:mt-4 text-center">
                    {photo.caption && (
                        <p className="font-serif italic text-[10px] sm:text-sm text-neutral-700 leading-snug">
                            "{photo.caption}"
                        </p>
                    )}
                    {photo.user && (
                        <p className="text-[8px] sm:text-[10px] text-neutral-400 font-bold mt-1">
                            📷 {photo.user.name}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-3 sm:px-10 pb-3 sm:pb-6 pt-2 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}

// --- Post Page ---
function PostPage({ post, book, pageNumber }: { post: RelatedPost & { _totalImages?: number }; book: any; pageNumber?: number }) {
    const dateStr = new Date(post.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const firstImage = post.images[0] || post.imageUrl;
    const totalImages = post._totalImages || (post.images.length > 0 ? post.images.length : (post.imageUrl ? 1 : 0));

    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] text-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-3 sm:px-10 pt-3 sm:pt-6 opacity-30">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Publicação</span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">{pageNumber}</span>
            </div>

            <div className="flex-1 flex flex-col p-3 sm:p-8 min-h-0 overflow-hidden">
                {/* Author info */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 shrink-0">
                    {post.user.avatarUrl ? (
                        <img src={post.user.avatarUrl} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-black/10" />
                    ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-[10px] sm:text-xs border border-black/10">
                            {post.user.name[0]}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-[10px] sm:text-sm text-neutral-900 leading-tight">{post.user.name}</p>
                        <p className="text-[8px] sm:text-[10px] text-neutral-400 font-semibold">{dateStr}</p>
                    </div>
                </div>

                {/* Post text */}
                {post.text && (
                    <div className="mb-3 sm:mb-4 shrink-0">
                        <p className="font-serif text-[10px] sm:text-sm text-neutral-700 leading-relaxed">
                            {post.text.length > 300 ? post.text.slice(0, 300) + "..." : post.text}
                        </p>
                    </div>
                )}

                {/* Post image */}
                {firstImage && (
                    <div className="flex-1 rounded-lg sm:rounded-xl overflow-hidden border border-black/10 shadow-sm bg-neutral-100 min-h-0 relative">
                        <img src={firstImage} alt="" className="w-full h-full object-cover" />
                        {totalImages > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded">
                                1/{totalImages}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-3 sm:px-10 pb-3 sm:pb-6 pt-2 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}

// --- Post Photo Page (additional images) ---
function PostPhotoPage({ imageUrl, post, index, total, book, pageNumber }: {
    imageUrl: string; post: RelatedPost; index: number; total: number; book: any; pageNumber?: number;
}) {
    const dateStr = new Date(post.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] text-neutral-800 overflow-hidden">
            {/* Header with author info */}
            <div className="flex items-center justify-between px-3 sm:px-10 pt-3 sm:pt-6">
                <div className="flex items-center gap-2">
                    {post.user.avatarUrl ? (
                        <img src={post.user.avatarUrl} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-black/10" />
                    ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-[8px] sm:text-[10px] border border-black/10">
                            {post.user.name[0]}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-[9px] sm:text-[11px] text-neutral-700 leading-tight">{post.user.name}</p>
                        <p className="text-[7px] sm:text-[9px] text-neutral-400">{dateStr}</p>
                    </div>
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase opacity-30">{pageNumber}</span>
            </div>

            {/* Photo */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 min-h-0">
                <div className="relative w-full h-full rounded-lg sm:rounded-2xl overflow-hidden border border-black/10 bg-neutral-100">
                    <img
                        src={imageUrl}
                        alt={`Foto ${index} de ${total}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    {/* Photo counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded">
                        {index}/{total}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-3 sm:px-10 pb-3 sm:pb-6 pt-2 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}

// --- Poll Page (Results - flat book style) ---
function PollPage({ poll, book, pageNumber }: { poll: RelatedPoll; book: any; pageNumber?: number }) {
    // Sort options by votes descending for results display
    const sorted = [...poll.options].sort((a, b) => b.voteCount - a.voteCount);
    const maxVotes = sorted[0]?.voteCount || 1;

    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] text-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-3 sm:px-10 pt-3 sm:pt-6 opacity-30">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Resultado da Enquete</span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">{pageNumber}</span>
            </div>

            <div className="flex-1 flex flex-col px-4 sm:px-10 py-3 sm:py-6 overflow-hidden">
                {/* Question - serif, like a chapter title */}
                <h3 className="font-serif text-sm sm:text-lg font-black text-neutral-900 leading-tight mb-1 shrink-0">
                    {poll.question}
                </h3>

                {poll.description && (
                    <p className="font-serif italic text-[9px] sm:text-xs text-neutral-500 mb-3 sm:mb-4 shrink-0">
                        {poll.description.length > 120 ? poll.description.slice(0, 120) + "…" : poll.description}
                    </p>
                )}

                {/* Thin rule separator */}
                <div className="w-full h-px bg-neutral-300 mb-3 sm:mb-4 shrink-0" />

                {/* Results as flat horizontal bars */}
                <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 overflow-hidden">
                    {sorted.slice(0, 8).map((opt, idx) => {
                        const pct = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;
                        const barWidth = maxVotes > 0 ? Math.max(2, (opt.voteCount / maxVotes) * 100) : 2;
                        const isWinner = idx === 0 && opt.voteCount > 0;

                        return (
                            <div key={opt.id} className="shrink-0">
                                {/* Option row with optional thumbnail */}
                                <div className="flex items-center gap-2 mb-0.5">
                                    {/* Thumbnail: book cover or option image */}
                                    {opt.type === "BOOK" && opt.book?.coverUrl ? (
                                        <div className="w-7 h-10 sm:w-9 sm:h-12 rounded-sm overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                                            <img src={opt.book.coverUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : opt.imageUrl ? (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                                            <img src={opt.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : null}

                                    {/* Label + bar */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between mb-0.5">
                                            <div className="truncate max-w-[65%]">
                                                <span className={`text-[9px] sm:text-[11px] block truncate ${isWinner ? "font-black text-neutral-900" : "font-semibold text-neutral-600"
                                                    }`}>
                                                    {opt.type === "BOOK" && opt.book ? opt.book.title : opt.text}
                                                </span>
                                                {opt.type === "BOOK" && opt.book && (
                                                    <span className="text-[7px] sm:text-[9px] text-neutral-400 italic block truncate">
                                                        {opt.book.author}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-[9px] sm:text-[11px] tabular-nums ml-2 shrink-0 ${isWinner ? "font-black text-neutral-900" : "font-bold text-neutral-400"
                                                }`}>
                                                {pct}%
                                                <span className="text-[7px] sm:text-[9px] font-normal text-neutral-300 ml-0.5">({opt.voteCount})</span>
                                            </span>
                                        </div>
                                        {/* Bar */}
                                        <div className="w-full h-2 sm:h-2.5 bg-neutral-100 border border-neutral-200">
                                            <div
                                                className={`h-full transition-all ${isWinner ? "bg-neutral-800" : "bg-neutral-300"
                                                    }`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {sorted.length > 8 && (
                        <p className="text-[8px] sm:text-[10px] text-neutral-400 italic text-center shrink-0">
                            e mais {sorted.length - 8} opções
                        </p>
                    )}
                </div>

                {/* Total votes - bottom rule style */}
                <div className="mt-auto pt-2 sm:pt-3 shrink-0">
                    <div className="w-full h-px bg-neutral-300 mb-1.5" />
                    <p className="text-[8px] sm:text-[10px] font-serif text-neutral-500 text-right">
                        Total: <span className="font-bold text-neutral-700">{poll.totalVotes}</span> voto{poll.totalVotes !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-3 sm:px-10 pb-3 sm:pb-6 pt-2 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}
