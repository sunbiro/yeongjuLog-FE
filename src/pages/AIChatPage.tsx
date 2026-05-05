import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import fireImg from "@/assets/images/fire.png";
import mapBackgroundImg from "@/assets/images/9eaa0e66ab063858b723b3be47acacf1ac105a4f.png";
import dragonPatternImg from "@/assets/images/aaa41ee594cd359da8758f4984ac72212c01f098.png";
import doorIconImg from "@/assets/images/exit.png";
import sendBtnImg from "@/assets/images/send.png";
import inputBgImg from "@/assets/images/chat.png";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  bonusPoints?: number;
};

type ConversationResponse = {
  success: boolean;
  data: {
    response: string;
    isFiltered: boolean;
    filterReason?: string;
    bonusPoints?: number;
  };
};

const initialMessage =
  "안녕하시오. 나는 영주의 기억을 잇는 도깨비불이오. 영주의 역사와 문화가 궁금하면 무엇이든 물어보시오.";

function AiMessage({ content }: { content: string }) {
  return (
    <div className="relative mr-auto w-[calc(100%-30px)] max-w-[340px] pl-[18px]">
      <div
        className="absolute left-[4px] top-1/2 h-0 w-0 -translate-y-1/2"
        style={{
          borderTop: "15px solid transparent",
          borderBottom: "15px solid transparent",
          borderRight: "18px solid #3d2f25",
          filter: "drop-shadow(-2px 2px 0 rgba(0, 0, 0, 0.25))",
        }}
      />
      <div
        className="relative min-h-[66px] px-5 py-4 text-[13px] font-bold leading-[1.55] text-[#3b2514] shadow-[0_5px_0_rgba(28,18,12,0.45)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,245,222,0.96) 0%, rgba(244,225,190,0.96) 100%)",
          border: "5px solid #3d2f25",
          boxShadow:
            "inset 0 0 0 2px #7c6247, inset 0 0 0 6px rgba(255,246,224,0.7), 0 5px 0 rgba(28,18,12,0.5)",
        }}
      >
        <span className="pointer-events-none absolute left-[7px] top-[7px] h-5 w-5 border-l-[4px] border-t-[4px] border-[#6a523b]" />
        <span className="pointer-events-none absolute right-[7px] top-[7px] h-5 w-5 border-r-[4px] border-t-[4px] border-[#6a523b]" />
        <span className="pointer-events-none absolute bottom-[7px] left-[7px] h-5 w-5 border-b-[4px] border-l-[4px] border-[#6a523b]" />
        <span className="pointer-events-none absolute bottom-[7px] right-[7px] h-5 w-5 border-b-[4px] border-r-[4px] border-[#6a523b]" />
        <p className="relative z-10 whitespace-pre-wrap break-keep">{content}</p>
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="relative ml-auto w-[calc(100%-34px)] max-w-[330px] pr-[18px]">
      <div
        className="absolute right-[4px] top-1/2 h-0 w-0 -translate-y-1/2"
        style={{
          borderTop: "17px solid transparent",
          borderBottom: "17px solid transparent",
          borderLeft: "20px solid #7b2f2f",
          filter: "drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.28))",
        }}
      />
      <div
        className="relative min-h-[72px] px-5 py-4 text-[13px] font-bold leading-[1.55] text-[#321909] shadow-[0_5px_0_rgba(45,14,12,0.45)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(225,190,107,0.97) 0%, rgba(202,158,73,0.97) 100%)",
          border: "5px solid #7b2f2f",
          boxShadow:
            "inset 0 0 0 2px #e5c66f, inset 0 0 0 6px rgba(120,43,36,0.28), 0 5px 0 rgba(45,14,12,0.5)",
        }}
      >
        <span className="pointer-events-none absolute left-[7px] top-[7px] h-4 w-4 border-l-[4px] border-t-[4px] border-[#f4d67a]" />
        <span className="pointer-events-none absolute right-[7px] top-[7px] h-4 w-4 border-r-[4px] border-t-[4px] border-[#f4d67a]" />
        <span className="pointer-events-none absolute bottom-[7px] left-[7px] h-4 w-4 border-b-[4px] border-l-[4px] border-[#f4d67a]" />
        <span className="pointer-events-none absolute bottom-[7px] right-[7px] h-4 w-4 border-b-[4px] border-r-[4px] border-[#f4d67a]" />
        <p className="relative z-10 whitespace-pre-wrap break-keep">{content}</p>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: initialMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !user) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post<ConversationResponse>("/v1/conversations/chat", {
        userId: user.id,
        characterType: "GOLD_PRINCE_TRANSCENDED",
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.data?.response ?? "잠시 후 다시 물어보시오.",
          bonusPoints: res.data?.bonusPoints,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "미안하오. 지금은 대답이 어렵소. 잠시 후 다시 시도해 주시오.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#24150d] font-inter">
        <header className="relative z-20 flex h-[60px] shrink-0 items-center bg-[#743210] px-4 shadow-[0_3px_0_rgba(57,22,9,0.55)]">
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="flex h-10 w-10 items-center justify-center active:scale-95"
            aria-label="메인으로 돌아가기"
          >
            <img
              src={doorIconImg}
              alt=""
              className="h-[34px] w-[34px] object-contain drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]"
              draggable={false}
            />
          </button>
          <h1 className="flex-1 pr-10 text-center text-[21px] font-black leading-none text-[#edf0d0] drop-shadow-[0_2px_0_rgba(37,16,7,0.9)]">
            도깨비불과 자유 대화
          </h1>
        </header>

        <main className="relative min-h-0 flex-1 overflow-hidden">
          <img
            src={mapBackgroundImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            draggable={false}
          />
          <img
            src={dragonPatternImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[#b7aa8d]/35" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#1f1713]/60 to-transparent" />

          <img
            src={fireImg}
            alt="도깨비불"
            className="pointer-events-none absolute -left-[48px] bottom-[106px] z-10 w-[226px] object-contain drop-shadow-[0_0_13px_rgba(43,185,255,0.9)]"
            draggable={false}
          />

          <div className="relative z-20 h-full overflow-y-auto overscroll-contain px-5 pb-5 pt-6">
            <div className="flex min-h-full flex-col gap-5 py-3">
              <div className="mt-auto" />
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "assistant" ? (
                    <AiMessage content={msg.content} />
                  ) : (
                    <UserMessage content={msg.content} />
                  )}
                  {msg.bonusPoints ? (
                    <p className="mt-2 pr-6 text-right text-[12px] font-black text-[#fff0a3] drop-shadow-[0_2px_0_rgba(61,23,9,0.9)]">
                      +{msg.bonusPoints} 포인트 획득!
                    </p>
                  ) : null}
                </div>
              ))}
              {loading ? <AiMessage content="생각 중이오..." /> : null}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="relative z-30 flex h-[45px] shrink-0 items-center gap-[5px] bg-[#172036] px-[3px] pb-[7px] pt-[5px]"
        >
          <label className="relative h-[33px] min-w-0 flex-1" aria-label="질문 입력">
            <img
              src={inputBgImg}
              alt=""
              className="absolute inset-0 h-full w-full object-fill"
              draggable={false}
            />
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="질문을 입력하시오"
              className="relative z-10 h-full w-full bg-transparent px-6 pb-[2px] text-[14px] font-bold text-[#2f2217] outline-none placeholder:text-[#88705c] disabled:opacity-60"
              disabled={loading || !user}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !input.trim() || !user}
            className="h-[34px] w-[62px] shrink-0 active:scale-95 disabled:opacity-55"
            aria-label="전송"
          >
            <img
              src={sendBtnImg}
              alt=""
              className="h-full w-full object-fill"
              draggable={false}
            />
          </button>
        </form>
      </div>
    </MobileFrameLayout>
  );
}
