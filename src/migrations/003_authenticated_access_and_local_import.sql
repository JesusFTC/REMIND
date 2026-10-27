-- Ejecutar tras 001, tanto si 002 se aplicó como si no. Ejecutar completo.
BEGIN;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders, public.categories, public.user_preferences TO authenticated;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['reminders', 'categories', 'user_preferences'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS remind_owner_access ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS remind_owner_guard ON public.%I', t);
    EXECUTE format('CREATE POLICY remind_owner_access ON public.%I FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)', t);
    EXECUTE format('CREATE POLICY remind_owner_guard ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)', t);
  END LOOP;
END $$;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS legacy_local_id text;
CREATE UNIQUE INDEX IF NOT EXISTS reminders_user_legacy_local_id_key ON public.reminders(user_id, legacy_local_id);
NOTIFY pgrst, 'reload schema';
COMMIT;
