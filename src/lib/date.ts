/**
 * Date-only helpers for API calendar dates (`YYYY-MM-DD`).
 * Parsed as local calendar components to avoid UTC/timezone day shifts.
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseDateOnly(isoDate: string): { day: number; month: number; year: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return { day, month, year };
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/** Format `YYYY-MM-DD` as `05 Nov 2026`. */
export function formatDateOnly(isoDate: string, options?: { includeYear?: boolean }): string {
  const parts = parseDateOnly(isoDate);
  if (!parts) return isoDate;
  const includeYear = options?.includeYear !== false;
  const label = `${pad2(parts.day)} ${MONTHS_SHORT[parts.month - 1]}`;
  return includeYear ? `${label} ${parts.year}` : label;
}

/**
 * Format an estimated delivery range for customers.
 * Same-day → `05 Nov 2026`
 * Same year → `05 Nov – 07 Nov 2026`
 * Cross year → `05 Nov 2026 – 02 Jan 2027`
 */
export function formatDeliveryRange(from: string, to: string): string {
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  if (!start || !end) {
    return from === to ? formatDateOnly(from) : `${formatDateOnly(from)} – ${formatDateOnly(to)}`;
  }

  if (from === to) {
    return formatDateOnly(from);
  }

  if (start.year === end.year) {
    return `${formatDateOnly(from, { includeYear: false })} – ${formatDateOnly(to)}`;
  }

  return `${formatDateOnly(from)} – ${formatDateOnly(to)}`;
}
