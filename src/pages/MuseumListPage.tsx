import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import div01Img from "@/assets/images/div01.png";
import div02Img from "@/assets/images/div02.png";
import div03Img from "@/assets/images/div03.png";
import div04Img from "@/assets/images/div04.png";
import div05Img from "@/assets/images/div05.png";
import give02Img from "@/assets/images/give02.png";
import listBackground from "@/assets/images/list_background.jpg";
import nextPageImg from "@/assets/images/nextpage.png";

type ArtifactCard = {
  id: string;
  image: string;
  title: string;
  top: number;
  labelTop: number;
  labelLeft?: number;
};

const artifactCards: ArtifactCard[] = [
  {
    id: "geumseong-record",
    image: div01Img,
    title: "금성대군 실기(1909)",
    top: 137,
    labelTop: 119,
    labelLeft: 125,
  },
  {
    id: "haedong-myeongjeok",
    image: div02Img,
    title: "해동명적 (3921)",
    top: 386,
    labelTop: 370,
  },
  {
    id: "sosu-admission",
    image: div03Img,
    title: "소수서원 입원록(340)",
    top: 635,
    labelTop: 619,
  },
  {
    id: "baegundong-signboard",
    image: div04Img,
    title: "백운동현판(24)",
    top: 884,
    labelTop: 865,
  },
  {
    id: "ju-sebung-portrait",
    image: div05Img,
    title: "주세붕초상(3)",
    top: 1133,
    labelTop: 1119,
  },
];

export default function MuseumListPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startY: 0,
    startScrollTop: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if ((event.target as HTMLElement).closest("button, a")) return;

    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: scrollRef.current.scrollTop,
    };
    scrollRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!scrollRef.current || !dragState.isDragging || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaY = event.clientY - dragState.startY;
    scrollRef.current.scrollTop = dragState.startScrollTop - deltaY;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!scrollRef.current || dragState.pointerId !== event.pointerId) return;

    if (scrollRef.current.hasPointerCapture(event.pointerId)) {
      scrollRef.current.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current.isDragging = false;
    setIsDragging(false);
  };

  return (
    <MobileFrameLayout padded={false}>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="relative h-full w-full select-none overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-inter text-black"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="relative h-[1446px] w-full">
          <img
            src={listBackground}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <a
            href="https://yjlove.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-0 top-0 z-20 w-full"
            aria-label="고향사랑기부제 바로가기"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <img
              src={give02Img}
              alt=""
              className="w-full object-cover"
              draggable={false}
            />
          </a>

          {artifactCards.map((card) => (
            <div key={card.id}>
              <div
                className="absolute flex h-[195px] w-[352px] items-center justify-center overflow-hidden rounded-[10px] border-[3px] border-solid border-white bg-white"
                style={{ left: 16, top: card.top }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </div>

              <div
                className="absolute z-10 flex h-[35px] w-[136px] items-center justify-center rounded-[10px] bg-[#d9d9d9] px-1"
                style={{ left: card.labelLeft ?? 121, top: card.labelTop }}
              >
                <p className="w-full text-center text-[14px] font-bold leading-[20px] tracking-[-0.1504px]">
                  {card.title}
                </p>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => navigate("/museum-quiz")}
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute left-[92px] top-[1363px] z-20 h-[83px] w-[200px] cursor-pointer transition-transform active:scale-95"
            aria-label="다음 페이지로 이동"
          >
            <img
              src={nextPageImg}
              alt=""
              className="h-full w-full max-w-none object-contain"
              draggable={false}
            />
          </button>
        </div>
      </div>
    </MobileFrameLayout>
  );
}
