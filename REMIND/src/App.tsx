import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { ReminderCard } from './components/ui/ReminderCard';
import { ReminderForm } from './components/ReminderForm';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { useReminders } from './hooks/useReminders';
import { migrateLocalReminders } from './services/supabase/migration';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { authService } from './services/supabase/auth';
import { Button } from './components/ui/Button';
import type { Reminder } from './types';
import { supabase } from './services/supabase/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentHour] = useState(() => new Date().getHours());
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const queryClient = useQueryClient();
  const [migrationError, setMigrationError] = useState('');
  const {
    error: dataError,
    reminders: remoteReminders,
    isLoading: isLoadingData,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleStatus
  } = useReminders(user?.id);



  useEffect(() => {
    let active = true;
    let authEventReceived = false;
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (active && !authEventReceived) setUser(currentUser);
      } catch (e) {
        console.error('Auth error:', e);
      } finally {
        if (active) setIsLoadingAuth(false);
      }
    }
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      if (!active) return;
      queryClient.removeQueries({ queryKey: ['reminders'] });
      setUser(session?.user ?? null);
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient]);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    migrateLocalReminders(userId).then(failures => {
      if (cancelled) return;
      setMigrationError(failures.length ? 'No se pudieron importar algunos recordatorios. Se conservaron en este dispositivo; revisa las fechas y aplica la migración 003 en Supabase.' : '');
      void queryClient.invalidateQueries({ queryKey: ['reminders', userId] });
    }).catch(() => {
      if (!cancelled) setMigrationError('No se pudieron importar los recordatorios locales. Tus datos siguen guardados en este dispositivo.');
    });
    return () => { cancelled = true; };
  }, [userId, queryClient]);

  const reminders = remoteReminders;

  const filteredReminders = useMemo(() => {
    switch (activeTab) {
      case 'completed':
        return reminders.filter(r => r.status === 'completed');
      case 'all':
        return reminders;
      case 'home':
        return reminders.filter(r => r.status === 'pending');
      default:
        return reminders;
    }
  }, [reminders, activeTab]);

  const handleSaveReminder = async (data: Partial<Reminder>) => {
    try {
      if (editingReminder) {
        await updateReminder({ id: editingReminder.id!, updates: data });
      } else {
        await addReminder({
          ...data,
          id: crypto.randomUUID(),
          userId: user?.id || '',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      setIsFormOpen(false);
      setEditingReminder(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo guardar el recordatorio.');
    }
  };


  const getGreeting = () => {
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-md mx-auto px-6 pt-8 pb-20">
        {activeTab === 'settings' ? (
          <SettingsPage />
        ) : (
          <>
            <header className="mb-8 space-y-1 flex justify-between items-start">
              <div className="space-y-1">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-text-secondary text-sm font-medium"
                >
                  {getGreeting()}, Usuario
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-text-main"
                >
                  Mis Recordatorios
                </motion.h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => authService.signOut()}
                className="text-xs"
              >
                Salir
              </Button>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-surface border border-border rounded-premium">
                <p className="text-text-secondary text-xs mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-text-main">
                  {reminders.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-premium">
                <p className="text-text-secondary text-xs mb-1">Completados</p>
                <p className="text-2xl font-bold text-success">
                  {reminders.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>

            {(dataError || migrationError) && <p role="alert" className="text-error mb-4">{dataError ? 'No se pudieron cargar los recordatorios: ' + dataError.message : migrationError}</p>}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-text-main capitalize">
                  {activeTab === 'home' ? 'Para Hoy' : activeTab === 'all' ? 'Todos' : 'Completados'}
                </h2>
              </div>

              {isLoadingData ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredReminders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-secondary">
                        <CheckCircle size={32} />
                      </div>
                      <p className="text-text-secondary">No hay recordatorios aquí.</p>
                    </motion.div>
                  ) : (
                    filteredReminders.map((reminder: Reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onEdit={() => { setEditingReminder(reminder); setIsFormOpen(true); }}
                        onToggle={(id) => { void toggleStatus({ id, status: reminder.status }).catch(() => alert('No se pudo actualizar el recordatorio.')); }}
                        onDelete={(id) => { void deleteReminder(id).catch(() => alert('No se pudo eliminar el recordatorio.')); }}
                      />
                    ))
                  )}
                </AnimatePresence>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setEditingReminder(null);
                setIsFormOpen(true);
              }}
              className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center z-30"
            >
              <Plus size={28} />
            </motion.button>
          </>
        )}

        <ReminderForm
          key={isFormOpen ? (editingReminder?.id ?? 'new') : 'closed'}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingReminder(null);
          }}
          onSave={handleSaveReminder}
          initialData={editingReminder || undefined}
        />
      </div >
    </AppShell>
  );
}
