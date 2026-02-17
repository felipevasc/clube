import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { LuSmile } from "react-icons/lu";

interface Props {
    onEmojiSelect: (emoji: string) => void;
    align?: "left" | "right";
}

export default function EmojiPickerButton({ onEmojiSelect, align = "left" }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Determine alignment classes
    const alignClasses = align === "left"
        ? "left-0 sm:left-0"
        : "right-0 sm:right-0";

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-sun-600 hover:bg-neutral-100 rounded-xl transition-colors shrink-0"
                title="Inserir emoji"
            >
                <LuSmile size={24} />
            </button>

            {isOpen && (
                <div
                    className={`absolute bottom-full mb-2 z-[100] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 ${alignClasses}`}
                    style={{
                        // Ensures it doesn't go off the side on very small screens
                        maxWidth: 'calc(100vw - 32px)',
                    }}
                >
                    <EmojiPicker
                        onEmojiClick={(emojiData: EmojiClickData) => {
                            onEmojiSelect(emojiData.emoji);
                            setIsOpen(false); // Close on select for better mobile UX
                        }}
                        theme={Theme.LIGHT}
                        lazyLoadEmojis={true}
                        searchPlaceholder="Procurar emoji..."
                        width="min(320px, 100vw - 40px)"
                        height={380}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                    />
                </div>
            )}
        </div>
    );
}
