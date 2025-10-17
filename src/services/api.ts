// src/services/api.ts — Axios v1 + TypeScript (sem any, sem warnings, sem blocos vazios)

/**
 * Base URL inteligente:
 * - Usa VITE_API_URL se definida
 * - Se estiver em localhost e não houver VITE_API_URL, usa http://localhost:3333
 * - Caso contrário, usa o backend do Render (produção)
 */
const inferBaseApi = (): string => {
  try {
    // Vite expõe import.meta.env tipado (definido em src/env.d.ts)
    const viteUrl: string | undefined = import.meta.env?.VITE_API_URL;
    if (viteUrl) return `${viteUrl.replace(/\/+$/, "")}/api`;
  } catch {
    // noop
  }

  if (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.host)) {
    return "http://localhost:3333/api";
  }
  return "https://myextasyclub-backend.onrender.com/api";
};

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

// Instância principal do Axios
const api: AxiosInstance = axios.create({
  baseURL: inferBaseApi(),
  // withCredentials: true,
});

// ──────────────────────────────────────────────
// Interceptor de REQUISIÇÃO
// ─────────────────────────────────────────────-
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Log leve de debug
    try {
      const m = (config.method ?? "get").toUpperCase();
      console.log("[API] =>", m, config.url);
    } catch {
      // noop
    }

    // Token → usando AxiosHeaders (classe correta do Axios v1)
    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
      if (token) {
        const headers =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : new AxiosHeaders(config.headers);

        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
      }
    } catch {
      // noop
    }

    // Compatibilidade: /payments/create-pix-order -> /payments/checkout (PIX)
    const method = (config.method ?? "").toLowerCase();
    const url = (config.url ?? "").replace(/\/+$/, "");
    if (method === "post" && /\/payments\/create-pix-order$/.test(url)) {
      console.warn("[API] compat: /create-pix-order -> /checkout (PIX)");
      config.url = "/payments/checkout";

      let body: unknown = config.data;
      try {
        if (typeof body === "string") body = JSON.parse(body);
      } catch {
        // noop
      }

      const normalized =
        body && typeof body === "object"
          ? (body as Record<string, unknown>)
          : ({} as Record<string, unknown>);
      if (!("method" in normalized)) normalized.method = "PIX";
      config.data = normalized;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────-
// Interceptor de RESPOSTA
// ─────────────────────────────────────────────-
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    try {
      if (error?.response?.status === 401) {
        console.error("[API] 401: token inválido/expirado");
        if (typeof localStorage !== "undefined") localStorage.removeItem("authToken");
        if (typeof window !== "undefined" && window.location.pathname !== "/entrar") {
          window.location.href = "/entrar";
        }
      }
    } catch {
      // noop
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────-
// TIPOS E HELPERS DE PAGAMENTO
// ─────────────────────────────────────────────-
export type CheckoutCardParams = {
  packageId: number;
  encryptedCard: string;
  holderName: string;
};

export async function getPackages(): Promise<unknown> {
  const { data } = await api.get("/payments/packages");
  return data as unknown;
}

export async function checkoutPix(packageId: number): Promise<unknown> {
  const { data } = await api.post("/payments/checkout", {
    packageId,
    method: "PIX",
  });
  return data as unknown;
}

export async function checkoutCard(params: CheckoutCardParams): Promise<unknown> {
  const { packageId, encryptedCard, holderName } = params;
  const { data } = await api.post("/payments/checkout", {
    packageId,
    method: "CREDIT_CARD",
    card: { encryptedCard, holderName },
  });
  return data as unknown;
}

export default api;
