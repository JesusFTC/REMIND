import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Reminder } from '../types';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      reminders: [],
      addReminder: (reminder) =>
        set((state) => ({ reminders: [...state.reminders, reminder] })),
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id
              ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' }
              : r
          ),
        })),
    }),
    {
      name: 'reminders-storage',
    }
  )
);
