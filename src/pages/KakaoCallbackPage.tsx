import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { User } from "@/context/AuthContext";

type LoginResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
    user: User;
  };
};

const pendingLoginRequests = new Map<string, Promise<LoginResponse>>();

function getKakaoLoginRequest(code: string, redirectUri: string) {
  const existingRequest = pendingLoginRequests.get(code);
  if (existingRequest) {
    return { request: existingRequest, reused: true };
  }

  const request = api
    .post<LoginResponse>("/v1/auth/kakao", { code, redirectUri })
    .finally(() => pendingLoginRequests.delete(code));
  pendingLoginRequests.set(code, request);

  return { request, reused: false };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Backend Kakao login request timed out."));
    }, ms);

    promise.then(resolve, reject).finally(() => window.clearTimeout(timeoutId));
  });
}

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const called = useRef(false);
  const [status, setStatus] = useState("Processing Kakao login...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      setError("Missing Kakao authorization code. Please start login again.");
      return;
    }

    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;
    const { request, reused } = getKakaoLoginRequest(code, redirectUri);

    setStatus(
      reused
        ? "Waiting for an already running Kakao login request..."
        : "Requesting Kakao login from backend...",
    );

    withTimeout(request, 20000)
      .then((res) => {
        const { accessToken, refreshToken, user } = res.data;
        login(accessToken, refreshToken, user);
        setStatus("Login succeeded. Moving to theme selection...");
        navigate("/theme", { replace: true });
      })
      .catch((error) => {
        console.error("Kakao login failed:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error occurred while processing Kakao login.",
        );
      });
  }, [login, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#17111a] px-6 text-center text-base text-white">
      <p>{status}</p>
      {error && (
        <>
          <p className="text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="rounded bg-white/15 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to login
          </button>
        </>
      )}
    </div>
  );
}
