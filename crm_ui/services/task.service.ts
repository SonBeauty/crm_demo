import { api } from "../libs/api";

export const taskService = {
  list: () => api.get("/tasks").then((r) => r.data.data),
  create: (payload: undefined) =>
    api.post("/tasks", payload).then((r) => r.data.data),
  update: (id: string, payload: any) =>
    api.patch(`/tasks/${id}`, payload).then((r) => r.data.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.data),
  remove: (id: string) => api.delete(`/tasks/${id}`).then((r) => r.data.data),
};
