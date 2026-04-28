export type MessageSender = 'agent' | 'lead' | 'system' | 'ai';

export interface Message {
  id: string;
  leadId: string;
  sender: MessageSender;
  content: string;
  createdAt: string;
  read?: boolean;
}

export interface ChatThread {
  leadId: string;
  messages: Message[];
  unreadCount: number;
  lastMessageAt?: string;
}
