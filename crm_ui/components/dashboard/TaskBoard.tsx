"use client";

import React, { useState } from "react";
import { TaskResponse } from "../../types";

type Props = {
  tasks: TaskResponse[];
  onStatusChange: (id: string, status: string) => void;
};

const columns = [
  { key: "TODO", title: "To Do", backgroundColor: "blue" },
  { key: "IN_PROGRESS", title: "In Progress", backgroundColor: "purple" },
  { key: "DONE", title: "Done", backgroundColor: "green" },
];

export default function TaskBoard({ tasks, onStatusChange }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) onStatusChange(id, status);
    setDraggingId(null);
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {columns.map((col) => (
        <div
          key={col.key}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, col.key)}
          style={{
            flex: 1,
            minHeight: 300,
            background: "transparent",
            padding: 12,
            borderRadius: 8,
            border: "1px solid purple",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{col.title}</h3>
          {tasks !== undefined &&
            tasks.length > 0 &&
            tasks
              .filter((t) => t.status === col.key)
              .map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, t.id)}
                  style={{
                    padding: 8,
                    marginBottom: 8,
                    background: "white",
                    borderRadius: 6,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    {t.description}
                  </div>
                </div>
              ))}
        </div>
      ))}
    </div>
  );
}
