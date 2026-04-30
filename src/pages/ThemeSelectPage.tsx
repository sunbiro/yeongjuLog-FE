import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import mainBackground from "@/assets/images/main_background.jpg";
import theme01Img from "@/assets/images/Theme01.png";
import theme02Img from "@/assets/images/Theme02.png";
import theme03Img from "@/assets/images/Theme03.png";

type ThemeKey = "geumseong" | "joseon" | "modern";

const themes: { id: ThemeKey; image: string; enabled: boolean; alt: string }[] = [
  { id: "geumseong", image: theme01Img, enabled: true, alt: "금성대군 테마" },
  { id: "joseon", image: theme02Img, enabled: false, alt: "조선 선비 테마" },
  { id: "modern", image: theme03Img, enabled: false, alt: "현대 영주 테마" },
];

export default function ThemeSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (id: ThemeKey) => {
    sessionStorage.setItem("selectedTheme", id);
    navigate("/main");
  };

  return (
    <MobileFrameLayout padded={false}>
      <div className="relative h-full w-full overflow-hidden bg-darkslateblue">
        <img
          src={mainBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-0 bg-[#183b76]/20" />

        <div className="absolute left-[25px] top-[70px] flex w-[340px] flex-col items-start gap-3.5 sm:w-[380px]">
          {themes.map(({ id, image, enabled, alt }) => (
            <button
              key={id}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && handleSelect(id)}
              className={[
                "relative self-stretch overflow-hidden transition-transform duration-200",
                enabled ? "cursor-pointer active:scale-[0.985]" : "cursor-not-allowed opacity-90",
              ].join(" ")}
            >
              <img
                src={image}
                alt={alt}
                className="block w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </MobileFrameLayout>
  );
}
