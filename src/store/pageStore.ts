import { create } from 'zustand';

export interface PageItem {
  id: string;
  title: string;
  icon?: string;
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
  addPage: (groupId?: string, initialData?: Partial<PageItem>) => string;
  updatePage: (pageId: string, updates: Partial<PageItem>) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setActivePage: (pageId: string) => void;
  setNavItems: (items: NavGroupItem[]) => void;
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
        content: "Đây là ghi chú cá nhân của tôi về công việc và học tập hàng ngày.\n\n- [x] Lên ý tưởng sản phẩm\n- [ ] Thiết kế giao diện Notion style\n- [ ] Hoàn thiện tính năng tạo trang mới",
        type: "page",
        createdAt: "2026-03-10",
      },
      {
        id: "p2",
        title: "Tài liệu mật",
        icon: "🔒",
        content: "Tài liệu bảo mật dự án và các ghi chú quan trọng cần lưu ý.",
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
        content: "Trợ lý AI hỗ trợ tự động hóa luồng làm việc và quản lý thông tin.",
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
        content: "Kho tài nguyên UI, Icon, Font chữ và Brand Guidelines.",
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
        content: "Tài liệu dự án liên phòng ban Alpha.",
        type: "page",
        createdAt: "2026-03-05",
      },
    ],
  },
];

export const usePageStore = create<WorkspaceState>((set, get) => ({
  navItems: initialNavItems,
  activePageId: "p1",

  addPage: (groupId, initialData) => {
    const targetGroupId = groupId || get().navItems[0]?.id || "1";
    const newPageId = `page-${Date.now()}`;
    const newPage: PageItem = {
      id: newPageId,
      title: initialData?.title ?? "", // Notion defaults to empty title (placeholder "Untitled")
      icon: initialData?.icon ?? "📄",
      content: initialData?.content ?? "",
      type: initialData?.type ?? "page",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      navItems: state.navItems.map((group) =>
        group.id === targetGroupId
          ? { ...group, children: [...group.children, newPage] }
          : group
      ),
      activePageId: newPageId,
    }));

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
      // Find another page to activate
      for (const group of newNavItems) {
        if (group.children.length > 0) {
          nextActiveId = group.children[0].id;
          break;
        }
      }
    } else {
      nextActiveId = state.activePageId;
    }

    set({
      navItems: newNavItems,
      activePageId: nextActiveId,
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

      set((s) => ({
        navItems: s.navItems.map((group) =>
          group.id === targetGroupId
            ? { ...group, children: [...group.children, duplicatedPage] }
            : group
        ),
        activePageId: duplicatedId,
      }));
    }
  },

  setActivePage: (pageId) => set({ activePageId: pageId }),

  setNavItems: (items) => set({ navItems: items }),

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
