import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import charBackground from "@/assets/images/char_background.png";
import picFrame from "@/assets/images/pic.png";

type Character = {
  imageUrl: string;
  characterId: number;
  userId: number;
  createdAt: string;
};

type CharacterResponse = {
  success: boolean;
  data: Character | null;
  message?: string;
};

export default function CharResultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedName = sessionStorage.getItem("charName");
    const savedImageUrl = sessionStorage.getItem("charImageUrl");
    const savedCharacterId = sessionStorage.getItem("characterId");
    const savedCreatedAt = sessionStorage.getItem("characterCreatedAt");
    const parsedCharacterId = Number(savedCharacterId);

    if (user && savedImageUrl && Number.isFinite(parsedCharacterId)) {
      setName(savedName || user.nickname || "나의 캐릭터");
      setCharacter({
        imageUrl: savedImageUrl,
        characterId: parsedCharacterId,
        userId: user.id,
        createdAt: savedCreatedAt || "",
      });
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
          setName(user.nickname || "나의 캐릭터");
          setCharacter(res.data);
          sessionStorage.setItem("charName", user.nickname || "나의 캐릭터");
          sessionStorage.setItem("charImageUrl", res.data.imageUrl);
          sessionStorage.setItem("characterId", String(res.data.characterId));
          sessionStorage.setItem("characterCreatedAt", res.data.createdAt);
        } else {
          setMessage(res.message ?? "활성 캐릭터가 없습니다.");
        }
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "캐릭터를 불러오지 못했습니다. 다시 시도해 주세요.";
        setMessage(errorMessage);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const clearCharacterSession = () => {
    sessionStorage.removeItem("charName");
    sessionStorage.removeItem("charTrait");
    sessionStorage.removeItem("charGender");
    sessionStorage.removeItem("charStyle");
    sessionStorage.removeItem("charImageUrl");
    sessionStorage.removeItem("characterId");
    sessionStorage.removeItem("characterCreatedAt");
  };

  const handleStart = () => {
    navigate("/main");
  };

  const handleRedo = () => {
    clearCharacterSession();
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
        ) : character ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
            <p
              className="text-2xl font-bold tracking-widest text-[#3d1f00]"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
            >
              {name}
            </p>

            <div className="relative w-56">
              <div
                className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
                style={{ top: "18%", width: "140px", height: "138px" }}
              >
                <img
                  src={character.imageUrl}
                  alt="생성된 캐릭터"
                  className="h-full w-full object-cover"
                />
              </div>
              <img src={picFrame} alt="" className="relative w-full" draggable={false} />
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
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <p
              className="text-2xl font-bold tracking-widest text-[#3d1f00]"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
            >
              캐릭터 없음
            </p>
            <p className="text-sm font-bold leading-6 text-[#5a351d]">
              {message ?? "활성 캐릭터가 없습니다."}
            </p>
            <button
              type="button"
              onClick={handleRedo}
              className="w-full max-w-[240px] rounded-lg border-2 border-[#7a4f22] bg-[#c8873a] px-10 py-3 text-base font-bold tracking-wide text-[#fff8ee] shadow-md transition-transform duration-150 active:scale-95"
            >
              캐릭터 만들기
            </button>
          </div>
        )}
      </div>
    </MobileFrameLayout>
  );
}
