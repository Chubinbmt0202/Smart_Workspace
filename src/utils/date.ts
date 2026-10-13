import type { NoteItem } from '../types/note';

/**
 * Parses a note date string into day, month, year numbers.
 * Supported formats: DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD
 */
export function parseNoteDate(note: NoteItem): { day: number; month: number; year: number } | null {
  if (!note.date) return null;

  // DD.MM.YYYY
  if (note.date.includes('.')) {
    const parts = note.date.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return { day, month, year };
      }
    }
  }

  // DD/MM/YYYY
  if (note.date.includes('/')) {
    const parts = note.date.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return { day, month, year };
      }
    }
  }

  // YYYY-MM-DD or DD-MM-YYYY
  if (note.date.includes('-')) {
    const parts = note.date.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return { day, month, year };
        }
      } else {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return { day, month, year };
        }
      }
    }
  }

  return null;
}

/**
 * Determines whether a note is scheduled or created for "today".
 * Matches:
 * 1. Explicit reminder.day of "Today" or "Hôm nay"
 * 2. Note date matches the current system date (today)
 * 3. Note date matches the mock template date (12.10.2026)
 */
export function isNoteToday(note: NoteItem): boolean {
  const reminderDay = note.reminder?.day?.trim().toLowerCase();
  if (reminderDay === 'today' || reminderDay === 'hôm nay') {
    return true;
  }

  const parsed = parseNoteDate(note);
  if (!parsed) return false;

  const now = new Date();
  const curDay = now.getDate();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();

  // Real today
  if (parsed.day === curDay && parsed.month === curMonth && parsed.year === curYear) {
    return true;
  }

  // Mock template "today" reference date (12.10.2026)
  if (parsed.day === 12 && parsed.month === 10 && parsed.year === 2026) {
    return true;
  }

  return false;
}
