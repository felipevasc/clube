import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../../lib/api";
import { LuShield, LuUser, LuKeyRound, LuTicket, LuSearch, LuChevronRight } from "react-icons/lu";

type DevUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  updatedAt?: string;
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const [users, setUsers] = useState<DevUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = useMemo(() => (loc.state as any)?.from || "/", [loc.state]);

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const out = await api<{ users: DevUser[] }>("/users"); // Fallback to public users if admin fails
      setUsers(Array.isArray(out?.users) ? out.users : []);
    } catch {
      // Ignore errors for this dev-helper feature
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await api("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      nav(from, { replace: true });
    } catch (e: any) {
      setError(e?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await api("/register", {
        method: "POST",
        body: JSON.stringify({ username, name, password, invitationCode }),
      });
      nav(from, { replace: true });
    } catch (e: any) {
      setError(e?.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await api("/users/reset-password", {
        method: "POST",
        body: JSON.stringify({ username, resetCode, newPassword: password }),
      });
      setSuccessMessage("Senha alterada com sucesso! Agora você pode entrar.");
      setMode("login");
    } catch (e: any) {
      setError(e?.message || "Erro ao resetar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center px-4 bg-[url('/images/fundo.png')] bg-cover bg-center overflow-auto py-10">
      <div className="w-full max-w-md">
        <Card>
          <div className="p-8">
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-white/40 border-2 border-white/50 grid place-items-center overflow-hidden shadow-xl">
                <img src="/images/margarida.png" alt="Margarida" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ fontFamily: 'comic sans ms, sans-serif' }}>
                  Margarida's
                </div>
                <div className="text-xl font-serif italic text-yellow-900 font-bold -mt-2 tracking-widest drop-shadow-sm">
                  book club
                </div>
              </div>
            </div>

            <div className="flex bg-black/5 rounded-2xl p-1 mb-8">
              <button
                onClick={() => { setMode("login"); setSuccessMessage(""); setError(""); }}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === "login" ? "bg-white text-sun-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setMode("register"); setSuccessMessage(""); setError(""); }}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === "register" ? "bg-white text-sun-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Registrar
              </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">{error}</div>}
            {successMessage && <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl border border-green-100">{successMessage}</div>}

            <div className="space-y-5">
              {mode === "login" ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider ml-1">Usuário</label>
                      <button
                        onClick={() => {
                          setShowUserSearch(true);
                          refreshUsers();
                        }}
                        className="text-[10px] font-black text-sun-600 hover:underline uppercase"
                      >
                        Procurar usuário
                      </button>
                    </div>
                    <div className="relative group">
                      <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        placeholder="Nome de usuário"
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Senha</label>
                    <div className="relative group">
                      <LuKeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <PrimaryButton loading={loading} onClick={handleLogin}>
                    Entrar no Clube
                  </PrimaryButton>

                  <button
                    onClick={() => setMode("reset")}
                    className="w-full text-center text-xs font-black text-neutral-500 hover:text-sun-600 transition-colors py-2 uppercase tracking-tighter"
                  >
                    Esqueceu a senha? Use um código de acesso
                  </button>
                </>
              ) : mode === "reset" ? (
                <>
                  <div className="space-y-4">
                    <div className="p-4 bg-sun-50 rounded-2xl border border-sun-100 flex items-start gap-3">
                      <LuShield className="text-sun-600 shrink-0 mt-0.5" size={18} />
                      <p className="text-xs font-bold text-sun-800 leading-relaxed">
                        Se você esqueceu sua senha, peça um <b>Código de Reset</b> para um dos administradores do clube.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Usuário</label>
                      <div className="relative group">
                        <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase())}
                          placeholder="Ex: alice"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Código de Reset</label>
                      <div className="relative group">
                        <LuTicket className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                          placeholder="XXXXXX"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-black tracking-widest uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Nova Senha</label>
                      <div className="relative group">
                        <LuKeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <PrimaryButton loading={loading} onClick={handleResetPassword}>
                      Redefinir Senha
                    </PrimaryButton>

                    <button
                      onClick={() => setMode("login")}
                      className="w-full text-center text-xs font-black text-neutral-500 hover:text-sun-600 transition-colors py-2 uppercase"
                    >
                      Voltar para o login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Convite</label>
                      <div className="relative group">
                        <LuTicket className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          value={invitationCode}
                          onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                          placeholder="Código do convite"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-black tracking-widest uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Usuário</label>
                      <div className="relative group">
                        <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase())}
                          placeholder="Username"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Nome</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome real"
                        className="w-full px-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider ml-1">Senha</label>
                      <div className="relative group">
                        <LuKeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 caracteres"
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 outline-none focus:ring-4 focus:ring-sun-200 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <PrimaryButton loading={loading} onClick={handleRegister}>
                      Finalizar Cadastro
                    </PrimaryButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {showUserSearch && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="font-black text-neutral-800">Procurar Usuário</div>
                <button onClick={() => setShowUserSearch(false)} className="text-neutral-400 hover:text-neutral-600 p-2">
                  <LuSearch size={20} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loadingUsers ? (
                  <div className="p-10 text-center text-neutral-400 font-medium">Carregando usuários...</div>
                ) : users.length === 0 ? (
                  <div className="p-10 text-center text-neutral-400 font-medium">Nenhum usuário encontrado</div>
                ) : (
                  users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setUsername(u.id);
                        setShowUserSearch(false);
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-sun-50 rounded-2xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0 border-2 border-white group-hover:border-sun-200 shadow-sm">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full grid place-items-center bg-sun-100 text-sun-600 font-black">
                            {u.name?.[0]?.toUpperCase() || u.id[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-neutral-800 group-hover:text-sun-700 transition-colors">{u.name || u.id}</div>
                        <div className="text-xs text-neutral-400 font-medium">@{u.id}</div>
                      </div>
                      <LuChevronRight className="ml-auto text-neutral-300 group-hover:text-sun-400 transition-colors" size={18} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
