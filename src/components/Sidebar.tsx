import { Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { Inbox, PanelLeftClose, SquarePen } from "lucide-react";
import SidebarContent from "./sidebarContent";
interface SidebarProps {
  toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
  return (
    <Flex 
      justify="between" 
      align="center" 
      px="4" 
      style={{ 
        height: '45px', // Chiều cao nhỏ gọn chuẩn Notion
        width: '100%',
        backgroundColor: 'transparent' 
      }}
    >
      {/* 1. BÊN TRÁI: Nút Đóng/Mở Sidebar [cite: 4] */}
      <Tooltip content="Đóng thanh bên">
        <IconButton
          variant="ghost"
          color="gray"
          onClick={toggleSidebar}
          style={{ cursor: 'pointer' }}
        >
          <PanelLeftClose size={18} strokeWidth={1.5} />
        </IconButton>
      </Tooltip>

      {/* 2. BÊN PHẢI: Nhóm Action Icons [cite: 4] */}
      <Flex gap="2" align="center">
        
        {/* Nút Inbox (Hộp thư) có nền xám mờ như trong ảnh [cite: 4] */}
        <Tooltip content="Hộp thư">
          <IconButton
            variant="ghost" // "soft" trong Radix tạo nền xám nhạt tự nhiên như hình [cite: 4]
            color="gray"
            style={{ cursor: 'pointer' }}
          >
            <Inbox size={18} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>

        {/* Nút Viết mới (Edit) [cite: 4] */}
        <Tooltip content="Tạo trang mới">
          <IconButton
            variant="ghost" // "ghost" không nền, chỉ hiện nền khi hover [cite: 4]
            color="gray"
            style={{ cursor: 'pointer' }}
          >
            <SquarePen size={18} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>

      </Flex>

      {/* <SidebarContent /> */}
    </Flex>
  );
}
