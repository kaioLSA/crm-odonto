export type NotificationType = 'info' | 'success' | 'warning' | 'lead' | 'task';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
