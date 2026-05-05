import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { useAuth } from "@/context/AuthContext";
import { ApiError, api } from "@/lib/api";
import backgroundMain from "@/assets/images/background_main.png";
import mainBackground from "@/assets/images/main_background.jpg";
import charImg from "@/assets/images/char.png";
import invenImg from "@/assets/images/inven.png";
import mapImg from "@/assets/images/map.png";
import marketImg from "@/assets/images/market.png";
import moneyImg from "@/assets/images/money.png";
import place01Img from "@/assets/images/place01.png";
import place02Img from "@/assets/images/place02.png";
import place03Img from "@/assets/images/place03.png";
import place04Img from "@/assets/images/place04.png";
import place05Img from "@/assets/images/place05.png";
import place06Img from "@/assets/images/place06.png";
import place07Img from "@/assets/images/place07.png";
import place08Img from "@/assets/images/place08.png";
import dividerImg from "@/assets/images/Rectangle 2.png";
import navBgImg from "@/assets/images/Rectangle 3.png";

type Marker = {
  id: string;
  image: string;
  alt: string;
  top: number;
  left: number;
  width: number;
  height: number;
  path?: string;
};

type NavItem = {
  id: string;
  image: string;
  alt: string;
  top: number;
  left: number;
  width: number;
  height: number;
  path: string;
};

type CharacterResponse = {
  success: boolean;
  data: {
    imageUrl: string;
    characterId: number;
    userId: number;
    createdAt: string;
  } | null;
};

type AuthMeResponse = {
  success?: boolean;
  data?: {
    totalPoint?: number;
    points?: number;
  };
  totalPoint?: number;
  points?: number;
};

const markers: Marker[] = [
  {
    id: "place-01",
    image: place01Img,
    alt: "Buseoksa",
    top: 74,
    left: 151,
    width: 72,
    height: 61,
  },
  {
    id: "place-02",
    image: place02Img,
    alt: "Sosu Seowon",
    top: 335,
    left: 75,
    width: 44,
    height: 59,
    path: "/sosu-seowon",
  },
  {
    id: "place-03",
    image: place06Img,
    alt: "Geumseong Daegun Shrine",
    top: 516,
    left: 58,
    width: 78,
    height: 68,
  },
  {
    id: "place-04",
    image: place08Img,
    alt: "Place 4",
    top: 479,
    left: 297,
    width: 54,
    height: 73,
  },
  {
    id: "place-05",
    image: place07Img,
    alt: "Place 5",
    top: 648,
    left: 285,
    width: 54,
    height: 73,
    path: "/ai-chat-food",
  },
  {
    id: "place-06",
    image: place05Img,
    alt: "Place 6",
    top: 412,
    left: 178,
    width: 54,
    height: 72,
    path: "/museum",
  },
  {
    id: "place-07",
    image: place03Img,
    alt: "Place 7",
    top: 318,
    left: 205,
    width: 45,
    height: 60,
  },
  {
    id: "place-08",
    image: place04Img,
    alt: "Place 8",
    top: 362,
    left: 322,
    width: 68,
    height: 60,
  },
];

const navItems: NavItem[] = [
  {
    id: "inventory",
    image: invenImg,
    alt: "Inventory",
    top: 764,
    left: 8,
    width: 135,
    height: 70,
    path: "/inventory",
  },
  {
    id: "map",
    image: mapImg,
    alt: "Map",
    top: 768,
    left: 143,
    width: 120,
    height: 66,
    path: "/main",
  },
  {
    id: "market",
    image: marketImg,
    alt: "Market",
    top: 766,
    left: 265,
    width: 123,
    height: 66,
    path: "/market",
  },
];

export default function MainPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(
    () => sessionStorage.getItem("charImageUrl"),
  );
  const [failedCharacterImageUrl, setFailedCharacterImageUrl] = useState<string | null>(null);
  const [totalPoint, setTotalPoint] = useState<number | null>(() => user?.points ?? null);

  useEffect(() => {
    if (!user) return;

    api
      .get<AuthMeResponse>("/v1/auth/me")
      .then((res) => {
        const nextTotalPoint = res.data?.totalPoint ?? res.data?.points ?? res.totalPoint ?? res.points;
        if (typeof nextTotalPoint !== "number") return;

        setTotalPoint(nextTotalPoint);
        if (user.points !== nextTotalPoint) {
          updateUser({ ...user, points: nextTotalPoint });
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.errorCode === "A004") {
          logout();
          navigate("/", { replace: true });
          return;
        }

        console.error("Failed to load total point:", err);
      });
  }, [logout, navigate, updateUser, user]);

  useEffect(() => {
    if (characterImageUrl || !user?.id) return;

    api
      .get<CharacterResponse>(`/characters/${user.id}/current`)
      .then((res) => {
        if (!res.data?.imageUrl) return;
        if (res.data.imageUrl === failedCharacterImageUrl) return;

        sessionStorage.setItem("charImageUrl", res.data.imageUrl);
        sessionStorage.setItem("characterId", String(res.data.characterId));
        setCharacterImageUrl(res.data.imageUrl);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [characterImageUrl, failedCharacterImageUrl, user?.id]);

  const handleCharacterImageError = () => {
    if (!characterImageUrl) return;

    console.warn("Failed to load character image:", characterImageUrl);
    sessionStorage.removeItem("charImageUrl");
    setFailedCharacterImageUrl(characterImageUrl);
    setCharacterImageUrl(null);
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-darkslateblue">
        <img
          src={mainBackground}
          alt=""
          className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
          draggable={false}
        />
        <img
          src={backgroundMain}
          alt=""
          className="absolute left-0 top-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* 포인트 표시 (클릭 불가) */}
        <img
          src={moneyImg}
          alt="Coins"
          className="absolute left-[7px] top-[26px] h-[39px] w-[139px] object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute left-[7px] top-[24px] flex h-[39px] w-[139px] items-center justify-end pr-[15px] pt-[1px]">
          <span className="min-w-[58px] text-center text-[17px] font-black leading-none text-[#ffd84a] drop-shadow-[0_1px_1px_rgba(45,22,4,0.9)]">
            {(totalPoint ?? user?.points ?? 0).toLocaleString("ko-KR")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/theme")}
          className="absolute left-[317px] top-[15px] flex h-[72px] w-[72px] items-center justify-center"
        >
          <div className="relative flex h-[75px] w-[75px] items-center justify-center">
            {characterImageUrl && (
              <div className="absolute h-[45px] w-[45px] overflow-hidden">
                <img
                  src={characterImageUrl}
                  alt="Character"
                  className="h-full w-full object-cover"
                  draggable={false}
                  onError={handleCharacterImageError}
                />
              </div>
            )}
            <img
              src={charImg}
              alt=""
              className="relative h-full w-full object-contain"
              draggable={false}
            />
          </div>
        </button>

        {markers.map((marker) =>
          marker.path ? (
            <button
              key={marker.id}
              type="button"
              onClick={() => navigate(marker.path!)}
              className="absolute transition-transform active:scale-95"
              style={{
                top: `${marker.top}px`,
                left: `${marker.left}px`,
                width: `${marker.width}px`,
                height: `${marker.height}px`,
              }}
            >
              <img
                src={marker.image}
                alt={marker.alt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ) : (
            <img
              key={marker.id}
              src={marker.image}
              alt={marker.alt}
              className="absolute opacity-50"
              draggable={false}
              style={{
                top: `${marker.top}px`,
                left: `${marker.left}px`,
                width: `${marker.width}px`,
                height: `${marker.height}px`,
              }}
            />
          ),
        )}

        <div className="pointer-events-none absolute left-0 top-[759px] h-[107px] w-[390px] bg-[#7f441e]/70" />
        <img
          src={dividerImg}
          alt=""
          className="pointer-events-none absolute left-0 top-[759px] h-px w-[390px] object-cover opacity-70"
          draggable={false}
        />
        <img
          src={navBgImg}
          alt=""
          className="pointer-events-none absolute left-0 top-[759px] h-[85px] w-[390px] object-cover"
          draggable={false}
        />

        <div className="absolute left-0 top-[759px] flex h-[85px] w-[390px] items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex h-full flex-1 items-center justify-center transition-transform active:scale-95"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="h-[66px] w-full object-contain"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </MobileFrameLayout>
  );
}
