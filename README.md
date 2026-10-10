# 🚀 Smart Workspace - 3 Chức Năng Chính: Ghi Chú, Lên Lịch & Việc Cần Làm

**Smart Workspace** là một nền tảng quản lý không gian làm việc cá nhân và đội ngũ theo phong cách **Notion**, được tinh gọn tập trung tối đa vào **3 chức năng cốt lõi**:
1. 📝 **Ghi chú (Notes)**: Soạn thảo văn bản, lưu trữ kiến thức và ý tưởng với menu lệnh gạch chéo (`/` Slash Commands).
2. 📅 **Lên lịch làm việc (Schedule)**: Lập kế hoạch theo ngày, khung giờ, phân loại sự kiện và theo dõi trạng thái.
3. ☑️ **Những việc cần làm (To-do List)**: Danh sách nhiệm vụ tương tác với checkbox Notion, thanh đo tiến độ và bộ lọc trạng thái.

---

## 📑 Mục lục
1. [3 Chức năng cốt lõi](#1-3-chức-năng-cốt-lõi)
   - [1.1. Ghi chú (Notes)](#11-ghi-chú-notes)
   - [1.2. Lên lịch làm việc (Schedule)](#12-lên-lịch-làm-việc-schedule)
   - [1.3. Những việc cần làm (To-do List)](#13-những-việc-cần-làm-to-do-list)
2. [Cơ chế tạo trang & Chuyển đổi linh hoạt](#2-cơ-chế-tạo-trang--chuyển-đổi-linh-hoạt)
3. [Thanh điều hướng Breadcrumb & Lịch sử](#3-thanh-điều-hướng-breadcrumb--lịch-sử)
4. [Trải nghiệm thao tác phím mượt mà](#4-trải-nghiệm-thao-tác-phím-mượt-mà)
5. [Kiến trúc State Management](#5-kiến-trúc-state-management)
6. [Cấu trúc thư mục](#6-cấu-trúc-thư-mục)
7. [Hướng dẫn cài đặt và khởi chạy](#7-hướng-dẫn-cài-đặt-và-khởi-chạy)
8. [Bảng phím tắt & Thao tác nhanh](#8-bảng-phím-tắt--thao-tác-nhanh)

---

## 1. 3 Chức năng cốt lõi

### 1.1. 📝 Ghi chú (Notes)
- **Soạn thảo tự do phong cách Notion**: Tiêu đề lớn không viền, đồng bộ thời gian thực với thanh điều hướng và Sidebar.
- **Menu lệnh gạch chéo (`/` Slash Commands)**: Gõ `/` để chèn nhanh Tiêu đề (H1, H2, H3), Danh sách chấm tròn, Đánh số, Khung chú thích (`Callout box`), Khối trích dẫn (`Quote`), Đường kẻ (`Divider`), Khối mã (`Code block`).
- **Trợ lý AI (Ask AI)**: Nhấn phím `Space` tại dòng trống để kích hoạt trợ lý AI gợi ý hoặc viết tiếp nội dung.
- **Click vùng trống để soạn thảo (Click-to-Edit)**: Nhấp chuột vào bất kỳ khoảng trắng nào bên dưới nội dung trang sẽ lập tức kích hoạt vùng soạn thảo và đặt con trỏ ở cuối văn bản.
- **Tùy biến hình ảnh**: Hỗ trợ bộ Emoji Picker Notion sinh động và ảnh bìa gradient nghệ thuật (Cover Image).

### 1.2. 📅 Lên lịch làm việc (Schedule Planner)
- **Bảng lịch trình công việc chuyên nghiệp**: Quản lý lịch làm việc theo các cột thông tin:
  - **Ngày / Thứ**: Thứ Hai, Thứ Ba, Hôm nay, ngày cụ thể,...
  - **Khung giờ**: 09:00 - 10:00, 14:00 - 16:30,... kèm icon đồng hồ.
  - **Công việc / Sự kiện**: Chỉnh sửa trực tiếp tên sự kiện hoặc cuộc họp.
  - **Phân loại (Tag)**: Họp (Meeting), Công việc (Task), Kế hoạch (Planning), Hạn chót (Deadline) với màu sắc nổi bật.
  - **Trạng thái**: Chưa bắt đầu, Đang diễn ra, Đã xong.
- **Thao tác nhanh**: Thêm dòng lịch mới chỉ với 1 click (`+ Thêm lịch mới`), click trực tiếp vào Badge để đổi trạng thái hoặc phân loại.
- **Bộ lọc thông minh**: Lọc nhanh theo **Tất cả**, **Chưa xong**, **Đã xong**.
- **Khu vực ghi chú bổ sung**: Cho phép gõ thêm ghi chú chi tiết bên dưới bảng lịch trình.

### 1.3. ☑️ Những việc cần làm (To-do List)
- **Checkbox vuông chuẩn Notion**: Nhấp để đánh dấu hoàn thành; văn bản tự động gạch ngang (`line-through`) và mờ nhẹ khi hoàn thành.
- **Thanh đo tiến độ trực quan (Progress Bar)**: Hiển thị tỷ lệ hoàn thành dạng phần trăm (ví dụ: `3/5 việc (60%)`), tự động đổi sang màu xanh lá khi đạt $100\%$.
- **Bộ lọc trạng thái công việc**: Lọc theo tab **Tất cả**, **Chưa xong**, **Đã xong** kèm số lượng công việc cụ thể.
- **Tự động nhận diện mức độ ưu tiên**:
  - Công việc chứa biểu tượng `🔥` tự động gắn huy hiệu đỏ **Ưu tiên cao**.
  - Công việc chứa biểu tượng `⚡` tự động gắn huy hiệu vàng **Quan trọng**.
- **Thao tác phím nhanh**:
  - `Shift + Enter`: Tạo thêm một ô việc cần làm mới ngay sau mục hiện tại.
  - `Enter`: Giữ nguyên danh sách cũ và chuyển ngay xuống vùng soạn thảo văn bản bình thường bên dưới.

---

## 2. Cơ chế tạo trang & Chuyển đổi linh hoạt

- **3 Nhóm danh mục chính trên Sidebar**:
  1. `📝 Ghi chú (Notes)`
  2. `📅 Lên lịch làm việc (Schedule)`
  3. `☑️ Những việc cần làm (To-do List)`
- **Tạo trang mới**:
  - Bấm nút `+` bên cạnh bất kỳ nhóm nào sẽ tạo ngay trang mới thuộc đúng chức năng đó.
  - Bấm nút Viết mới (`SquarePen`) tại đỉnh Sidebar để tạo nhanh trang mới.
  - Khi trang mới rỗng, hiển thị **3 thẻ mẫu lớn** tương ứng với 3 chức năng chính để bắt đầu.
- **Chuyển đổi chức năng 1-Click**:
  - Trên thanh công cụ đầu mỗi trang, có bộ nút chuyển đổi trực tiếp: `1. Ghi chú` | `2. Lên lịch` | `3. Việc cần làm`.

---

## 3. Thanh điều hướng Breadcrumb & Lịch sử

Vị trí: [`src/components/Topbar.tsx`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/components/Topbar.tsx)

- **Lịch sử duyệt trang Back / Forward (`<` và `>`)**: Quay lại hoặc tiến tới trang theo lịch sử xem trang.
- **Đường dẫn Breadcrumbs**: `🏢 Smart Workspace` / `[Tên Nhóm 3 chức năng]` / `[Icon] [Tên Trang]`.
- **Menu chuyển nhanh trong Breadcrumb**: Bấm vào tên nhóm trên breadcrumb sẽ mở dropdown chuyển nhanh sang các trang cùng nhóm.
- **Menu đổi loại trang**: Trong menu `...` cho phép chuyển đổi kiểu trang linh hoạt giữa Ghi chú, Lên lịch và Việc cần làm.

---

## 4. Trải nghiệm thao tác phím mượt mà

| Phím bấm | Hành vi xử lý |
| :--- | :--- |
| **`Enter` (thường)** | **Danh sách cũ vẫn giữ nguyên tại chỗ**, tạo ngay một dòng mới là **văn bản bình thường** bên dưới và chuyển con trỏ chuột xuống dòng đó. |
| **`Shift + Enter`** | **Tiếp tục duy trì khối block đó**: tạo tiếp to-do (`- [ ] `), bullet (`- `), số tăng dần (`2. `), quote (`> `)... |
| **`Space` (khi dòng trống)** | Kích hoạt trợ lý AI gợi ý hoặc viết tiếp nội dung. |
| **`/`** | Mở menu Slash Command để chèn các khối chức năng. |
| **`Backspace` (khi dòng to-do trống)** | Xóa mục to-do hiện tại và đưa con trỏ về mục liền trước. |

---

## 5. Kiến trúc State Management

File: [`src/store/pageStore.ts`](file:///d:/%C3%94n%20t%E1%BA%ADp/Smart_Workspace/src/store/pageStore.ts)

Sử dụng **Zustand** quản lý state tập trung, hỗ trợ TypeScript chặt chẽ:
```typescript
export type PageType = 'note' | 'schedule' | 'todo';

export interface PageItem {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  content?: string;
  type?: PageType; // 'note' | 'schedule' | 'todo'
  createdAt?: string;
}
```

---

## 6. Cấu trúc thư mục

```bash
smart_workspace/
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── ScheduleBlock.tsx          # Giao diện Lên lịch làm việc theo khung giờ
│   │   │   ├── SlashCommandMenu.tsx       # Menu lệnh nổi khi gõ '/'
│   │   │   └── TodoListBlock.tsx          # Giao diện Những việc cần làm tương tác
│   │   ├── Sidebar/
│   │   │   ├── NavGroup.tsx               # 3 Nhóm chính trên Sidebar & hover '+'
│   │   │   ├── Sidebar.tsx                # Thanh bên & nút tạo trang
│   │   │   ├── SidebarContent.tsx         # Kéo thả nhóm danh mục
│   │   │   └── SortableNavItem.tsx        # Item trang con & thao tác trang
│   │   └── Topbar.tsx                     # Thanh điều hướng Breadcrumb & Lịch sử
│   ├── layouts/
│   │   └── MainLayout.tsx                 # Khung Layout đóng/mở Sidebar
│   ├── pages/
│   │   └── Home.tsx                       # Màn hình chính xử lý 3 chức năng
│   ├── store/
│   │   └── pageStore.ts                   # Store quản lý 3 chức năng chính
│   └── styles/
│       └── globals.css                    # CSS toàn cục
```

---

## 7. Hướng dẫn cài đặt và khởi chạy

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Build kiểm tra sản phẩm
npm run build
```

---

## 8. Bảng phím tắt & Thao tác nhanh

| Phím tắt / Thao tác | Khu vực | Chức năng thực hiện |
| :--- | :--- | :--- |
| `Ctrl + K` | Sidebar | Tìm kiếm nhanh |
| `/` | Soạn thảo | Mở menu Slash Command chọn khối chức năng |
| `Space` | Dòng trống | Gọi trợ lý AI soạn thảo nội dung |
| `Enter` | Soạn thảo | Danh sách cũ giữ nguyên, chuyển sang dòng văn bản thường |
| `Shift + Enter` | Soạn thảo / Todo | Tiếp tục duy trì khối block đó (todo, bullet, số tăng dần...) |
| `Backspace` | Ô Todo trống | Xóa công việc hiện tại và quay về dòng trước |
| Click vùng trống | Đáy trang | Lập tức kích hoạt con trỏ chuột tại cuối văn bản |
| Click Icon trang | Tiêu đề | Mở bảng chọn nhanh biểu tượng Emoji Notion |
