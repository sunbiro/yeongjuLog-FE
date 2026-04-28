import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import charBackground from "@/assets/images/char_background.png";
import inputFrame from "@/assets/images/input.png";
import picFrame from "@/assets/images/pic.png";

type CharacterResponse = {
  success: boolean;
  data: {
    imageUrl: string;
    characterId: number;
    userId: number;
    createdAt: string;
  };
};

const STYLE_MAP: Record<string, string> = {
  geumseong: "royal",
  joseon: "scholar",
  modern: "common",
};

export default function CharSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [trait, setTrait] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    setError(null);

    const theme = sessionStorage.getItem("selectedTheme") ?? "geumseong";
    const features = {
      description: trait.trim() || "기본 캐릭터",
      gender: "male",
      style: STYLE_MAP[theme] ?? "scholar",
    };

    const form = new FormData();
    form.append("userId", String(user?.id ?? 0));
    form.append("photo", file);
    form.append(
      "features",
      new Blob([JSON.stringify(features)], { type: "application/json" })
    );

    try {
      const res = await api.postForm<CharacterResponse>("/characters/generate", form);
      sessionStorage.setItem("charName", name.trim());
      sessionStorage.setItem("charTrait", trait.trim());
      sessionStorage.setItem("charImageUrl", res.data.imageUrl);
      sessionStorage.setItem("characterId", String(res.data.characterId));
      navigate("/char-result");
    } catch {
      setError("캐릭터 생성에 실패했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
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

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
          <p
            className="mb-2 text-2xl font-bold tracking-widest text-[#3d1f00]"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
          >
            캐릭터 설정
          </p>

          {/* 이름 입력 */}
          <div className="relative w-full">
            <img src={inputFrame} alt="" className="w-full" draggable={false} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={12}
              disabled={loading}
              className="absolute inset-0 w-full bg-transparent text-center text-base text-transparent placeholder:text-[#a07850] focus:outline-none disabled:opacity-50"
              style={{ paddingLeft: "14%", paddingRight: "14%", paddingTop: "14%", paddingBottom: "14%", caretColor: "#3d1f00" }}
            />
          </div>

          {/* 특징 입력 */}
          <div className="relative w-full">
            <img src={inputFrame} alt="" className="w-full" draggable={false} />
            <input
              type="text"
              value={trait}
              onChange={(e) => setTrait(e.target.value)}
              placeholder="캐릭터의 특징을 입력해주세요"
              maxLength={30}
              disabled={loading}
              className="absolute inset-0 w-full bg-transparent text-center text-base text-transparent placeholder:text-[#a07850] focus:outline-none disabled:opacity-50"
              style={{ paddingLeft: "14%", paddingRight: "14%", paddingTop: "14%", paddingBottom: "14%", caretColor: "#3d1f00" }}
            />
          </div>

          {/* 사진 촬영 */}
          <button
            type="button"
            onClick={() => !loading && fileInputRef.current?.click()}
            className="relative w-48 cursor-pointer active:scale-95 transition-transform duration-150 disabled:opacity-50"
            disabled={loading}
          >
            <img src={picFrame} alt="사진 촬영" className="w-full" draggable={false} />
            {preview ? (
              <img
                src={preview}
                alt="촬영된 사진"
                className="absolute object-cover"
                style={{ inset: "13%" }}
              />
            ) : (
              <div
                className="absolute flex flex-col items-center justify-center gap-1"
                style={{ inset: "13%" }}
              >
                <span className="text-4xl">📷</span>
                <span className="text-xs text-[#7a5230] font-medium">사진 촬영</span>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handlePhotoCapture}
          />

          {error && (
            <p className="text-sm font-medium text-red-600 text-center">{error}</p>
          )}
        </div>

        {/* 로딩 오버레이 */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c8873a] border-t-transparent" />
            <p className="text-sm font-bold text-[#fff8ee]">캐릭터를 생성하고 있습니다...</p>
          </div>
        )}
      </div>
    </MobileFrameLayout>
  );
}
