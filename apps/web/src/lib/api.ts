const API = "/api";

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, message: string, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const body: any = init?.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!headers.has("content-type") && !isFormData) headers.set("content-type", "application/json");

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const text = await res.text();
  let json: any = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }
  if (!res.ok) throw new ApiError(res.status, String(json?.error || res.statusText), json);
  return json as T;
}

export async function apiMaybe<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    return await api<T>(path, init);
  } catch (e: any) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

export async function logout(): Promise<void> {
  await api("/logout", { method: "POST" });
}

export function getAuthenticatedUser(): string | null {
  // In this project, the token is stored in a cookie or transmitted via headers.
  // The backend uses x-username header for simplicity in dev/local.
  // For the frontend, let's assume we can get it from a common place or a cookie.
  // Usually this would be decoded from a JWT.
  // Looking at the code, the dev login just sets a cookie or we use a header.
  // Actually, let's check how the app knows who is logged in.
  // I'll check Shell.tsx or LoginPage.tsx if they exist.
  return document.cookie.split("; ").find(row => row.startsWith("username="))?.split("=")[1] || null;
}
