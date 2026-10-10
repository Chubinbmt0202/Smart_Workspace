# 🚀 Smart Workspace - Notion-Style Workspace & Knowledge Base

**Smart Workspace** là một nền tảng quản lý không gian làm việc và tri thức số hiện đại, được thiết kế và xây dựng theo phong cách **Notion**. Ứng dụng cung cấp trải nghiệm mượt mà với thanh bên (Sidebar) phân nhóm linh hoạt, thanh điều hướng (Breadcrumb Navigation) thông minh, cơ chế tạo trang tức thì, menu lệnh gạch chéo (`/` Slash Commands), danh sách công việc tương tác (Interactive To-do List) và bảng dữ liệu (Table Database).

---

## 📑 Mục lục
1. [Tính năng nổi bật](#1-tính-năng-nổi-bật)
2. [Kiến trúc hệ thống & Quản lý State](#2-kiến-trúc-hệ-thống--quản-lý-state)
3. [Chi tiết các thành phần chính](#3-chi-tiết-các-thành-phần-chính)
   - [3.1. Cơ chế tạo trang mới (New Page Mechanism)](#31-cơ-chế-tạo-trang-mới-new-page-mechanism)
   - [3.2. Thanh điều hướng & Lịch sử duyệt trang (Navigation Bar & Breadcrumbs)](#32-thanh-điều-hướng--lịch-sử-duyệt-trang-navigation-bar--breadcrumbs)
   - [3.3. Menu lệnh gạch chéo (`/` Slash Commands) & AI Assistant](#33-menu-lệnh-gạch-chéo--slash-commands--ai-assistant)
   - [3.4. Danh sách công việc tương tác (Interactive To-do List)](#34-danh-sách-công-việc-tương-tác-interactive-to-do-list)
   - [3.5. Bảng cơ sở dữ liệu (Table Database View)](#35-bảng-cơ-sở-dữ-liệu-table-database-view)
4. [Công nghệ sử dụng](#4-công-nghệ-sử-dụng)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Hướng dẫn cài đặt và khởi chạy](#6-hướng-dẫn-cài-đặt-và-khởi-chạy)
7. [Bảng phím tắt & Thao tác nhanh](#7-bảng-phím-tắt--thao-tác-nhanh)
8. [Định hướng phát triển tiếp theo (Roadmap)](#8-định-hướng-phát-triển-tiếp-theo-roadmap)

---

## 1. Tính năng nổi bật

- 📄 **Cơ chế tạo trang tức thì**: Tạo trang mới nhanh chóng từ nút đỉnh Sidebar, hover `+` tại tiêu đề nhóm hoặc nút `+ Add a page` inline.
- ✍️ **Click vùng trống để soạn thảo (Click-to-Edit)**: Nhấp chuột vào bất kỳ khoảng trống nào bên dưới nội dung trang sẽ lập tức kích hoạt vùng soạn thảo và đặt con trỏ ở cuối văn bản giống như Notion.
- 🧭 **Thanh điều hướng Breadcrumb thông minh**: Hiển thị đường dẫn `Workspace / Nhóm / Trang`, tích hợp nút lịch sử **Back (`<`)** và **Forward (`>`)**, kèm menu dropdown chuyển nhanh giữa các trang cùng nhóm.
- ⚡ **Hệ thống Slash Commands (`/`)**: Gõ `/` để mở menu lệnh nổi, lọc tìm kiếm thời gian thực, điều hướng bằng phím mũi tên `↑ ↓` và phím `Enter`.
- 🤖 **Kích hoạt AI Assistant**: Nhấn phím `Space` tại trang hoặc dòng trống để gọi trợ lý AI hỗ trợ soạn thảo.
- ☑️ **Giao diện To-do List tương tác cao cấp**: Checkbox vuông bo góc chuẩn Notion, gạch ngang chữ khi hoàn thành, thanh đo tiến độ (% hoàn thành), bộ lọc theo trạng thái, tự động nhận diện mức độ ưu tiên (`🔥`, `⚡`) và phím tắt `Enter`/`Backspace`.
- 📊 **Table Database**: Hỗ trợ chuyển đổi trang sang bảng cơ sở dữ liệu có các cột: Tên công việc, Trạng thái (Badge), Nhãn (Tag), Ngày tháng và thao tác thêm/xóa hàng trực tiếp.
- 🎨 **Tùy biến trang phong phú**: Hỗ trợ bộ Emoji Picker sinh động, ảnh bìa gradient nghệ thuật (Cover Image), tiêu đề chỉnh sửa trực tiếp không viền tự động đồng bộ thời gian thực.
- 🗂️ **Sidebar phân tầng & Kéo thả (Drag & Drop)**: Hỗ trợ sắp xếp các nhóm bằng `@dnd-kit`, thu gọn/mở rộng thanh bên mượt mà.

---

## 2. Kiến trúc hệ thống & Quản lý State

Dự án sử dụng **Zustand** làm kho lưu trữ trung tâm (`pageStore.ts`) với thiết kế bất biến (Immutable State) và tương thích hoàn toàn với React 18/19 (`useSyncExternalStore`):

```
                   ┌─────────────────────────────────────────┐
                   │        usePageStore (Zustand)           │
                   │  - navItems: NavGroupItem[]             │
                   │  - activePageId: string | null          │
                   │  - history: string[]                    │
                   │  - historyIndex: number                 │
                   └────────────────────┬────────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│      Sidebar       │       │       Topbar       │       │    Home (Editor)   │
│ - NavGroup (Dnd)   │       │ - Back/Forward     │       │ - Title & Icon     │
│ - New Page trigger │       │ - Breadcrumb Trail │       │ - TodoListBlock    │
│ - Drag & Drop      │       │ - Quick Switcher   │       │ - SlashCommandMenu │
└────────────────────┘       └────────────────────┘       └────────────────────┘
```

### Các phương thức cốt lõi trong `usePageStore`:
- `addPage(groupId?, initialData?)`: Tạo trang mới với ID duy nhất, tiêu đề mặc định (placeholder *"Untitled"*), icon `📄` và tự động kích hoạt trang mới tạo.
- `updatePage(pageId, updates)`: Cập nhật tiêu đề, icon, ảnh bìa, nội dung hoặc kiểu trang trong thời gian thực.
- `deletePage(pageId)`: Xóa trang và tự động chuyển sang trang kế tiếp hoặc trang hợp lệ trong lịch sử.
- `duplicatePage(pageId)`: Nhân bản trang hiện tại thành bản sao `(Copy)`.
- `setActivePage(pageId)`: Chuyển trang hoạt động và ghi nhận vào lịch sử duyệt (`history`).
- `goBack()` / `goForward()`: Điều hướng quay lại / tiến tới theo lịch sử trang đã xem.
- `useActivePage()`: Custom hook đã được memoize qua `useMemo`, đảm bảo không bao giờ phát sinh lỗi re-render vô hạn (*getSnapshot caching*).

---

## 3. Chi tiết các thành phần chính

### 3.1. Cơ chế tạo trang mới (New Page Mechanism)
Ứng dụng cung cấp 3 điểm kích hoạt tạo trang chuẩn phong cách Notion:
1. **Nút Viết mới (`SquarePen`) tại header Sidebar**: Tạo nhanh trang mới vào nhóm mặc định (*Private*) và chuyển màn hình đến trang đó.
2. **Nút `+` khi hover tiêu đề nhóm (`NavGroup`)**: Di chuột vào tên nhóm (như *Private*, *Agents*, *Team Workspace*) sẽ hiện nút `+`. Bấm vào sẽ tạo trang mới trực tiếp trong nhóm đó và tự động mở nhóm ra.
3. **Nút inline `+ Add a page`**: Nằm ở cuối danh sách trang của từng nhóm.

Khi trang mới được tạo:
- Tiêu đề mặc định rỗng với placeholder mờ `"Untitled"`.
- Con trỏ chuột tự động **focus** ngay vào ô nhập tiêu đề lớn.
- Nếu trang chưa có nội dung, hệ thống hiển thị các thẻ mẫu khởi đầu:
  - 📄 **Trang trống (Empty page)**
  - ✨ **Trang có icon ngẫu nhiên**
  - 📊 **Bảng cơ sở dữ liệu (Table Database)**
  - 📅 **Biên bản cuộc họp (Meeting Notes)**
  - 📋 **Kế hoạch công việc (To-do List)**

---

### 3.2. Thanh điều hướng & Lịch sử duyệt trang (Navigation Bar & Breadcrumbs)
Vị trí: [`Topbar.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Topbar.tsx)

- **Cặp nút Lịch sử (History Controls)**:
  - `<` (Quay lại trang trước): Sáng khi có thể quay lại, mờ khi ở trang đầu tiên.
  - `>` (Tiến tới trang sau): Sáng khi có thể tiến tới, mờ khi ở trang mới nhất.
- **Đường dẫn Breadcrumbs**:
  - `🏢 Smart Workspace` / `🔒 [Tên Nhóm]` / `[Icon] [Tên Trang]`.
  - Nhấp vào **[Tên Nhóm]** sẽ mở một menu dropdown hiển thị tất cả các trang anh em trong nhóm để chuyển trang nhanh chỉ với 1 click.
- **Đồng bộ thời gian thực**: Khi sửa tiêu đề hay icon ở trang chính, Topbar cập nhật ngay lập tức.
- **Các tiện ích phụ trợ**: Nút Copy link trang hiện tại, nút Yêu thích (Star), trạng thái "Đã lưu", menu `...` để nhân bản hoặc chuyển đổi kiểu trang.

---

### 3.3. Menu lệnh gạch chéo (`/` Slash Commands) & AI Assistant
Vị trí: [`SlashCommandMenu.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Editor/SlashCommandMenu.tsx)

- **Kích hoạt tự động**: Gõ ký tự `/` ở đầu dòng hoặc sau dấu cách sẽ mở menu nổi ngay dưới vị trí con trỏ.
- **Bộ lọc tìm kiếm tức thì**: Gõ tiếp ký tự sau `/` (ví dụ: `/h1`, `/todo`, `/call`, `/code`, `/table`, `/ai`) để lọc nhanh chức năng.
- **Điều khiển bằng bàn phím**:
  - `ArrowDown` ($\downarrow$) / `ArrowUp` ($\uparrow$): Di chuyển vệt sáng chọn lệnh.
  - `Enter` hoặc `Tab`: Thực thi lệnh và tự động đưa con trỏ chuột đến cuối khối vừa chèn.
  - `Escape`: Đóng menu lệnh.
- **Danh mục lệnh hỗ trợ**:
  | Lệnh | Tên chức năng | Cú pháp chèn | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `/text` | Văn bản thuần | Văn bản | Đoạn văn bản thông thường |
  | `/h1` | Heading 1 | `# ` | Tiêu đề cấp 1 lớn nhất |
  | `/h2` | Heading 2 | `## ` | Tiêu đề cấp 2 vừa |
  | `/h3` | Heading 3 | `### ` | Tiêu đề cấp 3 nhỏ |
  | `/todo` | To-do list | `- [ ] ` | Khối công việc có ô check |
  | `/bullet` | Bulleted list | `- ` | Danh sách chấm đầu dòng |
  | `/number` | Numbered list | `1. ` | Danh sách đánh số thứ tự |
  | `/callout`| Callout box | `> 💡 ` | Hộp ghi chú nổi bật |
  | `/quote` | Quote | `> ` | Đoạn trích dẫn |
  | `/divider`| Divider | `---` | Đường kẻ ngang phân cách |
  | `/code` | Code block | ````javascript ` | Khối mã lập trình |
  | `/ai` | Ask AI | `✨ [AI Assistant]` | Gọi trợ lý AI gợi ý nội dung |
  | `/table` | Table Database | Bảng dữ liệu | Chuyển sang chế độ Database |
- **Phím Space cho AI**: Khi trang hoặc dòng trống, placeholder hiển thị `"Press 'space' for AI or '/' for commands"`. Nhấn phím `Space` sẽ kích hoạt ngay khung hỗ trợ của AI.

---

### 3.4. Danh sách công việc tương tác (Interactive To-do List)
Vị trí: [`TodoListBlock.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Editor/TodoListBlock.tsx)

- **Ô Checkbox vuông phong cách Notion**: Nhấp để đánh dấu hoàn thành; khi hoàn thành ô chuyển nền xanh với icon check trắng, văn bản tự động gạch ngang (`line-through`) và mờ nhẹ.
- **Thanh đo tiến độ (Progress Bar)**: Đo lường tỷ lệ hoàn thành dạng phần trăm (ví dụ: `3/5 việc (60%)`), tự đổi sang màu xanh lá khi đạt 100%.
- **Bộ lọc trạng thái (Filters)**: Dễ dàng xem theo tab **Tất cả**, **Chưa xong**, **Đã xong**.
- **Soạn thảo nhanh bằng phím**:
  - `Enter`: Tạo ngay một việc mới ở dòng tiếp theo và focus con trỏ vào ô nhập.
  - `Backspace`: Khi ô nhập trống, tự động xóa dòng công việc hiện tại.
- **Tự động nhận diện mức độ ưu tiên**:
  - Công việc chứa biểu tượng `🔥` tự động gắn nhãn **Ưu tiên cao**.
  - Công việc chứa biểu tượng `⚡` tự động gắn nhãn **Quan trọng**.
- **Chuyển đổi chế độ xem linh hoạt**: Cung cấp nút chuyển đổi giữa **☑️ Checklist tương tác** và **📝 Văn bản thuần** (Markdown raw).

---

### 3.5. Bảng cơ sở dữ liệu (Table Database View)
- Bảng hiển thị thông tin gồm các cột: **Tên công việc**, **Trạng thái (Badge màu)**, **Nhãn Tag**, **Ngày thực hiện**, và **Nút xóa**.
- Hỗ trợ thêm hàng mới tức thì với nút `+ Thêm hàng mới`.
- Chỉnh sửa trực tiếp tên công việc tại từng ô trên bảng.

---

## 4. Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích sử dụng |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | Thư viện UI cốt lõi |
| **TypeScript** | `~6.0.2` | Kiểm soát kiểu dữ liệu an toàn và chặt chẽ |
| **Vite** | `^8.3.0` | Công cụ build và máy chủ phát triển siêu tốc |
| **Radix Themes & Icons** | `^3.3.0` | Hệ thống component UI chuẩn Design System & Accessibility |
| **Zustand** | `^5.0.15` | Quản trị State tập trung, hiệu năng cao, không boilerplate |
| **@dnd-kit** | `^6.3.1` | Kéo thả mượt mà cho thanh bên Sidebar |
| **Lucide React** | `^1.52.0` | Bộ biểu tượng vector hiện đại, sắc nét |

---

## 5. Cấu trúc thư mục

```bash
smart_workspace/
├── src/
│   ├── components/
│   │   ├── Dialog/
│   │   │   └── AddDialog.tsx              # Popup tạo trang (tuỳ chọn)
│   │   ├── Editor/
│   │   │   ├── SlashCommandMenu.tsx       # Menu lệnh nổi khi gõ '/'
│   │   │   └── TodoListBlock.tsx          # Khối Checklist công việc tương tác Notion
│   │   ├── Sidebar/
│   │   │   ├── NavGroup.tsx               # Nhóm danh mục Sidebar & hover '+' button
│   │   │   ├── Sidebar.tsx                # Thanh bên chính & nút SquarePen tạo trang
│   │   │   ├── SidebarContent.tsx         # DndContext kéo thả nhóm
│   │   │   └── SortableNavItem.tsx        # Item trang con, menu Duplicate/Delete
│   │   └── Topbar.tsx                     # Thanh điều hướng Breadcrumb, Back/Forward
│   ├── layouts/
│   │   └── MainLayout.tsx                 # Khung Layout đóng/mở Sidebar & Topbar
│   ├── pages/
│   │   └── Home.tsx                       # Màn hình soạn thảo trang chính Notion
│   ├── store/
│   │   └── pageStore.ts                   # Quản lý state toàn cục (Zustand store & hook)
│   ├── styles/
│   │   └── globals.css                    # CSS Reset & tuỳ biến toàn cục
│   ├── App.tsx                            # Root App Component
│   └── main.tsx                           # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 6. Hướng dẫn cài đặt và khởi chạy

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên
- **Trình quản lý gói**: npm (hoặc yarn/pnpm)

### Các bước cài đặt:
1. Mở terminal tại thư mục dự án:
   ```bash
   cd "d:/Ôn tập/Smart_Workspace"
   ```

2. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```

3. Khởi chạy máy chủ phát triển (Dev server):
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại địa chỉ: `http://localhost:5173`

4. Kiểm tra build sản phẩm (Production build):
   ```bash
   npm run build
   ```

---

## 7. Bảng phím tắt & Thao tác nhanh

| Phím tắt / Thao tác | Khu vực | Chức năng thực hiện |
| :--- | :--- | :--- |
| `Ctrl + K` | Sidebar | Mở ô tìm kiếm nhanh (Search or ask) |
| `/` | Trình soạn thảo | Mở menu Slash Command chọn khối chức năng |
| `Space` | Trình soạn thảo trống | Gọi trợ lý AI soạn thảo nội dung |
| `Enter` | Trình soạn thảo | Đổi sang khối block khác (chuyển về khối văn bản thường) |
| `Shift + Enter` | Trình soạn thảo / Todo | Tiếp tục duy trì khối block đó (to-do, bullet, số tăng dần, quote, heading...) |
| `Backspace` | Dòng trống có prefix | Xóa tiền tố khối hoặc xóa dòng to-do hiện tại |
| `Arrow Up / Down` | Menu `/` | Di chuyển vệt sáng chọn lệnh trong danh mục |
| `Escape` | Menu `/` | Đóng menu lệnh nổi |
| Click Icon trang | Tiêu đề trang | Mở bảng chọn nhanh biểu tượng Emoji |

---

## 8. Định hướng phát triển tiếp theo (Roadmap)

- [ ] **Lưu trữ dữ liệu bền vững (Persistence)**: Tích hợp `localStorage` hoặc Backend API / Firebase để lưu dữ liệu lâu dài.
- [ ] **Khối Kéo Thả (Drag-and-Drop Blocks)**: Cho phép sắp xếp từng khối văn bản, ảnh, callout tự do trên trang.
- [ ] **Tích hợp mô hình AI thực tế (Gemini API)**: Kết nối API để sinh văn bản, tóm tắt trang và dịch tự động.
- [ ] **Dark Mode Toggle**: Hỗ trợ chuyển đổi giao diện sáng/tối linh hoạt thông qua Radix Theme.
- [ ] **Hỗ trợ tệp đính kèm & Tải ảnh lên**: Tải ảnh trực tiếp làm ảnh bìa hoặc chèn vào giữa bài viết.
