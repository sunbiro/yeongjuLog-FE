import { useLocation, useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import claimRewardImg from "@/assets/images/claim_reward.png";
import moneyIconImg from "@/assets/images/money_icon.png";
import rewardBackground from "@/assets/images/reward_background.jpg";
import relicCardImg from "@/assets/images/4c21fdde-1cba-4b9c-ae63-45bf5ec5ab6f 1.png";

type SecretLetter = {
  id: number;
  sequenceNumber: number;
  title: string;
  content: string;
  description: string;
};

type RewardState = {
  rewardPoints: number;
  totalPoints: number;
  secretLetter: SecretLetter | null;
  isGoldShrineUnlocked: boolean;
};

export default function RewardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RewardState | null;

  const rewardPoints = state?.rewardPoints ?? 0;
  const secretLetter = state?.secretLetter ?? null;
  const isGoldShrineUnlocked = state?.isGoldShrineUnlocked ?? false;

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-[#17111a] font-inter text-black">
        <img
          src={rewardBackground}
          alt="미션 성공 리워드 지급"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* 금성대군 사당 해금 배너 */}
        {isGoldShrineUnlocked && (
          <div className="absolute left-1/2 top-[60px] w-[320px] -translate-x-1/2 rounded-2xl border-2 border-[#fee685] bg-black/70 px-4 py-3 text-center">
            <p className="text-[13px] font-bold leading-6 text-[#fee685]">
              ✨ 금성대군 사당이 해금되었습니다! ✨
            </p>
          </div>
        )}

        {/* 밀서 조각 카드 */}
        {secretLetter && (
          <div className="absolute left-1/2 top-[200px] -translate-x-1/2">
            <div className="relative">
              <img
                src={relicCardImg}
                alt={secretLetter.title}
                className="h-[160px] w-[160px] object-cover drop-shadow-[0_8px_24px_rgba(187,77,0,0.6)]"
                draggable={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/40 px-2 text-center">
                <p className="text-[11px] font-bold text-[#fee685]">
                  밀서 조각 #{secretLetter.sequenceNumber}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-[#fef3c6]">
                  {secretLetter.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 엽전 아이콘 */}
        <img
          src={moneyIconImg}
          alt="엽전"
          className="absolute left-[310px] top-[498px] h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 object-contain"
          draggable={false}
        />

        {/* 보상 텍스트 */}
        <div className="absolute left-1/2 top-[596px] flex w-[306px] -translate-x-1/2 flex-col items-center gap-4 text-center">
          {secretLetter ? (
            <p className="w-full text-[16px] font-black leading-[26px]">
              밀서조각 #{secretLetter.sequenceNumber} - '{secretLetter.title}'를 획득했습니다.
              {"\n"}
              <span className="text-[13px] font-medium leading-5 text-[#7b3306]">
                {secretLetter.description}
              </span>
            </p>
          ) : (
            <p className="w-full text-[16px] font-black leading-[26px]">
              미션을 완료했습니다!
            </p>
          )}

          {rewardPoints > 0 && (
            <p className="text-[14px] font-bold text-[#bb4d00]">
              +{rewardPoints} 엽전 획득
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/ai-chat")}
            className="mt-1 h-[86px] w-[258px] transition-transform active:scale-[0.98]"
            aria-label="리워드 수령"
          >
            <img
              src={claimRewardImg}
              alt="CLAIM REWARD 리워드 수령"
              className="h-full w-full object-contain"
              draggable={false}
            />
          </button>
        </div>
      </div>
    </MobileFrameLayout>
  );
}
