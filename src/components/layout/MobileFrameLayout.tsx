import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PropsWithChildren } from "react";

type MobileFrameLayoutProps = PropsWithChildren<{
  padded?: boolean;
}>;

const BASE_FRAME_WIDTH = 390;
const BASE_FRAME_HEIGHT = 844;

export default function MobileFrameLayout({
  children,
  padded = true,
}: MobileFrameLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      // Subtract safe-area padding so the frame never overflows and gets clipped
      const style = getComputedStyle(el);
      const contentWidth =
        el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const contentHeight =
        el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setScale(Math.min(contentWidth / BASE_FRAME_WIDTH, contentHeight / BASE_FRAME_HEIGHT));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const shellStyle = {
    width: BASE_FRAME_WIDTH * scale,
    height: BASE_FRAME_HEIGHT * scale,
  } satisfies CSSProperties;

  const frameStyle = {
    transform: `scale(${scale})`,
  } satisfies CSSProperties;

  return (
    <div ref={containerRef} className="app-bg">
      <div className="mobile-frame-shell" style={shellStyle}>
        <div className="mobile-frame" style={frameStyle}>
          <div className={padded ? "safe-screen" : "h-full w-full"}>{children}</div>
        </div>
      </div>
    </div>
  );
}
