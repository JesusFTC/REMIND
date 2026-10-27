import type { Reminder } from '../../types/index.ts';
import { requireDate } from '../../utils/date.ts';
export interface ReminderRow {
  id: string; user_id: string; title: string; description: string | null; due_date: string;
  category_name: string | null; priority: Reminder['priority']; status: Reminder['status'];
  repeat_interval: Reminder['repeat']; created_at: string | null; updated_at: string | null;
}
export function fromRow(row: ReminderRow): Reminder {
  return { id: row.id, userId: row.user_id, title: row.title, description: row.description ?? '',
    dueDate: requireDate(row.due_date), category: row.category_name ?? 'General',
    priority: row.priority, status: row.status, repeat: row.repeat_interval,
    createdAt: requireDate(row.created_at ?? row.due_date), updatedAt: requireDate(row.updated_at ?? row.due_date) };
}
export function toRow(input: Partial<Reminder>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) {
    if (!input.title.trim()) throw new Error('El título es obligatorio.');
    row.title = input.title.trim();
  }
  if (input.description !== undefined) row.description = input.description;
  if (input.dueDate !== undefined) row.due_date = requireDate(input.dueDate).toISOString();
  if (input.category !== undefined) row.category_name = input.category;
  if (input.priority !== undefined) row.priority = input.priority;
  if (input.status !== undefined) row.status = input.status;
  if (input.repeat !== undefined) row.repeat_interval = input.repeat;
  return row;
}
