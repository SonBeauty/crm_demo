"use client";

import { useEffect, useState } from "react";
import TaskBoard from "@/components/dashboard/TaskBoard";
import TaskModal from "@/components/dashboard/TaskModal";
import { taskService } from "@/services/task.service";
import { TaskResponse } from "@/types";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await taskService.list();
      setTasks(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    console.log("tasks updated:", tasks);
  }, [tasks]);

  console.log("tasks", tasks);
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await taskService.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreated = (task: TaskResponse) => {
    setTasks((prev) => [task, ...prev]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Tasks</h2>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              padding: "8px 12px",
              background: "#4c51bf",
              color: "white",
              borderRadius: 6,
              boxShadow: "0 4px 14px rgba(76, 81, 191, 0.39)",
            }}
          >
            New Task
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
