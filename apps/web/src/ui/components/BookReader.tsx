import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Book3D from "../components/Book3D";

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
};

// --- Helper: Split text into "Sheets" (Front/Back pairs) ---
// Each sheet has a front content and a back content.
type SheetData = {
    front: string;
    back: string;
    index: number;
    type?: 'content' | 'dedication';
};

function createSheets(book: BookReaderProps['book']): SheetData[] {
    if (!book) return [];

    // Approx chars per page - balanced for mobile spread
    // Approx chars per page - balanced for mobile high-density layout
    const isMobile = window.innerWidth < 600;
    const CHARS_PER_PAGE = isMobile ? 300 : 600;

    const contentPages: string[] = [];

    // First page is Indicação
    const dateStr = book.createdAt ? new Date(book.createdAt).toLocaleDateString('pt-BR') : "Data desconhecida";
    const indicatorName = book.createdByUser?.name || "Membro do Clube";
    let indicationText = `Este livro foi indicado por: ${indicatorName}, em ${dateStr}.`;

    if (book.indicationComment) {
        indicationText += `\n\n${book.indicationComment}`;
    }
    contentPages.push("DEDICATION:" + indicationText);

    // Second page starts the Synopsis chapter
    contentPages.push("SECTION:Sinopse");

    if (!book.synopsis) {
        contentPages.push("Sem conteúdo.");
    } else {
        const words = book.synopsis.split(" ");
        let currentPage = "";
        for (const word of words) {
            if ((currentPage + word).length > CHARS_PER_PAGE) {
                contentPages.push(currentPage.trim());
                currentPage = word + " ";
            } else {
                currentPage += word + " ";
            }
        }
        if (currentPage.trim()) contentPages.push(currentPage.trim());
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
        back: contentPages[0] || ""
    });

    let pageIndex = 1;
    while (pageIndex < contentPages.length) {
        sheets.push({
            index: sheets.length,
            front: contentPages[pageIndex] || "",
            back: contentPages[pageIndex + 1] || ""
        });
        pageIndex += 2;
    }

    return sheets;
}

export default function BookReader({ book, initialRect, onClose, onDelete, currentUserId, isAdmin }: BookReaderProps) {
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
        return createSheets(book);
    }, [book]);

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
                                    <PageContent type="front" content={sheet.front} book={book} pageNumber={i === 0 ? undefined : (i * 2)} coverUrl={book.coverUrl} />
                                </div>
                                <div className="book-page book-page-back">
                                    <PageContent type="back" content={sheet.back} book={book} pageNumber={(i * 2) + 1} coverUrl={book.coverUrl} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function PageContent({ type, content, book, pageNumber, coverUrl }: { type: 'front' | 'back', content: string; book: any, pageNumber?: number, coverUrl?: string | null }) {
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
