import type { CSSProperties } from "react";

export default function Avatar({ user, size = 40, className = "" }: { user: { id: string; name: string; avatarUrl?: string }; size?: number; className?: string }) {
  const initial = (user?.name || user?.id || "?").slice(0, 1).toUpperCase();
  const px = Math.max(28, Math.min(64, Number(size || 40)));
  const baseStyle: CSSProperties = { width: px, height: px };
  const cls = `rounded-2xl object-cover border border-black/5 bg-white ${className}`;
  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={cls} style={baseStyle} referrerPolicy="no-referrer" />;
  }
  return (
    <div
      className={`rounded-2xl bg-sun-100 border border-black/5 grid place-items-center font-black ${className}`}
      style={baseStyle}
      aria-label={user?.name || user?.id}
    >
      {initial}
    </div>
  );
}
