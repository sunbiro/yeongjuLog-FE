import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import claimRewardImg from "@/assets/images/claim_reward.png";
import moneyIconImg from "@/assets/images/money_icon.png";
import rewardBackground from "@/assets/images/reward_background.jpg";

export default function RewardPage() {
  const navigate = useNavigate();

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-[#17111a] font-inter text-black">
        <img
          src={rewardBackground}
          alt="미션 성공 리워드 지급"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <img
          src={moneyIconImg}
          alt="엽전"
          className="absolute left-[310px] top-[498px] h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 object-contain"
          draggable={false}
        />

        <div className="absolute left-1/2 top-[596px] flex w-[306px] -translate-x-1/2 flex-col items-center gap-7 text-center">
          <p className="w-full text-[16px] font-black leading-[24px]">
            밀서조각 #1 - '피 맺힌 맹세'를 획득했습니다.
          </p>

          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="h-[86px] w-[258px] transition-transform active:scale-[0.98]"
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
