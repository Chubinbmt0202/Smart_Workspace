# 📘 Smart Workspace - Tài liệu Kỹ thuật Chi tiết (Technical Documentation)

Tài liệu này cung cấp hướng dẫn chuyên sâu về kiến trúc, cấu trúc module, luồng dữ liệu (Data Flow) và cách bảo trì/mở rộng các tính năng trong dự án **Smart Workspace**.

---

## 1. Kiến trúc Quản lý State (`pageStore.ts`)

File: [`src/store/pageStore.ts`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/store/pageStore.ts)

### 1.1. Mô hình Dữ liệu (Type Definitions)
```typescript
export interface PageItem {
  id: string;             // Định danh duy nhất: "page-${Date.now()}"
  title: string;          // Tiêu đề trang (rỗng = "Untitled")
  icon?: string;          // Biểu tượng emoji đại diện (mặc định: "📄")
  cover?: string;         // Mã màu CSS gradient hoặc đường dẫn ảnh bìa
  content?: string;       // Nội dung bài viết (Markdown / JSON Database rows)
  type?: 'page' | 'database'; // Kiểu trang: Văn bản thường hoặc Bảng CSDL
  createdAt?: string;     // Dấu thời gian tạo trang
}

export interface NavGroupItem {
  id: string;             // Định danh nhóm (ví dụ: "1", "2", ...)
  title: string;          // Tên nhóm (Private, Agents, Team Workspace, ...)
  children: PageItem[];   // Danh sách các trang con thuộc nhóm
}
```

### 1.2. Cơ chế Lịch sử Duyệt trang (Navigation History)
`WorkspaceState` duy trì 2 thuộc tính:
- `history: string[]`: Danh sách mảng các `pageId` đã ghé thăm.
- `historyIndex: number`: Chỉ số index của trang hiện tại trong mảng lịch sử.

Khi gọi `setActivePage(pageId)` hoặc `addPage()`:
1. Mảng lịch sử được cắt ngắn đến chỉ số hiện tại: `history.slice(0, historyIndex + 1)`.
2. Đẩy `pageId` mới vào cuối mảng.
3. Cập nhật `historyIndex = history.length - 1`.

Điều này cho phép các nút `Back` và `Forward` hoạt động chính xác tương tự như trình duyệt web thực tế.

### 1.3. Xử lý Memoization tránh lỗi `Maximum update depth exceeded`
Trong React 18/19, hàm `getSnapshot` của `useSyncExternalStore` đòi hỏi tham chiếu trả về phải ổn định. 
Vì vậy, hook `useActivePage` được tách ra lấy các giá trị nguyên thủy từ store, sau đó sử dụng `useMemo`:

```typescript
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
```

---

## 2. Hệ thống Menu lệnh gạch chéo (`SlashCommandMenu.tsx`)

File: [`src/components/Editor/SlashCommandMenu.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Editor/SlashCommandMenu.tsx)

### 2.1. Cấu trúc Lệnh (`CommandItem`)
Mỗi lệnh trong hệ thống được định nghĩa với:
- `id`: Mã lệnh (`h1`, `todo`, `code`, `table`, ...)
- `title`: Tên hiển thị người dùng
- `description`: Mô tả chi tiết
- `category`: Nhóm lệnh (Khối cơ bản, Nâng cao, AI, ...)
- `icon`: Biểu tượng Lucide vector
- `keywords`: Danh sách từ khóa tìm kiếm tiếng Việt và tiếng Anh không dấu
- `execute()`: Hàm callback thực thi thao tác chèn chuỗi hoặc chuyển đổi view

### 2.2. Thuật toán phát hiện dấu `/`
Tại sự kiện `handleTextareaChange` trong [`Home.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/pages/Home.tsx):
1. Lấy vị trí con trỏ `selectionStart`.
2. Trích xuất chuỗi phía trước con trỏ: `textBeforeCursor`.
3. Tìm vị trí dấu `/` gần nhất: `lastSlashIndex`.
4. Điều kiện hợp lệ để mở menu:
   - Ký tự đứng trước dấu `/` phải là đầu dòng (`\n`) hoặc khoảng trắng (` `).
   - Đoạn văn bản giữa `/` và con trỏ không chứa ký tự xuống dòng (`\n`).
   - Độ dài chuỗi sau `/` không vượt quá 15 ký tự.

---

## 3. Hệ thống Danh sách công việc tương tác (`TodoListBlock.tsx`)

File: [`src/components/Editor/TodoListBlock.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Editor/TodoListBlock.tsx)

### 3.1. Parsing & Serializing Markdown hai chiều
Để đảm bảo dữ liệu luôn tương thích với định dạng Markdown chuẩn của Notion:
- **`parseTodosFromContent(content)`**:
  - Quét từng dòng. Nếu dòng bắt đầu bằng `- [ ] ` hoặc `- [x] `, bóc tách thành đối tượng `TodoItem`:
    ```typescript
    {
      id: string,
      text: string,
      completed: boolean,
      priority: 'high' | 'medium' | 'low'
    }
    ```
  - Các dòng văn bản khác (tiêu đề, ghi chú) được giữ nguyên trong biến `preamble`.
- **`serializeTodosToContent(preamble, todos)`**:
  - Ghép nối lại thành văn bản chuẩn: `- [x] <nội dung>` hoặc `- [ ] <nội dung>`.
  - Lưu ngược trở lại `page.content` trong store.

### 3.2. Tính năng UX nâng cao
- **Phím Enter**: Tự động chèn một `TodoItem` rỗng vào ngay vị trí phía sau mục hiện tại và tự động focus con trỏ.
- **Phím Backspace**: Khi ô nhập công việc rỗng, tự xóa công việc đó và focus ngược về mục liền trước.
- **Thanh đo tiến độ**: Tự động tính toán `Math.round((completedCount / totalCount) * 100)` và vẽ thanh `Progress`.

---

## 4. Hướng dẫn Mở rộng (Developer Guide)

### 4.1. Cách thêm một lệnh Slash Command mới
Mở [`src/components/Editor/SlashCommandMenu.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Editor/SlashCommandMenu.tsx) và thêm đối tượng mới vào mảng `getDefaultCommands`:

```typescript
{
  id: 'custom_command',
  title: 'Tên lệnh mới',
  description: 'Mô tả ngắn gọn về lệnh',
  category: 'Khối cơ bản (Basic blocks)',
  icon: <MyIcon size={18} color="var(--blue-9)" />,
  keywords: ['custom', 'lenh moi'],
  syntaxHint: '::',
  execute: () => insertText('Nội dung mẫu được chèn vào đây\n'),
}
```

### 4.2. Cách thêm nhóm thư mục mới vào Sidebar mặc định
Mở [`src/store/pageStore.ts`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/store/pageStore.ts) và bổ sung một phần tử vào `initialNavItems`:

```typescript
{
  id: "5",
  title: "Tên nhóm mới",
  children: [
    {
      id: `p-${Date.now()}`,
      title: "Trang mẫu ban đầu",
      icon: "🌟",
      content: "Nội dung khởi tạo...",
      type: "page",
      createdAt: new Date().toISOString(),
    }
  ]
}
```
