import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import backgroundInven from "@/assets/images/background_inven.png";
import mainBackground from "@/assets/images/main_background.jpg";
import inventoryButtonImg from "@/assets/images/inven.png";
import mapButtonImg from "@/assets/images/map.png";
import marketButtonImg from "@/assets/images/market.png";
import moneyImg from "@/assets/images/money.png";
import navBgImg from "@/assets/images/Rectangle 3.png";
import dividerImg from "@/assets/images/Rectangle 2.png";
import relicCardImg from "@/assets/images/4c21fdde-1cba-4b9c-ae63-45bf5ec5ab6f 1.png";

type SecretLetter = {
  id: number;
  sequenceNumber: number;
  title: string;
  content: string;
  description: string;
};

type UserSecretLetter = {
  id: number;
  secretLetter: SecretLetter;
  locationName: string;
  collectionOrder: number;
};

type SecretLetterListResponse = {
  success: boolean;
  data: UserSecretLetter[];
};

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
  const { user } = useAuth();

  const [letters, setLetters] = useState<UserSecretLetter[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    api
      .get<SecretLetterListResponse>(`/v1/secret-letters/my?userId=${user.id}`)
      .then((res) => {
        if (res.data) setLetters(res.data);
      })
      .catch((err) => console.error("밀서 조각 로딩 실패:", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const selected = letters[selectedIndex] ?? null;

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-darkslateblue font-inter text-black">
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

        {/* 포인트 버튼 */}
        <button
          type="button"
          onClick={() => navigate("/main")}
          className="absolute left-[252px] top-[5px] h-[39px] w-[139px]"
        >
          <img src={moneyImg} alt="보유 재화" className="h-full w-full object-cover" draggable={false} />
        </button>

        {/* 밀서 조각 진행도 (0/3 ~ 3/3) */}
        <div className="absolute left-[16px] top-[60px] flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#7b3306]">밀서 조각</span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full border-2 border-[#7b3306] ${
                  i < letters.length ? "bg-[#bb4d00]" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] text-[#7b3306]">{letters.length}/3</span>
        </div>

        {/* 카드 목록 (수평 스크롤) */}
        <div className="absolute left-6 top-[250px] flex w-full gap-3 overflow-x-auto px-4 pb-2">
          {loading ? (
            <p className="text-sm text-[#7b3306]">불러오는 중...</p>
          ) : letters.length === 0 ? (
            <p className="text-sm text-[#7b3306]">아직 수집한 밀서 조각이 없습니다.</p>
          ) : (
            letters.map((ul, i) => (
              <button
                key={ul.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`relative shrink-0 rounded-lg border-2 transition-transform active:scale-95 ${
                  selectedIndex === i ? "border-[#bb4d00] scale-105" : "border-transparent"
                }`}
              >
                <img
                  src={relicCardImg}
                  alt={ul.secretLetter.title}
                  className="h-[60px] w-[60px] object-cover"
                  draggable={false}
                />
                <span className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black/50 py-0.5 text-center text-[9px] text-white">
                  #{ul.secretLetter.sequenceNumber}
                </span>
              </button>
            ))
          )}
        </div>

        {/* 선택된 밀서 조각 상세 */}
        <div className="absolute left-[17px] top-[490px] h-[230px] w-[358px] overflow-y-auto rounded-xl bg-[#fffbeb]/0 p-5">
          {selected ? (
            <>
              <p className="text-[18px] font-bold leading-7 tracking-[1px] text-[#3d1f00]">
                밀서조각#{selected.secretLetter.sequenceNumber} - {selected.secretLetter.title}
              </p>
              <p className="mt-1 text-[12px] text-[#7b5c3a]">
                수집 장소: {selected.locationName}
              </p>
              <p className="mt-1 text-[12px] text-[#7b5c3a]">
                수집 순서: {selected.collectionOrder}번째
              </p>
              <div className="mt-4 rounded-lg border border-[#bb4d00]/30 bg-[#fff7ed] p-3">
                <p className="text-[13px] italic leading-6 text-[#7b3306]">
                  {selected.secretLetter.description}
                </p>
              </div>
              <p className="mt-4 text-[14px] leading-7 text-[#3d1f00]">
                {selected.secretLetter.content}
              </p>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-[#7b5c3a]">
                {loading ? "불러오는 중..." : "밀서 조각을 수집하면 이곳에 표시됩니다."}
              </p>
            </div>
          )}
        </div>

        {/* 하단 네비게이션 */}
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
            <img src={item.image} alt={item.alt} className="h-full w-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </MobileFrameLayout>
  );
}
