import { Fragment, useMemo } from "react";
import Avatar from "./Avatar";

export type ChatMsg = { id: string; userId: string; text: string; createdAt: string };
export type ChatUser = { id: string; name: string; avatarUrl?: string };

function safeDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d : null;
}

function dayKey(iso: string): string {
  const d = safeDate(iso);
  if (!d) return "";
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtDayLabel(iso: string): string {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" });
}

function fmtTime(iso: string): string {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function bubbleFill(me: boolean, accent: string): string {
  // WhatsApp-like: outgoing is a soft green; incoming is near-white.
  // Using gradients prevents the UI from feeling "flat blocks" on top of the wallpaper.
  if (me) {
    return "linear-gradient(180deg, rgba(217, 253, 211, 0.98), rgba(200, 248, 202, 0.96))";
  }
  // Slightly tint with the accent so different rooms feel distinct without becoming "colorful bubbles".
  return `linear-gradient(180deg, rgba(255,255,255,0.98), ${accent}08)`;
}

export default function ChatBubbles({
  messages,
  usersById,
  viewerId,
  accentHex,
  className = "",
}: {
  messages: ChatMsg[];
  usersById: Record<string, ChatUser>;
  viewerId: string;
  accentHex?: string;
  className?: string;
}) {
  const rows = useMemo(() => (Array.isArray(messages) ? messages : []), [messages]);
  const accent = /^#[0-9a-fA-F]{6}$/.test(String(accentHex || "")) ? String(accentHex) : "#ffbf0f";

  let lastDay = "";

  return (
    <div className={className}>
      {rows.map((m, idx) => {
        const prev = idx > 0 ? rows[idx - 1] : null;
        const next = idx < rows.length - 1 ? rows[idx + 1] : null;

        const me = !!viewerId && String(m.userId) === String(viewerId);
        const dkey = dayKey(m.createdAt);
        const prevDay = prev ? dayKey(prev.createdAt) : "";
        const nextDay = next ? dayKey(next.createdAt) : "";

        const dayChanged = !!dkey && dkey !== lastDay;
        if (dayChanged) lastDay = dkey;

        const firstInGroup = !prev || prev.userId !== m.userId || prevDay !== dkey;
        const lastInGroup = !next || next.userId !== m.userId || nextDay !== dkey;

        const u = usersById[m.userId] || { id: m.userId, name: m.userId };

        // Use CSS vars so the bubble + tail can share the same background.
        const bubbleBg = bubbleFill(me, accent);

        const bubbleRadius = me
          ? `${firstInGroup ? "rounded-tr-2xl" : "rounded-tr-md"} ${lastInGroup ? "rounded-br-2xl" : "rounded-br-md"} rounded-tl-2xl rounded-bl-2xl`
          : `${firstInGroup ? "rounded-tl-2xl" : "rounded-tl-md"} ${lastInGroup ? "rounded-bl-2xl" : "rounded-bl-md"} rounded-tr-2xl rounded-br-2xl`;

        const tailCls = lastInGroup
          ? me
            ? "after:content-[''] after:absolute after:bottom-3 after:right-[-6px] after:w-3.5 after:h-3.5 after:bg-[var(--bubble-bg)] after:rotate-45 after:rounded-[3px] after:shadow-[0_2px_6px_rgba(0,0,0,0.08)] after:ring-1 after:ring-black/5"
            : "after:content-[''] after:absolute after:bottom-3 after:left-[-6px] after:w-3.5 after:h-3.5 after:bg-[var(--bubble-bg)] after:rotate-45 after:rounded-[3px] after:shadow-[0_2px_6px_rgba(0,0,0,0.08)] after:ring-1 after:ring-black/5"
          : "";

        return (
          <Fragment key={m.id}>
            {dayChanged ? (
              <div className="sticky top-0 z-[1] py-2 flex justify-center">
                <div className="px-3 py-1 rounded-full border border-black/10 bg-white/70 backdrop-blur text-[11px] font-black text-neutral-700">
                  {fmtDayLabel(m.createdAt)}
                </div>
              </div>
            ) : null}

            <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] ${me ? "" : ""}`}>
                <div className={`flex items-end gap-2 ${me ? "flex-row-reverse" : ""}`}>
                  {!me ? (
                    <div className="shrink-0 w-9">
                      {firstInGroup ? <Avatar user={u} size={34} className="shadow-sm border border-black/5" /> : <div className="w-[34px] h-[34px]" />}
                    </div>
                  ) : null}

                  <div
                    className={[
                      "relative px-3 py-1.5 pr-11 shadow-sm",
                      bubbleRadius,
                      "bg-[var(--bubble-bg)]",
                      "ring-1 ring-black/5",
                      tailCls,
                    ].join(" ")}
                    style={{ ["--bubble-bg" as any]: bubbleBg }}
                  >
                    {!me && firstInGroup ? (
                      <div className="text-[11px] font-black leading-none text-neutral-800">
                        {u.name}
                      </div>
                    ) : null}

                    <div
                      className={[
                        "text-[14px] leading-[1.35] whitespace-pre-wrap break-words text-neutral-900",
                        !me && firstInGroup ? "mt-1" : "",
                      ].join(" ")}
                    >
                      {m.text}
                    </div>

                    {lastInGroup ? (
                      <div className="absolute bottom-1.5 right-2.5 text-[10px] text-neutral-600 tabular-nums select-none">
                        {fmtTime(m.createdAt)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
