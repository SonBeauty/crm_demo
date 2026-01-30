"use client";

import React, { useState } from "react";
import { TaskResponse } from "../../types";

type Props = {
  tasks: TaskResponse[];
  onStatusChange: (id: string, status: string) => void;
};

const columns = [
  {
    key: "TODO",
    title: "To Do",
    backgroundColor: "#ffc53d",
    boxShadow: "0 4px 14px rgba(0,0,0,0.45), 0 0 14px rgba(255, 193, 7, 0.35)",
    borderColor: "#ffb900",
  },
  {
    key: "IN_PROGRESS",
    title: "In Progress",
    backgroundColor: "#5a43d6",
    borderColor: "#4c35c3",
  },
  {
    key: "DONE",
    title: "Done",
    backgroundColor: "#299764",
    borderColor: "#218c5d",
  },
];

export default function TaskBoard({ tasks, onStatusChange }: Props) {
  console.log("props", tasks);
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
            background: "linear-gradient(180deg, #020617, #020617 70%, #000)",
            padding: 8,
            borderRadius: 8,
            border: "3px solid #8d54ff40",
          }}
        >
          <div
            style={{
              marginTop: 0,
              backgroundColor: col.backgroundColor,
              boxShadow: col.boxShadow || "0 4px 14px rgba(0,0,0,0.25)",
              border: `2px solid ${col.borderColor}`,
            }}
            className="font-semibold text-xl text-center text-white p-3 rounded-md mb-4 relative"
          >
            {col.title}
          </div>
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
