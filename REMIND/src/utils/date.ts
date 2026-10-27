export function normalizeDate(value: unknown): Date | null {
  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') return null;
  if (value === '') return null;
  const date = new Date(value instanceof Date ? value.getTime() : value);
  return Number.isNaN(date.getTime()) ? null : date;
}
export function requireDate(value: unknown): Date {
  const date = normalizeDate(value);
  if (!date) throw new Error('Fecha inválida. Corrige el recordatorio antes de guardarlo.');
  return date;
}
export function localDateInput(date: Date): string {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
}
