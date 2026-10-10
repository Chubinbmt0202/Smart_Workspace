import { create } from 'zustand';
import { useMemo } from 'react';
import { DEFAULT_SCHEDULE } from '../components/Editor/ScheduleBlock';

export type PageType = 'note' | 'schedule' | 'todo';

export interface PageItem {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  content?: string;
  type?: PageType;
  createdAt?: string;
}

export interface NavGroupItem {
  id: string;
  title: string;
  children: PageItem[];
}

interface WorkspaceState {
  navItems: NavGroupItem[];
  activePageId: string | null;
  history: string[];
  historyIndex: number;
  addPage: (groupId?: string, initialData?: Partial<PageItem>) => string;
  updatePage: (pageId: string, updates: Partial<PageItem>) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setActivePage: (pageId: string) => void;
  setNavItems: (items: NavGroupItem[]) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  getActivePage: () => { page: PageItem; group: NavGroupItem } | null;
}

const initialNavItems: NavGroupItem[] = [
  {
    id: "notes",
    title: "📝 Ghi chú",
    children: [
      {
        id: "note-1",
        title: "Sổ tay ghi chú & Ý tưởng",
        icon: "📝",
        cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        content: `Chào mừng bạn đến với mục Ghi chú (Notes)!

💡 Tại đây bạn có thể:
- Ghi lại mọi ý tưởng, kiến thức và tài liệu quan trọng
- Sử dụng phím '/' để mở menu chèn tiêu đề, khối trích dẫn hoặc mã code
- Nhấn phím 'Space' tại dòng trống để nhờ AI hỗ trợ viết tiếp nội dung
- Nhấp chuột vào bất kỳ khoảng trống nào bên dưới để tiếp tục soạn thảo`,
        type: "note",
        createdAt: "2026-03-10",
      },
      {
        id: "note-2",
        title: "Tài liệu kiến thức Workspace",
        icon: "💡",
        content: `📌 BỘ NGUYÊN TẮC LÀM VIỆC HIỆU QUẢ:
1. Luôn lập kế hoạch đầu ngày với mục "Lên lịch làm việc".
2. Chia nhỏ mục tiêu lớn thành các mục "Những việc cần làm".
3. Ghi chép tài liệu và quyết định quan trọng ngay vào mục "Ghi chú".`,
        type: "note",
        createdAt: "2026-03-09",
      },
    ],
  },
  {
    id: "schedule",
    title: "📅 Lên lịch làm việc",
    children: [
      {
        id: "sched-1",
        title: "Lịch trình làm việc tuần này",
        icon: "📅",
        cover: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        content: JSON.stringify(DEFAULT_SCHEDULE),
        type: "schedule",
        createdAt: "2026-03-08",
      },
      {
        id: "sched-2",
        title: "Lịch họp & Hạn chót (Deadlines)",
        icon: "⏰",
        content: JSON.stringify([
          {
            id: 'd1',
            day: 'Thứ Ba',
            time: '14:00 - 15:00',
            title: 'Họp rà soát tiến độ với Product Manager',
            category: 'Họp (Meeting)',
            status: 'Đã xong',
          },
          {
            id: 'd2',
            day: 'Thứ Năm',
            time: '17:30',
            title: 'Hạn chót bàn giao phiên bản Beta v1.0',
            category: 'Deadline',
            status: 'Chưa bắt đầu',
          },
        ]),
        type: "schedule",
        createdAt: "2026-03-07",
      },
    ],
  },
  {
    id: "todos",
    title: "☑️ Những việc cần làm",
    children: [
      {
        id: "todo-1",
        title: "Nhiệm vụ cần làm hôm nay",
        icon: "☑️",
        cover: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        content: `- [x] Hoàn thiện tính năng Ghi chú Notion 🔥
- [x] Tích hợp Lên lịch làm việc theo khung giờ ⚡
- [ ] Quản lý Những việc cần làm tương tác với tiến độ
- [ ] Đánh giá trải nghiệm người dùng
- [ ] Tối ưu hóa phím tắt thao tác`,
        type: "todo",
        createdAt: "2026-03-06",
      },
      {
        id: "todo-2",
        title: "Mục tiêu trọng tâm tuần",
        icon: "🎯",
        content: `- [x] Thiết kế giao diện chuyên nghiệp
- [ ] Tối ưu hóa phím tắt Enter và Shift+Enter
- [ ] Hoàn thiện tài liệu hướng dẫn người dùng`,
        type: "todo",
        createdAt: "2026-03-05",
      },
    ],
  },
];

export const usePageStore = create<WorkspaceState>((set, get) => ({
  navItems: initialNavItems,
  activePageId: "note-1",
  history: ["note-1"],
  historyIndex: 0,

  addPage: (groupId, initialData) => {
    const targetGroupId = groupId || get().navItems[0]?.id || "notes";
    const newPageId = `page-${Date.now()}`;

    // Tự động gán type và icon mặc định dựa trên nhóm được chọn
    let defaultType: PageType = 'note';
    let defaultIcon = '📝';
    if (targetGroupId === 'schedule') {
      defaultType = 'schedule';
      defaultIcon = '📅';
    } else if (targetGroupId === 'todos') {
      defaultType = 'todo';
      defaultIcon = '☑️';
    }

    const newPage: PageItem = {
      id: newPageId,
      title: initialData?.title ?? "",
      icon: initialData?.icon ?? defaultIcon,
      cover: initialData?.cover,
      content: initialData?.content ?? (defaultType === 'schedule' ? JSON.stringify(DEFAULT_SCHEDULE) : ""),
      type: initialData?.type ?? defaultType,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const newNavItems = state.navItems.map((group) =>
        group.id === targetGroupId
          ? { ...group, children: [...group.children, newPage] }
          : group
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newPageId);

      return {
        navItems: newNavItems,
        activePageId: newPageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });

    return newPageId;
  },

  updatePage: (pageId, updates) => {
    set((state) => ({
      navItems: state.navItems.map((group) => ({
        ...group,
        children: group.children.map((page) =>
          page.id === pageId ? { ...page, ...updates } : page
        ),
      })),
    }));
  },

  deletePage: (pageId) => {
    const state = get();
    let nextActiveId: string | null = null;

    const newNavItems = state.navItems.map((group) => ({
      ...group,
      children: group.children.filter((page) => page.id !== pageId),
    }));

    if (state.activePageId === pageId) {
      for (const group of newNavItems) {
        if (group.children.length > 0) {
          nextActiveId = group.children[0].id;
          break;
        }
      }
    } else {
      nextActiveId = state.activePageId;
    }

    const filteredHistory = state.history.filter((id) => id !== pageId);
    const newHistory = filteredHistory.length > 0 ? filteredHistory : nextActiveId ? [nextActiveId] : [];
    const newHistoryIndex = Math.max(0, newHistory.length - 1);

    set({
      navItems: newNavItems,
      activePageId: nextActiveId,
      history: newHistory,
      historyIndex: newHistoryIndex,
    });
  },

  duplicatePage: (pageId) => {
    const state = get();
    let targetPage: PageItem | null = null;
    let targetGroupId: string | null = null;

    for (const group of state.navItems) {
      const found = group.children.find((p) => p.id === pageId);
      if (found) {
        targetPage = found;
        targetGroupId = group.id;
        break;
      }
    }

    if (targetPage && targetGroupId) {
      const duplicatedId = `page-${Date.now()}`;
      const duplicatedPage: PageItem = {
        ...targetPage,
        id: duplicatedId,
        title: targetPage.title ? `${targetPage.title} (Bản sao)` : "Untitled (Bản sao)",
      };

      set((s) => {
        const newHistory = s.history.slice(0, s.historyIndex + 1);
        newHistory.push(duplicatedId);
        return {
          navItems: s.navItems.map((group) =>
            group.id === targetGroupId
              ? { ...group, children: [...group.children, duplicatedPage] }
              : group
          ),
          activePageId: duplicatedId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    }
  },

  setActivePage: (pageId) => {
    set((state) => {
      if (state.activePageId === pageId) return state;
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(pageId);
      return {
        activePageId: pageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setNavItems: (items) => set({ navItems: items }),

  goBack: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        historyIndex: prevIndex,
        activePageId: history[prevIndex],
      });
    }
  },

  goForward: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        historyIndex: nextIndex,
        activePageId: history[nextIndex],
      });
    }
  },

  canGoBack: () => get().historyIndex > 0,

  canGoForward: () => get().historyIndex < get().history.length - 1,

  getActivePage: () => {
    const { navItems, activePageId } = get();
    if (!activePageId) return null;
    for (const group of navItems) {
      const found = group.children.find((p) => p.id === activePageId);
      if (found) {
        return { page: found, group };
      }
    }
    return null;
  },
}));

export const useActivePage = () => {
  const activePageId = usePageStore((state) => state.activePageId);
  const navItems = usePageStore((state) => state.navItems);

  return useMemo(() => {
    if (!activePageId) return null;
    for (const group of navItems) {
      const found = group.children.find((p) => p.id === activePageId);
      if (found) {
        return { page: found, group };
      }
    }
    return null;
  }, [activePageId, navItems]);
};
