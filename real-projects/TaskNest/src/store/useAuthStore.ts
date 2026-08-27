import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

const savedToken = localStorage.getItem("tasknest_token");
const savedUser = localStorage.getItem("tasknest_user");

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  setAuth: (user, token) => {
    localStorage.setItem("tasknest_token", token);
    localStorage.setItem("tasknest_user", JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("tasknest_token");
    localStorage.removeItem("tasknest_user");
    set({ user: null, token: null });
  }
}));
