import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import sosuBackground from "@/assets/images/place02_background.png";
import quizImg from "@/assets/images/quiz.png";
import wrongImg from "@/assets/images/X.png";
import giveImg from "@/assets/images/give.png";

const MUSEUM_LOCATION_CODE = "SOSU_MUSEUM";

type Artifact = {
  artifactNumber: number;
  name: string;
  period: string;
  material: string;
  designation: string | null;
  designationNumber: number;
};

type ArtifactsResponse = {
  success: boolean;
  data: Artifact[];
};

type MissionResponse = {
  success: boolean;
  data: Array<{
    id?: number | string;
    missionId?: number | string;
    locationName: string;
    title: string;
    question: string;
    rewardPoints: number;
    type: string;
    isCompleted: boolean;
  }>;
};

type SecretLetter = {
  id: number;
  sequenceNumber: number;
  title: string;
  content: string;
  description: string;
};

type MissionSubmitResponse = {
  success: boolean;
  data: {
    isCorrect: boolean;
    message: string;
    rewardPoints: number;
    totalPoints: number;
    secretLetter: SecretLetter | null;
    isGoldShrineUnlocked: boolean;
  };
};

export default function MuseumQuizPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const wrongTimerRef = useRef<number | null>(null);

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showWrongImage, setShowWrongImage] = useState(false);
  const [missionId, setMissionId] = useState<number | null>(null);
  const [missionLoading, setMissionLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [artifactsLoading, setArtifactsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (wrongTimerRef.current !== null) {
        window.clearTimeout(wrongTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (user?.id == null) return;
    setMissionLoading(true);
    api
      .get<MissionResponse>(`/v1/missions/location/${MUSEUM_LOCATION_CODE}?userId=${user.id}`)
      .then((res) => {
        const mission = res.data?.[0];
        const loadedId = mission?.id ?? mission?.missionId;
        const loadedMissionId = loadedId != null ? Number(loadedId) : null;

        if (loadedMissionId === null || !Number.isFinite(loadedMissionId)) {
          console.error("미션 ID를 찾을 수 없습니다:", mission);
          return;
        }

        setMissionId(loadedMissionId);
        setIsCompleted(mission?.isCompleted ?? false);
      })
      .catch((err) => {
        console.error("미션 로딩 실패:", err);
      })
      .finally(() => setMissionLoading(false));
  }, [user?.id]);

  useEffect(() => {
    setArtifactsLoading(true);
    api
      .get<ArtifactsResponse>("/v1/museum/artifacts")
      .then((res) => {
        if (res.data) setArtifacts(res.data);
      })
      .catch((err) => console.error("소장품 로딩 실패:", err))
      .finally(() => setArtifactsLoading(false));
  }, []);

  const showWrongFeedback = () => {
    setShowWrongImage(true);
    if (wrongTimerRef.current !== null) {
      window.clearTimeout(wrongTimerRef.current);
    }
    wrongTimerRef.current = window.setTimeout(() => {
      setShowWrongImage(false);
      wrongTimerRef.current = null;
    }, 2000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericUserId = Number(user?.id);

    if (!user || !Number.isFinite(numericUserId) || missionId === null) {
      console.error("미션 제출 필수값 누락:", { userId: user?.id, missionId });
      showWrongFeedback();
      return;
    }

    if (isCompleted) {
      navigate("/reward");
      return;
    }

    if (selectedNumber === null) {
      showWrongFeedback();
      return;
    }

    try {
      const res = await api.post<MissionSubmitResponse>("/v1/missions/submit", {
        userId: numericUserId,
        missionId,
        answer: String(selectedNumber),
      });

      if (res.data?.isCorrect) {
        setShowWrongImage(false);
        setIsCompleted(true);
        updateUser({ ...user, points: res.data.totalPoints });
        navigate("/reward", {
          state: {
            rewardPoints: res.data.rewardPoints,
            totalPoints: res.data.totalPoints,
            secretLetter: res.data.secretLetter ?? null,
            isGoldShrineUnlocked: res.data.isGoldShrineUnlocked,
          },
        });
      } else {
        showWrongFeedback();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("M002")) {
        navigate("/reward");
      } else {
        showWrongFeedback();
      }
    }
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-black font-inter">
        <img
          src={sosuBackground}
          alt="소수서원"
          className="absolute inset-0 h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#0f172a]/55" />

        <a
          href="https://yjlove.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-0 top-0 z-10 w-full"
        >
          <img
            src={giveImg}
            alt="give"
            className="w-full"
            draggable={false}
          />
        </a>

        <div className="absolute left-1/2 top-[200px] w-[430px] -translate-x-1/2">
          <img
            src={quizImg}
            alt=""
            className="h-auto w-full"
            draggable={false}
          />

          <form onSubmit={handleSubmit} className="absolute left-[70px] top-[172px] flex w-[290px] flex-col">
            <p className="ml-[5px] text-[13px] font-black leading-[18px] text-[#f7e8c7]">
              금성대군의 행적을 기록한 이 문헌, 금성대군실기의 소수박물관 소장품 번호는 무엇인가?
            </p>

            {/* 소장품 선택 목록 */}
            <div className="ml-[10px] mt-[8px] max-h-[160px] overflow-y-auto flex flex-col gap-[5px] pr-[2px]">
              {artifactsLoading || missionLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#b55318] border-t-transparent" />
                  <p className="text-[12px] text-[#f7e8c7]/70">소장품 불러오는 중...</p>
                </div>
              ) : (
                artifacts.map((artifact) => (
                  <button
                    key={artifact.artifactNumber}
                    type="button"
                    onClick={() => setSelectedNumber(artifact.artifactNumber)}
                    className={[
                      "w-full rounded-[6px] border-2 px-3 py-[6px] text-left text-[12px] font-bold transition-colors",
                      selectedNumber === artifact.artifactNumber
                        ? "border-[#d06a1c] bg-[#b55318] text-white"
                        : "border-[#9e6f3d] bg-[#fff3d6] text-[#2f1c0d]",
                    ].join(" ")}
                  >
                    <span className="opacity-70">{artifact.artifactNumber}번</span>{" "}
                    {artifact.name}
                  </button>
                ))
              )}
            </div>

            <button
              type="submit"
              disabled={missionLoading || artifactsLoading || !Number.isFinite(Number(missionId)) || selectedNumber === null}
              className="mt-[9px] h-[45px] rounded-[7px] bg-[#b55318] text-[16px] font-black text-white shadow-[inset_0_-3px_0_rgba(94,34,10,0.35)] active:scale-[0.98] disabled:opacity-50"
            >
              제출하기
            </button>
          </form>
        </div>

        <div className="absolute left-[14px] top-[694px] flex h-[50px] w-[362px] items-center justify-center rounded-[6px] bg-[#3b4658]">
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="h-[50px] w-full text-base font-bold text-white active:scale-[0.98]"
          >
            돌아가기
          </button>
        </div>

        {showWrongImage ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20">
            <img
              src={wrongImg}
              alt="틀렸습니다"
              className="w-[340px] max-w-[92%] object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.45)]"
              draggable={false}
            />
          </div>
        ) : null}
      </div>
    </MobileFrameLayout>
  );
}
