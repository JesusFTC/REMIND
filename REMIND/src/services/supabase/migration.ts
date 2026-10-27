import { supabase } from './client';
import { toRow } from './reminderMapping';
import { migrateReminders } from '../../utils/migrateReminders';
import { useReminderStore } from '../../store/reminderStore';
const running = new Map<string, Promise<string[]>>();
export function migrateLocalReminders(userId: string) {
  const existing = running.get(userId);
  if (existing) return existing;
  const task = migrateReminders(useReminderStore.getState().reminders, userId, async (item, owner) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (user?.id !== owner) throw new Error('La sesión ha cambiado.');
    const { error } = await supabase.from('reminders').upsert({
      ...toRow(item), user_id: owner, legacy_local_id: item.id,
    }, { onConflict: 'user_id,legacy_local_id', ignoreDuplicates: true });
    if (error) throw error;
  }, id => useReminderStore.getState().deleteReminder(id)).finally(() => { running.delete(userId); });
  running.set(userId, task);
  return task;
}
