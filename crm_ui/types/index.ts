export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface getInfoResponse {
  data: User;
}

export interface SocketNotification {
  type: "NEW_EMPLOYEE" | "UPDATE_ROLE" | "UPLOAD_DONE";
  message: string;
  isRead: boolean;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    user: User;
  };
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  ownerId?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  ownerId?: string;
  assignedToId?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface PaginatedResult<T> {
  data: {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
}
