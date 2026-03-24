/**
 * Format an ISO date string to a human-readable date.
 */
export function formatDate(
  isoString: string,
  locale: string = 'fr-FR',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString(locale, options);
  } catch {
    return isoString;
  }
}

/**
 * Format a date string (YYYY-MM-DD) to a readable date.
 */
export function formatEventDate(dateString: string, locale: string = 'fr-FR'): string {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
