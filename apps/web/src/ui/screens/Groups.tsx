import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../../lib/api";

type Group = { id: string; name: string; description: string; ownerId: string };

function initialLetter(s: string) {
  const t = (s || "?").trim();
  return (t ? t.slice(0, 1) : "?").toUpperCase();
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const canCreate = useMemo(() => name.trim().length > 0, [name]);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const out = await api<{ groups: Group[] }>("/groups");
      setGroups(out.groups || []);
    } catch (e: any) {
      setError(e?.message || "Não foi possível carregar os grupos.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="text-sm font-black">Criar grupo</div>
          <div className="mt-3 grid gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
              placeholder="Nome do grupo"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
              placeholder="Descrição (opcional)"
            />
            {createError ? <div className="text-sm text-red-600">{createError}</div> : null}
            <PrimaryButton
              onClick={async () => {
                if (!canCreate || creating) return;
                setCreateError("");
                setCreating(true);
                try {
                  await api("/groups", { method: "POST", body: JSON.stringify({ name, description }) });
                  setName("");
                  setDescription("");
                  await refresh();
                } catch (e: any) {
                  setCreateError(e?.message || "Não foi possível criar o grupo.");
                } finally {
                  setCreating(false);
                }
              }}
              disabled={!canCreate || creating}
            >
              {creating ? "Criando..." : "Criar"}
            </PrimaryButton>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-black flex-1">Seus grupos</div>
            {!loading ? (
              <button
                onClick={refresh}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/70 border border-black/10 hover:bg-white transition"
              >
                Recarregar
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-3 text-sm text-neutral-600">Carregando...</div>
          ) : error ? (
            <div className="mt-3 space-y-2">
              <div className="text-sm font-black">Não foi possível carregar</div>
              <div className="text-sm text-red-600">{error}</div>
            </div>
          ) : groups.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-600">
              Você ainda não tem grupos. Crie um acima ou peça um convite para um amigo.
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              {groups.map((g) => (
                <NavLink
                  key={g.id}
                  to={`/groups/${g.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 hover:bg-white transition px-3 py-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sun-500 shadow-card grid place-items-center font-black">
                    {initialLetter(g.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black truncate">{g.name}</div>
                    {g.description ? (
                      <div className="text-xs text-neutral-600 line-clamp-2">{g.description}</div>
                    ) : (
                      <div className="text-xs text-neutral-500">Sem descrição.</div>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
