'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationCenter() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleNewUser = (data: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'New User Registered',
        message: `${data.name} (${data.email}) just joined.`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      toast.success(newNotification.title, {
        description: newNotification.message,
      });
    };

    const handleUserUpdated = (data: any) => {
       const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'User Updated',
        message: `${data.name} (${data.email}) profiled was updated.`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      toast.info(newNotification.title, {
        description: newNotification.message,
      });
    }

    socket.on('NEW_USER', handleNewUser);
    socket.on('USER_UPDATED', handleUserUpdated);

    return () => {
      socket.off('NEW_USER', handleNewUser);
      socket.off('USER_UPDATED', handleUserUpdated);
    };
  }, [socket]);

  const markAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const toggleOpen = () => {
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
              <h3 className="font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-800/50 transition-colors ${
                        !notification.read ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
