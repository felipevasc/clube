import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

import { LuBookOpen } from "react-icons/lu";
import BookReader, { type RelatedData } from "../components/BookReader";

type PollVoter = { id: string; name?: string };

type PollOption = {
  id: string;
  type?: "TEXT" | "BOOK";
  text: string;
  imageUrl?: string;
  bookId?: string;
  book?: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    synopsis?: string;
    indicationComment?: string;
    createdAt?: string;
    createdByUser?: { id: string; name: string; avatarUrl?: string };
  };
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
  const navigate = useNavigate();
  const { pollId } = useParams<{ pollId: string }>();
  const [poll, setPoll] = useState<PollDetail & { city?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showVoters, setShowVoters] = useState(false);
  const [canUserVote, setCanUserVote] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; isAdmin: boolean; cities: string[] } | null>(null);
  const [viewingBook, setViewingBook] = useState<{ book: NonNullable<PollOption['book']>; initialRect: DOMRect | null } | null>(null);
  const [bookRelatedData, setBookRelatedData] = useState<RelatedData | null>(null);

  const fetchPoll = async () => {
    if (!pollId) return;
    setLoading(true);
    try {
      const [res, meRes] = await Promise.all([
        api<{ poll: PollDetail & { city?: string } }>(`/polls/${pollId}`),
        api<{ user: { id: string; isAdmin: boolean; cities: string[] } }>("/me").catch(() => ({ user: { id: "", isAdmin: false, cities: [] as string[] } }))
      ]);

      setPoll(res?.poll || null);
      setCurrentUser(meRes.user);

      if (res?.poll?.city && meRes.user.cities) {
        setCanUserVote(meRes.user.cities.includes(res.poll.city));
      }

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
    if (poll.userHasVoted || !canUserVote) return;

    if (poll.multiChoice) {
      setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]));
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (!poll || !pollId) return;
    if (selectedOptions.length === 0) return;
    if (!canUserVote) return;

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

  if (loading) return <div className="p-4 text-sm text-neutral-500 font-bold animate-pulse">Carregando...</div>;
  if (!poll) return <div className="p-4 text-sm text-neutral-500 font-bold">Enquete nao encontrada.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/enquetes"
          className="text-xs font-black text-neutral-600 hover:text-neutral-900 transition flex items-center gap-1"
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
              <div
                role="button"
                tabIndex={0}
                onClick={
                  showResults || voting
                    ? undefined
                    : () => handleToggleOption(opt.id)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (!showResults && !voting) handleToggleOption(opt.id);
                  }
                }}
                className={`group relative w-full text-left rounded-3xl border transition overflow-hidden cursor-pointer outline-none focus-within:ring-2 focus-within:ring-sun-500/50 ${isSelected ? "bg-sun-50 border-sun-500 ring-1 ring-sun-500" : "bg-white border-black/10 hover:border-black/20"
                  } ${showResults || voting ? 'cursor-default' : ''}`}
              >
                {showResults ? (
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                    style={{
                      width: `${percent}%`,
                      background: `linear-gradient(90deg, ${RESULT_COLORS[idx % RESULT_COLORS.length]}66, ${RESULT_COLORS[idx % RESULT_COLORS.length]
                        }18)`,
                    }}
                  />
                ) : null}

                <div className="relative p-4 flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full border-2 grid place-items-center shrink-0 transition-all ${isSelected ? "bg-sun-500 border-sun-600 scale-110 shadow-lg shadow-sun-500/20" : "bg-white border-black/15 group-hover:border-black/30"}`}>
                    {isSelected ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50 duration-200" /> : null}
                  </div>

                  {opt.type === "BOOK" && opt.book ? (
                    <div className="flex-1 flex items-center gap-4 min-w-0">
                      <div className="w-12 h-16 rounded-lg bg-neutral-100 overflow-hidden border border-black/5 shrink-0 shadow-sm">
                        {opt.book.coverUrl ? (
                          <img src={opt.book.coverUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-sun-100 text-sun-600 font-bold">
                            {opt.book.title[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-neutral-900 leading-tight truncate">{opt.book.title}</div>
                        <div className="text-xs text-neutral-500 font-bold truncate mt-0.5">{opt.book.author}</div>
                        {showResults && (
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-600 font-black tabular-nums uppercase tracking-tighter">
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{Math.round(percent)}%</span>
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded">
                              {Number(opt.votes || 0)} voto{Number(opt.votes || 0) === 1 ? "" : "s"}
                            </span>
                            {opt.userVoted && (
                              <span className="text-sun-600 bg-sun-50 px-1.5 py-0.5 rounded border border-sun-100">seu voto</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (opt.book) {
                            const rect = e.currentTarget.parentElement?.firstElementChild?.getBoundingClientRect();
                            setViewingBook({ book: opt.book, initialRect: rect || null });
                            api<RelatedData>(`/books/${opt.book.id}/related`).then(setBookRelatedData).catch(() => { });
                          }
                        }}
                        className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-neutral-400 hover:text-sun-600 hover:bg-sun-50 hover:border-sun-100 transition-all shadow-sm shrink-0"
                        title="Ver livro em tela cheia"
                      >
                        <LuBookOpen size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        {opt.imageUrl && (
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden border border-black/5 shrink-0 shadow-sm">
                            <img src={opt.imageUrl} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-black text-neutral-900 leading-tight ${opt.imageUrl ? 'text-sm' : 'text-base'}`}>{opt.text}</div>
                          {showResults && (
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-600 font-black tabular-nums uppercase tracking-tighter text-left">
                              <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{Math.round(percent)}%</span>
                              <span className="bg-neutral-100 px-1.5 py-0.5 rounded">
                                {Number(opt.votes || 0)} voto{Number(opt.votes || 0) === 1 ? "" : "s"}
                              </span>
                              {opt.userVoted && (
                                <span className="text-sun-600 bg-sun-50 px-1.5 py-0.5 rounded border border-sun-100">seu voto</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {showResults && !opt.imageUrl && opt.type !== "BOOK" ? (
                    <div className="w-11 h-11 rounded-2xl border border-black/5 bg-white/70 grid place-items-center shrink-0 shadow-sm">
                      <div className="text-[10px] font-black text-neutral-800">{Math.round(percent)}%</div>
                    </div>
                  ) : null}
                </div>
              </div>

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
      <BookReader
        book={viewingBook?.book || null}
        initialRect={viewingBook?.initialRect || null}
        onClose={() => { setViewingBook(null); setBookRelatedData(null); }}
        relatedData={bookRelatedData}
      />
    </div>
  );
}
