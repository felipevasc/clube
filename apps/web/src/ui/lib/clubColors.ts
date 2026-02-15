export type ClubColorKey =
  | "rubi"
  | "tangerina"
  | "damasco"
  | "mel"
  | "limonada"
  | "pistache"
  | "abacate"
  | "hortela"
  | "verde"
  | "menta"
  | "aqua"
  | "turquesa"
  | "oceano"
  | "ceudeverao"
  | "azul"
  | "cobalto"
  | "anil"
  | "iris"
  | "uva"
  | "ameixa"
  | "magenta"
  | "framboesa"
  | "rosa"
  | "pitaya";

export const CLUB_COLORS: Array<{ key: ClubColorKey; label: string; hex: string }> = [
  { key: "rubi", label: "Rubi", hex: "#da6262" },
  { key: "tangerina", label: "Tangerina", hex: "#da8062" },
  { key: "damasco", label: "Damasco", hex: "#da9e62" },
  { key: "mel", label: "Mel", hex: "#dabc62" },
  { key: "limonada", label: "Limonada", hex: "#dada62" },
  { key: "pistache", label: "Pistache", hex: "#bcda62" },
  { key: "abacate", label: "Abacate", hex: "#9eda62" },
  { key: "hortela", label: "Hortela", hex: "#80da62" },
  { key: "verde", label: "Verde", hex: "#62da62" },
  { key: "menta", label: "Menta", hex: "#62da80" },
  { key: "aqua", label: "Aqua", hex: "#62da9e" },
  { key: "turquesa", label: "Turquesa", hex: "#62dabc" },
  { key: "oceano", label: "Oceano", hex: "#62dada" },
  { key: "ceudeverao", label: "Ceu de verao", hex: "#62bcda" },
  { key: "azul", label: "Azul", hex: "#629eda" },
  { key: "cobalto", label: "Cobalto", hex: "#6280da" },
  { key: "anil", label: "Anil", hex: "#6262da" },
  { key: "iris", label: "Iris", hex: "#8062da" },
  { key: "uva", label: "Uva", hex: "#9e62da" },
  { key: "ameixa", label: "Ameixa", hex: "#bc62da" },
  { key: "magenta", label: "Magenta", hex: "#da62da" },
  { key: "framboesa", label: "Framboesa", hex: "#da62bc" },
  { key: "rosa", label: "Rosa", hex: "#da629e" },
  { key: "pitaya", label: "Pitaya", hex: "#da6280" },
];

export function clubColorHex(key: string | null | undefined): string {
  const k = String(key || "") as ClubColorKey;
  return CLUB_COLORS.find((c) => c.key === k)?.hex || "#ffbf0f";
}

