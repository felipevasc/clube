import { Fragment, useMemo } from "react";
import Avatar from "./Avatar";

export type ChatMsg = { id: string; userId: string; text: string; createdAt: string };
export type ChatUser = { id: string; name: string; avatarUrl?: string };

const USER_THEMES = [
  { text: "text-red-600", bg: "#fef2f2" },
  { text: "text-orange-600", bg: "#fff7ed" },
  { text: "text-amber-600", bg: "#fffbeb" },
  { text: "text-yellow-600", bg: "#fefce8" },
  { text: "text-lime-600", bg: "#f7fee7" },
  { text: "text-green-600", bg: "#f0fdf4" },
  { text: "text-emerald-600", bg: "#ecfdf5" },
  { text: "text-teal-600", bg: "#f0fdfa" },
  { text: "text-cyan-600", bg: "#ecfeff" },
  { text: "text-sky-600", bg: "#f0f9ff" },
  { text: "text-blue-600", bg: "#eff6ff" },
  { text: "text-indigo-600", bg: "#eef2ff" },
  { text: "text-violet-600", bg: "#f5f3ff" },
  { text: "text-purple-600", bg: "#faf5ff" },
  { text: "text-fuchsia-600", bg: "#fdf4ff" },
  { text: "text-pink-600", bg: "#fdf2f8" },
  { text: "text-rose-600", bg: "#fff1f2" },
  { text: "text-slate-600", bg: "#f8fafc" },
];

function getUserTheme(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_THEMES.length;
  return USER_THEMES[index];
}

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
  if (me) {
    return "linear-gradient(180deg, rgba(217, 253, 211, 0.98), rgba(200, 248, 202, 0.96))";
  }
  return `linear-gradient(180deg, rgba(255,255,255,0.98), ${accent}08)`;
}

export default function ChatBubbles({
  messages,
  usersById,
  viewerId,
  isGroup,
  accentHex,
  className = "",
}: {
  messages: ChatMsg[];
  usersById: Record<string, ChatUser>;
  viewerId: string;
  isGroup?: boolean;
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
        const theme = getUserTheme(m.userId);

        // WhatsApp Colors
        // Me: Green, Others: Dynamic Pastel Theme
        const bubbleBg = me ? "#d9fdd3" : theme.bg;

        // WhatsApp Shape
        const rBase = "rounded-lg";
        const bubbleRadius = me
          ? `${rBase} ${firstInGroup ? "rounded-tr-none" : ""}`
          : `${rBase} ${firstInGroup ? "rounded-tl-none" : ""}`;

        // Tail - uses CSS var for background match to support dynamic theme
        const tailCls = firstInGroup
          ? me
            ? "after:content-[''] after:absolute after:top-0 after:right-[-8px] after:w-3 after:h-3 after:bg-[var(--bubble-bg)] after:[clip-path:polygon(0_0,100%_0,0_100%)]"
            : "after:content-[''] after:absolute after:top-0 after:left-[-8px] after:w-3 after:h-3 after:bg-[var(--bubble-bg)] after:[clip-path:polygon(0_0,100%_0,100%_100%)]"
          : "";

        return (
          <Fragment key={m.id}>
            {dayChanged ? (
              <div className="sticky top-0 z-[1] py-2 flex justify-center">
                <div className="px-3 py-1 rounded-lg bg-[#e1f3fb] text-[11px] font-medium text-neutral-600 shadow-sm">
                  {fmtDayLabel(m.createdAt)}
                </div>
              </div>
            ) : null}

            <div className={`flex ${me ? "justify-end" : "justify-start"} mb-1 ${firstInGroup && idx > 0 ? "mt-4" : ""}`}>
              <div className={`max-w-[78%] flex items-start gap-3 ${me ? "flex-row-reverse" : ""}`}>
                {!me && firstInGroup ? (
                  <div className="shrink-0 w-[24px]">
                    <Avatar user={u} size={24} className="shadow-sm" />
                  </div>
                ) : !me ? <div className="w-[24px]" /> : null}

                <div
                  className={[
                    "relative px-2 py-1 shadow-sm text-sm text-neutral-800",
                    bubbleRadius,
                    tailCls,
                  ].join(" ")}
                  style={{ backgroundColor: bubbleBg, ["--bubble-bg" as any]: bubbleBg }}
                >
                  {!me && firstInGroup && isGroup ? (
                    <div className={`text-[12px] font-bold leading-tight mb-0.5 ${theme.text}`}>
                      {u.name}
                    </div>
                  ) : null}

                  <div className="whitespace-pre-wrap break-words leading-snug pr-14 pb-1">
                    {m.text}
                  </div>

                  <div className="absolute bottom-1 right-2 text-[10px] text-neutral-500 tabular-nums select-none leading-none">
                    {fmtTime(m.createdAt)}
                    {me && <span className="ml-1 text-blue-500">✓</span>}
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
