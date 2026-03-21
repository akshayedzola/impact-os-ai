/**
 * Thin wrapper around the ImpactOS Frappe API routes.
 * All API routes follow the pattern: /api/<resource>/<method>
 */
export async function frappeCall<T = unknown>(
  resource: string,
  method: string,
  params: Record<string, string> = {},
  httpMethod: "GET" | "POST" = "GET",
  token?: string | null,
): Promise<T> {
  const base = `/api/${resource}/${method}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = base;
  let body: string | undefined;

  if (httpMethod === "GET") {
    const qs = new URLSearchParams(params).toString();
    if (qs) url = `${base}?${qs}`;
  } else {
    body = JSON.stringify(params);
  }

  const res = await fetch(url, {
    method: httpMethod,
    headers,
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `API error ${res.status}`);
  }

  return data as T;
}
