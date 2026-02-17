import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { LuUserCog, LuSearch, LuPencilLine, LuShield, LuTicketPlus, LuCopy, LuHistory, LuTicket } from "react-icons/lu";
import PrimaryButton from "../components/PrimaryButton";
import UserEditModal from "./UserEditModal";
import Avatar from "../components/Avatar";

type User = {
    id: string;
    name: string;
    avatarUrl?: string;
    isAdmin: boolean;
    cities: string[];
};

type Invitation = {
    id: string;
    city: string;
    isUsed: boolean;
    usedBy?: string;
    createdAt: string;
};

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingInvs, setLoadingInvs] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [invCity, setInvCity] = useState("FORTALEZA");

    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchInvitations();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await api<{ users: User[] }>("/admin/users");
            setUsers(res.users);
        } catch (err: any) {
            console.error("Failed to fetch users", err);
            setError(err.message || "Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    }

    async function fetchInvitations() {
        setLoadingInvs(true);
        try {
            const res = await api<{ invitations: Invitation[] }>("/admin/invitations");
            setInvitations(res.invitations);
        } catch (err) {
            console.error("Failed to fetch invitations", err);
        } finally {
            setLoadingInvs(false);
        }
    }

    async function handleGenerateInvite() {
        try {
            await api("/admin/invitations", {
                method: "POST",
                body: JSON.stringify({ city: invCity })
            });
            setShowInviteModal(false);
            fetchInvitations();
        } catch (err: any) {
            alert(err.message || "Erro ao gerar convite");
        }
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sun-600">
                    <LuUserCog size={24} />
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900">Gestão de Usuários</h1>
                </div>
                <p className="text-sm font-medium text-neutral-500">Administre os membros do seu clube.</p>
            </div>

            <div className="relative group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Buscar usuários por nome ou ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-white border border-black/5 rounded-2xl text-sm font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sun-500/20 focus:border-sun-500 transition-all shadow-sm"
                />
            </div>

            {loading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-sun-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-neutral-500">Carregando membros...</p>
                </div>
            ) : error ? (
                <div className="py-12 flex flex-col items-center gap-3 text-red-500 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-sm font-black text-center px-4">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="text-xs font-bold uppercase tracking-wider underline hover:opacity-80"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 bg-neutral-50/50 rounded-[2.5rem] border border-dashed border-neutral-200">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <LuSearch size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-neutral-900">Nenhum membro encontrado</p>
                        <p className="text-xs font-medium text-neutral-500 mt-1">
                            {search ? `Não encontramos ninguém para "${search}"` : "O clube ainda não tem membros cadastrados."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="group bg-white border border-black/5 rounded-3xl p-4 flex items-center justify-between gap-4 hover:shadow-xl hover:shadow-black/5 transition-all">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="relative">
                                    <Avatar user={user} size={56} />
                                    {user.isAdmin && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-sun-500 rounded-full border-2 border-white flex items-center justify-center text-black shadow-sm" title="Admin">
                                            <LuShield size={12} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-neutral-900 truncate">{user.name}</h3>
                                        {user.isAdmin && (
                                            <span className="px-2 py-0.5 bg-sun-500/10 text-sun-700 text-[10px] font-black uppercase tracking-wider rounded-md">Admin</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        <p className="text-xs font-bold text-neutral-400">@{user.id}</p>
                                        {user.cities.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-neutral-300" />
                                                <p className="text-xs font-bold text-neutral-500 truncate">
                                                    {user.cities.join(", ")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(user)}
                                className="shrink-0 w-11 h-11 rounded-2xl bg-neutral-50 border border-black/5 flex items-center justify-center text-neutral-600 hover:bg-sun-500 hover:text-black hover:border-sun-500 transition-all"
                            >
                                <LuPencilLine size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-8 border-t border-black/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sun-600">
                        <LuTicket size={24} />
                        <h2 className="text-xl font-black tracking-tight text-neutral-900">Convites</h2>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-sun-500 hover:bg-sun-400 text-neutral-900 font-black rounded-xl transition-all shadow-sm text-sm"
                    >
                        <LuTicketPlus size={18} />
                        Novo Convite
                    </button>
                </div>

                <div className="grid gap-3">
                    {loadingInvs ? (
                        <div className="text-center py-10 text-neutral-400 font-bold text-sm">Carregando convites...</div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-10 text-neutral-400 font-bold text-sm bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200">
                            Nenhum convite gerado ainda.
                        </div>
                    ) : (
                        invitations.map(inv => (
                            <div key={inv.id} className="bg-white border border-black/5 rounded-3xl p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${inv.isUsed ? 'bg-neutral-100 text-neutral-400' : 'bg-sun-100 text-sun-600'}`}>
                                        {inv.isUsed ? <LuHistory size={24} /> : <LuTicket size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-neutral-800 tracking-widest">{inv.id}</span>
                                            {inv.isUsed && (
                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-black uppercase rounded">Usado por @{inv.usedBy}</span>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">
                                            {inv.city} • Gerado em {new Date(inv.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                {!inv.isUsed && (
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(inv.id);
                                            alert("Código copiado!");
                                        }}
                                        className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-sun-600 hover:bg-sun-50 transition-all"
                                        title="Copiar Código"
                                    >
                                        <LuCopy size={18} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-black text-neutral-900 mb-6">Gerar Novo Convite</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Cidade</label>
                                <select
                                    value={invCity}
                                    onChange={e => setInvCity(e.target.value)}
                                    className="w-full px-4 py-4 bg-neutral-50 rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-bold"
                                >
                                    <option value="FORTALEZA">Fortaleza</option>
                                    <option value="BRASILIA">Brasília</option>
                                    <option value="GERAL">Geral</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 py-4 text-sm font-black text-neutral-500 hover:bg-neutral-50 rounded-2xl transition-all"
                                >
                                    Cancelar
                                </button>
                                <PrimaryButton onClick={handleGenerateInvite}>
                                    Gerar Código
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedUser && (
                <UserEditModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                    onUpdated={updated => {
                        setUsers(users.map(u => u.id === updated.id ? updated : u));
                    }}
                />
            )}
        </div>
    );
}
