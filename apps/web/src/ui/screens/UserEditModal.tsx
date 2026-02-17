import { useState } from "react";
import { api } from "../../lib/api";
import { LuX, LuCheck, LuTrash2, LuRotateCcw, LuCopy } from "react-icons/lu";
import ConfirmModal from "../components/ConfirmModal";

type User = {
    id: string;
    name: string;
    avatarUrl?: string;
    isAdmin: boolean;
    cities: string[];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdated: (user: User) => void;
    onDeleted?: (id: string) => void;
};

export default function UserEditModal({ isOpen, onClose, user, onUpdated, onDeleted }: Props) {
    const [name, setName] = useState(user.name);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin);
    const [cities, setCities] = useState<string[]>(user.cities);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [resetCode, setResetCode] = useState("");

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const ALL_CITIES = ["FORTALEZA", "BRASILIA"];

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await api<{ user: User }>(`/admin/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({ name, isAdmin, cities }),
            });
            onUpdated(res.user);
            onClose();
        } catch (err: any) {
            setError(err.message || "Falha ao atualizar usuário");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleResetPassword() {
        try {
            const res = await api<{ resetCode: string }>(`/admin/users/${user.id}/reset-password`, { method: "POST" });
            setResetCode(res.resetCode);
        } catch (err: any) {
            setError(err.message || "Erro ao gerar código");
        } finally {
            setShowResetConfirm(false);
        }
    }

    async function handleDelete() {
        try {
            await api(`/admin/users/${user.id}`, { method: "DELETE" });
            onDeleted?.(user.id);
            onClose();
        } catch (err: any) {
            setError(err.message || "Erro ao remover usuário");
        } finally {
            setShowDeleteConfirm(false);
        }
    }

    const toggleCity = (city: string) => {
        if (cities.includes(city)) {
            setCities(cities.filter(c => c !== city));
        } else {
            setCities([...cities, city]);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

                <div className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-slide-up sm:animate-in sm:fade-in sm:zoom-in">
                    <div className="px-6 pt-8 pb-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-tight">Editar Usuário</h2>
                            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition">
                                <LuX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Login / ID</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-400 border-2 border-transparent">
                                        @{user.id}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.id);
                                        }}
                                        className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-sun-600 hover:bg-sun-50 transition-all border-2 border-transparent"
                                        title="Copiar ID"
                                    >
                                        <LuCopy size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Nome</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-bold border-2 border-transparent focus:border-sun-500 outline-none transition"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Administrador</label>
                                <div className="flex items-center gap-3 p-3 bg-neutral-100 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdmin(!isAdmin)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${isAdmin ? 'bg-sun-500' : 'bg-neutral-300'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isAdmin ? 'translate-x-6' : ''}`} />
                                    </button>
                                    <span className="text-sm font-bold">{isAdmin ? 'Sim' : 'Não'}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Cidades</label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_CITIES.map(city => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => toggleCity(city)}
                                            className={`px-4 py-2 rounded-full text-xs font-black transition ${cities.includes(city) ? 'bg-sun-500 text-black shadow-sm' : 'bg-neutral-100 text-neutral-500'}`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full h-14 rounded-2xl bg-sun-500 hover:bg-sun-400 disabled:opacity-50 text-black font-black flex items-center justify-center gap-2 shadow-lg shadow-sun-500/20 transition-all ${submitting ? 'scale-95' : ''}`}
                                >
                                    {submitting ? 'Salvando...' : (
                                        <>
                                            <LuCheck size={20} />
                                            <span>Salvar Alterações</span>
                                        </>
                                    )}
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowResetConfirm(true)}
                                        className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black flex items-center justify-center gap-2 transition-all"
                                    >
                                        <LuRotateCcw size={18} />
                                        <span className="text-xs uppercase">Resetar Senha</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="h-14 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-black flex items-center justify-center gap-2 transition-all"
                                    >
                                        <LuTrash2 size={18} />
                                        <span className="text-xs uppercase">Remover</span>
                                    </button>
                                </div>
                            </div>

                            {resetCode && (
                                <div className="p-4 bg-sun-50 border-2 border-sun-200 rounded-3xl space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-[10px] font-black uppercase text-sun-700 tracking-wider">Código de Acesso Gerado</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black tracking-[0.2em] text-neutral-900">{resetCode}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(resetCode);
                                            }}
                                            className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <LuCopy size={16} className="text-sun-600" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-sun-600 leading-tight">
                                        Passe este código para o usuário. Ele deve usá-lo na tela de reset de senha.
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Remover Usuário"
                message={`TEM CERTEZA que deseja remover ${user.name}? Esta ação não pode ser desfeita.`}
                confirmLabel="Remover agora"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            <ConfirmModal
                isOpen={showResetConfirm}
                title="Gerar Reset de Senha"
                message={`Deseja gerar um código de acesso para ${user.name} redefinir a própria senha?`}
                confirmLabel="Gerar código"
                onConfirm={handleResetPassword}
                onCancel={() => setShowResetConfirm(false)}
            />
        </>
    );
}
