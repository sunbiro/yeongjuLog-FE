import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import talkImg from "@/assets/images/talk.png";
import chatWindowImg from "@/assets/images/찐대화창 3.png";
import charImg from "@/assets/images/char.png";

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

export default function AIChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const characterImageUrl = sessionStorage.getItem("charImageUrl");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "안녕하시오! 나는 영주를 지키는 선비라오. 영주의 역사와 문화에 대해 궁금한 것이 있으면 무엇이든 물어보시오.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || !user) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post<ConversationResponse>("/v1/conversations/chat", {
        userId: user.id,
        characterType: "GOLD_PRINCE",
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
          content: "죄송합니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0d0a05]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a1500_0%,#0d0a05_70%)]" />

        {/* 헤더 */}
        <div className="relative flex items-center px-4 pt-10 pb-2">
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-lg text-white active:scale-95"
          >
            ←
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-[#fee685]">AI 선비와 대화</h1>
          <div className="h-8 w-8" />
        </div>

        {/* 캐릭터 + 말풍선 */}
        <div className="relative flex h-[170px] shrink-0 items-end justify-center">
          <img
            src={talkImg}
            alt=""
            className="absolute right-[55px] top-[8px] h-[65px] w-[110px] object-contain"
            draggable={false}
          />
          <img
            src={characterImageUrl ?? charImg}
            alt="캐릭터"
            className="h-[150px] w-auto object-contain"
            draggable={false}
          />
        </div>

        {/* 채팅창 */}
        <div className="relative mx-4 mb-3 flex-1 overflow-hidden rounded-2xl">
          <img
            src={chatWindowImg}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-fill"
            draggable={false}
          />
          <div className="relative flex h-full flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-[#bb4d00] text-white"
                      : "rounded-tl-sm border border-[#7b3306] bg-[#2a1a0e]/90 text-[#fee685]"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.bonusPoints ? (
                  <span className="mt-1 text-[11px] font-bold text-[#fee685]">
                    +{msg.bonusPoints} 포인트 획득!
                  </span>
                ) : null}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm border border-[#7b3306] bg-[#2a1a0e]/90 px-4 py-2 text-sm text-[#fee685]">
                  ···
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력창 */}
        <form onSubmit={handleSend} className="relative flex gap-2 px-4 pb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하시오..."
            className="h-12 flex-1 rounded-xl border border-[#7b3306] bg-[#2a1a0e] px-4 text-sm text-[#fef3c6] outline-none placeholder:text-[#7b5c3a] focus:border-[#fee685]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-12 rounded-xl bg-[#bb4d00] px-5 text-sm font-bold text-white disabled:opacity-40 active:scale-95"
          >
            전송
          </button>
        </form>
      </div>
    </MobileFrameLayout>
  );
}
