import { api } from "@/libs/api";
import { CreateUserDto, PaginatedResult, User } from "@/types";

export const userService = {
  getAll: async (params?: string): Promise<PaginatedResult<User>> => {
    const { data } = await api.get<PaginatedResult<User>>("users", {
      params: params,
    });
    return data;
  },

  create: async (user: CreateUserDto): Promise<User> => {
    const { data } = await api.post<User>("users", user);
    return data;
  },

  update: async (id: string, user: User): Promise<User> => {
    const { data } = await api.put<User>(`users/${id}`, user);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/users/${id}`);
  },
};
