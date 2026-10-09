import { Flex, Text, Kbd } from "@radix-ui/themes";
import { useState } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableNavItem } from "./SortableNavItem";

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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
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
              <SortableNavItem
                id={item.id}
                item={item}
                key={item.id}
              />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  );
}
