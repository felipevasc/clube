import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type BookReaderProps = {
    book: { id: string; title: string; author: string; synopsis?: string; coverUrl?: string | null } | null;
    onClose: () => void;
};

// --- Helper: Split text into "Sheets" (Front/Back pairs) ---
// Each sheet has a front content and a back content.
type SheetData = {
    front: string;
    back: string;
    index: number;
};

function createSheets(text: string, title: string, author: string): SheetData[] {
    // Approx chars per page - balanced for mobile spread
    // Approx chars per page - balanced for mobile high-density layout
    const isMobile = window.innerWidth < 600;
    const CHARS_PER_PAGE = isMobile ? 130 : 220;

    // First page is Title/Author
    const contentPages: string[] = [];

    if (!text) {
        contentPages.push("Sem conteúdo.");
    } else {
        const words = text.split(" ");
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
    // Sheet 0: Front = Cover/Title, Back = Page 1
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

export default function BookReader({ book, onClose }: BookReaderProps) {
    const nav = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    // flippedIndex represents how many sheets are currently flipped to the LEFT.
    // 0 = Book Closed (Cover visible) -> Actually, let's start with book OPEN logic or simple flip?
    // User wants "reading" mode. 
    // Let's start with proper "Book is open" state?
    // If we want a realistic "Flip", we usually start with Cover closed, then open it.
    // Let's start with 0 (Cover closed) for effect, then auto-open to 1?
    // Or just start reading.

    // Let's start with 0 sheets flipped (Cover is visible on right).
    // Then user clicks "Next" (on cover), it flips to left (showing Page 1 on back of cover).
    const [flippedCount, setFlippedCount] = useState(0);

    useEffect(() => {
        if (book) {
            setTimeout(() => {
                setIsOpen(true);
                // Optional: Auto-open cover after a moment?
                // setTimeout(() => setFlippedCount(1), 600);
            }, 50);
            setFlippedCount(0);
        } else {
            setIsOpen(false);
        }
    }, [book]);

    const sheets = useMemo(() => {
        if (!book) return [];
        return createSheets(book.synopsis || "", book.title, book.author);
    }, [book]);

    if (!book) return null;

    const handleNext = () => {
        if (flippedCount < sheets.length) {
            setFlippedCount(p => p + 1);
        }
    };

    const handlePrev = () => {
        if (flippedCount > 0) {
            setFlippedCount(p => p - 1);
        }
    };

    // Total Z-indexes needed: enough to stack.
    const totalSheets = sheets.length;

    return (
        <div className={`book-reader-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
            {/* Action Buttons (Fixed on screen) */}
            <div className="absolute top-8 right-8 flex gap-4 z-[200]">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        nav(`/books/${book.id}/edit`);
                        onClose();
                    }}
                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Fechar
                </button>
            </div>

            <div className="book-scene" onClick={(e) => e.stopPropagation()}>
                <div
                    className="book-volume"
                    style={{
                        transform: flippedCount === 0
                            ? "translateX(0)"
                            : "translateX(50%)"
                    }}
                >
                    {/* Back Cover (Static base) */}
                    <div className="book-back-cover" />

                    {/* Dynamic Sheets */}
                    {sheets.map((sheet, i) => {
                        // Z-Index Logic:
                        // If not flipped (on right): higher index is ON TOP. (Wait, Sheet 0 is top).
                        // So if i >= flippedCount: z = (total - i)
                        // If flipped (on left): higher index is ON BOTTOM. 
                        // So if i < flippedCount: z = i
                        const isFlipped = i < flippedCount;
                        const zIndex = isFlipped ? i : (totalSheets - i);

                        return (
                            <div
                                key={i}
                                className={`book-sheet ${isFlipped ? "flipped" : ""}`}
                                style={{ zIndex }}
                                onClick={() => isFlipped ? handlePrev() : handleNext()}
                            >
                                {/* Front Face (Right Side Page) */}
                                <div className="book-page book-page-front">
                                    <PageContent
                                        type="front"
                                        content={sheet.front}
                                        book={book}
                                        pageNumber={i === 0 ? undefined : (i * 2)}
                                        coverUrl={book.coverUrl}
                                    />
                                </div>

                                {/* Back Face (Left Side Page) */}
                                <div className="book-page book-page-back">
                                    <PageContent
                                        type="back"
                                        content={sheet.back}
                                        book={book}
                                        pageNumber={(i * 2) + 1}
                                        coverUrl={book.coverUrl}
                                    />
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
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
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

    return (
        <div className="h-full flex flex-col p-3 sm:p-10 bg-[#fdfbf7] text-neutral-800">
            {/* Header decor */}
            <div className="flex justify-between items-center mb-2 sm:mb-6 opacity-30">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase truncate max-w-[60%]">{book.title}</span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">{pageNumber}</span>
            </div>

            <div className="flex-1 font-serif text-[13px] xs:text-[15px] sm:text-[20px] md:text-[25px] leading-relaxed text-left space-y-2 sm:space-y-8 py-1 sm:py-4 px-0.5 sm:px-2 overflow-hidden">
                {content.split('\n').filter(Boolean).map((p: string, idx: number) => (
                    <p key={idx} className="indent-4 sm:indent-12">{p}</p>
                ))}
            </div>

            <div className="flex justify-between items-center pt-2 sm:pt-8 border-t border-black/5">
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 truncate">{book.title}</div>
            </div>
        </div>
    );
}
