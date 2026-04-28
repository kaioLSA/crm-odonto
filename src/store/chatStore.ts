import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatThread, Message, MessageSender } from '@/types';
import { nowIso, uid } from '@/services/api';

interface ChatState {
  threads: Record<string, ChatThread>;
  activeLeadId?: string;
  setActive: (leadId?: string) => void;
  ensureThread: (leadId: string) => void;
  sendMessage: (leadId: string, content: string, sender?: MessageSender) => Message;
  receiveMessage: (leadId: string, content: string, sender?: MessageSender) => Message;
  markRead: (leadId: string) => void;
  totalUnread: () => number;
}

const SEED_THREADS: Record<string, ChatThread> = {};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: SEED_THREADS,

      setActive: (leadId) => {
        set({ activeLeadId: leadId });
        if (leadId) get().markRead(leadId);
      },

      ensureThread: (leadId) =>
        set((state) => {
          if (state.threads[leadId]) return state;
          return {
            threads: {
              ...state.threads,
              [leadId]: { leadId, messages: [], unreadCount: 0 },
            },
          };
        }),

      sendMessage: (leadId, content, sender = 'agent') => {
        const message: Message = {
          id: uid('msg'),
          leadId,
          sender,
          content,
          createdAt: nowIso(),
          read: true,
        };
        set((state) => {
          const existing = state.threads[leadId] ?? { leadId, messages: [], unreadCount: 0 };
          return {
            threads: {
              ...state.threads,
              [leadId]: {
                ...existing,
                messages: [...existing.messages, message],
                lastMessageAt: message.createdAt,
              },
            },
          };
        });
        return message;
      },

      receiveMessage: (leadId, content, sender = 'lead') => {
        const message: Message = {
          id: uid('msg'),
          leadId,
          sender,
          content,
          createdAt: nowIso(),
          read: false,
        };
        set((state) => {
          const existing = state.threads[leadId] ?? { leadId, messages: [], unreadCount: 0 };
          const isActive = state.activeLeadId === leadId;
          return {
            threads: {
              ...state.threads,
              [leadId]: {
                ...existing,
                messages: [...existing.messages, { ...message, read: isActive }],
                unreadCount: isActive ? 0 : existing.unreadCount + 1,
                lastMessageAt: message.createdAt,
              },
            },
          };
        });
        return message;
      },

      markRead: (leadId) =>
        set((state) => {
          const thread = state.threads[leadId];
          if (!thread) return state;
          return {
            threads: {
              ...state.threads,
              [leadId]: {
                ...thread,
                unreadCount: 0,
                messages: thread.messages.map((m) => ({ ...m, read: true })),
              },
            },
          };
        }),

      totalUnread: () =>
        Object.values(get().threads).reduce((sum, t) => sum + t.unreadCount, 0),
    }),
    { name: 'pixel-agents:chat' },
  ),
);
