export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface SocketNotification {
  type: "NEW_EMPLOYEE" | "UPDATE_ROLE" | "UPLOAD_DONE";
  message: string;
  isRead: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
