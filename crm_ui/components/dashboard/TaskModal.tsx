"use client";

import React, { useEffect, useState } from "react";
import { taskService } from "@/services/task.service";
import { Task, TaskResponse } from "@/types";
import { userService } from "@/services/user.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (task: TaskResponse) => void;
};

export default function TaskModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await userService.getAll();
      setUsers(res.data.items);
    };

    fetchUsers();
  }, [open]);
  if (!open) return;

  console.log(users);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const payload: any = { title, description: description || undefined };
      if (assignedToId) payload.assignedToId = assignedToId;
      const created = await taskService.create(payload);
      onCreated?.(created);
      setTitle("");
      setDescription("");
      setAssignedToId("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          maxWidth: 720,
          margin: "6vh auto",
          background: "linear-gradient(180deg, #ffffff, #fbfbfd)",
          borderRadius: 12,
          padding: 22,
          boxShadow:
            "0 30px 80px rgba(15, 23, 42, 0.7), 0 8px 30px rgba(15,23,42,0.45)",
          border: "1px solid rgba(76,81,191,0.08)",
          transform: "translateY(-4px)",
          zIndex: 10000,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#374151",
          }}
        >
          ×
        </button>

        <h3 style={{ marginTop: 0, marginBottom: 6, fontSize: 20 }}>
          Create Task
        </h3>
        <p style={{ marginTop: 0, marginBottom: 12, color: "#6b7280" }}>
          Add a new task — it will appear immediately on the board.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Assign to
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="p-2 w-full rounded-md border border-gray-300"
            >
              {users?.length !== 0 &&
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "8px 12px",
                background: "transparent",
                borderRadius: 6,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "8px 14px",
                background: "#4c51bf",
                color: "white",
                borderRadius: 8,
                boxShadow: "0 8px 30px rgba(76,81,191,0.28)",
              }}
            >
              {saving ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
