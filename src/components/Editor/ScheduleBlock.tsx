import { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Badge,
  Dialog,
  TextField,
  Select,
  Checkbox,
} from '@radix-ui/themes';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Edit3,
  Clock,
  Menu,
  Check,
  ChevronDown,
  X,
} from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isAllDay?: boolean;
  category: string;
  color: string;
  description?: string;
  status?: 'Chưa bắt đầu' | 'Đang diễn ra' | 'Đã xong';
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: CalendarCategory[] = [
  { id: 'tasks', name: 'Tasks (Công việc)', color: '#1a73e8' },
  { id: 'study', name: 'Học tập', color: '#00897b' },
  { id: 'meeting', name: 'Họp hành & Deadline', color: '#ea580c' },
  { id: 'birthdays', name: 'Birthdays & Cá nhân', color: '#1e8e3e' },
  { id: 'project', name: 'Dự án (Projects)', color: '#8e24aa' },
];

// Helper to get formatted string YYYY-MM-DD
const formatDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Generate initial sample events for the current month
const getInitialEvents = (): CalendarEvent[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const getDateInCurrentMonth = (day: number) => {
    return formatDateStr(new Date(year, month, Math.min(Math.max(1, day), 28)));
  };

  return [
    {
      id: 'e-1',
      title: 'Họp giao ban & Phân công dự án',
      date: getDateInCurrentMonth(now.getDate() - 2),
      startTime: '09:00',
      endTime: '10:30',
      category: 'Họp hành & Deadline',
      color: '#ea580c',
      description: 'Rà soát kế hoạch sprint và chốt tiến độ các đầu việc quan trọng.',
      status: 'Đã xong',
    },
    {
      id: 'e-2',
      title: 'Lập lịch làm việc & Mục tiêu tuần',
      date: getDateInCurrentMonth(now.getDate()),
      startTime: '08:30',
      endTime: '09:30',
      category: 'Tasks (Công việc)',
      color: '#1a73e8',
      description: 'Lên danh sách to-do và phân bổ thời gian hợp lý cho từng dự án.',
      status: 'Đang diễn ra',
    },
    {
      id: 'e-3',
      title: 'Sinh nhật thành viên nhóm',
      date: getDateInCurrentMonth(now.getDate() + 1),
      isAllDay: true,
      category: 'Birthdays & Cá nhân',
      color: '#1e8e3e',
      description: 'Tổ chức tiệc ngọt và gửi lời chúc mừng tại văn phòng.',
      status: 'Chưa bắt đầu',
    },
    {
      id: 'e-4',
      title: 'Buổi học React 19 & TypeScript',
      date: getDateInCurrentMonth(now.getDate() + 3),
      startTime: '14:00',
      endTime: '16:00',
      category: 'Học tập',
      color: '#00897b',
      description: 'Tìm hiểu về Server Components, Hooks tối ưu và Zustand state store.',
      status: 'Chưa bắt đầu',
    },
    {
      id: 'e-5',
      title: 'Hạn chót bàn giao phiên bản v1.0',
      date: getDateInCurrentMonth(now.getDate() + 5),
      startTime: '17:00',
      endTime: '18:00',
      category: 'Họp hành & Deadline',
      color: '#ea580c',
      description: 'Nộp báo cáo sản phẩm hoàn thiện cho khách hàng.',
      status: 'Chưa bắt đầu',
    },
  ];
};

export const DEFAULT_SCHEDULE = getInitialEvents();

interface ScheduleBlockProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function ScheduleBlock({ content, onChange }: ScheduleBlockProps) {
  // Parse events from content with backward compatibility
  const events: CalendarEvent[] = useMemo(() => {
    try {
      const parsed = JSON.parse(content || '');
      if (Array.isArray(parsed) && parsed.length > 0) {
        const now = new Date();
        return parsed.map((item, idx) => {
          // If old format item without date property
          if (!item.date) {
            const dayOffset = (idx % 7) - 2;
            const targetDate = new Date(now);
            targetDate.setDate(now.getDate() + dayOffset);
            const timeParts = (item.time || '09:00 - 10:00').split('-');
            return {
              id: item.id || `legacy-${idx}`,
              title: item.title || 'Lịch làm việc',
              date: formatDateStr(targetDate),
              startTime: timeParts[0]?.trim() || '09:00',
              endTime: timeParts[1]?.trim() || '10:00',
              category: item.category?.includes('Họp') ? 'Họp hành & Deadline' : 'Tasks (Công việc)',
              color: item.category?.includes('Họp') ? '#ea580c' : '#1a73e8',
              status: item.status || 'Chưa bắt đầu',
              description: '',
            };
          }
          return item;
        });
      }
    } catch {
      // content is not valid JSON array
    }
    return DEFAULT_SCHEDULE;
  }, [content]);

  // Current viewed month/year in main calendar
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  // Selected date for highlighting
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  // View mode
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  // Left sidebar toggle
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Selected category filter
  const [activeCategories, setActiveCategories] = useState<string[]>(
    DEFAULT_CATEGORIES.map((c) => c.name)
  );

  // Dialog state for create/edit
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(formatDateStr(new Date()));
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:00');
  const [formIsAllDay, setFormIsAllDay] = useState(false);
  const [formCategory, setFormCategory] = useState('Tasks (Công việc)');
  const [formColor, setFormColor] = useState('#1a73e8');
  const [formDescription, setFormDescription] = useState('');

  // Commit updates to parent
  const updateEvents = (newEvents: CalendarEvent[]) => {
    onChange(JSON.stringify(newEvents));
  };

  // Open dialog to create event
  const handleOpenCreate = (targetDateStr?: string) => {
    setEditingEventId(null);
    setFormTitle('');
    setFormDate(targetDateStr || formatDateStr(selectedDate));
    setFormStartTime('09:00');
    setFormEndTime('10:00');
    setFormIsAllDay(false);
    setFormCategory('Tasks (Công việc)');
    setFormColor('#1a73e8');
    setFormDescription('');
    setIsDialogOpen(true);
  };

  // Open dialog to edit existing event
  const handleOpenEdit = (evt: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingEventId(evt.id);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormStartTime(evt.startTime || '09:00');
    setFormEndTime(evt.endTime || '10:00');
    setFormIsAllDay(!!evt.isAllDay);
    setFormCategory(evt.category);
    setFormColor(evt.color || '#1a73e8');
    setFormDescription(evt.description || '');
    setIsDialogOpen(true);
  };

  // Save event
  const handleSaveEvent = () => {
    if (!formTitle.trim()) return;

    if (editingEventId) {
      // Update
      const updated = events.map((item) =>
        item.id === editingEventId
          ? {
              ...item,
              title: formTitle.trim(),
              date: formDate,
              startTime: formIsAllDay ? undefined : formStartTime,
              endTime: formIsAllDay ? undefined : formEndTime,
              isAllDay: formIsAllDay,
              category: formCategory,
              color: formColor,
              description: formDescription,
            }
          : item
      );
      updateEvents(updated);
    } else {
      // Create
      const newEvt: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: formTitle.trim(),
        date: formDate,
        startTime: formIsAllDay ? undefined : formStartTime,
        endTime: formIsAllDay ? undefined : formEndTime,
        isAllDay: formIsAllDay,
        category: formCategory,
        color: formColor,
        description: formDescription,
        status: 'Chưa bắt đầu',
      };
      updateEvents([...events, newEvt]);
    }
    setIsDialogOpen(false);
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!editingEventId) return;
    updateEvents(events.filter((item) => item.id !== editingEventId));
    setIsDialogOpen(false);
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Toggle category in filter
  const handleToggleCategory = (catName: string) => {
    if (activeCategories.includes(catName)) {
      setActiveCategories(activeCategories.filter((c) => c !== catName));
    } else {
      setActiveCategories([...activeCategories, catName]);
    }
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Category match
      if (!activeCategories.includes(evt.category)) return false;
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [events, activeCategories, searchQuery]);

  // Calendar calculations for Month grid
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Grid dates (weeks of 7 days)
  const monthGridDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { date: Date; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Preceding days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month to complete 35 or 42 cells (5 or 6 rows)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Mini calendar calculation
  const miniGridDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
    const days: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrev - i);
      days.push({ dayNum: daysInPrev - i, dateStr: formatDateStr(d), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      days.push({ dayNum: i, dateStr: formatDateStr(d), isCurrentMonth: true });
    }
    const rem = 35 - days.length;
    for (let i = 1; i <= (rem >= 0 ? rem : 42 - days.length); i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      days.push({ dayNum: i, dateStr: formatDateStr(d), isCurrentMonth: false });
    }
    return days;
  }, [currentYear, currentMonth]);

  const todayStr = formatDateStr(new Date());
  const selectedDateStr = formatDateStr(selectedDate);

  // Month header label e.g. "Tháng 6, 2026" / "June 2026"
  const monthNameEn = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthNameVi = `Tháng ${currentMonth + 1}, ${currentYear}`;

  // Weekdays header
  const weekDayHeaders = [
    { en: 'SUN', vi: 'CN' },
    { en: 'MON', vi: 'T2' },
    { en: 'TUE', vi: 'T3' },
    { en: 'WED', vi: 'T4' },
    { en: 'THU', vi: 'T5' },
    { en: 'FRI', vi: 'T6' },
    { en: 'SAT', vi: 'T7' },
  ];

  const miniWeekDayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Box
      style={{
        borderRadius: '12px',
        border: '1px solid var(--gray-4)',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        marginBottom: '24px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ========================================================
          1. GOOGLE CALENDAR TOP BAR
          ======================================================== */}
      <Flex
        align="center"
        justify="between"
        px="4"
        py="2"
        style={{
          borderBottom: '1px solid #dadce0',
          backgroundColor: '#ffffff',
          minHeight: '60px',
        }}
      >
        {/* Left: Hamburger, Logo, Today, Prev/Next, Month Title */}
        <Flex align="center" gap="3">
          <IconButton
            variant="ghost"
            color="gray"
            size="2"
            onClick={() => setShowSidebar(!showSidebar)}
            title="Đóng / mở thanh danh mục"
            style={{ cursor: 'pointer', borderRadius: '50%' }}
          >
            <Menu size={20} color="#5f6368" />
          </IconButton>

          {/* Google Calendar Logo Badge */}
          <Flex align="center" gap="2" style={{ userSelect: 'none' }}>
            <Box
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: '#1a73e8',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 1px 3px rgba(26, 115, 232, 0.4)',
              }}
            >
              <Text size="1" style={{ fontSize: '9px', fontWeight: 600, lineHeight: 1 }}>
                {new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase()}
              </Text>
              <Text size="3" style={{ fontWeight: 700, lineHeight: 1.1 }}>
                {new Date().getDate()}
              </Text>
            </Box>
            <Box>
              <Text size="4" weight="bold" style={{ color: '#3c4043', letterSpacing: '-0.3px' }}>
                Lịch làm việc
              </Text>
              <Text size="1" color="gray" style={{ display: 'block', lineHeight: 1 }}>
                Google Calendar View
              </Text>
            </Box>
          </Flex>

          {/* Today Button */}
          <Button
            variant="outline"
            color="gray"
            size="2"
            onClick={handleGoToday}
            style={{
              cursor: 'pointer',
              border: '1px solid #dadce0',
              borderRadius: '6px',
              fontWeight: 500,
              color: '#3c4043',
              padding: '6px 14px',
              marginLeft: '12px',
              backgroundColor: '#ffffff',
            }}
          >
            Hôm nay (Today)
          </Button>

          {/* Navigation Arrows */}
          <Flex align="center" gap="1">
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              onClick={handlePrevMonth}
              title="Tháng trước"
              style={{ cursor: 'pointer', borderRadius: '50%' }}
            >
              <ChevronLeft size={20} color="#5f6368" />
            </IconButton>
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              onClick={handleNextMonth}
              title="Tháng sau"
              style={{ cursor: 'pointer', borderRadius: '50%' }}
            >
              <ChevronRight size={20} color="#5f6368" />
            </IconButton>
          </Flex>

          {/* Current Month & Year Display */}
          <Text
            size="4"
            weight="medium"
            style={{
              color: '#3c4043',
              fontSize: '20px',
              fontWeight: 500,
              marginLeft: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            {monthNameVi} <span style={{ color: '#80868b', fontSize: '15px' }}>({monthNameEn})</span>
          </Text>
        </Flex>

        {/* Right: Search, View Mode Switcher, Event Stats */}
        <Flex align="center" gap="3">
          {/* Quick Search */}
          <Box style={{ position: 'relative', width: '200px' }}>
            <Search
              size={15}
              color="#5f6368"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sự kiện..."
              style={{
                width: '100%',
                paddingLeft: '32px',
                paddingRight: '10px',
                height: '34px',
                borderRadius: '6px',
                border: '1px solid #dadce0',
                outline: 'none',
                fontSize: '13px',
                backgroundColor: '#f1f3f4',
                color: '#3c4043',
              }}
            />
          </Box>

          {/* View Mode Selector */}
          <Select.Root
            value={viewMode}
            onValueChange={(val: 'month' | 'week' | 'agenda') => setViewMode(val)}
          >
            <Select.Trigger
              style={{
                cursor: 'pointer',
                borderRadius: '6px',
                height: '34px',
                border: '1px solid #dadce0',
                backgroundColor: '#ffffff',
                fontWeight: 500,
                color: '#3c4043',
              }}
            />
            <Select.Content>
              <Select.Item value="month">Tháng (Month)</Select.Item>
              <Select.Item value="week">Tuần (Week)</Select.Item>
              <Select.Item value="agenda">Lịch biểu (Agenda)</Select.Item>
            </Select.Content>
          </Select.Root>

          {/* Total events badge */}
          <Badge color="indigo" variant="soft" size="2">
            {filteredEvents.length} sự kiện
          </Badge>
        </Flex>
      </Flex>

      {/* ========================================================
          2. MAIN BODY (LEFT SIDEBAR + CALENDAR CONTENT)
          ======================================================== */}
      <Flex style={{ minHeight: '680px' }}>
        {/* ----------------- LEFT SIDEBAR ----------------- */}
        {showSidebar && (
          <Box
            style={{
              width: '230px',
              flexShrink: 0,
              borderRight: '1px solid #dadce0',
              padding: '16px 14px',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Google Style "+ Create" Button */}
            <Button
              size="3"
              onClick={() => handleOpenCreate()}
              style={{
                cursor: 'pointer',
                width: '100%',
                height: '46px',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                color: '#3c4043',
                border: '1px solid #dadce0',
                boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={20} color="#1a73e8" strokeWidth={2.5} />
              Tạo mới (Create)
            </Button>

            {/* Mini Calendar Date Picker */}
            <Box mb="4">
              <Flex justify="between" align="center" mb="2">
                <Text size="2" weight="bold" style={{ color: '#3c4043' }}>
                  {monthNameVi}
                </Text>
                <Flex gap="1">
                  <IconButton
                    variant="ghost"
                    color="gray"
                    size="1"
                    onClick={handlePrevMonth}
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                  >
                    <ChevronLeft size={14} />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    color="gray"
                    size="1"
                    onClick={handleNextMonth}
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                  >
                    <ChevronRight size={14} />
                  </IconButton>
                </Flex>
              </Flex>

              {/* Days header: S M T W T F S */}
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  marginBottom: '4px',
                }}
              >
                {miniWeekDayHeaders.map((dh, idx) => (
                  <Text key={idx} size="1" color="gray" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {dh}
                  </Text>
                ))}
              </Box>

              {/* Mini Days Grid */}
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '2px',
                  textAlign: 'center',
                }}
              >
                {miniGridDays.map((cell, idx) => {
                  const isToday = cell.dateStr === todayStr;
                  const isSelected = cell.dateStr === selectedDateStr;

                  return (
                    <Box
                      key={idx}
                      onClick={() => {
                        setSelectedDate(new Date(cell.dateStr));
                        handleOpenCreate(cell.dateStr);
                      }}
                      style={{
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: isToday
                          ? '#ffffff'
                          : cell.isCurrentMonth
                          ? isSelected
                            ? '#1a73e8'
                            : '#3c4043'
                          : '#bdc1c6',
                        backgroundColor: isToday
                          ? '#1a73e8'
                          : isSelected
                          ? '#e8f0fe'
                          : 'transparent',
                        fontWeight: isToday || isSelected ? 700 : 400,
                      }}
                    >
                      {cell.dayNum}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* My Calendars (Danh mục lịch) */}
            <Box style={{ borderTop: '1px solid #f1f3f4', paddingTop: '16px' }}>
              <Flex align="center" justify="between" mb="2">
                <Text size="2" weight="bold" style={{ color: '#3c4043' }}>
                  Lịch của tôi (My calendars)
                </Text>
                <ChevronDown size={14} color="#5f6368" />
              </Flex>

              <Flex direction="column" gap="2">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isChecked = activeCategories.includes(cat.name);
                  return (
                    <Flex
                      key={cat.id}
                      align="center"
                      gap="2"
                      onClick={() => handleToggleCategory(cat.name)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        userSelect: 'none',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <Box
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          backgroundColor: isChecked ? cat.color : 'transparent',
                          border: `2px solid ${cat.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </Box>
                      <Text
                        size="2"
                        style={{
                          color: isChecked ? '#3c4043' : '#80868b',
                          fontSize: '13px',
                          fontWeight: isChecked ? 500 : 400,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>

            {/* Quick Add Tip */}
            <Box
              mt="4"
              p="2"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dadce0',
              }}
            >
              <Text size="1" color="gray" style={{ lineHeight: 1.4, display: 'block' }}>
                💡 <strong>Mẹo:</strong> Nhấp vào bất kỳ ô ngày nào trên lịch để tạo nhanh sự kiện mới!
              </Text>
            </Box>
          </Box>
        )}

        {/* ----------------- MAIN CALENDAR GRID ----------------- */}
        <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* VIEW: THÁNG (MONTH VIEW) */}
          {viewMode === 'month' && (
            <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
              {/* Day Headers (SUN, MON, TUE, WED, THU, FRI, SAT) */}
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  borderBottom: '1px solid #dadce0',
                  backgroundColor: '#ffffff',
                  width: '100%',
                }}
              >
                {weekDayHeaders.map((dh, idx) => (
                  <Box
                    key={idx}
                    py="2"
                    style={{
                      textAlign: 'center',
                      borderRight: idx < 6 ? '1px solid #dadce0' : 'none',
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Text
                      size="1"
                      style={{
                        fontWeight: 600,
                        color: idx === 0 || idx === 6 ? '#d93025' : '#70757a',
                        fontSize: '11px',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {dh.en} <span style={{ opacity: 0.6 }}>({dh.vi})</span>
                    </Text>
                  </Box>
                ))}
              </Box>

              {/* Month Grid Cells (7 columns x rows) - strictly uniform 1/7 width & equal row height */}
              <Box
                style={{
                  flexGrow: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  gridAutoRows: 'minmax(120px, 1fr)',
                  width: '100%',
                }}
              >
                {monthGridDays.map((cell, idx) => {
                  const isToday = cell.dateStr === todayStr;
                  const dayEvents = filteredEvents.filter((e) => e.date === cell.dateStr);

                  return (
                    <Box
                      key={idx}
                      onClick={() => handleOpenCreate(cell.dateStr)}
                      style={{
                        borderRight: (idx + 1) % 7 !== 0 ? '1px solid #dadce0' : 'none',
                        borderBottom: '1px solid #dadce0',
                        backgroundColor: cell.isCurrentMonth ? '#ffffff' : '#fafafa',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '120px',
                        height: '100%',
                        minWidth: 0,
                        width: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Day number centered cleanly at top */}
                      <Flex justify="center" align="center" mb="1" style={{ width: '100%', minWidth: 0 }}>
                        <Box
                          style={{
                            minWidth: isToday ? '24px' : 'auto',
                            height: '24px',
                            padding: isToday ? '0 6px' : '0 4px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isToday ? '#1a73e8' : 'transparent',
                            color: isToday
                              ? '#ffffff'
                              : cell.isCurrentMonth
                              ? '#3c4043'
                              : '#80868b',
                            fontWeight: isToday ? 700 : cell.isCurrentMonth ? 500 : 400,
                            fontSize: '12px',
                            lineHeight: 1,
                          }}
                        >
                          {cell.date.getDate() === 1
                            ? `${cell.date.toLocaleString('en-US', { month: 'short' })} 1`
                            : cell.date.getDate()}
                        </Box>
                      </Flex>

                      {/* Event Chips List */}
                      <Flex
                        direction="column"
                        gap="1"
                        style={{
                          flexGrow: 1,
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {dayEvents.slice(0, 3).map((evt) => (
                          <Box
                            key={evt.id}
                            onClick={(e) => handleOpenEdit(evt, e)}
                            title={`${evt.startTime ? evt.startTime + ' - ' : ''}${evt.title}`}
                            style={{
                              backgroundColor: evt.color || '#1a73e8',
                              color: '#ffffff',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '11px',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              transition: 'opacity 0.15s ease',
                              width: '100%',
                              minWidth: 0,
                              boxSizing: 'border-box',
                              display: 'block',
                            }}
                          >
                            {evt.startTime && <strong>{evt.startTime} </strong>}
                            {evt.title}
                          </Box>
                        ))}

                        {/* If more than 3 events */}
                        {dayEvents.length > 3 && (
                          <Text
                            size="1"
                            style={{
                              color: '#1a73e8',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            +{dayEvents.length - 3} sự kiện nữa
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* VIEW: TUẦN (WEEK VIEW) */}
          {viewMode === 'week' && (
            <Box p="4">
              <Text size="3" weight="bold" mb="3">
                Lịch tuần hiện tại (Week View)
              </Text>
              <Flex direction="column" gap="2">
                {monthGridDays.slice(0, 7).map((d, i) => {
                  const evts = filteredEvents.filter((e) => e.date === d.dateStr);
                  const isToday = d.dateStr === todayStr;
                  return (
                    <Box
                      key={i}
                      p="3"
                      style={{
                        borderRadius: '8px',
                        border: isToday ? '2px solid #1a73e8' : '1px solid #dadce0',
                        backgroundColor: isToday ? '#f8fafd' : '#ffffff',
                      }}
                    >
                      <Flex justify="between" align="center" mb="2">
                        <Flex align="center" gap="2">
                          <Text size="2" weight="bold" style={{ color: isToday ? '#1a73e8' : '#3c4043' }}>
                            {weekDayHeaders[i].vi} ({weekDayHeaders[i].en}) - {d.dateStr}
                          </Text>
                          {isToday && (
                            <Badge color="blue" size="1">
                              Hôm nay
                            </Badge>
                          )}
                        </Flex>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => handleOpenCreate(d.dateStr)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Plus size={14} /> Thêm vào ngày này
                        </Button>
                      </Flex>

                      {evts.length === 0 ? (
                        <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>
                          Chưa có lịch trình nào.
                        </Text>
                      ) : (
                        <Flex direction="column" gap="1">
                          {evts.map((e) => (
                            <Flex
                              key={e.id}
                              align="center"
                              justify="between"
                              p="2"
                              onClick={() => handleOpenEdit(e)}
                              style={{
                                backgroundColor: '#f1f3f4',
                                borderLeft: `4px solid ${e.color}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <Flex align="center" gap="2">
                                <Clock size={13} color="#5f6368" />
                                <Text size="1" weight="bold">
                                  {e.startTime || 'Cả ngày'} {e.endTime ? `- ${e.endTime}` : ''}
                                </Text>
                                <Text size="2">{e.title}</Text>
                              </Flex>
                              <Badge color="gray" size="1">
                                {e.category}
                              </Badge>
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          )}

          {/* VIEW: LỊCH BIỂU (AGENDA VIEW) */}
          {viewMode === 'agenda' && (
            <Box p="4">
              <Text size="3" weight="bold" mb="3">
                Danh sách toàn bộ sự kiện & công việc
              </Text>
              {filteredEvents.length === 0 ? (
                <Box p="4" style={{ textAlign: 'center' }}>
                  <Text size="2" color="gray">
                    Không tìm thấy sự kiện nào phù hợp.
                  </Text>
                </Box>
              ) : (
                <Flex direction="column" gap="2">
                  {filteredEvents
                    .slice()
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((evt) => (
                      <Flex
                        key={evt.id}
                        align="center"
                        justify="between"
                        p="3"
                        onClick={() => handleOpenEdit(evt)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #dadce0',
                          borderLeft: `5px solid ${evt.color}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                      >
                        <Flex direction="column" gap="1">
                          <Flex align="center" gap="2">
                            <Text size="2" weight="bold" style={{ color: '#202124' }}>
                              {evt.title}
                            </Text>
                            <Badge
                              size="1"
                              style={{ backgroundColor: evt.color, color: '#ffffff' }}
                            >
                              {evt.category}
                            </Badge>
                          </Flex>
                          <Flex align="center" gap="3">
                            <Text size="1" color="gray">
                              📅 Ngày: {evt.date}
                            </Text>
                            <Text size="1" color="gray">
                              ⏰ Giờ: {evt.startTime || 'Cả ngày'} {evt.endTime ? `- ${evt.endTime}` : ''}
                            </Text>
                            {evt.description && (
                              <Text size="1" color="gray">
                                💬 {evt.description}
                              </Text>
                            )}
                          </Flex>
                        </Flex>

                        <Flex align="center" gap="2">
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="gray"
                            onClick={(e) => handleOpenEdit(evt, e)}
                          >
                            <Edit3 size={14} />
                          </IconButton>
                        </Flex>
                      </Flex>
                    ))}
                </Flex>
              )}
            </Box>
          )}
        </Box>
      </Flex>

      {/* ========================================================
          3. MODAL / DIALOG TẠO & CHỈNH SỬA SỰ KIỆN (GOOGLE STYLE)
          ======================================================== */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: '480px', borderRadius: '12px' }}>
          <Dialog.Title>
            <Flex align="center" justify="between">
              <Text size="3" weight="bold">
                {editingEventId ? 'Chỉnh sửa lịch làm việc' : 'Tạo sự kiện mới'}
              </Text>
              <IconButton
                size="1"
                variant="ghost"
                color="gray"
                onClick={() => setIsDialogOpen(false)}
              >
                <X size={16} />
              </IconButton>
            </Flex>
          </Dialog.Title>

          <Flex direction="column" gap="3" mt="3">
            {/* Title */}
            <Box>
              <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                Tiêu đề sự kiện / công việc *
              </Text>
              <TextField.Root
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Thêm tiêu đề (ví dụ: Họp nhóm dự án, Deadline...)"
                size="2"
              />
            </Box>

            {/* Date */}
            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                  Ngày (Date)
                </Text>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '34px',
                    borderRadius: '6px',
                    border: '1px solid #dadce0',
                    padding: '0 8px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </Box>

              <Box style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '6px' }}>
                <Flex align="center" gap="2" style={{ cursor: 'pointer' }}>
                  <Checkbox
                    checked={formIsAllDay}
                    onCheckedChange={(checked) => setFormIsAllDay(!!checked)}
                  />
                  <Text size="2">Cả ngày (All day)</Text>
                </Flex>
              </Box>
            </Flex>

            {/* Time range (if not all day) */}
            {!formIsAllDay && (
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                    Giờ bắt đầu
                  </Text>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    style={{
                      width: '100%',
                      height: '34px',
                      borderRadius: '6px',
                      border: '1px solid #dadce0',
                      padding: '0 8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                    Giờ kết thúc
                  </Text>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      height: '34px',
                      borderRadius: '6px',
                      border: '1px solid #dadce0',
                      padding: '0 8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </Box>
              </Flex>
            )}

            {/* Category selection */}
            <Box>
              <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                Danh mục lịch (Calendar Category)
              </Text>
              <Select.Root
                value={formCategory}
                onValueChange={(val) => {
                  setFormCategory(val);
                  const matched = DEFAULT_CATEGORIES.find((c) => c.name === val);
                  if (matched) setFormColor(matched.color);
                }}
              >
                <Select.Trigger style={{ width: '100%' }} />
                <Select.Content>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <Select.Item key={cat.id} value={cat.name}>
                      <Flex align="center" gap="2">
                        <Box
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: cat.color,
                          }}
                        />
                        {cat.name}
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Color selection */}
            <Box>
              <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                Màu sắc nhận diện
              </Text>
              <Flex gap="2">
                {[
                  '#1a73e8', // Blue
                  '#00897b', // Teal
                  '#ea580c', // Orange
                  '#1e8e3e', // Green
                  '#8e24aa', // Purple
                  '#d93025', // Red
                  '#f9ab00', // Yellow
                ].map((col) => (
                  <Box
                    key={col}
                    onClick={() => setFormColor(col)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: col,
                      cursor: 'pointer',
                      border: formColor === col ? '3px solid #202124' : '2px solid transparent',
                    }}
                  />
                ))}
              </Flex>
            </Box>

            {/* Description */}
            <Box>
              <Text size="1" weight="bold" color="gray" mb="1" style={{ display: 'block' }}>
                Mô tả chi tiết / Ghi chú
              </Text>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Thêm ghi chú, link họp Google Meet, tài liệu liên quan..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  border: '1px solid #dadce0',
                  padding: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </Box>
          </Flex>

          {/* Dialog Action Buttons */}
          <Flex justify="between" mt="4" align="center">
            {editingEventId ? (
              <Button
                variant="ghost"
                color="red"
                onClick={handleDeleteEvent}
                style={{ cursor: 'pointer' }}
              >
                <Trash2 size={15} /> Xóa sự kiện
              </Button>
            ) : (
              <Box />
            )}

            <Flex gap="2">
              <Button
                variant="outline"
                color="gray"
                onClick={() => setIsDialogOpen(false)}
                style={{ cursor: 'pointer' }}
              >
                Hủy
              </Button>
              <Button
                variant="solid"
                color="indigo"
                onClick={handleSaveEvent}
                disabled={!formTitle.trim()}
                style={{ cursor: 'pointer', backgroundColor: '#1a73e8' }}
              >
                {editingEventId ? 'Lưu thay đổi' : 'Tạo sự kiện'}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
