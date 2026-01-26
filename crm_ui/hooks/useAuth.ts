// hooks/use-auth.ts
import { create } from "zustand";
import { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem("accessToken", token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
