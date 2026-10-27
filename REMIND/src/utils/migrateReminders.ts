import type { Reminder } from '../types/index.ts';
import { requireDate } from './date.ts';
export async function migrateReminders(items: Reminder[], userId: string,
  save: (item: Reminder, owner: string) => Promise<unknown>, acknowledge: (id: string) => void) {
  const failures: string[] = [];
  for (const item of items) {
    if (item.userId && item.userId !== userId) continue;
    try {
      if (typeof item.id !== 'string' || !item.id) throw new Error('Falta el ID local');
      await save({ ...item, dueDate: requireDate(item.dueDate) }, userId);
      acknowledge(item.id);
    } catch { failures.push(item.id); }
  }
  return failures;
}
