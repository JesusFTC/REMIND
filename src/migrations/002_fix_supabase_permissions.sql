-- Migración 002: Corrección de Permisos y RLS
-- Proyecto: REMIND

-- 1. Asegurar que las tablas estén expuestas al rol 'authenticated'
-- Supabase por defecto puede restringir el acceso a tablas nuevas si no se configuran los GRANTS explícitamente
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_preferences TO authenticated;

-- 2. Reforzar RLS (Row Level Security)
-- Asegurar que RLS esté activo
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Políticas detalladas para 'reminders'
-- Eliminamos políticas previas para evitar conflictos y creamos las definitivas
DROP POLICY IF EXISTS "Users can manage their own reminders" ON public.reminders;

CREATE POLICY "reminders_select_policy" ON public.reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reminders_insert_policy" ON public.reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reminders_update_policy" ON public.reminders
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reminders_delete_policy" ON public.reminders
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Políticas detalladas para 'categories'
DROP POLICY IF EXISTS "Users can manage their own categories" ON public.categories;

CREATE POLICY "categories_select_policy" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "categories_insert_policy" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_update_policy" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_delete_policy" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Políticas detalladas para 'user_preferences'
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;

CREATE POLICY "prefs_select_policy" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "prefs_insert_policy" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prefs_update_policy" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prefs_delete_policy" ON public.user_preferences
  FOR DELETE USING (auth.uid() = user_id);
