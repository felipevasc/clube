import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../../lib/api";

type DevUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  updatedAt?: string;
};

export default function Login() {
  const [username, setU] = useState("");
  const [name, setName] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [devUsers, setDevUsers] = useState<DevUser[]>([]);
  const [devUsersLoading, setDevUsersLoading] = useState(false);
  const [devUsersError, setDevUsersError] = useState("");
  const [devUsersQuery, setDevUsersQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = useMemo(() => (loc.state as any)?.from || "/", [loc.state]);
  const urlError = useMemo(() => new URLSearchParams(loc.search).get("error") || "", [loc.search]);

  const googleHref = useMemo(() => `/api/auth/google/start?from=${encodeURIComponent(String(from || "/"))}`, [from]);

  const showDevUsernameLogin = useMemo(() => import.meta.env.DEV, []);

  const filteredDevUsers = useMemo(() => {
    const q = devUsersQuery.trim().toLowerCase();
    if (!q) return devUsers;
    return devUsers.filter((u) => {
      const id = String(u.id || "").toLowerCase();
      const name = String(u.name || "").toLowerCase();
      return id.includes(q) || name.includes(q);
    });
  }, [devUsers, devUsersQuery]);

  async function refreshDevUsers() {
    setDevUsersError("");
    setDevUsersLoading(true);
    try {
      const out = await api<{ users: DevUser[] }>("/dev/users");
      setDevUsers(Array.isArray(out?.users) ? out.users : []);
    } catch (e: any) {
      setDevUsersError(e?.message || "Erro ao carregar usuarios");
    } finally {
      setDevUsersLoading(false);
    }
  }

  useEffect(() => {
    if (!showDevUsernameLogin) return;
    refreshDevUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDevUsernameLogin]);

  const errorLabel = useMemo(() => {
    const e = String(urlError || error || "").trim();
    if (!e) return "";
    if (e === "google_not_configured") return "Login com Google ainda não está configurado neste ambiente.";
    if (e === "session_not_configured") return "Sessão não configurada no servidor.";
    if (e === "google_invalid_state") return "Não foi possível validar o login. Tente novamente.";
    if (e === "google_missing_code") return "Não foi possível concluir o login. Tente novamente.";
    if (e === "google_access_denied") return "Login cancelado.";
    return e;
  }, [urlError, error]);

  return (
    <div className="min-h-dvh grid place-items-center px-4 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,191,15,0.55),transparent_60%),radial-gradient(900px_500px_at_10%_40%,rgba(255,216,79,0.35),transparent_55%)]">
      <div className="w-full max-w-md">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sun-500 grid place-items-center font-black text-xl">
                C
              </div>
              <div>
                <div className="text-xl font-black tracking-tight">Entrar</div>
                <div className="text-sm text-neutral-600">Acesse seu clube com uma conta.</div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={googleHref}
                className="block w-full text-center rounded-2xl px-4 py-3 text-sm font-black bg-sun-500 hover:bg-sun-400 transition"
              >
                Continuar com Google
              </a>
            </div>

            {errorLabel ? <div className="mt-4 text-sm text-red-600">{errorLabel}</div> : null}

            {showDevUsernameLogin ? (
              <div className="mt-6 pt-5 border-t border-black/10">
                <div className="text-xs font-semibold text-neutral-600">Dev: entrar sem senha</div>

                <label className="mt-3 block text-xs font-semibold text-neutral-600" htmlFor="dev-user-search">
                  Buscar usuario
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="dev-user-search"
                    value={devUsersQuery}
                    onChange={(e) => setDevUsersQuery(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                    placeholder="Filtrar por nome/username..."
                    inputMode="text"
                  />
                  <button
                    type="button"
                    onClick={refreshDevUsers}
                    disabled={devUsersLoading}
                    className="shrink-0 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black hover:bg-neutral-50 transition disabled:opacity-50"
                    title="Recarregar"
                  >
                    {devUsersLoading ? "..." : "R"}
                  </button>
                </div>

                {devUsersError ? <div className="mt-2 text-xs text-red-600">{devUsersError}</div> : null}

                <label className="mt-3 block text-xs font-semibold text-neutral-600" htmlFor="dev-user-select">
                  Escolher usuario
                </label>
                <div className="mt-2">
                  <select
                    id="dev-user-select"
                    value={selectedUserId}
                    onChange={(e) => {
                      const v = String(e.target.value || "");
                      setSelectedUserId(v);
                      setU(v);
                    }}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                  >
                    <option value="">Selecionar...</option>
                    {filteredDevUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name ? `${u.name} (${u.id})` : u.id}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="mt-2 block text-xs font-semibold text-neutral-600" htmlFor="dev-username">
                  Ou digite um username (cria se nao existir)
                </label>
                <div className="mt-2">
                  <input
                    id="dev-username"
                    value={username}
                    onChange={(e) => {
                      const v = e.target.value;
                      setU(v);
                      const id = v.trim();
                      setSelectedUserId(devUsers.some((u) => u.id === id) ? id : "");
                    }}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                    autoComplete="username"
                    inputMode="text"
                  />
                </div>

                <label className="mt-2 block text-xs font-semibold text-neutral-600" htmlFor="dev-name">
                  Nome (opcional)
                </label>
                <div className="mt-2">
                  <input
                    id="dev-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                    autoComplete="name"
                    inputMode="text"
                  />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-neutral-600 mb-2">Cidades</div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cities.includes("FORTALEZA")}
                        onChange={(e) => {
                          if (e.target.checked) setCities((p) => [...p, "FORTALEZA"]);
                          else setCities((p) => p.filter((c) => c !== "FORTALEZA"));
                        }}
                        className="rounded border-gray-300 text-sun-500 focus:ring-sun-200"
                      />
                      <span className="text-sm">Fortaleza</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cities.includes("BRASILIA")}
                        onChange={(e) => {
                          if (e.target.checked) setCities((p) => [...p, "BRASILIA"]);
                          else setCities((p) => p.filter((c) => c !== "BRASILIA"));
                        }}
                        className="rounded border-gray-300 text-sun-500 focus:ring-sun-200"
                      />
                      <span className="text-sm">Brasília</span>
                    </label>
                  </div>
                </div>

                <PrimaryButton
                  disabled={loading}
                  onClick={async () => {
                    setError("");
                    setLoading(true);
                    try {
                      const u = username.trim();
                      await api("/login", {
                        method: "POST",
                        body: JSON.stringify({ username: u, cities }),
                      });
                      const n = name.trim();
                      if (n) {
                        const me = await api<{ user: { bio?: string; avatarUrl?: string } }>("/me");
                        await api("/me", {
                          method: "PUT",
                          body: JSON.stringify({
                            name: n,
                            bio: String(me?.user?.bio || ""),
                            avatarUrl: String(me?.user?.avatarUrl || ""),
                          }),
                        });
                      }
                      nav(from, { replace: true });
                    } catch (e: any) {
                      setError(e?.message || "Erro");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </PrimaryButton>

                <div className="mt-2 text-[11px] text-neutral-600">
                  Dica: usernames aceitam apenas letras, numeros e _ (min 3, max 32).
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
