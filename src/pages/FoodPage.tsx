import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import { api } from "@/lib/api";
import foodImg from "@/assets/images/food.jpg";
import foodcharImg from "@/assets/images/foodchar.png";

type RecommendRestaurant = {
  id: number;
  name: string;
  address?: string;
  roadAddress?: string;
  phoneNumber?: string | null;
  category?: string;
  badges?: string[];
  isHighlyRecommended?: boolean;
  menuInfo?: string | null;
  kakaoMapUrl?: string | null;
  naverMapUrl?: string | null;
};

type RecommendAccommodation = {
  id: number;
  name: string;
  roadAddress?: string | null;
  roomCount?: number | null;
  kakaoMapUrl?: string | null;
  naverMapUrl?: string | null;
};

type RecommendByLocationResponse = {
  success: boolean;
  data: {
    locationName: string;
    latitude: number;
    longitude: number;
    restaurantComment: string | null;
    restaurants: RecommendRestaurant[];
    restaurantCount: number;
    accommodationComment: string | null;
    accommodations: RecommendAccommodation[];
    accommodationCount: number;
  };
};

type ViewMode = "restaurants" | "accommodations";

export default function FoodPage() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>("restaurants");
  const [restaurants, setRestaurants] = useState<RecommendRestaurant[]>([]);
  const [accommodations, setAccommodations] = useState<RecommendAccommodation[]>([]);
  const [restaurantComment, setRestaurantComment] = useState<string | null>(null);
  const [accommodationComment, setAccommodationComment] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true);

    api
      .post<RecommendByLocationResponse>("/v1/recommendations/by-location", {
        locationType: "SOSU_MUSEUM",
        radiusKm: 3.0,
        accommodationLimit: 5,
      })
      .then((res) => {
        if (res.data) {
          setRestaurants(res.data.restaurants ?? []);
          setAccommodations(res.data.accommodations ?? []);
          setRestaurantComment(res.data.restaurantComment ?? null);
          setAccommodationComment(res.data.accommodationComment ?? null);
        }
      })
      .catch((err) => console.error("추천 데이터 로딩 실패:", err))
      .finally(() => setDataLoading(false));
  }, []);

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0d0a05]">
        {/* 히어로 */}
        <div className="relative h-[220px] shrink-0 overflow-hidden">
          <img src={foodImg} alt="영주 음식" className="h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#0d0a05]" />
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="absolute left-4 top-10 flex h-8 items-center gap-1 rounded-lg bg-black/60 px-3 text-xs text-white active:scale-95"
          >
            ← 뒤로
          </button>
          <img
            src={foodcharImg}
            alt="음식 안내 캐릭터"
            className="absolute bottom-0 right-3 h-[140px] w-auto object-contain"
            draggable={false}
          />
        </div>

        {/* 타이틀 */}
        <div className="px-5 pb-2 pt-1">
          <h1 className="text-xl font-bold text-[#fee685]">
            {viewMode === "restaurants" ? "영주 맛집 추천" : "영주 숙소 찾기"}
          </h1>
          <p className="mt-0.5 text-xs text-[#a87a4a]">
            소수박물관 기준 · 반경 3km
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-[#7b3306] bg-[#1a0d05]/80 p-1">
            <button
              type="button"
              onClick={() => setViewMode("restaurants")}
              className={`h-9 rounded-md text-[13px] font-black active:scale-95 ${
                viewMode === "restaurants" ? "bg-[#d9a44a] text-[#321909]" : "text-[#fee685]"
              }`}
            >
              맛집
            </button>
            <button
              type="button"
              onClick={() => setViewMode("accommodations")}
              className={`h-9 rounded-md text-[13px] font-black active:scale-95 ${
                viewMode === "accommodations" ? "bg-[#d9a44a] text-[#321909]" : "text-[#fee685]"
              }`}
            >
              숙소
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-8">
          {/* AI 추천 코멘트 */}
          {(dataLoading || (viewMode === "restaurants" ? restaurantComment : accommodationComment)) && (
            <div className="rounded-2xl border border-[#bb4d00] bg-[#2a1a0e] px-4 py-4">
              <p className="mb-2 text-[11px] font-bold tracking-wider text-[#bb4d00]">주모의 추천</p>
              {dataLoading && !(viewMode === "restaurants" ? restaurantComment : accommodationComment) ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#fee685] border-t-transparent" />
                  <p className="text-xs text-[#fee685]/60">추천 문구를 생성하는 중...</p>
                </div>
              ) : (
                <p className="text-sm italic leading-6 text-[#fee685]">
                  "{viewMode === "restaurants" ? restaurantComment : accommodationComment}"
                </p>
              )}
            </div>
          )}

          {/* 목록 로딩 */}
          {dataLoading &&
            ((viewMode === "restaurants" && restaurants.length === 0) ||
              (viewMode === "accommodations" && accommodations.length === 0)) && (
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#bb4d00] border-t-transparent" />
              <p className="text-xs text-[#a87a4a]">
                {viewMode === "restaurants" ? "주변 맛집을 찾는 중..." : "주변 숙소를 찾는 중..."}
              </p>
            </div>
          )}

          {/* 결과 없음 */}
          {!dataLoading && viewMode === "restaurants" && restaurants.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm text-[#a87a4a]">반경 3km 내 등록된 맛집이 없습니다.</p>
            </div>
          )}

          {!dataLoading && viewMode === "accommodations" && accommodations.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm text-[#a87a4a]">반경 3km 내 등록된 숙소가 없습니다.</p>
            </div>
          )}

          {/* 맛집 카드 */}
          {viewMode === "restaurants" && restaurants.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#7b3306] bg-[#1a0d05]/90 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[#fee685]">{r.name}</h2>
                  {r.category && (
                    <p className="mt-0.5 text-[11px] font-medium text-[#bb4d00]">{r.category}</p>
                  )}
                </div>
                {r.isHighlyRecommended && (
                  <span className="shrink-0 rounded-full border border-[#bb4d00]/40 bg-[#bb4d00]/20 px-2 py-0.5 text-[10px] text-[#bb4d00]">
                    강력추천
                  </span>
                )}
              </div>

              {r.badges && r.badges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-[#2a1a0e] px-2 py-0.5 text-[10px] text-[#fef3c6]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {r.menuInfo && (
                <p className="mt-2 text-sm leading-5 text-[#fef3c6]">{r.menuInfo}</p>
              )}

              {(r.roadAddress || r.address) && (
                <p className="mt-2 text-[11px] text-[#7b5c3a]">
                  📍 {r.roadAddress ?? r.address}
                </p>
              )}

              {r.phoneNumber && (
                <p className="mt-0.5 text-[11px] text-[#7b5c3a]">📞 {r.phoneNumber}</p>
              )}

              {(r.kakaoMapUrl || r.naverMapUrl) && (
                <div className="mt-3 flex gap-2">
                  {r.kakaoMapUrl && (
                    <a
                      href={r.kakaoMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-[#fee500] py-1.5 text-center text-[11px] font-bold text-black active:scale-95"
                    >
                      카카오맵
                    </a>
                  )}
                  {r.naverMapUrl && (
                    <a
                      href={r.naverMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-[#03c75a] py-1.5 text-center text-[11px] font-bold text-white active:scale-95"
                    >
                      네이버맵
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 숙소 카드 */}
          {viewMode === "accommodations" && accommodations.map((a) => (
            <div key={a.id} className="rounded-2xl border border-[#7b3306] bg-[#1a0d05]/90 p-4">
              <h2 className="truncate text-base font-bold text-[#fee685]">{a.name}</h2>
              <p className="mt-0.5 text-[11px] font-medium text-[#bb4d00]">숙박시설</p>

              {a.roomCount != null && (
                <p className="mt-2 text-sm leading-5 text-[#fef3c6]">객실 {a.roomCount}개</p>
              )}

              <p className="mt-2 text-[11px] text-[#7b5c3a]">
                📍 {a.roadAddress ?? "주소 정보 없음"}
              </p>

              {a.kakaoMapUrl && (
                <div className="mt-3">
                  <a
                    href={a.kakaoMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg bg-[#fee500] py-1.5 text-center text-[11px] font-bold text-black active:scale-95"
                  >
                    카카오맵
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MobileFrameLayout>
  );
}
