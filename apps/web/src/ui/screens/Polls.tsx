import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";
import { LuChartBarBig, LuPlus, LuCheck, LuUsers, LuLayoutList, LuArrowRight } from "react-icons/lu";
import CreatePollModal from "../components/CreatePollModal";

type Poll = {
  id: string;
  question: string;
  description?: string;
  createdAt: string;
  multiChoice?: boolean;
  publicVotes?: boolean;
  city: string;
  _count: {
    votes: number;
  };
};

type User = {
  id: string;
  name: string;
  cities: string[];
};

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export default function Polls() {
  const [activeCity, setActiveCity] = useState<"FORTALEZA" | "BRASILIA">("FORTALEZA");
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    api<{ user: User }>("/me").then(res => {
      setUser(res.user);
      if (res.user.cities.includes("FORTALEZA")) setActiveCity("FORTALEZA");
      else if (res.user.cities.includes("BRASILIA")) setActiveCity("BRASILIA");
    }).catch(() => { });
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await api<{ polls: Poll[] }>(`/polls?city=${activeCity}`);
      setPolls(Array.isArray(res?.polls) ? res.polls : []);
    } catch (e) {
      console.error(e);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [activeCity]);

  const canVote = user?.cities.includes(activeCity);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 grid place-items-center">
            <LuChartBarBig className="w-6 h-6 text-neutral-900" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Enquetes</h1>
            <p className="text-sm text-neutral-500 font-bold">Participe e veja o que os outros pensam</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-lg shadow-neutral-900/20 hover:scale-105 active:scale-95 transition-all"
        >
          <LuPlus size={24} />
        </button>
      </div>

      <div className="flex bg-neutral-100 p-1.5 rounded-[24px] gap-1">
        {(["FORTALEZA", "BRASILIA"] as const).map((city) => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={`flex-1 py-3 px-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeCity === city
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {!canVote && user && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
            <LuUsers className="text-amber-600" size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-amber-900 leading-tight">Visualização Restrita</p>
            <p className="text-xs text-amber-700 font-bold leading-relaxed">
              Você não pertence a {activeCity}. Poderá ver os resultados, mas não poderá votar.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-sun-200 border-t-sun-500 rounded-full animate-spin" />
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Carregando...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <LuLayoutList className="text-neutral-300" size={32} />
            </div>
            <p className="text-sm font-black text-neutral-400 capitalize">Nenhuma enquete encontrada em {activeCity.toLowerCase()}.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 text-xs font-black text-sun-600 hover:underline"
            >
              Crie a primeira agora!
            </button>
          </div>
        ) : (
          polls.map((p) => (
            <Link key={p.id} to={`/enquetes/poll/${encodeURIComponent(p.id)}`}>
              <Card>
                <div className="p-5 flex flex-col gap-4 hover:bg-black/[0.01] transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="text-lg font-black text-neutral-900 leading-tight group-hover:text-sun-600 transition-colors">
                        {p.question}
                      </h3>
                      {p.description && (
                        <p className="text-sm text-neutral-500 font-bold line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter mb-1">{fmtDate(p.createdAt)}</div>
                      <div className="w-10 h-10 rounded-2xl bg-neutral-50 border border-black/5 flex items-center justify-center group-hover:bg-sun-50 group-hover:text-sun-600 transition-all">
                        <LuArrowRight size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/[0.03] pt-4">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 py-1 px-3 bg-neutral-50 rounded-full text-[10px] font-black text-neutral-500 border border-black/[0.03]">
                        <LuCheck size={12} />
                        <span>{p._count.votes} Votos</span>
                      </div>
                      {p.multiChoice && (
                        <div className="py-1 px-3 bg-blue-50 rounded-full text-[10px] font-black text-blue-500 border border-blue-100/50">
                          Múltipla escolha
                        </div>
                      )}
                      {p.publicVotes && (
                        <div className="py-1 px-3 bg-sun-50 rounded-full text-[10px] font-black text-sun-600 border border-sun-100/50">
                          Voto Público
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      <CreatePollModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        city={activeCity}
        onCreated={fetchPolls}
      />
    </div>
  );
}
