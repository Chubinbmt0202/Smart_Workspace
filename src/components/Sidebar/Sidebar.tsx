import { Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { Inbox, PanelLeftClose, SquarePen } from "lucide-react";
import SidebarContent from "./SidebarContent";
import { usePageStore } from "../../store/pageStore";

interface SidebarProps {
  toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
  const addPage = usePageStore((state) => state.addPage);

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
          <Tooltip content="Hộp thư">
            <IconButton
              variant="ghost"
              color="gray"
              style={{ cursor: "pointer" }}
            >
              <Inbox size={18} strokeWidth={1.5} />
            </IconButton>
          </Tooltip>

          {/* Nút Viết mới (New Page like Notion) */}
          <Tooltip content="Tạo trang mới (New Page)">
            <IconButton
              variant="ghost"
              color="gray"
              onClick={() => addPage()}
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
