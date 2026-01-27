'use client';

import { useState, useEffect } from 'react';
import { Bell, X, UserPlus, UserCheck, UserMinus, Info } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationCenter() {
  const socket = useSocket();
  const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    console.log('✅ NotificationCenter listener active');

    const handleNewUser = (data: any) => {
      console.log('📢 Event [NEW_USER]:', data);
      addNotification({
        title: 'New Member Joined',
        message: `${data.name || data.email} has joined the team.`,
        type: 'success',
      });
      
      toast.success('New Member Joined', {
        description: `${data.name || data.email} just joined.`,
      });
    };

    const handleUserUpdated = (data: any) => {
      console.log('📢 Event [USER_UPDATED]:', data);
      addNotification({
        title: 'Profile Updated',
        message: data.message || `Profile of ${data.name || 'a user'} was updated.`,
        type: 'info',
      });
      
      toast.info('Profile Updated', {
        description: data.message || `Profile of ${data.name || 'a user'} was updated.`,
      });
    };

    const handleUserDeleted = (data: any) => {
      console.log('📢 Event [USER_DELETED]:', data);
      addNotification({
        title: 'Account Deleted',
        message: `User ${data.userId || 'unknown'} has been removed.`,
        type: 'error',
      });
      
      toast.error('Account Deleted', {
        description: `User ${data.userId || 'unknown'} has been removed.`,
      });
    };

    socket.on('NEW_USER', handleNewUser);
    socket.on('USER_UPDATED', handleUserUpdated);
    socket.on('USER_DELETED', handleUserDeleted);

    return () => {
      socket.off('NEW_USER', handleNewUser);
      socket.off('USER_UPDATED', handleUserUpdated);
      socket.off('USER_DELETED', handleUserDeleted);
    };
  }, [socket, addNotification]);

  const toggleOpen = () => {
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
    setIsOpen(!isOpen);
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success': return <UserPlus className="text-emerald-400" size={16} />;
      case 'info': return <UserCheck className="text-blue-400" size={16} />;
      case 'error': return <UserMinus className="text-red-400" size={16} />;
      default: return <Info className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-white group"
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-[10px] font-bold text-white flex items-center justify-center border-2 border-slate-900 shadow-lg animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-85 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/30">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 text-[10px] font-bold">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-slate-800/50 text-slate-600">
                    <Bell size={32} />
                  </div>
                  <p className="text-sm font-medium text-slate-400">All caught up!</p>
                  <p className="text-xs text-slate-500">No new notifications to show.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-800/40 transition-all cursor-default group ${
                        !notification.read ? 'bg-violet-500/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-800 bg-slate-800/10 text-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
