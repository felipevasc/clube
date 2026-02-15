export const USERS_URL = process.env.USERS_URL || "http://localhost:3001";
export const BOOKS_URL = process.env.BOOKS_URL || "http://localhost:3002";
export const GROUPS_URL = process.env.GROUPS_URL || "http://localhost:3003";
export const FEED_URL = process.env.FEED_URL || "http://localhost:3004";

export const EVENT_TARGETS = (process.env.EVENT_TARGETS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

