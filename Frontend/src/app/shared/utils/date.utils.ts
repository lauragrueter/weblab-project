
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseBackendDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split('-').map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1) return null;
  return isNaN(date.getTime()) ? null : date;
}