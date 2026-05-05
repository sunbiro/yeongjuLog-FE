import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import fireImg from "@/assets/images/fire.png";
import infoImg from "@/assets/images/info.png";
import seonbichonBackground from "@/assets/images/place02_background.png";

export default function SeonbichonPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <button
        type="button"
        onClick={() => navigate("/place4-quiz")}
        className="relative block h-full w-full overflow-hidden bg-black text-left font-inter"
        aria-label="선비촌 기록을 읽고 다음으로 넘어가기"
      >
        <img
          src={seonbichonBackground}
          alt="선비촌"
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
            "이곳 선비촌은 조선의 선비정신이 살아 숨쉬는 곳이라네. 유교의
            가르침을 바탕으로 학문과 덕을 쌓으며 살았던 선비들의 일상이
            고스란히 담겨 있지."
          </p>
          <p className="mt-3">
            "이른 새벽부터 경전을 읽고 예법을 익히며 나라를 걱정하는 마음으로
            하루를 보냈던 선비들... 그 올곧은 기개와 청렴한 정신이 바로 이
            영주 땅에 뿌리내려 지금의 선비촌으로 남았다네. 학문을 숭상하던
            이들의 삶의 방식이 이 공간에 고스란히 살아 숨쉬고 있지."
          </p>
        </div>
      </button>
    </MobileFrameLayout>
  );
}
