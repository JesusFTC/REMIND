# REMIND: revisión y correcciones

Se revisó una copia de C:/Users/JECT/Desktop/AppPERSONAL/remind. La carpeta original no se modificó. El ZIP incluye el proyecto completo sin node_modules, .env, dist ni claves.

## Hallazgos

1. useReminders ejecutaba SELECT antes de conocer la sesión. Ahora la consulta se habilita al confirmar el usuario, valida la sesión y mantiene la caché separada por usuario.
2. La migración 001 activa RLS pero no concede permisos explícitos. 002 ya intenta concederlos; no se puede saber desde los archivos si se ejecutó. Consultar sin sesión usa el rol anon y también puede fallar. Por tanto, la causa exacta del 403 en el servidor NO está confirmada. Ejecutar diagnose_access.sql permite revisar los permisos y políticas reales. Un error 42501 con “permission denied for table” apunta a permisos; una política SELECT que no coincide normalmente devuelve cero filas.
3. El servicio enviaba objetos de la app directamente a tablas con otro formato: dueDate/due_date, userId/user_id, category/category_name y repeat/repeat_interval. Ahora convierte explícitamente los campos y las fechas en ambos sentidos; user_id siempre procede del usuario autenticado. El SDK existente se encarga del JWT de la sesión; no se introdujo ninguna clave de servicio.
4. App.tsx seguía usando localR.dueDate.toISOString() pese a existir normalizeDate. Las fechas persistidas son texto. Ahora se validan antes de enviar; los datos que fallen permanecen en localStorage y aparece un aviso.
5. La importación anterior buscaba duplicados por título/fecha, ignoraba errores y podía repetirse. Ahora usa una identidad local por usuario y una restricción única en Supabase. Los reintentos no duplican los registros importados con esta versión; solo se elimina la copia local después de confirmar el guardado remoto. Los registros con otro propietario no se importan. Los antiguos registros sin propietario se asignan a la cuenta que realiza la importación. Si alguna versión anterior ya importó datos sin identidad local, revisar posibles duplicados históricos manualmente.
6. El formulario mezclaba la fecha UTC con la hora local y perdía la hora al cambiar de día. Ahora conserva la hora y trabaja con el día local. Se restablece al abrir otro recordatorio y bloquea el botón mientras guarda.
7. La edición no tenía ningún control que la abriera. Se agregó el botón Editar. También se muestran errores de carga y fallos de las operaciones.

## SQL que debes ejecutar

En un proyecto que ya tiene las tablas de 001, abrir Supabase > SQL Editor y ejecutar COMPLETO:

src/migrations/003_authenticated_access_and_local_import.sql

No hace falta volver a ejecutar 001 ni 002. La nueva 003 funciona con o sin 002 aplicada y puede volver a ejecutarse. Mantiene RLS activo, concede USAGE del esquema y SELECT/INSERT/UPDATE/DELETE solo al rol authenticated. Agrega políticas de propietario, incluida una política restrictiva que limita políticas permisivas anteriores, y la columna/índice para importar sin duplicados. No modifica las migraciones anteriores.

Si la base está vacía: ejecutar 001 y después 003. No ejecutar 001 de nuevo sobre una base ya creada: sus políticas y triggers originales no son repetibles.

Después ejecutar src/migrations/diagnose_access.sql: los permisos y rowsecurity deben aparecer verdaderos y debe existir legacy_local_id. Ejecutar SQL como administrador no demuestra por sí solo que una sesión de usuario tenga acceso.

## Ejecutar la aplicación

1. Extraer el ZIP en una carpeta nueva.
2. Copiar tu .env original a esa carpeta, o completar .env.example y guardarlo como .env. No usar una clave service_role/secret en el frontend.
3. Usar Node.js 22.18 o posterior; la revisión se ejecutó con Node 26.7.
4. Ejecutar npm ci, npm test, npm run lint y npm run build.
5. Ejecutar npm run dev y abrir la dirección que indique.

## Validación ejecutada

- npm run build: correcto, TypeScript + Vite + generación PWA.
- npm test: 17 pruebas correctas con zona horaria America/Mexico_City.
- npm run lint: sin advertencias ni errores.
- Pruebas: fechas ISO/Date/epoch e inválidas, fecha local al cruzar medianoche UTC, conversión de columnas, actualizaciones parciales, importación con errores y aislamiento por propietario. Las pruebas del servicio utilizan un cliente Supabase simulado y ejercitan lectura, creación, completar, eliminar, cambios de sesión y propagación de 403.
- Aviso de build: el JavaScript principal supera 500 kB; no bloquea la compilación.

No se ejecutó la migración en PostgreSQL ni se probó login/CRUD contra tu Supabase real. No se verificó la interfaz en un navegador. El build usa las dependencias ya instaladas del proyecto original, copiadas al espacio de trabajo; no se ejecutó una instalación limpia npm ci.

## Comprobación pendiente en Supabase real

Después de aplicar 003: iniciar sesión, confirmar GET /rest/v1/reminders sin 403, crear, recargar, editar fecha/título, completar y eliminar. Cerrar sesión y entrar con otra cuenta: no deben aparecer datos de la primera. Comprobar que repetir la importación no crea duplicados. Si aparece un 403, guardar el cuerpo JSON de la respuesta (code/message/details/hint) y el resultado de diagnose_access.sql; no compartir JWT ni claves privadas.

Fuente oficial de diagnóstico: https://supabase.com/kb/troubleshooting/database-api-42501-errors
