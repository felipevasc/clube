import { z } from "zod";

export const UsernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_.-]+$/, "Use apenas letras, numeros, _ . ou -");

export const MediaUrlSchema = z
  .string()
  .min(1)
  .max(2000)
  // Allow either absolute URLs or same-origin relative paths (used by the /api proxy in dev).
  .refine((v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"), "URL invalida");

export const LoginSchema = z.object({
  username: UsernameSchema,
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  username: UsernameSchema,
  name: z.string().min(2).max(60),
  password: z.string().min(6),
  invitationCode: z.string().min(4),
});

export const UserProfileSchema = z.object({
  name: z.string().min(1).max(60),
  bio: z.string().max(200).optional().default(""),
  avatarUrl: z.union([MediaUrlSchema, z.literal("")]).optional().default(""),
  coverUrl: z.union([MediaUrlSchema, z.literal("")]).optional().default(""),
  cities: z.array(z.string()).default([]),
  isAdmin: z.boolean().optional().default(false),
});

export const BookCreateSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  coverUrl: z.union([MediaUrlSchema, z.literal("")]).optional().default(""),
  synopsis: z.string().optional(),
  categoryIds: z.array(z.string()),
  aiStyleDescription: z.string().optional(),
  aiStyleImageUrls: z.array(MediaUrlSchema).optional(),
  indicationComment: z.string().optional(),
});

export const BookUpdateSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  coverUrl: z.union([MediaUrlSchema, z.literal("")]).optional().default(""),
  synopsis: z.string().optional(),
  categoryIds: z.array(z.string()),
  aiStyleDescription: z.string().optional(),
  aiStyleImageUrls: z.array(MediaUrlSchema).optional(),
  indicationComment: z.string().optional(),
});

export const GroupCreateSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(200).optional().default(""),
});



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

export const CitySchema = z.enum(["FORTALEZA", "BRASILIA"]);
export type City = z.infer<typeof CitySchema>;

export const ClubBookCreateInputSchema = z.object({
  bookId: z.string().min(1).max(64),
  coverUrl: z.union([MediaUrlSchema, z.literal("")]).optional().default(""),
  colorKey: ClubColorKeySchema,
  city: CitySchema,
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2025).max(2100),
  indicationComment: z.string().optional(),
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

export const PollOptionTypeSchema = z.enum(["TEXT", "BOOK"]);

export const PollOptionCreateSchema = z.object({
  type: PollOptionTypeSchema.default("TEXT"),
  text: z.string().max(200).optional().default(""),
  imageUrl: MediaUrlSchema.optional(),
  bookId: z.string().optional(),
});

export const PollCreateSchema = z.object({
  question: z.string().min(1).max(500),
  description: z.string().max(1000).optional().default(""),
  imageUrl: MediaUrlSchema.optional(),
  multiChoice: z.boolean().optional().default(false),
  publicVotes: z.boolean().optional().default(false),
  options: z.array(PollOptionCreateSchema).min(2).max(10),
  clubBookId: z.string().min(1).max(64).optional(),
  city: CitySchema.default("FORTALEZA"),
});

export const PollVoteSchema = z.object({
  optionId: z.string().min(1),
}).or(
  z.object({
    // Single "ballot" submission (esp. for multi-choice). The API should reject revotes.
    optionIds: z.array(z.string().min(1)).min(1).max(10),
  })
);
