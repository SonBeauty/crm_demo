import { api } from "../libs/api";

export const taskService = {
  list: () => api.get("/tasks").then((r) => r.data),
  create: (payload: any) => api.post("/tasks", payload).then((r) => r.data),
  update: (id: string, payload: any) =>
    api.patch(`/tasks/${id}`, payload).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data),
  remove: (id: string) => api.delete(`/tasks/${id}`).then((r) => r.data),
};
