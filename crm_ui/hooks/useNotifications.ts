import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'success' | 'info' | 'error';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (noti) => {
    const newNoti: Notification = {
      ...noti,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    set((state) => ({
      notifications: [newNoti, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
