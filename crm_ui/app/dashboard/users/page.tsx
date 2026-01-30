"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Filter,
  Search,
  MoreVertical,
  Shield,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";

import { User, Role } from "@/types";

import { Suspense } from "react";
import { userService } from "@/services/user.service";

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const menuRef = useRef<HTMLElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get("role") || "",
  );
  const [query, setQuery] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: Role;
  }>({
    name: "",
    email: "",
    role: "EMPLOYEE",
  });
  const fetchUsers = async (role?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      const { data } = await userService.getAll(params.toString());
      setUsers(data?.items);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter]);

  useEffect(() => {
    if (openMenuId) {
      menuRef.current = document.querySelector(
        `[data-menu-id="${openMenuId}"]`,
      );
    } else {
      menuRef.current = null;
    }
  }, [openMenuId]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (!menuRef.current.contains(target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    const params = new URLSearchParams(searchParams);
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "MANAGER":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const openEdit = async (id: string) => {
    setEditLoading(true);
    try {
      const data = await userService.getById(id);
      setSelectedUser(data);
      setEditForm({
        name: data.name || "",
        email: data.email || "",
        role: data.role,
      });
      setIsEditing(true);
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };

  const saveEdit = async () => {
    if (!selectedUser) return;
    setEditLoading(true);
    try {
      await userService.update(selectedUser.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });

      await fetchUsers(roleFilter);
      closeEdit();
    } catch (err) {
      console.error("Failed to save user", err);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm">
            Manage your team and customers
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          New User
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50">
                <th className="p-4 font-medium text-slate-400 text-sm">User</th>
                <th className="p-4 font-medium text-slate-400 text-sm">Role</th>
                <th className="p-4 font-medium text-slate-400 text-sm">
                  Joined
                </th>
                <th className="p-4 font-medium text-slate-400 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600">
                          <span className="font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                      >
                        <Shield size={10} />
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className="relative inline-block"
                        data-menu-id={user.id}
                      >
                        <button
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === user.id ? null : user.id,
                            )
                          }
                          aria-haspopup="true"
                          aria-expanded={openMenuId === user.id}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenuId === user.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20">
                            <button
                              className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors text-sm text-white"
                              onClick={() => {
                                setOpenMenuId(null);
                                openEdit(user.id);
                              }}
                            >
                              Edit
                            </button>
                            {/* add more actions here */}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
          <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-lg p-6 z-50">
            <h3 className="text-lg font-medium text-white mb-4">Edit User</h3>

            <label className="block text-sm text-slate-300 mb-1">Name</label>
            <input
              className="w-full mb-3 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, name: e.target.value }))
              }
            />

            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              className="w-full mb-3 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, email: e.target.value }))
              }
            />

            <label className="block text-sm text-slate-300 mb-1">Role</label>
            <select
              className="w-full mb-4 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              value={editForm.role}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, role: e.target.value as Role }))
              }
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 bg-slate-700 text-white rounded"
                onClick={closeEdit}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded"
                onClick={saveEdit}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400">Loading...</div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
