import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import backgroundMarket from "@/assets/images/background_market.png";
import mainBackground from "@/assets/images/main_background.jpg";
import inventoryButtonImg from "@/assets/images/inven.png";
import mapButtonImg from "@/assets/images/map.png";
import marketButtonImg from "@/assets/images/market.png";
import marketCardImg from "@/assets/images/스크린샷 2026-04-12 오전 1.23.16 1.png";
import pointCardImg from "@/assets/images/스크린샷 2026-04-12 오전 1.23.30 1.png";
import ticketCardImg from "@/assets/images/스크린샷 2026-04-12 오전 1.24.16 1.png";
import pointLabelImg from "@/assets/images/포인트.png";
import ticketLabelImg from "@/assets/images/상품권.png";
import navBgImg from "@/assets/images/Rectangle 3.png";

const navItems = [
  {
    id: "inventory",
    image: inventoryButtonImg,
    alt: "인벤토리",
    top: 758,
    left: 10,
    width: 135,
    height: 70,
    path: "/inventory",
  },
  {
    id: "map",
    image: mapButtonImg,
    alt: "지도",
    top: 762,
    left: 146,
    width: 123,
    height: 66,
    path: "/main",
  },
  {
    id: "market",
    image: marketButtonImg,
    alt: "장터",
    top: 762,
    left: 265,
    width: 120,
    height: 66,
    path: "/market",
  },
] as const;

export default function MarketPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden border-[3px] border-solid border-black bg-darkslateblue box-border text-center text-2xl text-black font-inter">
        <img
          src={mainBackground}
          alt=""
          className="absolute left-0 top-0 h-[844px] w-[391px] object-cover opacity-70"
          draggable={false}
        />
        <img
          src={backgroundMarket}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <img
          src={marketCardImg}
          alt="장터 안내"
          className="absolute left-[36px] top-[640px] h-[104px] w-80 object-cover"
          draggable={false}
        />
        <img
          src={pointCardImg}
          alt="포인트 상점"
          className="absolute left-[41px] top-[566px] h-[79px] w-[309px] object-cover"
          draggable={false}
        />
        <img
          src={ticketCardImg}
          alt="상품권 상점"
          className="absolute left-[29px] top-[165px] h-[79px] w-[338px] object-cover"
          draggable={false}
        />

        <div className="pointer-events-none absolute left-0 top-[755px] h-[107px] w-[390px] bg-[#7f441e]/70" />
        <img
          src={navBgImg}
          alt=""
          className="pointer-events-none absolute left-0 top-[755px] h-[85px] w-[390px] object-cover"
          draggable={false}
        />

        <img
          src={pointLabelImg}
          alt="포인트"
          className="absolute left-[69px] top-[423px] h-[23px] w-[69px] object-cover"
          draggable={false}
        />
        <img
          src={ticketLabelImg}
          alt="상품권"
          className="absolute left-[258px] top-[423px] h-[23px] w-[69px] object-cover"
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
