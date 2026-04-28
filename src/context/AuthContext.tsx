import { createContext, useContext, useState, type ReactNode } from "react";

export type User = {
  id: number;
  nickname: string;
  points: number;
  secretLetterCount: number;
  isGoldShrineUnlocked: boolean;
  provider: string;
  profileImageUrl: string | null;
  email: string | null;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthContextValue = AuthState & {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadInitialState(): AuthState {
  const token = localStorage.getItem("accessToken");
  const raw = localStorage.getItem("user");
  const user = raw ? (JSON.parse(raw) as User) : null;
  return { accessToken: token, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  function login(accessToken: string, refreshToken: string, user: User) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setState({ accessToken, user });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setState({ accessToken: null, user: null });
  }

  function updateUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
