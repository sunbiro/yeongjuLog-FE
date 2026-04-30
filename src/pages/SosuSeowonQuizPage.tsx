import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import sosuBackground from "@/assets/images/place02_background.png";
import quizImg from "@/assets/images/quiz.png";
import wrongImg from "@/assets/images/X.png";

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

export default function SosuSeowonQuizPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const wrongTimerRef = useRef<number | null>(null);

  const [answer, setAnswer] = useState("");
  const [showWrongImage, setShowWrongImage] = useState(false);
  const [missionId, setMissionId] = useState<number | null>(null);
  const [missionLoading, setMissionLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
      .get<MissionResponse>(`/v1/missions/location/SOSU_SEOWON?userId=${user.id}`)
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

    const submitAnswer = answer.trim();
    if (!submitAnswer) {
      showWrongFeedback();
      return;
    }

    try {
      const res = await api.post<MissionSubmitResponse>("/v1/missions/submit", {
        userId: numericUserId,
        missionId,
        answer: submitAnswer,
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

        <div className="absolute left-1/2 top-[200px] w-[430px] -translate-x-1/2">
          <img
            src={quizImg}
            alt=""
            className="h-auto w-full"
            draggable={false}
          />

          <form onSubmit={handleSubmit} className="absolute left-[70px] top-[172px] flex w-[290px] flex-col">
            <p className="ml-[5px] mt-[8px] h-[29px] text-[14px] font-black leading-[19px] text-[#f7e8c7]">
              금성대군의 행적을 기록한 이 문헌, 금성대군실기의 소수박물관 소장품 번호는 무엇인가?
            </p>
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="답을 입력하세요"
              disabled={missionLoading}
              className="h-[44px] rounded-[7px] border-2 border-[#9e6f3d] bg-[#fff3d6] px-4 text-[15px] font-bold text-[#2f1c0d] outline-none placeholder:text-[#a08a6b] focus:border-[#d06a1c] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={missionLoading || !Number.isFinite(Number(missionId)) || !answer.trim()}
              className="mt-[9px] h-[45px] rounded-[7px] bg-[#b55318] text-[16px] font-black text-white shadow-[inset_0_-3px_0_rgba(94,34,10,0.35)] active:scale-[0.98]"
            >
              제출하기
            </button>
          </form>
        </div>

        <div className="absolute left-[14px] top-[594px] flex h-[50px] w-[362px] items-center justify-center rounded-[6px] bg-[#3b4658]">
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
