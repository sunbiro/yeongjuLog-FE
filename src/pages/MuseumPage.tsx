import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import fireImg from "@/assets/images/fire.png";
import infoImg from "@/assets/images/info.png";
import sosuBackground from "@/assets/images/place02_background.png";

export default function MuseumPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <button
        type="button"
        onClick={() => navigate("/museum-quiz")}
        className="relative block h-full w-full overflow-hidden bg-black text-left font-inter"
        aria-label="소수박물관 기록을 읽고 다음으로 넘어가기"
      >
        <img
          src={sosuBackground}
          alt="소수박물관"
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
          <p>
            "오오... 저것이 나의 생애를 기록한 책인가 보군. 
            하지만 국가의 기록물로 등록되어 엄격히 보호받고 있어 함부로 읽을 수가 없네. 
            공공의 기록(데이터)을 통해 이 책의 '고유한 번호'를 입력하여 봉인을 풀어주게!"
          </p>
        </div>
      </button>
    </MobileFrameLayout>
  );
}
