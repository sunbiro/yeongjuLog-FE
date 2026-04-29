import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import mainBackground from "@/assets/images/main_background.jpg";
import sunbiroLogo from "@/assets/images/logo.png";
import yeongjuCityLogo from "@/assets/images/yeongju_logo.png";
import { useEffect } from "react";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID as
  | string
  | undefined;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as
  | string
  | undefined;
const KAKAO_CLIENT_ID_PLACEHOLDER = "your_kakao_client_id_here";

function hasOAuthEnvValue(
  value: string | undefined,
  placeholder?: string,
): value is string {
  const trimmed = value?.trim();
  return Boolean(trimmed) && trimmed !== placeholder;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      navigate("/main", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleKakaoLogin = () => {
    if (
      !hasOAuthEnvValue(KAKAO_CLIENT_ID, KAKAO_CLIENT_ID_PLACEHOLDER) ||
      !hasOAuthEnvValue(REDIRECT_URI)
    ) {
      console.error(
        "Kakao login is not configured. Set VITE_KAKAO_CLIENT_ID and VITE_KAKAO_REDIRECT_URI in .env, then restart Vite.",
      );
      alert(
        "Kakao login is not configured. Please check the frontend .env file.",
      );
      return;
    }

    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
    });
    const url = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-darkslateblue text-center text-base text-black font-inter">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={mainBackground}
          alt=""
        />

        <div className="absolute inset-x-4 top-[63px] flex flex-col items-center">
          <div className="flex h-[414px] w-[254px] flex-col items-center justify-center pb-[93px] pt-[77px]">
            <div className="flex w-[254px] flex-col items-start gap-2">
              <div className="relative h-5 self-stretch" />
              <img
                className="relative h-[216px] max-w-full shrink-0 self-stretch overflow-hidden object-cover"
                src={sunbiroLogo}
                alt="선비로 로고"
              />
            </div>
          </div>

          <div className="relative h-[303px] w-full">
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="absolute left-1/2 top-0 h-14 w-[299px] max-w-full -translate-x-1/2 rounded-[10px] bg-gold shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            >
              <span className="absolute left-[95px] top-[18px] flex h-5 w-5 items-center justify-center">
                <KakaoIcon />
              </span>
              <b className="absolute left-[123px] top-[15px] leading-6 tracking-[-0.31px]">
                카카오 로그인
              </b>
            </button>
          </div>

          <img
            className="relative w-[112px] object-cover"
            src={yeongjuCityLogo}
            width={112}
            height={53}
            alt="영주 로고"
          />
        </div>
      </div>
    </MobileFrameLayout>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2C5.582 2 2 4.896 2 8.462c0 2.275 1.488 4.274 3.75 5.412L4.842 17l3.876-2.476c.417.058.845.088 1.282.088 4.418 0 8-2.896 8-6.462C18 4.896 14.418 2 10 2z"
        fill="#000000"
      />
    </svg>
  );
}
