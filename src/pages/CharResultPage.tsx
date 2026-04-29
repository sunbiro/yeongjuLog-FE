import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import charBackground from "@/assets/images/char_background.png";
import picFrame from "@/assets/images/pic.png";

type CharacterResponse = {
  success: boolean;
  data: {
    imageUrl: string;
    characterId: number;
    userId: number;
    createdAt: string;
  } | null;
};

export default function CharResultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedName = sessionStorage.getItem("charName");
    const savedImageUrl = sessionStorage.getItem("charImageUrl");

    if (savedName && savedImageUrl) {
      setName(savedName);
      setImageUrl(savedImageUrl);
      setLoading(false);
      return;
    }

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    api
      .get<CharacterResponse>(`/characters/${user.id}/current`)
      .then((res) => {
        if (res.data) {
          setName(user.nickname);
          setImageUrl(res.data.imageUrl);
        } else {
          navigate("/theme", { replace: true });
        }
      })
      .catch(() => {
        navigate("/theme", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleStart = () => {
    navigate("/main");
  };

  const handleRedo = () => {
    sessionStorage.removeItem("charName");
    sessionStorage.removeItem("charTrait");
    sessionStorage.removeItem("charImageUrl");
    sessionStorage.removeItem("characterId");
    navigate("/char-setup");
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={charBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#f5e9c8]/30" />

        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c8873a] border-t-transparent" />
            <p className="text-sm font-bold text-[#3d1f00]">캐릭터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
            <p
              className="text-2xl font-bold tracking-widest text-[#3d1f00]"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
            >
              {name}
            </p>

            <div className="relative w-56">
              <img src={picFrame} alt="" className="w-full" draggable={false} />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="생성된 캐릭터"
                  className="absolute object-cover"
                  style={{ inset: "13%" }}
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="mt-2 w-full max-w-[240px] rounded-lg border-2 border-[#7a4f22] bg-[#c8873a] px-10 py-3 text-base font-bold tracking-wide text-[#fff8ee] shadow-md transition-transform duration-150 active:scale-95"
            >
              여정 시작하기
            </button>

            <button
              type="button"
              onClick={handleRedo}
              className="w-full max-w-[240px] rounded-lg border-2 border-[#b0906a] bg-[#d9b88a] px-10 py-3 text-base font-bold tracking-wide text-[#5a3a1a] transition-transform duration-150 active:scale-95"
            >
              다시 만들기
            </button>
          </div>
        )}
      </div>
    </MobileFrameLayout>
  );
}
