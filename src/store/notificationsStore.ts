import { create } from 'zustand';
import { Notification, NotificationType } from '@/types';
import { nowIso, uid } from '@/services/api';

interface NotificationsState {
  notifications: Notification[];
  push: (input: { type: NotificationType; title: string; description?: string; link?: string }) => Notification;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],

  push: (input) => {
    const n: Notification = {
      id: uid('notif'),
      createdAt: nowIso(),
      read: false,
      ...input,
    };
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 50),
    }));
    return n;
  },

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
