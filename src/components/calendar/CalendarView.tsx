import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Paperclip,
} from 'lucide-react';
import type { NoteItem } from '../../types/note';
import type { TagItem } from '../../types/tag';
import { getTagColor, getTagColorClass } from '../../utils/tagColor';

export interface CalendarViewProps {
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
  onOpenAddModalWithDate?: (date: { day: number; month: number; year: number }) => void;
  onSwitchToGrid?: () => void;
  tags?: TagItem[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Parse note date formatted as DD.MM.YYYY, YYYY-MM-DD, or DD/MM/YYYY
function parseNoteDate(note: NoteItem): { day: number; month: number; year: number } | null {
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

  // YYYY-MM-DD
  if (note.date.includes('-')) {
    const parts = note.date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
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

  return null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  notes,
  onSelectNote,
  onOpenAddModalWithDate,
  tags = [],
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (9 = October)

  const todayRef = new Date();

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build days grid for the month view
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  interface DayCell {
    dayNumber: number;
    monthIndex: number;
    yearNumber: number;
    isCurrentMonth: boolean;
    isFirstOfMonth?: boolean;
    monthShortName?: string;
    isToday: boolean;
    notes: NoteItem[];
  }

  const cells: DayCell[] = [];

  // 1. Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dNum = daysInPrevMonth - i;
    const mIdx = month === 0 ? 11 : month - 1;
    const yNum = month === 0 ? year - 1 : year;

    const cellNotes = notes.filter((n) => {
      const parsed = parseNoteDate(n);
      return (
        parsed &&
        parsed.day === dNum &&
        parsed.month === mIdx + 1 &&
        parsed.year === yNum
      );
    });

    cells.push({
      dayNumber: dNum,
      monthIndex: mIdx,
      yearNumber: yNum,
      isCurrentMonth: false,
      isToday:
        dNum === todayRef.getDate() &&
        mIdx === todayRef.getMonth() &&
        yNum === todayRef.getFullYear(),
      notes: cellNotes
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const isToday =
      d === todayRef.getDate() &&
      month === todayRef.getMonth() &&
      year === todayRef.getFullYear();

    const cellNotes = notes.filter((n) => {
      const parsed = parseNoteDate(n);
      return (
        parsed &&
        parsed.day === d &&
        parsed.month === month + 1 &&
        parsed.year === year
      );
    });

    cells.push({
      dayNumber: d,
      monthIndex: month,
      yearNumber: year,
      isCurrentMonth: true,
      isFirstOfMonth: d === 1,
      monthShortName: MONTH_SHORT_NAMES[month],
      isToday,
      notes: cellNotes
    });
  }

  // 3. Next month leading days (fill up to multiple of 7, usually 35 or 42 cells)
  const remainingCells = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
  for (let nextD = 1; nextD <= remainingCells; nextD++) {
    const mIdx = month === 11 ? 0 : month + 1;
    const yNum = month === 11 ? year + 1 : year;

    const cellNotes = notes.filter((n) => {
      const parsed = parseNoteDate(n);
      return (
        parsed &&
        parsed.day === nextD &&
        parsed.month === mIdx + 1 &&
        parsed.year === yNum
      );
    });

    cells.push({
      dayNumber: nextD,
      monthIndex: mIdx,
      yearNumber: yNum,
      isCurrentMonth: false,
      isFirstOfMonth: nextD === 1,
      monthShortName: MONTH_SHORT_NAMES[mIdx],
      isToday:
        nextD === todayRef.getDate() &&
        mIdx === todayRef.getMonth() &&
        yNum === todayRef.getFullYear(),
      notes: cellNotes
    });
  }

  return (
    <div className="calendar-wrapper">
      <div className="cal-top-bar">
        <div className="cal-header-left">
          <div className="cal-nav-group">
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handlePrevMonth}
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handleNextMonth}
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <h2 className="cal-month-title">
            {MONTH_NAMES[month]} {year}
          </h2>
        </div>
      </div>

      {/* 2. Weekday Header Row */}
      <div className="cal-weekdays-row">
        {WEEKDAYS.map((wDay) => (
          <div key={wDay} className="cal-weekday-cell">
            {wDay}
          </div>
        ))}
      </div>

      {/* 3. Main Days Grid */}
      <div className="cal-grid">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`cal-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today-cell' : ''
              }`}
            onClick={() =>
              onOpenAddModalWithDate?.({
                day: cell.dayNumber,
                month: cell.monthIndex + 1,
                year: cell.yearNumber
              })
            }
          >
            <div className="cal-day-top">
              <span
                className={`cal-day-num ${cell.isToday ? 'is-today' : ''}`}
              >
                {cell.isFirstOfMonth
                  ? `${cell.monthShortName} ${cell.dayNumber}`
                  : cell.dayNumber}
              </span>

              <button
                type="button"
                className="cal-day-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAddModalWithDate?.({
                    day: cell.dayNumber,
                    month: cell.monthIndex + 1,
                    year: cell.yearNumber
                  });
                }}
                title={`Thêm ghi chú vào ngày ${cell.dayNumber}/${cell.monthIndex + 1}`}
                aria-label="Thêm ghi chú"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* List of notes for this day */}
            <div className="cal-events-container">
              {cell.notes.map((note) => {
                const tagColor = getTagColor(note.tag, tags);

                return (
                  <div
                    key={note.id}
                    className={`cal-note-chip ${getTagColorClass(note.tag)}`}
                    style={tagColor ? {
                      backgroundColor: `color-mix(in srgb, ${tagColor} 16%, white)`,
                      borderLeftColor: tagColor
                    } : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNote(note);
                    }}
                    title={`${note.title}${note.reminder?.time ? ' (' + note.reminder.time + ')' : ''
                      }`}
                  >
                    {note.reminder?.time && (
                      <span className="cal-chip-time">
                        {note.reminder.time}
                      </span>
                    )}
                    <span className="cal-chip-title">{note.title}</span>
                    {note.attachmentCount && note.attachmentCount > 0 ? (
                      <Paperclip size={11} className="cal-chip-clip" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
