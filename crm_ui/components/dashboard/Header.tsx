"use client";

import NotificationCenter from "./NotificationCenter";
import { Search, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar - Aesthetic addition */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 w-96 group focus-within:border-violet-500/50 transition-all">
        <Search size={18} className="text-slate-500 group-focus-within:text-violet-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search everything..." 
          className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Notification Center */}
        <NotificationCenter />

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-700/50 h-10">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-white truncate max-w-[120px]">
              {user?.name || 'Admin User'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 tracking-wider">
              {user?.role || 'ADMIN'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 border border-violet-400/20">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
