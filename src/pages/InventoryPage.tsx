import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import backgroundInven from "@/assets/images/background_inven.png";
import mainBackground from "@/assets/images/main_background.jpg";
import inventoryButtonImg from "@/assets/images/inven.png";
import mapButtonImg from "@/assets/images/map.png";
import marketButtonImg from "@/assets/images/market.png";
import moneyImg from "@/assets/images/money.png";
import navBgImg from "@/assets/images/Rectangle 3.png";
import dividerImg from "@/assets/images/Rectangle 2.png";
import relicCardImg from "@/assets/images/4c21fdde-1cba-4b9c-ae63-45bf5ec5ab6f 1.png";
import relicBadgeImg from "@/assets/images/스크린샷 2026-04-12 오전 2.18.41 1.png";

const navItems = [
  {
    id: "inventory",
    image: inventoryButtonImg,
    alt: "인벤토리",
    top: 758,
    left: 9,
    width: 135,
    height: 70,
    path: "/inventory",
  },
  {
    id: "map",
    image: mapButtonImg,
    alt: "지도",
    top: 762,
    left: 144,
    width: 120,
    height: 66,
    path: "/main",
  },
  {
    id: "market",
    image: marketButtonImg,
    alt: "상점",
    top: 762,
    left: 266,
    width: 123,
    height: 66,
    path: "/market",
  },
] as const;

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-darkslateblue text-center text-lg text-black font-inter">
        <img
          src={mainBackground}
          alt=""
          className="absolute left-0 top-0 h-[844px] w-[391px] object-cover opacity-70"
          draggable={false}
        />
        <img
          src={backgroundInven}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <button
          type="button"
          onClick={() => navigate("/main")}
          className="absolute left-[252px] top-[5px] h-[39px] w-[139px]"
        >
          <img
            src={moneyImg}
            alt="보유 재화"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </button>

        <img
          src={relicCardImg}
          alt="밀서 조각 카드"
          className="absolute left-[27px] top-[251px] h-[78px] w-[78px] object-cover"
          draggable={false}
        />
        <img
          src={relicBadgeImg}
          alt="밀서 조각 배지"
          className="absolute left-[119px] top-[259px] h-[59px] w-[70px] object-cover"
          draggable={false}
        />

        <div className="absolute left-[39px] top-[561px] h-[194px] w-[317px] text-left text-[18px] font-medium leading-10 tracking-[2px] text-[#111111]">
          밀서조각#1 - 피 맺힌 맹세
          <br />
          <br />
          찢어진 밀서 조각이다.
        </div>

        <div className="pointer-events-none absolute left-[-1px] top-[755px] h-[107px] w-[390px] bg-[#7f441e]/70" />
        <img
          src={dividerImg}
          alt=""
          className="pointer-events-none absolute left-0 top-[755px] h-px w-[390px] object-cover opacity-70"
          draggable={false}
        />
        <img
          src={navBgImg}
          alt=""
          className="pointer-events-none absolute left-0 top-[755px] h-[85px] w-[390px] object-cover"
          draggable={false}
        />

        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className="absolute transition-transform active:scale-95"
            style={{
              top: `${item.top}px`,
              left: `${item.left}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
            }}
          >
            <img
              src={item.image}
              alt={item.alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </MobileFrameLayout>
  );
}
