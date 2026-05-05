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
import SosuSeowonQuizPage from "@/pages/SosuSeowonQuizPage";
import MuseumPage from "@/pages/MuseumPage";
import MuseumListPage from "@/pages/MuseumListPage";
import MuseumQuizPage from "@/pages/MuseumQuizPage";
import SeonbichonPage from "@/pages/SeonbichonPage";
import SeonbichonQuizPage from "@/pages/SeonbichonQuizPage";
import AIChatPage from "@/pages/AIChatPage";
import AIChatPageFood from "@/pages/AIChatPage_food";
import FoodPage from "@/pages/FoodPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/oauth/kakao/callback", element: <KakaoCallbackPage /> },
  { path: "/theme", element: <ThemeSelectPage /> },
  { path: "/char-setup", element: <CharSetupPage /> },
  { path: "/char-result", element: <CharResultPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/sosu-seowon", element: <SosuSeowonPage /> },
  { path: "/sosu-seowon-quiz", element: <SosuSeowonQuizPage /> },
  { path: "/museum", element: <MuseumPage /> },
  { path: "/museum-list", element: <MuseumListPage /> },
  { path: "/museum-quiz", element: <MuseumQuizPage /> },
  { path: "/place4", element: <SeonbichonPage /> },
  { path: "/place4-quiz", element: <SeonbichonQuizPage /> },
  { path: "/reward", element: <RewardPage /> },
  { path: "/inventory", element: <InventoryPage /> },
  { path: "/market", element: <MarketPage /> },
  { path: "/ai-chat", element: <AIChatPage /> },
  { path: "/ai-chat-food", element: <AIChatPageFood /> },
  { path: "/food", element: <FoodPage /> },
]);
