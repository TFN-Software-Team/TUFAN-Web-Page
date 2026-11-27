// Location-agnostic calendar date utilities for sponsor expiration tracking.
// Uses native Temporal.PlainDate when available, with a timezone-safe calendar-day
// fallback (never constructs `new Date("YYYY-MM-DD")` which suffers from UTC drift).

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseCalendarParts(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = ISO_DATE_RE.exec(dateStr.trim().slice(0, 10));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function getTodayParts() {
  if (typeof globalThis.Temporal !== 'undefined') {
    const today = globalThis.Temporal.Now.plainDateISO();
    return { year: today.year, month: today.month, day: today.day };
  }
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function daysInMonth(year, month) {
  // Day 0 of next month gives the exact last day of `month` in local calendar math
  return new Date(year, month, 0).getDate();
}

export function getTodayPlainDateString() {
  if (typeof globalThis.Temporal !== 'undefined') {
    return globalThis.Temporal.Now.plainDateISO().toString();
  }
  const { year, month, day } = getTodayParts();
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function addMonthsToToday(months) {
  if (typeof globalThis.Temporal !== 'undefined') {
    return globalThis.Temporal.Now.plainDateISO()
      .add({ months }, { overflow: 'constrain' })
      .toString();
  }
  const { year, month, day } = getTodayParts();
  const totalMonths = (year * 12 + (month - 1)) + months;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = (totalMonths % 12) + 1;
  const clampedDay = Math.min(day, daysInMonth(targetYear, targetMonth));
  return `${targetYear}-${pad2(targetMonth)}-${pad2(clampedDay)}`;
}

export function getEndOfCurrentYear() {
  const { year } = getTodayParts();
  return `${year}-12-31`;
}

/**
 * Returns true if sponsor's end date has strictly passed (today > endDate).
 * On the end date itself, the sponsor is still considered active.
 * Returns false if no end date is set (indefinite sponsorship).
 */
export function isSponsorExpired(endDate) {
  if (!endDate || !String(endDate).trim()) return false;
  const normalized = String(endDate).trim().slice(0, 10);

  if (typeof globalThis.Temporal !== 'undefined') {
    try {
      const expiry = globalThis.Temporal.PlainDate.from(normalized);
      const today = globalThis.Temporal.Now.plainDateISO();
      return globalThis.Temporal.PlainDate.compare(expiry, today) < 0;
    } catch {
      return false;
    }
  }

  const expiry = parseCalendarParts(normalized);
  if (!expiry) return false;
  const today = getTodayParts();

  if (expiry.year !== today.year) return expiry.year < today.year;
  if (expiry.month !== today.month) return expiry.month < today.month;
  return expiry.day < today.day;
}

/**
 * Returns exact calendar days remaining until endDate (inclusive of today).
 * Returns null if no endDate is set. Negative values mean expired.
 */
export function getSponsorRemainingDays(endDate) {
  if (!endDate || !String(endDate).trim()) return null;
  const normalized = String(endDate).trim().slice(0, 10);

  if (typeof globalThis.Temporal !== 'undefined') {
    try {
      const expiry = globalThis.Temporal.PlainDate.from(normalized);
      const today = globalThis.Temporal.Now.plainDateISO();
      return today.until(expiry, { largestUnit: 'day' }).days;
    } catch {
      return null;
    }
  }

  const expiry = parseCalendarParts(normalized);
  if (!expiry) return null;
  const today = getTodayParts();
  // Use UTC noon for both calendar dates so DST transitions never cause off-by-one errors
  const expiryDays = Math.floor(Date.UTC(expiry.year, expiry.month - 1, expiry.day) / 86400000);
  const todayDays = Math.floor(Date.UTC(today.year, today.month - 1, today.day) / 86400000);
  return expiryDays - todayDays;
}

/**
 * Formats an ISO calendar date ("YYYY-MM-DD") for display without timezone drift.
 */
export function formatSponsorDate(endDate, lang = 'tr') {
  if (!endDate || !String(endDate).trim()) return '';
  const normalized = String(endDate).trim().slice(0, 10);
  const locale = lang === 'en' ? 'en-US' : 'tr-TR';

  if (typeof globalThis.Temporal !== 'undefined') {
    try {
      return globalThis.Temporal.PlainDate.from(normalized).toLocaleString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return normalized;
    }
  }

  const parts = parseCalendarParts(normalized);
  if (!parts) return normalized;

  // Format in explicit UTC from Date.UTC(y, m-1, d) so the calendar date never shifts
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
}

export function normalizeSponsor(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name || '',
    logoUrl: item.logoUrl || item.logo_url || '',
    websiteUrl: item.websiteUrl || item.website_url || '',
    endDate: item.endDate ?? item.end_date ?? '',
  };
}

