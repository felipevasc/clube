import { useEffect, useState } from "react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../../lib/api";

type User = { id: string; name: string; bio: string; avatarUrl: string };

export default function Profile() {
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const refresh = async () => {
    const out = await api<{ user: User }>("/me");
    setMe(out.user);
    setName(out.user.name);
    setBio(out.user.bio || "");
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-sun-100 border border-black/10 grid place-items-center font-black text-xl">
              {(me?.name || me?.id || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-black">{me?.name || "Carregando..."}</div>
              <div className="text-xs text-neutral-600">{me?.id ? `@${me.id}` : ""}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <label className="text-xs font-semibold text-neutral-600">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
            />

            <label className="text-xs font-semibold text-neutral-600 mt-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-24 resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
            />

            <PrimaryButton
              onClick={async () => {
                await api("/me", { method: "PUT", body: JSON.stringify({ name, bio, avatarUrl: me?.avatarUrl || "" }) });
                await refresh();
              }}
            >
              Salvar
            </PrimaryButton>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="text-sm font-black">Estante</div>
          <div className="mt-2 text-sm text-neutral-600">
            Veja seus livros na <span className="font-black">Estante</span> e gerencie o atual em <span className="font-black">Livro do mês</span>.
          </div>
        </div>
      </Card>
    </div>
  );
}
