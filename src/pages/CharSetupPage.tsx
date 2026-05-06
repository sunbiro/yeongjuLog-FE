import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import charBackground from "@/assets/images/char_background.png";
import inputFrame from "@/assets/images/input.png";
import picFrame from "@/assets/images/pic.png";

type CharacterStyle = "scholar" | "royal" | "common";
type CharacterGender = "male" | "female";

type CharacterResponse = {
  success: boolean;
  data: {
    imageUrl: string;
    characterId: number;
    userId: number;
    createdAt: string;
  };
};

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

const STYLE_MAP: Record<string, CharacterStyle> = {
  geumseong: "royal",
  joseon: "scholar",
  modern: "common",
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function CharSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [trait, setTrait] = useState("");
  const [gender, setGender] = useState<CharacterGender>("male");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setError("사진은 최대 10MB까지 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    try {
      setError(null);
      setPhotoFile(file);
      setPreview(await readFileAsDataUrl(file));
    } catch {
      setError("사진을 불러오는 데 실패했습니다. 다른 사진을 선택해 주세요.");
      event.target.value = "";
    }
  };

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || loading) return;

    const description = trait.trim();
    if (!description) {
      setError("캐릭터 특징을 입력해 주세요.");
      return;
    }

    if (!photoFile) {
      setError("캐릭터로 만들 얼굴 사진을 선택해 주세요.");
      return;
    }

    const selectedTheme = sessionStorage.getItem("selectedTheme") ?? "joseon";
    const features = {
      description,
      gender,
      style: STYLE_MAP[selectedTheme] ?? "scholar",
    };

    const formData = new FormData();
    formData.append("photo", photoFile);
    formData.append(
      "features",
      new Blob([JSON.stringify(features)], { type: "application/json" }),
    );

    try {
      setLoading(true);
      setError(null);

      const res = await api.postForm<CharacterResponse>(
        `/characters/generate?userId=${user.id}`,
        formData,
      );

      sessionStorage.setItem("charName", name.trim() || user.nickname || "캐릭터");
      sessionStorage.setItem("charTrait", description);
      sessionStorage.setItem("charGender", gender);
      sessionStorage.setItem("charStyle", features.style);
      sessionStorage.setItem("charImageUrl", res.data.imageUrl);
      sessionStorage.setItem("characterId", String(res.data.characterId));
      sessionStorage.setItem("characterCreatedAt", res.data.createdAt);
      navigate("/char-result");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "캐릭터 생성에 실패했습니다. 다시 시도해 주세요.";
      setError(message);
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

        <form
          onSubmit={handleGenerate}
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
        >
          <p
            className="mb-2 text-2xl font-bold tracking-widest text-[#3d1f00]"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
          >
            캐릭터 설정
          </p>

          <label className="relative w-full">
            <img src={inputFrame} alt="" className="w-full" draggable={false} />
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={12}
              disabled={loading}
              className="absolute inset-[18%_14%] bg-transparent text-center text-base font-bold text-[#3d1f00] placeholder:text-[#a07850] focus:outline-none disabled:opacity-50"
            />
          </label>

          <label className="relative w-full">
            <img src={inputFrame} alt="" className="w-full" draggable={false} />
            <input
              type="text"
              value={trait}
              onChange={(event) => setTrait(event.target.value)}
              placeholder="예: 웃는 표정, 안경"
              maxLength={40}
              disabled={loading}
              className="absolute inset-[18%_14%] bg-transparent text-center text-base font-bold text-[#3d1f00] placeholder:text-[#a07850] focus:outline-none disabled:opacity-50"
            />
          </label>

          <div className="grid w-full grid-cols-2 gap-3">
            {(["male", "female"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                disabled={loading}
                className={[
                  "rounded-md border-2 px-4 py-2 text-sm font-black shadow-[0_3px_0_rgba(70,39,20,0.35)] active:scale-95 disabled:opacity-50",
                  gender === value
                    ? "border-[#4d2c16] bg-[#9f5b27] text-[#fff8df]"
                    : "border-[#8d6236] bg-[#ead4a8] text-[#5a351d]",
                ].join(" ")}
              >
                {value === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => !loading && fileInputRef.current?.click()}
            className="relative w-48 cursor-pointer transition-transform duration-150 active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
              style={{ top: "18%", width: "120px", height: "118px" }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="선택한 사진"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                  <span className="text-4xl" aria-hidden="true">📷</span>
                  <span className="text-xs font-medium text-[#7a5230]">사진 선택</span>
                </div>
              )}
            </div>
            <img src={picFrame} alt="사진 선택" className="relative w-full" draggable={false} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <p className="text-center text-sm font-bold text-[#3d1f00]">
            캐릭터로 만들 내 사진을 촬영 또는 업로드 해주세요
          </p>

          <button
            type="submit"
            disabled={loading || !trait.trim() || !photoFile}
            className="w-full max-w-[240px] rounded-lg border-2 border-[#7a4f22] bg-[#c8873a] px-8 py-3 text-base font-bold tracking-wide text-[#fff8ee] shadow-md transition-transform duration-150 active:scale-95 disabled:opacity-50"
          >
            캐릭터 생성
          </button>

          {error ? (
            <p className="max-w-[310px] text-center text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}
        </form>

        {loading ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/55 px-8 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c8873a] border-t-transparent" />
            <p className="text-sm font-bold leading-6 text-[#fff8ee]">
              도트 캐릭터를 생성하고 있습니다.
              <br />
              보통 15~30초 정도 걸립니다.
            </p>
          </div>
        ) : null}
      </div>
    </MobileFrameLayout>
  );
}
