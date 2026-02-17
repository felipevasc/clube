import type { CSSProperties } from "react";

export default function Avatar({
  user,
  size = 40,
  className = "",
  activeBookColor
}: {
  user: { id: string; name: string; avatarUrl?: string };
  size?: number;
  className?: string;
  activeBookColor?: string;
}) {
  const initial = (user?.name || user?.id || "?").slice(0, 1).toUpperCase();
  const px = Number(size || 40);
  const baseStyle: CSSProperties = {
    width: px,
    height: px,
    borderColor: activeBookColor || 'rgba(0,0,0,0.05)',
    borderWidth: activeBookColor ? '3px' : '1px'
  };
  const cls = `rounded-full object-cover border bg-white ${className}`;
  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={cls} style={baseStyle} referrerPolicy="no-referrer" />;
  }
  return (
    <div
      className={`rounded-full bg-sun-100 border grid place-items-center font-black ${className}`}
      style={baseStyle}
      aria-label={user?.name || user?.id}
    >
      {initial}
    </div>
  );
}
