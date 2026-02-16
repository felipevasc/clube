import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

type PollVoter = { id: string; name?: string };

type PollOption = {
  id: string;
  text: string;
  imageUrl?: string;
  votes?: number; // Only returned after the viewer votes
  userVoted?: boolean;
  voters?: PollVoter[]; // Only if publicVotes and after the viewer votes
};

type PollDetail = {
  id: string;
  clubBookId?: string;
  question: string;
  description?: string;
  imageUrl?: string;
  multiChoice: boolean;
  publicVotes: boolean;
  options: PollOption[];
  totalVotes?: number;
  userHasVoted: boolean;
};

const RESULT_COLORS = [
  "#FFBF0F",
  "#FF6B6B",
  "#4D96FF",
  "#34D399",
  "#A78BFA",
  "#FB7185",
  "#22C55E",
  "#F97316",
  "#06B6D4",
  "#64748B",
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pct(part: number, total: number) {
  if (!total) return 0;
  return clamp((part / total) * 100, 0, 100);
}

function DonutChart({ values, size = 160 }: { values: number[]; size?: number }) {
  const total = values.reduce((a, b) => a + b, 0);
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.08)" strokeWidth={stroke} fill="none" />
      {total > 0
        ? values.map((v, i) => {
            const frac = v / total;
            const dash = frac * c;
            const gap = c - dash;
            const offset = -acc * c;
            acc += frac;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={RESULT_COLORS[i % RESULT_COLORS.length]}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })
        : null}
      <circle cx={size / 2} cy={size / 2} r={r - stroke / 2 - 2} fill="white" />
      <text x="50%" y="48%" textAnchor="middle" className="fill-neutral-900" style={{ fontWeight: 900, fontSize: 22 }}>
        {total}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        className="fill-neutral-500"
        style={{ fontWeight: 800, fontSize: 10, letterSpacing: 1.5 }}
      >
        VOTOS
      </text>
    </svg>
  );
}

export default function PollDetail() {
  const { pollId } = useParams<{ pollId: string }>();
  const [poll, setPoll] = useState<PollDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showVoters, setShowVoters] = useState(false);

  const fetchPoll = async () => {
    if (!pollId) return;
    setLoading(true);
    try {
      const res = await api<{ poll: PollDetail }>(`/polls/${pollId}`);
      setPoll(res?.poll || null);
      if (res?.poll?.userHasVoted) {
        const votedIds = (res.poll.options || []).filter((o) => o.userVoted).map((o) => o.id);
        setSelectedOptions(votedIds);
      } else {
        setSelectedOptions([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const showResults = !!poll?.userHasVoted;

  const totalVotes = useMemo(() => {
    const n = Number(poll?.totalVotes || 0);
    return Number.isFinite(n) ? n : 0;
  }, [poll?.totalVotes]);

  const resultValues = useMemo(() => (poll?.options || []).map((o) => Number(o.votes || 0)), [poll?.options]);

  const canShowVoters = useMemo(() => {
    if (!poll || !showResults || !poll.publicVotes) return false;
    return (poll.options || []).some((o) => Array.isArray(o.voters) && o.voters.length > 0);
  }, [poll, showResults]);

  const handleToggleOption = (optionId: string) => {
    if (!poll) return;
    if (poll.userHasVoted) return;

    if (poll.multiChoice) {
      setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]));
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (!poll || !pollId) return;
    if (selectedOptions.length === 0) return;

    setVoting(true);
    try {
      await api(`/polls/${pollId}/vote`, {
        method: "POST",
        body: JSON.stringify({ optionIds: selectedOptions }),
      });
      await fetchPoll();
    } catch (e: any) {
      console.error(e);
      const raw = String(e?.message || "");
      const msg =
        raw === "already_voted"
          ? "Voce ja votou nesta enquete."
          : raw === "single_choice_requires_one_option"
            ? "Esta enquete permite apenas 1 opcao."
            : raw || "Erro ao votar. Tente novamente.";
      alert(msg);
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-neutral-500">Carregando...</div>;
  if (!poll) return <div className="p-4 text-sm text-neutral-500">Enquete nao encontrada.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to={poll.clubBookId ? `/enquetes/livro/${encodeURIComponent(poll.clubBookId)}` : "/enquetes"}
          className="text-xs font-black text-neutral-600 hover:text-neutral-900 transition"
        >
          {"<"} Voltar
        </Link>
        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Enquete</div>
        <div className="w-12" />
      </div>

      <Card>
        <div className="p-6">
          {poll.imageUrl ? (
            <div className="mb-4 rounded-3xl overflow-hidden border border-black/10 shadow-sm bg-neutral-100">
              <img src={poll.imageUrl} alt="" className="w-full h-44 object-cover" />
            </div>
          ) : null}

          <h1 className="text-xl font-black text-neutral-900 leading-tight">{poll.question}</h1>
          {poll.description ? <div className="mt-2 text-sm text-neutral-600">{poll.description}</div> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Voto unico</span>
            {poll.multiChoice ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Multiplas opcoes</span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Uma opcao</span>
            )}
            {poll.publicVotes ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Voto publico</span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Voto anonimo</span>
            )}
          </div>

          {!showResults ? (
            <div className="mt-4 text-xs text-neutral-500 font-semibold">
              {poll.multiChoice ? "Escolha 1 ou mais opcoes e confirme seu voto." : "Escolha 1 opcao e confirme seu voto."}
            </div>
          ) : null}
        </div>
      </Card>

      {showResults ? (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-black text-neutral-900">Resultado</div>
                <div className="text-xs text-neutral-500 font-semibold mt-1">
                  {totalVotes} voto{totalVotes === 1 ? "" : "s"}
                </div>
              </div>
              <DonutChart values={resultValues} />
            </div>

            {canShowVoters ? (
              <button
                onClick={() => setShowVoters((v) => !v)}
                className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left hover:bg-black/[0.02] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black text-neutral-800">Quem votou</div>
                  <div className="text-xs font-bold text-neutral-500">{showVoters ? "Ocultar" : "Mostrar"}</div>
                </div>
                <div className="mt-1 text-xs text-neutral-500">Visivel porque esta enquete foi criada como voto publico.</div>
              </button>
            ) : null}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {poll.options.map((opt, idx) => {
          const isSelected = selectedOptions.includes(opt.id);
          const percent = showResults ? pct(Number(opt.votes || 0), totalVotes) : 0;
          const showOptVoters = showVoters && Array.isArray(opt.voters) && opt.voters.length > 0;

          return (
            <div key={opt.id} className="space-y-2">
              <button
                disabled={showResults || voting}
                onClick={() => handleToggleOption(opt.id)}
                className={`relative w-full text-left rounded-3xl border transition overflow-hidden ${
                  isSelected ? "bg-sun-50 border-sun-500 ring-1 ring-sun-500" : "bg-white border-black/10 hover:border-black/20"
                }`}
              >
                {showResults ? (
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                    style={{
                      width: `${percent}%`,
                      background: `linear-gradient(90deg, ${RESULT_COLORS[idx % RESULT_COLORS.length]}66, ${
                        RESULT_COLORS[idx % RESULT_COLORS.length]
                      }18)`,
                    }}
                  />
                ) : null}

                <div className="relative p-4 flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border grid place-items-center shrink-0 ${isSelected ? "bg-sun-500 border-sun-600" : "bg-white border-black/15"}`}>
                    {isSelected ? <div className="w-2.5 h-2.5 rounded-full bg-white" /> : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-900">{opt.text}</div>
                    {showResults ? (
                      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600 font-bold tabular-nums">
                        <span>{Math.round(percent)}%</span>
                        <span className="text-neutral-300">•</span>
                        <span>
                          {Number(opt.votes || 0)} voto{Number(opt.votes || 0) === 1 ? "" : "s"}
                        </span>
                        {opt.userVoted ? (
                          <>
                            <span className="text-neutral-300">•</span>
                            <span className="text-sun-700">seu voto</span>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {showResults ? (
                    <div className="w-10 h-10 rounded-2xl border border-black/10 bg-white/70 grid place-items-center shrink-0" style={{ boxShadow: "0 8px 18px rgba(0,0,0,0.08)" }}>
                      <div className="text-xs font-black text-neutral-700">{Math.round(percent)}%</div>
                    </div>
                  ) : null}
                </div>
              </button>

              {showOptVoters ? (
                <Card>
                  <div className="p-4">
                    <div className="text-xs font-black uppercase tracking-widest text-neutral-500">Votaram</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(opt.voters || []).slice(0, 24).map((u) => (
                        <span key={u.id} className="px-3 py-1 rounded-full bg-neutral-100 border border-black/5 text-xs font-bold text-neutral-700">
                          {u.name || u.id}
                        </span>
                      ))}
                      {(opt.voters || []).length > 24 ? (
                        <span className="px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-bold text-neutral-500">
                          +{(opt.voters || []).length - 24}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
          );
        })}
      </div>

      {!showResults ? (
        <div className="pt-2">
          <PrimaryButton onClick={handleVote} disabled={voting || selectedOptions.length === 0}>
            {voting ? "Registrando..." : poll.multiChoice ? "Votar" : "Confirmar voto"}
          </PrimaryButton>
          <div className="mt-2 text-center text-xs text-neutral-500 font-semibold">Os resultados aparecem somente depois que voce votar.</div>
        </div>
      ) : null}
    </div>
  );
}
