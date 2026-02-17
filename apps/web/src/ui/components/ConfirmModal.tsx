import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    isDestructive = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-sun-50 text-sun-500'}`}>
                        <LuTriangleAlert size={32} />
                    </div>

                    <h3 className="text-xl font-black text-neutral-900 mb-2 leading-tight">
                        {title}
                    </h3>

                    <p className="text-sm text-neutral-500 font-bold leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-black transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 h-12 rounded-2xl text-white text-xs font-black shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] ${isDestructive ? 'bg-red-500 shadow-red-200' : 'bg-sun-500 shadow-sun-200'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
