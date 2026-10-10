import { create } from 'zustand';
import { useMemo } from 'react';

export interface PageItem {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  content?: string;
  type?: 'page' | 'database';
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
    id: "1",
    title: "Private",
    children: [
      {
        id: "p1",
        title: "Note của tôi",
        icon: "📝",
        cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        content: `Chào mừng bạn đến với sổ tay cá nhân Smart Workspace!

🎯 Mục tiêu công việc trong tuần:
- [x] Lên ý tưởng giao diện Notion phong cách hiện đại
- [x] Xây dựng cơ chế tạo trang mới nhanh
- [x] Tích hợp thanh điều hướng Breadcrumb thông minh
- [ ] Tích hợp phím tắt nhanh

💡 Ghi chú quan trọng:
Mọi nội dung bạn gõ ở đây sẽ được lưu trữ và cập nhật đồng bộ tức thì trên thanh điều hướng và Sidebar.`,
        type: "page",
        createdAt: "2026-03-10",
      },
      {
        id: "p2",
        title: "Tài liệu mật",
        icon: "🔒",
        content: `🔒 BẢO MẬT NỘI BỘ - KHÔNG CHIA SẺ RA NGOÀI

Danh sách các quy chuẩn an toàn:
1. Xác thực hai yếu tố (2FA) bắt buộc cho tất cả tài khoản.
2. Mã hóa dữ liệu người dùng tại client và lưu trữ đám mây an toàn.
3. Kiểm tra định kỳ log truy cập mỗi tuần.`,
        type: "page",
        createdAt: "2026-03-09",
      },
    ],
  },
  {
    id: "2",
    title: "Agents",
    children: [
      {
        id: "p3",
        title: "Assistant",
        icon: "🤖",
        cover: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        content: `🤖 Trợ lý AI Workspace

Tôi có thể giúp bạn:
- Tự động tóm tắt các cuộc họp
- Gợi ý cấu trúc dự án và tạo biểu mẫu công việc
- Phân tích dữ liệu từ bảng biểu và tạo báo cáo tự động`,
        type: "page",
        createdAt: "2026-03-08",
      },
    ],
  },
  {
    id: "3",
    title: "Team Workspace",
    children: [
      {
        id: "p4",
        title: "Báo cáo quý 1",
        icon: "📊",
        content: "Báo cáo tổng kết hiệu quả dự án và các chỉ số tăng trưởng quý 1.",
        type: "database",
        createdAt: "2026-03-07",
      },
      {
        id: "p5",
        title: "Design Assets",
        icon: "🎨",
        cover: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
        content: `🎨 Kho tài nguyên thiết kế UI/UX

1. Bảng màu thương hiệu:
   - Primary: #6366F1 (Indigo)
   - Secondary: #8B5CF6 (Purple)
   - Gray scale: Radix Themes Gray palette

2. Bộ Typography:
   - Display: Inter / System Font
   - Code: JetBrains Mono / SF Mono`,
        type: "page",
        createdAt: "2026-03-06",
      },
    ],
  },
  {
    id: "4",
    title: "Shared with me",
    children: [
      {
        id: "p6",
        title: "Project Alpha",
        icon: "📁",
        content: `📁 Dự án Alpha - Hợp tác liên phòng ban

Kế hoạch phát hành phiên bản Beta vào cuối tháng:
- Tuần 1: Thiết kế giao diện và luồng người dùng
- Tuần 2: Tích hợp logic và quản lý trạng thái
- Tuần 3: Kiểm thử tải và thu thập phản hồi người dùng`,
        type: "page",
        createdAt: "2026-03-05",
      },
    ],
  },
];

export const usePageStore = create<WorkspaceState>((set, get) => ({
  navItems: initialNavItems,
  activePageId: "p1",
  history: ["p1"],
  historyIndex: 0,

  addPage: (groupId, initialData) => {
    const targetGroupId = groupId || get().navItems[0]?.id || "1";
    const newPageId = `page-${Date.now()}`;
    const newPage: PageItem = {
      id: newPageId,
      title: initialData?.title ?? "",
      icon: initialData?.icon ?? "📄",
      cover: initialData?.cover,
      content: initialData?.content ?? "",
      type: initialData?.type ?? "page",
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
        title: targetPage.title ? `${targetPage.title} (Copy)` : "Untitled (Copy)",
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
