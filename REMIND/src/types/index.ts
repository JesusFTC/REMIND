export type Priority = 'low' | 'medium' | 'high';
export type RepeatInterval = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReminderStatus = 'pending' | 'completed';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: Date;
  category: string;
  priority: Priority;
  status: ReminderStatus;
  repeat: RepeatInterval;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  timezone: string;
  pushEnabled: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
