import { useEffect, useRef } from "react";
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

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;

    api
      .post<LoginResponse>("/v1/auth/kakao", { code, redirectUri })
      .then((res) => {
        const { accessToken, refreshToken, isNewUser, user } = res.data;
        login(accessToken, refreshToken, user);
        navigate(isNewUser ? "/theme" : "/main", { replace: true });
      })
      .catch(() => {
        navigate("/", { replace: true });
      });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#17111a] text-white text-base">
      로그인 중...
    </div>
  );
}
