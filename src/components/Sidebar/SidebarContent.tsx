import { Flex, Text, Kbd } from "@radix-ui/themes";
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
import { usePageStore } from "../../store/pageStore";

export default function SidebarContent() {
  const navItems = usePageStore((state) => state.navItems);
  const setNavItems = usePageStore((state) => state.setNavItems);
  const addPage = usePageStore((state) => state.addPage);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const handleAddPage = (groupId: string, title?: string) => {
    addPage(groupId, title ? { title } : undefined);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = navItems.findIndex((item) => item.id === active.id);
      const newIndex = navItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setNavItems(arrayMove(navItems, oldIndex, newIndex));
      }
    }
  };

  return (
    <Flex direction="column" gap="3" px="3" py="2" style={{ width: "100%" }}>
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
            {navItems.map((item) => (
              <SortableNavItem
                id={item.id}
                item={item}
                key={item.id}
                onAddPage={handleAddPage}
              />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  );
}
