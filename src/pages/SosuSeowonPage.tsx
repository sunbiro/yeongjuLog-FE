import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import fireImg from "@/assets/images/fire.png";
import infoImg from "@/assets/images/info.png";
import sosuBackground from "@/assets/images/place02_background.png";
import wrongImg from "@/assets/images/X.png";

type ScreenMode = "story" | "quiz";
type StoryStep = 0 | 1;

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

export default function SosuSeowonPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const wrongTimerRef = useRef<number | null>(null);

  const [mode, setMode] = useState<ScreenMode>("story");
  const [storyStep, setStoryStep] = useState<StoryStep>(0);
  const [answer, setAnswer] = useState("");
  const [showWrongImage, setShowWrongImage] = useState(false);

  const [missionId, setMissionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
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
        setQuestion(mission?.question ?? null);
        setIsCompleted(mission?.isCompleted ?? false);
      })
      .catch((err) => {
        console.error("미션 로딩 실패:", err);
      })
      .finally(() => setMissionLoading(false));
  }, [user?.id]);

  const handleStoryNext = () => {
    if (storyStep === 0) {
      setStoryStep(1);
      return;
    }
    setMode("quiz");
  };

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

    const payload = {
      userId: numericUserId,
      missionId,
      answer: submitAnswer,
    };

    try {
      const res = await api.post<MissionSubmitResponse>("/v1/missions/submit", payload);

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
      {mode === "story" ? (
        <StoryScreen storyStep={storyStep} onNext={handleStoryNext} />
      ) : (
        <QuizScreen
          answer={answer}
          missionId={missionId}
          question={question}
          missionLoading={missionLoading}
          showWrongImage={showWrongImage}
          onAnswerChange={setAnswer}
          onBack={() => navigate("/reward")}
          onSubmit={handleSubmit}
        />
      )}
    </MobileFrameLayout>
  );
}

function StoryScreen({
  storyStep,
  onNext,
}: {
  storyStep: StoryStep;
  onNext: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onNext}
      className="relative block h-full w-full overflow-hidden bg-black text-left font-inter"
      aria-label="소수서원 기록을 읽고 다음으로 넘어가기"
    >
      <img
        src={sosuBackground}
        alt="소수서원"
        className="absolute left-0 top-0 h-[566px] w-full object-cover object-top"
        draggable={false}
      />
      <img
        src={fireImg}
        alt=""
        className="absolute -left-[52px] top-[346px] h-[218px] w-[250px] object-contain"
        draggable={false}
      />
      <div className="absolute left-0 top-[562px] h-[12px] w-full bg-[#2b1307]" />
      <img
        src={infoImg}
        alt=""
        className="absolute bottom-0 left-0 h-[282px] w-full object-cover"
        draggable={false}
      />

      <div className="absolute left-[18px] top-[580px] h-[264px] w-[354px] px-3 pt-5 text-center text-[14px] font-black leading-[22px] text-black">
        {storyStep === 0 ? <FirstStoryText /> : <SecondStoryText />}
      </div>
    </button>
  );
}

function FirstStoryText() {
  return (
    <>
      <p>
        "이곳 소수서원은 지금은 학문을 논하는 정갈한 곳이지. 하지만 백 년 전,
        이곳은 내가 단종 임금의 복위를 도모하던 숙수사라는 절이었다네."
      </p>
      <p className="mt-3">
        "1457년 정축지변의 참화가 이 고을을 휩쓴 뒤... 찬란했던 숙수사의 모습도
        안개처럼 자취를 감추고 말았지. 불길에 사라졌는지, 세월에 묻혔는지
        명확한 기록조차 남지 못할 만큼 처참한 세월이었네. 고을마저 폐지되어
        억눌려 지낸 지 백 년... 비로소 퇴계 선생의 건의로 기개가 다시 살아난
        것이라네."
      </p>
    </>
  );
}

function SecondStoryText() {
  return (
    <>
      <p>
        "오오, 선비들이 가르침을 받던 이곳 강학당까지 잘 찾아왔구먼. 여기
        어딘가에 우리가 목숨 바쳐 지키려 했던 그날의 맹세가 숨겨져 있네."
      </p>
      <p className="mt-5">
        "자네, 들리는가? 정축년의 그날 밤... 내가 단종 임금을 위해 거사를
        도모하던 이 찬란한 절터도 참화 속에 안개처럼 자취를 감추고 말았네."
      </p>
      <p className="mt-5">
        "비극 속에 잊힌 이 옛 절의 이름은 무엇인가? 자네라면 그 이름을 기억해낼
        수 있겠지."
      </p>
    </>
  );
}

type QuizScreenProps = {
  answer: string;
  missionId: number | null;
  question: string | null;
  missionLoading: boolean;
  showWrongImage: boolean;
  onAnswerChange: (answer: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function QuizScreen({
  answer,
  missionId,
  question,
  missionLoading,
  showWrongImage,
  onAnswerChange,
  onBack,
  onSubmit,
}: QuizScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#101828] font-inter text-[#fef3c6]">
      <img
        src={sosuBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        draggable={false}
      />

      <div className="absolute left-6 top-8 flex h-[632px] w-[342px] flex-col gap-6">
        <section className="rounded-[10px] border-[4px] border-[#bb4d00] bg-[#1e2939] px-6 py-7 shadow-[0px_25px_50px_rgba(0,0,0,0.25)]">
          <h1 className="text-center text-2xl font-medium leading-8">소수서원</h1>
          <p className="mt-4 text-sm leading-[23px] tracking-[-0.15px] text-[#fee685]">
            밤 8시, 소수서원 입구. 짙은 안개와 청사초롱 불빛 사이로 의문의
            목소리가 들려온다. 유령이 나타나 백 년 전 정축지변의 참화로 사라진
            옛 절터의 비극을 들려준다.
          </p>
        </section>

        <section className="rounded-[10px] border-[4px] border-[#bb4d00] bg-[#7b3306] px-6 py-6 text-center shadow-[0px_25px_50px_rgba(0,0,0,0.25)]">
          <p className="text-sm leading-[23px] text-[#fee685]">
            선비들이 가르침을 받던 강학당으로 이동하여, 비극 속에 잊힌 옛 절의
            이름을 기억해내시오.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 rounded-[10px] bg-[#461901] p-4">
            <label htmlFor="sosu-answer" className="text-sm leading-5">
              {missionLoading
                ? "미션을 불러오는 중..."
                : (question ?? "정축지변으로 사라진 이곳의 옛 절 이름은 무엇인가?")}
            </label>
            <input
              id="sosu-answer"
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="답을 입력하시오"
              disabled={missionLoading}
              className="h-[51px] rounded-lg border-2 border-[#bb4d00] bg-[#fffbeb] px-4 text-center text-base text-[#111111] outline-none placeholder:text-black/50 focus:ring-2 focus:ring-[#fee685] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={missionLoading || !Number.isFinite(Number(missionId)) || !answer.trim()}
              className="h-12 rounded-lg bg-[#bb4d00] text-base font-bold leading-6 text-white disabled:opacity-50 active:scale-[0.98]"
            >
              제출하기
            </button>
          </form>
        </section>

        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-lg bg-[#364153] text-base font-medium leading-6 text-white active:scale-[0.98]"
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
  );
}
