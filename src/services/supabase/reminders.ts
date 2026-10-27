import { supabase } from './client';
import type { Reminder } from '../../types';
import { fromRow, toRow } from './reminderMapping';
async function currentUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Inicia sesión para acceder a tus recordatorios.');
  return user.id;
}
export const reminderService = {
  async fetchReminders(expectedUserId: string) {
    const userId = await currentUserId();
    if (userId !== expectedUserId) throw new Error('La sesión ha cambiado.');
    const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId).order('due_date', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(fromRow);
  },
  async createReminder(reminder: Partial<Reminder>) {
    const userId = await currentUserId();
    const row = toRow({ priority: 'medium', status: 'pending', repeat: 'none', ...reminder });
    if (!row.title || !row.due_date) throw new Error('Título y fecha son obligatorios.');
    const { data, error } = await supabase.from('reminders').insert({ ...row, user_id: userId }).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async updateReminder(id: string, updates: Partial<Reminder>) {
    const userId = await currentUserId();
    const { data, error } = await supabase.from('reminders').update(toRow(updates)).eq('id', id).eq('user_id', userId).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async deleteReminder(id: string) {
    const userId = await currentUserId();
    const { data, error } = await supabase.from('reminders').delete().eq('id', id).eq('user_id', userId).select('id').single();
    if (error) throw error;
    return data;
  },
  async toggleStatus(id: string, currentStatus: string) {
    return reminderService.updateReminder(id, { status: currentStatus === 'completed' ? 'pending' : 'completed' });
  },
};
