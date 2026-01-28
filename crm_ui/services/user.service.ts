import { api } from "@/libs/api";
import { CreateUserDto, PaginatedResult, User } from "@/types";

export const userService = {
  getAll: async (
    params?: string | Record<string, undefined>,
  ): Promise<PaginatedResult<User>> => {
    if (params && typeof params === "string") {
      const { data } = await api.get<PaginatedResult<User>>(`users?${params}`);
      return data;
    }

    const { data } = await api.get<PaginatedResult<User>>("users", {
      params: params,
    });
    return data;
  },

  create: async (user: CreateUserDto): Promise<User> => {
    const { data } = await api.post<User>("users", user);
    console.log(data);
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`users/${id}`);
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
