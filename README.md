# Smart Workspace

Smart Workspace là ứng dụng ghi chú và sắp xếp công việc trên Windows. Bạn có thể tạo ghi chú, phân loại bằng tag, đặt lời nhắc và xem ghi chú theo lịch.

## Tải và cài đặt

1. Mở trang [Smart Workspace Releases](https://github.com/Chubinbmt0202/Smart_Workspace/releases).
2. Chọn bản phát hành mới nhất và tải file **Smart Workspace Setup** có đuôi `.exe`.
3. Mở file vừa tải, làm theo hướng dẫn cài đặt và chọn thư mục cài nếu cần.
4. Mở **Smart Workspace** từ màn hình Desktop hoặc menu Start.

> Nếu trang Releases chưa có bản phát hành hoặc chưa có file `.exe` trong phần **Assets**, hiện chưa có bộ cài công khai để tải. File bộ cài trong thư mục `release` trên máy phát triển chưa được đưa lên GitHub.

Ứng dụng hiện được đóng gói cho Windows. Cần có kết nối Internet và tài khoản Google để đăng nhập.

## Hướng dẫn sử dụng

### Đăng nhập

Mở ứng dụng, chọn **Đăng nhập bằng Google**, sau đó hoàn tất đăng nhập trong trình duyệt. Khi đăng nhập thành công, ứng dụng sẽ mở danh sách ghi chú.

### Tạo và chỉnh sửa ghi chú

1. Chọn **Thêm ghi chú** (nút dấu cộng) ở thanh bên.
2. Nhập tiêu đề và nội dung.
3. Chọn tag hoặc tạo tag mới; có thể thêm tệp đính kèm hoặc đặt ngày giờ nhắc nhở nếu cần.
4. Chọn **Lưu ghi chú**.

Chọn một ghi chú để mở phần chi tiết. Tại đây, bạn có thể sửa nội dung, đổi tag, quản lý tệp đính kèm, đặt lời nhắc, ghim hoặc xóa ghi chú.

### Tìm và sắp xếp ghi chú

- Dùng ô tìm kiếm để lọc ghi chú theo từ khóa.
- Chọn **All Inboxes** hoặc một tag ở thanh bên để lọc theo danh mục.
- Chuyển giữa chế độ thẻ ghi chú và chế độ lịch bằng nút chuyển chế độ.
- Trong lịch, chọn một ngày để tạo ghi chú gắn với ngày đó.
- Mở mục lịch đã lên lịch để xem các ghi chú theo lịch.

### Thùng rác

Ghi chú đã xóa được chuyển vào **Thùng rác**. Tại đây, bạn có thể khôi phục ghi chú hoặc xóa vĩnh viễn. Xóa vĩnh viễn không thể hoàn tác.

### Đăng xuất

Mở menu tài khoản ở thanh trên cùng và chọn đăng xuất.

## Dành cho nhà phát triển

```bash
npm install
npm run electron:dev
```

Tạo bộ cài Windows:

```bash
npm run electron:dist
```

Bộ cài được tạo trong thư mục `release`. Để người dùng tải được từ trang Releases, hãy tải file cài đặt `.exe` lên phần **Assets** của một GitHub Release.
