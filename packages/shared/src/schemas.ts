import { z } from "zod";

export const UsernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/, "Use apenas letras, numeros e _");

export const LoginSchema = z.object({
  username: UsernameSchema,
});

export const UserProfileSchema = z.object({
  name: z.string().min(1).max(60),
  bio: z.string().max(200).optional().default(""),
  avatarUrl: z.string().url().optional().default(""),
});

export const BookCreateSchema = z.object({
  title: z.string().min(1).max(120),
  author: z.string().min(1).max(80),
  coverUrl: z.string().max(2000).optional().default(""),
});

export const BookUpdateSchema = BookCreateSchema;

export const GroupCreateSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(200).optional().default(""),
});

export const MediaUrlSchema = z
  .string()
  .min(1)
  .max(2000)
  // Allow either absolute URLs or same-origin relative paths (used by the /api proxy in dev).
  .refine((v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"), "URL invalida");

// "Livro do mes" palette: 24 distinct accents that still feel cohesive with the app.
// Stored as a key in the DB, rendered by the UI via the hex values below.
export const CLUB_COLORS = [
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
] as const;

export const ClubColorKeySchema = z.enum([
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
]);

export type ClubColorKey = z.infer<typeof ClubColorKeySchema>;

export const ClubBookCreateInputSchema = z.object({
  bookId: z.string().min(1).max(64),
  colorKey: ClubColorKeySchema,
  isActive: z.boolean().optional().default(true),
});

// Internal: gateway enriches with title/author so services can render labels without extra calls.
export const ClubBookCreateSchema = ClubBookCreateInputSchema.extend({
  title: z.string().min(1).max(120),
  author: z.string().min(1).max(80),
});

export const ClubBookMessageCreateSchema = z.object({
  text: z.string().min(1).max(2000),
});

export const ClubBookArtifactCreateSchema = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  size: z.number().int().min(1).max(50 * 1024 * 1024),
  url: MediaUrlSchema,
});

export const PostCreateSchema = z.object({
  text: z.string().max(500).optional().default(""),
  imageUrl: MediaUrlSchema.optional(),
  images: z.array(MediaUrlSchema).max(10).optional(),
  clubBookId: z.string().min(1).max(64).optional(),
}).refine((v) => (v.text || "").trim().length > 0 || !!v.imageUrl || (v.images && v.images.length > 0), "Informe um texto ou uma imagem");

export const CommentCreateSchema = z.object({
  text: z.string().min(1).max(300),
});

export const ReactionTypeSchema = z.enum(["like", "love", "laugh", "wow", "sad", "clap"]);

export const PostReactSchema = z.object({
  type: ReactionTypeSchema,
});

export const EventEnvelopeSchema = z.object({
  id: z.string(),
  type: z.string(),
  ts: z.number(),
  source: z.string(),
  data: z.unknown()
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;
