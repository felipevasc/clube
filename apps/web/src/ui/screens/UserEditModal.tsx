import { useState } from "react";
import { api } from "../../lib/api";
import { LuX, LuCheck } from "react-icons/lu";

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
};

export default function UserEditModal({ isOpen, onClose, user, onUpdated }: Props) {
    const [name, setName] = useState(user.name);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin);
    const [cities, setCities] = useState<string[]>(user.cities);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

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

    const toggleCity = (city: string) => {
        if (cities.includes(city)) {
            setCities(cities.filter(c => c !== city));
        } else {
            setCities([...cities, city]);
        }
    };

    return (
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
                    </form>
                </div>
            </div>
        </div>
    );
}
