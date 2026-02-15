import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api, apiMaybe } from "../../lib/api";

type Group = { id: string; name: string; description?: string | null };
type Invite = { id: string; groupId: string; createdAt: string };
type InviteOut = { invite: Invite; group: Group };

type Member = { id: string; groupId: string; userId: string; role: string };
type JoinRequest = { id: string; groupId: string; userId: string; status: string };
type MeState = { membership: Member | null; pendingRequest: JoinRequest | null; isOwner: boolean };

export default function InviteScreen() {
  const { token } = useParams();
  const inviteId = String(token || "");
  const nav = useNavigate();
  const loc = useLocation();
  const [sessionUserId, setSessionUserId] = useState("");

  const [out, setOut] = useState<InviteOut | null>(null);
  const [me, setMe] = useState<MeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setOut(null);
      setMe(null);
      setActionMsg("");
      setDeclined(false);
      setSessionUserId("");

      if (!inviteId) {
        setError("Link de convite inválido.");
        setLoading(false);
        return;
      }

      try {
        const inviteOut = await api<InviteOut>(`/invites/${encodeURIComponent(inviteId)}`);
        if (!alive) return;
        setOut(inviteOut);

        const session = await apiMaybe<{ user: { id: string } }>("/me");
        if (!alive) return;
        const uid = String(session?.user?.id || "");
        setSessionUserId(uid);
        if (!uid) {
          setMe(null);
        } else {
          try {
            const meOut = await api<MeState>(`/groups/${encodeURIComponent(inviteOut.group.id)}/me`);
            if (!alive) return;
            setMe(meOut || null);
          } catch {
            if (!alive) return;
            setMe(null);
          }
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Não foi possível abrir este convite.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [inviteId]);

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
                <div className="text-xl font-black tracking-tight">Convite</div>
                <div className="text-sm text-neutral-600">Você foi convidado para um clube privado.</div>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 space-y-2">
                <div className="text-lg font-black">Carregando convite...</div>
                <div className="text-sm text-neutral-600">Buscando informações do grupo.</div>
              </div>
            ) : error ? (
              <div className="mt-6 space-y-2">
                <div className="text-lg font-black">Convite indisponível</div>
                <div className="text-sm text-red-600">{error}</div>
                <div className="text-sm text-neutral-600">Peça um novo link para quem te convidou.</div>
              </div>
            ) : declined ? (
              <div className="mt-6 space-y-3">
                <div className="text-lg font-black">Convite recusado</div>
                <div className="text-sm text-neutral-600">Se mudar de ideia, você pode pedir um novo convite depois.</div>
                <PrimaryButton onClick={() => nav("/groups", { replace: true })}>Voltar para grupos</PrimaryButton>
              </div>
            ) : !out?.group ? (
              <div className="mt-6 space-y-2">
                <div className="text-lg font-black">Grupo não encontrado</div>
                <div className="text-sm text-neutral-600">Este convite pode ter expirado.</div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                  <div className="text-xs font-bold text-neutral-600">Grupo</div>
                  <div className="mt-1 text-lg font-black leading-tight">{out.group.name}</div>
                  {String(out.group.description || "").trim() ? (
                    <div className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      {String(out.group.description || "").trim()}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2">
                  {!sessionUserId ? (
                    <PrimaryButton
                      onClick={() => {
                        nav("/login", { replace: true, state: { from: loc.pathname } });
                      }}
                    >
                      Entrar para aceitar
                    </PrimaryButton>
                  ) : me?.membership ? (
                    <PrimaryButton onClick={() => nav(`/groups/${encodeURIComponent(out.group.id)}`, { replace: true })}>
                      Abrir grupo
                    </PrimaryButton>
                  ) : (
                    <>
                      <PrimaryButton
                        disabled={actionLoading}
                        onClick={async () => {
                          if (actionLoading) return;
                          setActionLoading(true);
                          setActionMsg("");
                          try {
                            const resp = await api<any>(`/invites/${encodeURIComponent(inviteId)}/accept`, {
                              method: "POST",
                            });
                            const status = String(resp?.status || "");
                            if (status === "joined" || status === "already_member") {
                              nav(`/groups/${encodeURIComponent(out.group.id)}`, { replace: true });
                              return;
                            }
                            setActionMsg("Convite aceito.");
                            nav(`/groups/${encodeURIComponent(out.group.id)}`, { replace: true });
                          } catch (e: any) {
                            setActionMsg(e?.message || "Não foi possível aceitar o convite.");
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                      >
                        {actionLoading ? "Aceitando..." : "Aceitar convite"}
                      </PrimaryButton>
                      <button
                        disabled={actionLoading}
                        onClick={async () => {
                          if (actionLoading) return;
                          const ok = confirm("Recusar este convite?");
                          if (!ok) return;
                          setActionLoading(true);
                          setActionMsg("");
                          try {
                            await api<any>(`/invites/${encodeURIComponent(inviteId)}/decline`, { method: "POST" });
                            setDeclined(true);
                          } catch (e: any) {
                            setActionMsg(e?.message || "Não foi possível recusar o convite.");
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                        className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-white border border-black/10 hover:bg-sun-50 transition"
                      >
                        Recusar
                      </button>
                    </>
                  )}

                  {me?.pendingRequest ? (
                    <div className="text-sm text-neutral-700">
                      Você já tem um pedido pendente neste grupo. Se aceitar o convite, você entra imediatamente.
                    </div>
                  ) : null}

                  {actionMsg ? <div className="text-sm text-neutral-700">{actionMsg}</div> : null}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
