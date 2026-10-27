import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '../services/supabase/reminders';
import type { Reminder } from '../types';

export const useReminders = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading, error } = useQuery({
    queryKey: ['reminders', userId],
    enabled: Boolean(userId),
    queryFn: () => reminderService.fetchReminders(userId!),
  });

  const addMutation = useMutation({
    mutationFn: reminderService.createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Reminder> }) =>
      reminderService.updateReminder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: reminderService.deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      reminderService.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  return {
    reminders,
    isLoading,
    error,
    addReminder: addMutation.mutateAsync,
    updateReminder: updateMutation.mutateAsync,
    deleteReminder: deleteMutation.mutateAsync,
    toggleStatus: toggleMutation.mutateAsync,
  };
};
