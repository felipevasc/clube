import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../../lib/api";

type Group = { id: string; name: string; description?: string | null; ownerId: string };
type Member = { id: string; groupId: string; userId: string; role: string };
type JoinRequest = { id: string; groupId: string; userId: string; status: string };
type User = { id: string; name: string; avatarUrl: string };
type MeState = { membership: Member | null; pendingRequest: JoinRequest | null; isOwner: boolean };
type Book = { id: string; title: string; author: string };
type BookOfMonth = { id: string; groupId: string; bookId: string; setByUserId: string; setAt: string };
type BookOfMonthOut = { current: BookOfMonth | null; history: BookOfMonth[] };

function initialLetter(s: string) {
  const t = (s || "?").trim();
  return (t ? t.slice(0, 1) : "?").toUpperCase();
}

function roleLabel(role: string) {
  switch (String(role || "").toLowerCase()) {
    case "owner":
      return "Owner";
    case "mod":
      return "Moderador";
    case "member":
      return "Membro";
    default:
      return role || "Membro";
  }
}

export default function GroupDetail() {
  const { id } = useParams();
  const groupId = String(id || "");

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [me, setMe] = useState<MeState | null>(null);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User | null>>({});
  const [bookOfMonth, setBookOfMonth] = useState<BookOfMonthOut | null>(null);
  const [booksById, setBooksById] = useState<Record<string, Book | null>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [bomOpen, setBomOpen] = useState(false);
  const [bomQ, setBomQ] = useState("");
  const [bomResults, setBomResults] = useState<Book[]>([]);
  const [bomLoading, setBomLoading] = useState(false);
  const [bomMsg, setBomMsg] = useState("");
  const [bomCreateTitle, setBomCreateTitle] = useState("");
  const [bomCreateAuthor, setBomCreateAuthor] = useState("");
  const [bomCreateLoading, setBomCreateLoading] = useState(false);
  const [bomCreateMsg, setBomCreateMsg] = useState("");

  const desc = useMemo(() => (group?.description || "").trim(), [group?.description]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setGroup(null);
      setMembers([]);
      setMe(null);
      setRequests([]);
      setUsersById({});
      setActionMsg("");
      setBookOfMonth(null);
      setBooksById({});
      setBomOpen(false);
      setBomQ("");
      setBomResults([]);
      setBomLoading(false);
      setBomMsg("");
      setBomCreateTitle("");
      setBomCreateAuthor("");
      setBomCreateLoading(false);
      setBomCreateMsg("");

      if (!groupId) {
        setError("Link inválido.");
        setLoading(false);
        return;
      }

      try {
        const [gOut, mOut, meOut, bomOut] = await Promise.all([
          api<{ group: Group }>(`/groups/${encodeURIComponent(groupId)}`),
          api<{ members: Member[] }>(`/groups/${encodeURIComponent(groupId)}/members`),
          api<MeState>(`/groups/${encodeURIComponent(groupId)}/me`),
          api<BookOfMonthOut>(`/groups/${encodeURIComponent(groupId)}/book-of-month`),
        ]);
        if (!alive) return;
        setGroup(gOut.group || null);
        const memberRows: Member[] = mOut.members || [];
        setMembers(memberRows);
        setMe(meOut || null);
        setBookOfMonth(bomOut || null);

        const isOwner = !!meOut?.isOwner;
        const reqOut = isOwner
          ? await api<{ requests: JoinRequest[] }>(`/groups/${encodeURIComponent(groupId)}/requests`)
          : { requests: [] as JoinRequest[] };
        if (!alive) return;
        const requestRows: JoinRequest[] = reqOut.requests || [];
        setRequests(requestRows);

        const ids = Array.from(new Set([...memberRows.map((m: Member) => m.userId), ...requestRows.map((r: JoinRequest) => r.userId)])).filter(Boolean);

        const entries = await Promise.all(
          ids.map(async (uid: string) => {
            try {
              const out = await api<{ user: User }>(`/users/${encodeURIComponent(uid)}`);
              return [uid, out.user] as const;
            } catch {
              return [uid, null] as const;
            }
          })
        );
        if (!alive) return;
        setUsersById(Object.fromEntries(entries));

        const bookIds = Array.from(
          new Set([...(bomOut?.history || []).slice(0, 12).map((h) => h.bookId)].filter(Boolean))
        );
        const bookEntries = await Promise.all(
          bookIds.map(async (bid) => {
            try {
              const out = await api<{ book: Book }>(`/books/${encodeURIComponent(bid)}`);
              return [bid, out.book] as const;
            } catch {
              return [bid, null] as const;
            }
          })
        );
        if (!alive) return;
        setBooksById(Object.fromEntries(bookEntries));
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Não foi possível carregar o grupo.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [groupId]);

  const refresh = async () => {
    // Re-run the effect by emulating a "soft" refresh.
    // (Keeping this local avoids lifting state into a custom hook right now.)
    setLoading(true);
    setError("");
    try {
      const [gOut, mOut, meOut, bomOut] = await Promise.all([
        api<{ group: Group }>(`/groups/${encodeURIComponent(groupId)}`),
        api<{ members: Member[] }>(`/groups/${encodeURIComponent(groupId)}/members`),
        api<MeState>(`/groups/${encodeURIComponent(groupId)}/me`),
        api<BookOfMonthOut>(`/groups/${encodeURIComponent(groupId)}/book-of-month`),
      ]);
      setGroup(gOut.group || null);
      const memberRows: Member[] = mOut.members || [];
      setMembers(memberRows);
      setMe(meOut || null);
      setBookOfMonth(bomOut || null);

      const isOwner = !!meOut?.isOwner;
      const reqOut = isOwner
        ? await api<{ requests: JoinRequest[] }>(`/groups/${encodeURIComponent(groupId)}/requests`)
        : { requests: [] as JoinRequest[] };
      const requestRows: JoinRequest[] = reqOut.requests || [];
      setRequests(requestRows);

      const ids = Array.from(new Set([...memberRows.map((m: Member) => m.userId), ...requestRows.map((r: JoinRequest) => r.userId)])).filter(Boolean);
      const entries = await Promise.all(
        ids.map(async (uid: string) => {
          try {
            const out = await api<{ user: User }>(`/users/${encodeURIComponent(uid)}`);
            return [uid, out.user] as const;
          } catch {
            return [uid, null] as const;
          }
        })
      );
      setUsersById(Object.fromEntries(entries));

      const bookIds = Array.from(
        new Set([...(bomOut?.history || []).slice(0, 12).map((h) => h.bookId)].filter(Boolean))
      );
      const bookEntries = await Promise.all(
        bookIds.map(async (bid) => {
          try {
            const out = await api<{ book: Book }>(`/books/${encodeURIComponent(bid)}`);
            return [bid, out.book] as const;
          } catch {
            return [bid, null] as const;
          }
        })
      );
      setBooksById(Object.fromEntries(bookEntries));
    } catch (e: any) {
      setError(e?.message || "Não foi possível atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const shareInviteLink = async () => {
    if (!group) return;
    setActionMsg("");
    try {
      const out = await api<{ inviteId: string }>(`/groups/${encodeURIComponent(group.id)}/invite`, { method: "POST" });
      const link = `${location.origin}/invite/${out.inviteId}`;
      try {
        await navigator.clipboard.writeText(link);
        setActionMsg("Link de convite copiado.");
      } catch {
        // Fallback for older browsers.
        prompt("Copie o link do convite:", link);
      }
    } catch (e: any) {
      setActionMsg(e?.message || "Não foi possível gerar o link de convite.");
    }
  };

  const rotateInviteLink = async () => {
    if (!group) return;
    setActionMsg("");
    const ok = confirm("Trocar o link de convite? O link anterior vai parar de funcionar.");
    if (!ok) return;
    try {
      const out = await api<{ inviteId: string }>(`/groups/${encodeURIComponent(group.id)}/invite/rotate`, {
        method: "POST",
      });
      const link = `${location.origin}/invite/${out.inviteId}`;
      try {
        await navigator.clipboard.writeText(link);
        setActionMsg("Novo link copiado. O anterior foi desativado.");
      } catch {
        prompt("Copie o novo link do convite:", link);
        setActionMsg("Link trocado.");
      }
    } catch (e: any) {
      setActionMsg(e?.message || "Não foi possível trocar o link de convite.");
    }
  };

  const searchBomBooks = async () => {
    setBomMsg("");
    setBomLoading(true);
    try {
      const q = bomQ.trim();
      const out = await api<{ books: Book[] }>(`/books${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setBomResults(out.books || []);
    } catch (e: any) {
      setBomMsg(e?.message || "Não foi possível buscar livros.");
      setBomResults([]);
    } finally {
      setBomLoading(false);
    }
  };

  const createAndChooseBomBook = async () => {
    if (!groupId) return;
    const title = bomCreateTitle.trim();
    const author = bomCreateAuthor.trim();
    if (!title || !author) {
      setBomCreateMsg("Informe título e autor.");
      return;
    }
    setBomCreateLoading(true);
    setBomCreateMsg("");
    setBomMsg("");
    try {
      const out = await api<{ book: Book }>("/books", { method: "POST", body: JSON.stringify({ title, author }) });
      const b = out?.book;
      if (!b?.id) throw new Error("Resposta inválida do servidor.");
      setBomResults((prev) => [b, ...(prev || []).filter((x) => x.id !== b.id)]);
      await api(`/groups/${encodeURIComponent(groupId)}/book-of-month`, { method: "POST", body: JSON.stringify({ bookId: b.id }) });
      setBomOpen(false);
      setBomCreateTitle("");
      setBomCreateAuthor("");
      await refresh();
    } catch (e: any) {
      const msg = e?.message || "Não foi possível cadastrar/selecionar o livro.";
      setBomCreateMsg(msg);
      setBomMsg(msg);
    } finally {
      setBomCreateLoading(false);
    }
  };

  const requestJoin = async () => {
    if (!group) return;
    if (actionLoading) return;
    setActionLoading(true);
    setActionMsg("");
    try {
      const out = await api<any>(`/groups/${encodeURIComponent(group.id)}/join`, { method: "POST" });
      if (out?.status === "already_member") setActionMsg("Você já faz parte do grupo.");
      else if (out?.status === "already_requested") setActionMsg("Seu pedido já está pendente.");
      else setActionMsg("Pedido enviado.");
      await refresh();
    } catch (e: any) {
      setActionMsg(e?.message || "Não foi possível enviar o pedido.");
    } finally {
      setActionLoading(false);
    }
  };

  const leaveGroup = async () => {
    if (!group) return;
    if (actionLoading) return;
    setActionMsg("");
    const ok = confirm("Sair do grupo? Você poderá pedir para entrar novamente.");
    if (!ok) return;

    setActionLoading(true);
    try {
      const out = await api<any>(`/groups/${encodeURIComponent(group.id)}/leave`, { method: "POST" });
      if (out?.status === "left") setActionMsg("Você saiu do grupo.");
      else if (out?.status === "not_member") setActionMsg("Você não é membro deste grupo.");
      else setActionMsg("Ação concluída.");
      await refresh();
    } catch (e: any) {
      setActionMsg(e?.message || "Não foi possível sair do grupo.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <NavLink
          to="/groups"
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/70 border border-black/10 hover:bg-white transition"
        >
          Voltar
        </NavLink>
      </div>

      <Card>
        <div className="p-4">
          <div className="text-sm font-black">Grupo</div>

          {loading ? (
            <div className="mt-3 space-y-2">
              <div className="text-lg font-black">Carregando...</div>
              <div className="text-sm text-neutral-600">Buscando dados do grupo e membros.</div>
            </div>
          ) : error ? (
            <div className="mt-3 space-y-2">
              <div className="text-lg font-black">Não foi possível abrir este grupo</div>
              <div className="text-sm text-red-600">{error}</div>
              <div className="text-sm text-neutral-600">
                Verifique se o link está correto ou tente novamente.
              </div>
            </div>
          ) : !group ? (
            <div className="mt-3 space-y-2">
              <div className="text-lg font-black">Grupo não encontrado</div>
              <div className="text-sm text-neutral-600">Este grupo pode ter sido removido.</div>
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sun-500 shadow-card grid place-items-center font-black text-lg">
                  {initialLetter(group.name)}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-black leading-tight">{group.name}</div>
                  {me?.membership ? (
                    <div className="text-xs text-neutral-600 mt-1">{roleLabel(me.membership.role)}</div>
                  ) : me?.pendingRequest ? (
                    <div className="text-xs text-neutral-600 mt-1">Pedido pendente</div>
                  ) : (
                    <div className="text-xs text-neutral-600 mt-1">Você ainda não faz parte</div>
                  )}
                </div>
              </div>

              {desc ? (
                <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                  <div className="text-xs font-bold text-neutral-600">Descrição</div>
                  <div className="mt-1 text-sm text-neutral-800 leading-relaxed">{desc}</div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-neutral-600">Sem descrição.</div>
              )}

              <div className="mt-4 grid gap-2">
                {me?.membership ? (
                  <button
                    onClick={leaveGroup}
                    disabled={actionLoading || me.membership.role === "owner"}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition disabled:opacity-60 disabled:hover:bg-white"
                  >
                    {me.membership.role === "owner" ? "Owner não pode sair" : actionLoading ? "Saindo..." : "Sair do grupo"}
                  </button>
                ) : me?.pendingRequest ? (
                  <button
                    disabled
                    className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white/70 border border-black/10 opacity-70"
                  >
                    Pedido pendente
                  </button>
                ) : (
                  <PrimaryButton disabled={actionLoading} onClick={requestJoin}>
                    {actionLoading ? "Enviando..." : "Pedir para entrar"}
                  </PrimaryButton>
                )}

	                {me?.isOwner ? (
	                  <>
	                    <button
	                      onClick={shareInviteLink}
	                      className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition"
	                    >
	                      Convidar (copiar link)
	                    </button>
	                    <button
	                      onClick={rotateInviteLink}
	                      className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition"
	                    >
	                      Rotacionar link
	                    </button>
	                  </>
	                ) : null}

                {actionMsg ? <div className="text-sm text-neutral-700">{actionMsg}</div> : null}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-black flex-1">Livro do mês</div>
            {!loading && !error && group && me?.isOwner ? (
              <button
                onClick={() => {
                  setBomMsg("");
                  setBomCreateMsg("");
                  setBomCreateTitle("");
                  setBomCreateAuthor("");
                  setBomOpen((v) => !v);
                  if (!bomOpen) {
                    setBomQ("");
                    setBomResults([]);
                  }
                }}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/70 border border-black/10 hover:bg-white transition"
              >
                {bomOpen ? "Fechar" : bookOfMonth?.current ? "Trocar" : "Definir"}
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-3 text-sm text-neutral-600">Carregando...</div>
          ) : error ? (
            <div className="mt-3 text-sm text-neutral-600">Livro do mês indisponível por enquanto.</div>
          ) : !group ? null : !bookOfMonth?.current ? (
            <div className="mt-3 text-sm text-neutral-600">Nenhum livro definido ainda.</div>
          ) : (
            <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
              <div className="text-xs font-bold text-neutral-600">Atual</div>
              {booksById[bookOfMonth.current.bookId] ? (
                <NavLink to={`/books/${encodeURIComponent(bookOfMonth.current.bookId)}`} className="block mt-1">
                  <div className="text-lg font-black leading-tight">
                    {booksById[bookOfMonth.current.bookId]?.title}
                  </div>
                  <div className="text-sm text-neutral-600">{booksById[bookOfMonth.current.bookId]?.author}</div>
                </NavLink>
              ) : (
                <div className="mt-1">
                  <div className="text-lg font-black leading-tight">Livro indisponível</div>
                  <div className="text-xs text-neutral-600">ID: {bookOfMonth.current.bookId}</div>
                </div>
              )}
              <div className="mt-2 text-xs text-neutral-500">
                Definido em {new Date(bookOfMonth.current.setAt).toLocaleString()}
              </div>
            </div>
          )}

          {bomOpen && group && me?.isOwner ? (
            <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-3">
              <div className="text-xs font-semibold text-neutral-600">Escolher livro</div>
              <div className="mt-2 flex gap-2">
                <input
                  value={bomQ}
                  onChange={(e) => setBomQ(e.target.value)}
                  className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                  placeholder="Buscar por título ou autor"
                />
                <button
                  onClick={searchBomBooks}
                  disabled={bomLoading}
                  className="rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition disabled:opacity-60"
                >
                  {bomLoading ? "Buscando..." : "Buscar"}
                </button>
              </div>

              {bomMsg ? <div className="mt-2 text-sm text-red-600">{bomMsg}</div> : null}

              <div className="mt-3 grid gap-2">
                {bomResults.slice(0, 8).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black truncate">{b.title}</div>
                      <div className="text-xs text-neutral-600 truncate">{b.author}</div>
                    </div>
                    <button
                      onClick={async () => {
                        const ok = confirm(`Definir "${b.title}" como livro do mês?`);
                        if (!ok) return;
                        setBomMsg("");
                        try {
                          await api(`/groups/${encodeURIComponent(groupId)}/book-of-month`, {
                            method: "POST",
                            body: JSON.stringify({ bookId: b.id }),
                          });
                          setBomOpen(false);
                          await refresh();
                        } catch (e: any) {
                          setBomMsg(e?.message || "Não foi possível definir o livro do mês.");
                        }
                      }}
                      className="text-xs font-black px-3 py-2 rounded-xl bg-sun-500 hover:bg-sun-400 transition"
                    >
                      Escolher
                    </button>
                  </div>
                ))}
                {!bomLoading && bomResults.length === 0 ? (
                  <div className="text-sm text-neutral-600">Nenhum livro encontrado.</div>
                ) : null}
              </div>

              <div className="mt-4 pt-3 border-t border-black/5">
                <div className="text-xs font-semibold text-neutral-600">Cadastrar novo livro</div>
                <div className="mt-2 grid gap-2">
                  <input
                    value={bomCreateTitle}
                    onChange={(e) => setBomCreateTitle(e.target.value)}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                    placeholder="Título"
                  />
                  <input
                    value={bomCreateAuthor}
                    onChange={(e) => setBomCreateAuthor(e.target.value)}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-sun-200"
                    placeholder="Autor"
                  />
                  {bomCreateMsg ? <div className="text-sm text-red-600">{bomCreateMsg}</div> : null}
                  <button
                    onClick={createAndChooseBomBook}
                    disabled={bomCreateLoading}
                    className="rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition disabled:opacity-60"
                  >
                    {bomCreateLoading ? "Criando..." : "Criar e escolher"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {!loading && !error && bookOfMonth?.history?.length ? (
            <div className="mt-4">
              <div className="text-xs font-bold text-neutral-600">Histórico</div>
              <div className="mt-2 grid gap-2">
                {bookOfMonth.history.slice(1, 8).map((h) => {
                  const b = booksById[h.bookId];
                  return (
                    <div key={h.id} className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
                      {b ? (
                        <NavLink to={`/books/${encodeURIComponent(h.bookId)}`} className="block">
                          <div className="text-sm font-black">{b.title}</div>
                          <div className="text-xs text-neutral-600">{b.author}</div>
                        </NavLink>
                      ) : (
                        <div>
                          <div className="text-sm font-black">Livro indisponível</div>
                          <div className="text-xs text-neutral-600">ID: {h.bookId}</div>
                        </div>
                      )}
                      <div className="mt-1 text-xs text-neutral-500">{new Date(h.setAt).toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {!loading && !error && group && me?.isOwner ? (
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-black flex-1">Pedidos para entrar</div>
              <div className="text-xs text-neutral-500">{requests.length}</div>
            </div>

            {requests.length === 0 ? (
              <div className="mt-3 text-sm text-neutral-600">Nenhum pedido pendente.</div>
            ) : (
              <div className="mt-3 grid gap-2">
                {requests.map((r) => {
                  const u = usersById[r.userId];
                  const displayName = (u?.name || r.userId || "?").trim();
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-2"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-sun-100 border border-black/5 grid place-items-center font-black overflow-hidden">
                        {u?.avatarUrl ? (
                          <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          initialLetter(displayName)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black truncate">{displayName}</div>
                        <div className="text-xs text-neutral-500 truncate">{r.userId}</div>
                      </div>
                      <button
                        onClick={async () => {
                          await api(`/groups/${encodeURIComponent(group.id)}/requests/${encodeURIComponent(r.id)}/approve`, {
                            method: "POST",
                          });
                          await refresh();
                        }}
                        className="text-xs font-black px-3 py-2 rounded-xl bg-sun-500 hover:bg-sun-400 transition"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={async () => {
                          await api(`/groups/${encodeURIComponent(group.id)}/requests/${encodeURIComponent(r.id)}/reject`, {
                            method: "POST",
                          });
                          await refresh();
                        }}
                        className="text-xs font-black px-3 py-2 rounded-xl bg-white border border-black/10 hover:bg-white transition"
                      >
                        Rejeitar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-black flex-1">Membros</div>
            {!loading && !error ? (
              <div className="text-xs text-neutral-500">{members.length}</div>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-3 text-sm text-neutral-600">Carregando membros...</div>
          ) : error ? (
            <div className="mt-3 text-sm text-neutral-600">Membros indisponíveis por enquanto.</div>
          ) : members.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-600">
              Nenhum membro listado. Se você acabou de criar o grupo, tente recarregar.
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              {members.map((m) => {
                const u = usersById[m.userId];
                const displayName = (u?.name || m.userId || "?").trim();
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-sun-100 border border-black/5 grid place-items-center font-black overflow-hidden">
                      {u?.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        initialLetter(displayName)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black truncate">{displayName}</div>
                      <div className="text-xs text-neutral-500 truncate">
                        {roleLabel(m.role)}
                        {u?.id && u.id !== displayName ? ` • ${u.id}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
