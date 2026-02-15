import { clubColorHex } from "./clubColors";

const COLOR_KEYS = [
  "rubi",
  "tangerina",
  "damasco",
  "mel",
  "limonada",
  "pistache",
  "abacate",
  "hortela",
  "verde",
  "menta",
  "aqua",
  "turquesa",
  "oceano",
  "ceudeverao",
  "azul",
  "cobalto",
  "anil",
  "iris",
  "uva",
  "ameixa",
  "magenta",
  "framboesa",
  "rosa",
  "pitaya",
] as const;

export function bookAccentHex(seed: string): string {
  const s = String(seed || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % COLOR_KEYS.length;
  return clubColorHex(COLOR_KEYS[idx] || "azul");
}

export function bookInitial(title: string): string {
  const t = String(title || "").trim();
  if (!t) return "?";
  const m = t.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]/);
  return String((m ? m[0] : t[0]) || "?").toUpperCase();
}

