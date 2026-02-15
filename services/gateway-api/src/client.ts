type Json = any;

export async function httpJson(method: string, url: string, body?: unknown, headers?: Record<string, string>) {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
        ...(headers || {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e: any) {
    // Network error (service down, DNS, refused connection, etc).
    const cause = e?.cause;
    const err: any = new Error(`upstream fetch failed: ${url}`);
    err.status = 502;
    err.body = {
      error: "upstream fetch failed",
      url,
      detail: {
        message: String(e?.message || e),
        code: cause?.code,
        errno: cause?.errno,
        address: cause?.address,
        port: cause?.port,
      },
    };
    throw err;
  }

  const text = await res.text();
  let json: Json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.error || res.statusText;
    const err: any = new Error(String(msg));
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}
