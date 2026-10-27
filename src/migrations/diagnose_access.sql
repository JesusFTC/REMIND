-- Solo diagnóstico; ejecutar en Supabase SQL Editor.
SELECT t.table_name,
  has_schema_privilege('authenticated', 'public', 'USAGE') AS schema_usage,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'SELECT') AS can_select,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'INSERT') AS can_insert,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'UPDATE') AS can_update,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'DELETE') AS can_delete
FROM (VALUES ('reminders'), ('categories'), ('user_preferences')) AS t(table_name);
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('reminders', 'categories', 'user_preferences');
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname = 'public'
AND tablename IN ('reminders', 'categories', 'user_preferences');
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema='public' AND table_name='reminders' AND column_name='legacy_local_id';
