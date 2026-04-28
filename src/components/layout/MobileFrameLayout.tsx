import type { PropsWithChildren } from "react";

type MobileFrameLayoutProps = PropsWithChildren<{
  padded?: boolean;
}>;

export default function MobileFrameLayout({
  children,
  padded = true,
}: MobileFrameLayoutProps) {
  return (
    <div className="app-bg">
      <div className="mobile-frame">
        <div className={padded ? "safe-screen" : "h-full w-full"}>{children}</div>
      </div>
    </div>
  );
}
