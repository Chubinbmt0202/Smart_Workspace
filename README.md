# Smart Workspace

Smart Workspace là một giao diện quản lý không gian làm việc dạng dashboard, tập trung vào trải nghiệm sidebar, topbar và layout đa chức năng tương tự Notion / workspace management UI. Dự án hiện đang xây dựng phiên bản giao diện frontend cơ bản với các thành phần có thể kéo thả, tạo nhóm, thêm mục mới, và bố cục workspace linh hoạt.

## 1. Mục tiêu dự án

- Tạo một nền tảng UI workspace hiện đại để quản lý project, tài liệu, agent và shared items.
- Tối ưu trải nghiệm người dùng với layout rõ ràng, sidebar có thể thu gọn và nhóm chức năng.
- Làm nền tảng cho việc phát triển các tính năng sau này như: routing, dữ liệu thực, auth, search, permission, workspace management.

## 2. Tính năng chính

- Sidebar dạng nhóm (Private, Agents, Team Workspace, Shared with me)
- Có thể kéo thả nhóm trong sidebar bằng dnd-kit
- Thêm item con vào mỗi nhóm bằng input trực tiếp
- Thu gọn/mở rộng sidebar để tăng không gian làm việc
- Topbar hiển thị tiêu đề workspace, trạng thái Private, và các hành động như Share, Link, Favorite
- Layout cơ bản với MainLayout và page content container
- Dùng Radix UI + Lucide React để triển khai giao diện nhất quán

## 3. Công nghệ sử dụng

- React 19 + TypeScript
- Vite
- Radix Themes
- dnd-kit cho drag-and-drop
- React Router DOM
- Zustand (đã cài đặt, có thể mở rộng cho state management)
- TanStack React Query (đã cài đặt, phù hợp cho dữ liệu server-side)
- Lucide React cho icon

## 4. Cấu trúc thư mục

```bash
smart_workspace/
├─ src/
│  ├─ components/
│  │  ├─ Sidebar/
│  │  │  ├─ NavGroup.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ SidebarContent.tsx
│  │  │  └─ SortableNavItem.tsx
│  │  ├─ Topbar.tsx
│  │  └─ ...
│  ├─ layouts/
│  │  └─ MainLayout.tsx
│  ├─ pages/
│  │  └─ Home.tsx
│  ├─ styles/
│  │  └─ globals.css
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ README.md
```

## 5. Luồng hoạt động của ứng dụng

### Layout chính

`MainLayout` quản lý hai phần chính:

- Sidebar bên trái
- Khu vực content chính

Khi sidebar đóng, chiều rộng được chuyển về 0 và hiển thị nút mở lại bên trái.

### Sidebar

`SidebarContent` chứa dữ liệu navItems dạng mảng local state. Mỗi phần tử gồm:

```ts
{
  id: string;
  title: string;
  children: string[];
}
```

Với mỗi group:

- hiển thị title
- hiển thị danh sách children
- cho phép thêm child mới
- cho phép kéo thả đối với group

### Topbar

`Topbar` hiển thị các thông tin:

- tên công việc / workspace
- trạng thái Private
- thời gian chỉnh sửa gần nhất
- nút Share
- các action nhanh: Link, Favorite, More

## 6. Cài đặt và chạy dự án

### Yêu cầu

- Node.js >= 18
- npm >= 9

### Cài đặt dependencies

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Mặc định Vite sẽ chạy ứng dụng tại địa chỉ:

```bash
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Chạy preview sau build

```bash
npm run preview
```

## 7. Scripts có sẵn

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## 8. Quy ước phát triển

- Sử dụng TypeScript để tăng tính an toàn và dễ bảo trì.
- Khai báo component theo hướng chức năng và module hóa rõ ràng.
- Mỗi component nên có một trách nhiệm duy nhất.
- Không nên viết logic nghiệp vụ trực tiếp trong component quá lớn; nên tách ra thành hook hoặc helper nếu phức tạp.
- Tận dụng Radix UI để đảm bảo thống nhất về design system và accessibility.
- Khi thêm mới component, ưu tiên đặt trong folder phù hợp theo domain (components/, layouts/, pages/).

## 9. Mẫu dữ liệu hiện tại

Hiện tại ứng dụng đang dùng dữ liệu mock local trong `SidebarContent`:

```ts
const [navItems, setNavItems] = useState([
  {
    id: "1",
    title: "Private",
    children: ["📝 Note của tôi", "🔒 Tài liệu mật"],
  },
  {
    id: "2",
    title: "Agents",
    children: ["🤖 Assistant"],
  },
  {
    id: "3",
    title: "Team Workspace",
    children: ["📊 Báo cáo quý 1", "🎨 Design Assets"],
  },
  { id: "4", title: "Shared with me", children: ["📁 Project Alpha"] },
]);
```

Dữ liệu này có thể thay thế bằng API hoặc store sau này khi ứng dụng chuyển sang backend thực.

## 10. Kiến trúc mở rộng trong tương lai

- Thêm routing bằng `react-router-dom` cho các page riêng biệt
- Tích hợp API để load workspace data
- Dùng Zustand hoặc React Query để quản lý state và dữ liệu cache
- Thêm xác thực người dùng, phân quyền và lưu trữ dữ liệu cá nhân
- Mở rộng chức năng search, filter, favorites, activity timeline

## 11. Gợi ý cải tiến

1. Tách dữ liệu sidebar ra khỏi component và đưa vào store hoặc API.
2. Thêm unit tests cho các component chính.
3. Cấu hình ESLint/Prettier rõ ràng hơn cho team.
4. Tạo chuẩn naming và folder structure theo domain-driven hoặc feature-based approach.
5. Bổ sung README chi tiết cho từng module nếu dự án phát triển lớn hơn.

## 12. Trạng thái hiện tại

Dự án đang ở giai đoạn UI prototype / frontend foundation. Chức năng hiện có tập trung vào layout và trải nghiệm người dùng, chưa tích hợp backend hoặc dữ liệu thực tế. Đây là nền tảng phù hợp để tiếp tục mở rộng thành một workspace management system hoàn chỉnh.

## 13. Liên hệ / góp ý

Nếu cần mở rộng thêm tính năng hoặc chuẩn hóa kiến trúc, có thể tiếp tục refactor theo hướng:

- data layer
- service API
- feature-based folders
- reusable UI components

---

Bản README này được viết để làm tài liệu chuẩn cho dự án, phù hợp cho việc onboarding, phát triển, và triển khai trong môi trường team.
