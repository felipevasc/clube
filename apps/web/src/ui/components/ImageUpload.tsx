import { useState, useRef } from "react";
import { LuUpload, LuX, LuImage, LuLoader } from "react-icons/lu";
import { api } from "../../lib/api";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", className = "" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload raw binary
            const res = await fetch("/api/uploads", {
                method: "POST",
                headers: {
                    "Content-Type": file.type,
                    "x-file-name": file.name,
                },
                body: file,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Erro ao enviar imagem. Tente novamente.");
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    if (value) {
        return (
            <div className={`relative aspect-video rounded-xl overflow-hidden group bg-neutral-100 border border-neutral-200 ${className}`}>
                <img
                    src={value}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="opacity-0 group-hover:opacity-100 bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:scale-110 transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                        <LuX className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`image-upload-${label}`}
            />
            <label
                htmlFor={`image-upload-${label}`}
                className={`
                    flex flex-col items-center justify-center w-full aspect-video rounded-xl 
                    border-2 border-dashed border-neutral-300 bg-neutral-50 
                    hover:bg-neutral-100 hover:border-neutral-400 
                    cursor-pointer transition-all gap-2 text-neutral-500
                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                `}
            >
                {uploading ? (
                    <LuLoader className="w-8 h-8 animate-spin text-neutral-400" />
                ) : (
                    <>
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <LuImage className="w-6 h-6 text-neutral-400" />
                        </div>
                        <span className="text-sm font-bold">{label}</span>
                        <span className="text-xs text-neutral-400">JPG, PNG, WebP</span>
                    </>
                )}
            </label>
        </div>
    );
}
