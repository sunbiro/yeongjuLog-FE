const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://3.34.190.164:8080";

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const { message, errorCode } = error as { message?: string; errorCode?: string };
    throw new Error(
      [message ?? `HTTP ${res.status}`, errorCode ? `(${errorCode})` : ""]
        .filter(Boolean)
        .join(" "),
    );
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  postForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: "POST", body: form }),
};
