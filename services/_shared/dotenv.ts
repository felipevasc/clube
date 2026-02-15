import fs from "node:fs";
import path from "node:path";

function stripQuotes(v: string): string {
  const s = String(v || "");
  if ((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

// Minimal .env loader (best-effort). We keep this tiny instead of pulling a dependency.
export function loadDotEnv(file = ".env") {
  try {
    const p = path.resolve(process.cwd(), file);
    if (!fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const idx = t.indexOf("=");
      if (idx <= 0) continue;
      const key = t.slice(0, idx).trim();
      const val = stripQuotes(t.slice(idx + 1).trim());
      if (!key) continue;
      if (process.env[key] !== undefined) continue;
      process.env[key] = val;
    }
  } catch {
    // Best-effort: never fail boot because of env parsing.
  }
}

