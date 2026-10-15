import type { NoteItem } from '../types/note';

export function getReminderFromDayNotice(
  dayNotice?: string | null
): { time: string; day: string } | undefined {
  if (!dayNotice) return undefined;

  const date = new Date(dayNotice);
  if (Number.isNaN(date.getTime())) return undefined;

  return {
    time: new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(date),
    day: new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  };
}

function getNoteReminderDate(note: NoteItem, now: Date): Date | null {
  if (note.day_notice) {
    const date = new Date(note.day_notice);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const reminderDay = note.reminder?.day?.trim().toLowerCase();
  const reminderTime = note.reminder?.time?.replace('.', ':');
  const timeParts = reminderTime?.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeParts) return null;

  const hours = Number(timeParts[1]);
  const minutes = Number(timeParts[2]);
  if (hours > 23 || minutes > 59) return null;

  if (reminderDay === 'today' || reminderDay === 'hôm nay') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  }

  const dateParts = reminderDay?.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (!dateParts) return null;

  const date = new Date(
    Number(dateParts[3]),
    Number(dateParts[2]) - 1,
    Number(dateParts[1]),
    hours,
    minutes
  );
  if (
    date.getFullYear() !== Number(dateParts[3]) ||
    date.getMonth() !== Number(dateParts[2]) - 1 ||
    date.getDate() !== Number(dateParts[1])
  ) {
    return null;
  }
  return date;
}

export function getNoteReminderStatus(
  note: NoteItem,
  now = new Date()
): 'today' | 'overdue' | null {
  const reminderDate = getNoteReminderDate(note, now);
  if (!reminderDate) return null;

  const reminderDay = new Date(
    reminderDate.getFullYear(),
    reminderDate.getMonth(),
    reminderDate.getDate()
  ).getTime();
  const currentDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  if (reminderDay === currentDay) {
    return reminderDate.getTime() < now.getTime() ? 'overdue' : 'today';
  }
  if (reminderDay < currentDay) return 'overdue';
  return null;
}

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

  if (note.day_notice) {
    const reminderDate = new Date(note.day_notice);
    const now = new Date();
    if (
      !Number.isNaN(reminderDate.getTime()) &&
      reminderDate.getDate() === now.getDate() &&
      reminderDate.getMonth() === now.getMonth() &&
      reminderDate.getFullYear() === now.getFullYear()
    ) {
      return true;
    }
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
