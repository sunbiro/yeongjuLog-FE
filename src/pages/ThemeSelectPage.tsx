import { useNavigate } from "react-router";

import MobileFrameLayout from "@/components/layout/MobileFrameLayout";
import mainBackground from "@/assets/images/main_background.jpg";
import theme01Img from "@/assets/images/theme01.jpg";
import theme02Img from "@/assets/images/theme02.jpg";
import theme03Img from "@/assets/images/theme03.jpg";

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
    navigate("/char-setup");
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

        <div className="absolute inset-x-0 top-[176px] flex flex-col items-center gap-3.5 px-6">
          {themes.map(({ id, image, enabled, alt }) => (
            <button
              key={id}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && handleSelect(id)}
              className={[
                "relative w-full transition-transform duration-200",
                enabled ? "cursor-pointer active:scale-[0.985]" : "cursor-not-allowed opacity-90",
              ].join(" ")}
            >
              <img
                src={image}
                alt={alt}
                className="block w-full"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </MobileFrameLayout>
  );
}
