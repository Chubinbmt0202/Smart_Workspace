import { Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { Inbox, PanelLeftClose, SquarePen } from "lucide-react";
import SidebarContent from "./SidebarContent";
interface SidebarProps {
  toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
  return (
    <>
      <Flex
        justify="between"
        align="center"
        px="4"
        style={{
          height: "45px",
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <Tooltip content="Đóng thanh bên">
          <IconButton
            variant="ghost"
            color="gray"
            onClick={toggleSidebar}
            style={{ cursor: "pointer" }}
          >
            <PanelLeftClose size={18} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>

        <Flex gap="2" align="center">
          {/* Nút Inbox (Hộp thư) có nền xám mờ như trong ảnh [cite: 4] */}
          <Tooltip content="Hộp thư">
            <IconButton
              variant="ghost" // "soft" trong Radix tạo nền xám nhạt tự nhiên như hình [cite: 4]
              color="gray"
              style={{ cursor: "pointer" }}
            >
              <Inbox size={18} strokeWidth={1.5} />
            </IconButton>
          </Tooltip>

          {/* Nút Viết mới (Edit) [cite: 4] */}
          <Tooltip content="Tạo trang mới">
            <IconButton
              variant="ghost" // "ghost" không nền, chỉ hiện nền khi hover [cite: 4]
              color="gray"
              style={{ cursor: "pointer" }}
            >
              <SquarePen size={18} strokeWidth={1.5} />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
      <SidebarContent />
    </>
  );
}
