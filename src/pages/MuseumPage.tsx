import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import letterImg from "@/assets/images/4c21fdde-1cba-4b9c-ae63-45bf5ec5ab6f 1.png";
import goListImg from "@/assets/images/golist.png";
import infoImg from "@/assets/images/info.png";
import museumBackground from "@/assets/images/museum_background.jpg";

export default function MuseumPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <main className="relative h-full w-full overflow-hidden border-[3px] border-solid border-black bg-darkslateblue font-inter text-black">
        <img
          src={museumBackground}
          alt="소수박물관 전경"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          draggable={false}
        />

        <img
          src={letterImg}
          alt="밀서"
          className="absolute left-1/2 top-[31.3%] h-[27.6%] w-[59.7%] max-w-none -translate-x-1/2 object-contain opacity-90"
          draggable={false}
        />

        <img
          src={infoImg}
          alt=""
          className="absolute bottom-0 left-1/2 h-[37%] w-[102.5%] max-w-none -translate-x-1/2 object-cover"
          draggable={false}
        />

        <section className="absolute bottom-[12.4%] left-1/2 flex h-[20.9%] w-full -translate-x-1/2 items-center justify-center text-center">
          <p className="text-[clamp(9px,2.82vw,10px)] font-bold leading-[2.72]">
            박물관의 문턱을 넘는 순간, 첫 번째 밀서가 갑작스레 떨리기 시작한다.
            <br />
            강렬한 빛과 진동 속에서, 오래 잠들어 있던 과거의 파편들이 하나둘 깨어난다.
            <br />
            빛은 길을 인도하듯 흩어진 기록물들을 추적하고, 당신을 깊은 역사 속으로 이끈다.
            <br />
            마침내 마주한 것은, 국가의 이름으로 봉인된 금성대군의 생애 기록.
            <br />
            그의 숨겨진 진실이, 지금 당신의 선택을 기다리고 있다.
          </p>
        </section>

        <button
          type="button"
          onClick={() => navigate("/museum-list")}
          className="absolute bottom-[1.7%] left-1/2 h-[11.1%] w-[54.9%] -translate-x-1/2 transition-transform active:scale-95"
          aria-label="유물 리스트 보러가기"
        >
          <img
            src={goListImg}
            alt=""
            className="h-full w-full max-w-none object-contain"
            draggable={false}
          />
        </button>
      </main>
    </MobileFrameLayout>
  );
}
