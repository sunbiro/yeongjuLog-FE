import { useEffect, useState } from "react";
import type { CSSProperties, PropsWithChildren } from "react";

type MobileFrameLayoutProps = PropsWithChildren<{
  padded?: boolean;
}>;

const BASE_FRAME_WIDTH = 390;
const BASE_FRAME_HEIGHT = 844;

function getFrameScale() {
  if (typeof window === "undefined") return 1;

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  // window.innerHeight ignores the soft keyboard so the frame doesn't shrink when typing
  const viewportHeight = window.innerHeight;

  return Math.min(
    viewportWidth / BASE_FRAME_WIDTH,
    viewportHeight / BASE_FRAME_HEIGHT,
  );
}

export default function MobileFrameLayout({
  children,
  padded = true,
}: MobileFrameLayoutProps) {
  const [scale, setScale] = useState(getFrameScale);

  useEffect(() => {
    const updateScale = () => setScale(getFrameScale());

    updateScale();
    // window resize covers both real viewport changes and orientation changes.
    // We intentionally skip visualViewport resize to avoid shrinking on keyboard open.
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const shellStyle = {
    width: BASE_FRAME_WIDTH * scale,
    height: BASE_FRAME_HEIGHT * scale,
  } satisfies CSSProperties;

  const frameStyle = {
    transform: `scale(${scale})`,
  } satisfies CSSProperties;

  return (
    <div className="app-bg">
      <div className="mobile-frame-shell" style={shellStyle}>
        <div className="mobile-frame" style={frameStyle}>
          <div className={padded ? "safe-screen" : "h-full w-full"}>{children}</div>
        </div>
      </div>
    </div>
  );
}
