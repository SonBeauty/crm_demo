"use client";

import React, { useEffect, useState } from "react";
import TaskBoard from "../../../components/dashboard/TaskBoard";
import { taskService } from "../../../services/task.service";
import { TaskResponse } from "../../../types";

export default function Page() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await taskService.list();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await taskService.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
