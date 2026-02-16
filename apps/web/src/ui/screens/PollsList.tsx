import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Card from "../components/Card";
import CreatePollModal from "../components/CreatePollModal";

type Poll = {
  id: string;
  question: string;
  createdAt: string;
  multiChoice?: boolean;
  publicVotes?: boolean;
  options?: Array<{ id: string }>;
};

type ClubBook = {
  id: string;
  title: string;
  author: string;
  colorKey: string;
  isActive: boolean;
};

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "";
  }
}

export default function PollsList() {
  const { clubBookId } = useParams<{ clubBookId: string }>();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [book, setBook] = useState<ClubBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchBook = async () => {
    if (!clubBookId) return;
    try {
      const out = await api<{ clubBooks: ClubBook[] }>("/club-books");
      const b = (out?.clubBooks || []).find((x) => String(x.id) === String(clubBookId)) || null;
      setBook(b);
    } catch {
      setBook(null);
    }
  };

  const fetchPolls = async () => {
    if (!clubBookId) return;
    setLoading(true);
    try {
      const res = await api<{ polls: Poll[] }>(`/polls?clubBookId=${encodeURIComponent(clubBookId)}`);
      setPolls(Array.isArray(res?.polls) ? res.polls : []);
    } catch (e) {
      console.error(e);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchPolls();
  }, [clubBookId]);

  const subtitle = useMemo(() => {
    if (!book) return "";
    const active = book.isActive ? " (ativo)" : "";
    return `${book.author}${active}`;
  }, [book]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/enquetes" className="text-xs font-black text-neutral-600 hover:text-neutral-900 transition">
          {"<"} Livros
        </Link>
        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Enquetes</div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-2xl bg-neutral-900 px-4 py-2 text-xs font-black text-white shadow-lg shadow-neutral-500/20 hover:bg-neutral-800 transition"
          type="button"
        >
          Nova
        </button>
      </div>

      {book ? (
        <Card>
          <div className="p-6">
            <div className="text-lg font-black text-neutral-900 leading-tight">{book.title}</div>
            {subtitle ? <div className="mt-1 text-sm text-neutral-600">{subtitle}</div> : null}
            <div className="mt-4 text-xs text-neutral-500 font-semibold">Crie enquetes para este livro e veja os resultados depois de votar.</div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {loading ? <div className="text-sm text-neutral-500 p-4">Carregando enquetes...</div> : null}

        {!loading && polls.length === 0 ? (
          <Card>
            <div className="p-6 text-center text-neutral-500">Nenhuma enquete criada para este livro ainda.</div>
          </Card>
        ) : null}

        {polls.map((p) => (
          <Link key={p.id} to={`/enquetes/poll/${encodeURIComponent(p.id)}`}>
            <Card>
              <div className="p-4 hover:bg-black/[0.02] transition">
                <div className="font-black text-neutral-900 leading-snug">{p.question}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">{fmtDate(p.createdAt)}</span>
                  {p.multiChoice ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Multiplas</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Uma opcao</span>
                  )}
                  {p.publicVotes ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Voto publico</span>
                  ) : null}
                </div>
                <div className="mt-3 text-xs font-bold text-neutral-500">Toque para votar e ver o resultado</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {clubBookId ? (
        <CreatePollModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} clubBookId={clubBookId} onCreated={fetchPolls} />
      ) : null}
    </div>
  );
}
