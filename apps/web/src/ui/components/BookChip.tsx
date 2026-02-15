import { clubColorHex } from "../lib/clubColors";

export type ClubBookLabel = {
  id: string;
  title: string;
  author: string;
  colorKey: string;
};

function hexWithAlpha(hex: string, alphaHex: string): string {
  const h = String(hex || "").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return hex;
  return `${h}${alphaHex}`;
}

export default function BookChip({ clubBook }: { clubBook: ClubBookLabel | null | undefined }) {
  if (!clubBook) return null;
  const hex = clubColorHex(clubBook.colorKey);
  const bg = hexWithAlpha(hex, "18");
  const border = hexWithAlpha(hex, "55");
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black border"
      style={{ backgroundColor: bg, borderColor: border, color: "#111" }}
      title={`${clubBook.title} — ${clubBook.author}`}
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hex }} />
      <span className="max-w-[180px] truncate">{clubBook.title}</span>
    </span>
  );
}

