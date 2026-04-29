import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/LoginPage";
import KakaoCallbackPage from "@/pages/KakaoCallbackPage";
import ThemeSelectPage from "@/pages/ThemeSelectPage";
import CharSetupPage from "@/pages/CharSetupPage";
import CharResultPage from "@/pages/CharResultPage";
import MainPage from "@/pages/MainPage";
import InventoryPage from "@/pages/InventoryPage";
import MarketPage from "@/pages/MarketPage";
import RewardPage from "@/pages/RewardPage";
import SosuSeowonPage from "@/pages/SosuSeowonPage";
import AIChatPage from "@/pages/AIChatPage";
import FoodPage from "@/pages/FoodPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/oauth/kakao/callback", element: <KakaoCallbackPage /> },
  { path: "/theme", element: <ThemeSelectPage /> },
  { path: "/char-setup", element: <CharSetupPage /> },
  { path: "/char-result", element: <CharResultPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/sosu-seowon", element: <SosuSeowonPage /> },
  { path: "/reward", element: <RewardPage /> },
  { path: "/inventory", element: <InventoryPage /> },
  { path: "/market", element: <MarketPage /> },
  { path: "/ai-chat", element: <AIChatPage /> },
  { path: "/food", element: <FoodPage /> },
]);
