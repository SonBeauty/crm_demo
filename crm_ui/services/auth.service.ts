import { api } from "@/libs/api";
import { AuthResponse, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },
};
