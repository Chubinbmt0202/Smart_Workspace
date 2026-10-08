import { Flex, Text, Kbd, IconButton, DropdownMenu } from "@radix-ui/themes";
import {
  ChevronRight,
  LineDotRightHorizontal,
  Split,
  Volume2,
  FileText,
  Mail,
  Flag,
  Waypoints,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface NavGroupProps {
  title: string;
  children: ReactNode;
}
function NavGroup({ title, children }: NavGroupProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex direction="column" style={{ width: "100%" }}>
      <Flex
        justify="between"
        align="center"
        gap="1"
        px="2"
        py="2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          borderRadius: "6px",
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
          transition: "background-color 0.15s ease",
        }}
      >
        <Flex align="center">
          <Text size="1" color="gray" weight="medium" style={{ opacity: 0.8 }}>
            {title}
          </Text>

          <ChevronRight
            size={13}
            strokeWidth={1.5}
            style={{
              visibility: isHovered ? "visible" : "hidden",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              marginLeft: "4px",
            }}
          />
        </Flex>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger onClick={(e) => e.stopPropagation()}>
            <IconButton
              variant="ghost"
              color="gray"
              mr="1"
              style={{
                cursor: "pointer",
                visibility: isHovered ? "visible" : "hidden",
              }}
            >
              <LineDotRightHorizontal size={13} strokeWidth={1} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            size="2"
            align="start"
            color="gray"
            variant="soft"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <Split size={14} /> Branch in new chat
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <FileText size={14} /> More
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <Volume2 size={14} /> Listen
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <FileText size={14} /> Export to Docs
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <Mail size={14} /> Draft in Gmail
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <Flag size={14} /> Report legal issue
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex gap="2" align="center">
                <Waypoints size={14} /> Show thinking steps
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      {isOpen && (
        <Flex direction="column" pl="4" pt="1" pb="2" gap="2">
          {children}
        </Flex>
      )}
    </Flex>
  );
}

function SortableNavItem({ id, item }: { id: string; item: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Làm mờ mục khi đang kéo
    position: "relative" as const,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NavGroup title={item.title}>
        {item.children.map((child: string, index: number) => (
          <Text color="gray" key={index} size="2">
            {child}
          </Text>
        ))}
      </NavGroup>
    </div>
  );
}

// 2. COMPONENT CHÍNH
export default function SidebarContent() {
  const [navItems, setNavItems] = useState([
    {
      id: "1",
      title: "Private",
      children: ["📝 Note của tôi", "🔒 Tài liệu mật"],
    },
    {
      id: "2",
      title: "Team Workspace",
      children: ["📊 Báo cáo quý 1", "🎨 Design Assets"],
    },
    { id: "3", title: "Shared with me", children: ["📁 Project Alpha"] },
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5, // Cho phép tay di chuyển lệch 5px trong lúc giữ
      },
    }),
  );

  // Xử lý logic khi người dùng thả chuột (kết thúc kéo)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNavItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Đổi chỗ vị trí trong mảng
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  return (
    <Flex direction="column" gap="3" px="3" py="2" style={{ width: "100%" }}>
      {/* Thanh tìm kiếm */}
      <Flex
        align="center"
        justify="between"
        px="2"
        py="1"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "6px",
          cursor: "pointer",
          backgroundColor: "var(--gray-1)",
          height: "32px",
        }}
      >
        <Text size="2" color="gray">
          Search or ask
        </Text>
        <Kbd size="1" style={{ color: "var(--gray-10)" }}>
          Ctrl+K
        </Kbd>
      </Flex>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={navItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Flex direction="column" gap="1">
            {navItems.map((item: any) => (
              <SortableNavItem id={item.id} item={item} key={item.id} />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  );
}
