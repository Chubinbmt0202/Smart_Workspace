import { useSortable } from "@dnd-kit/sortable";
import { NavGroup } from "./NavGroup";
import { Text, Box, Flex, DropdownMenu, IconButton } from "@radix-ui/themes";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Copy, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { usePageStore } from "../../store/pageStore";
import type { PageItem, NavGroupItem } from "../../store/pageStore";

function ChildItem({
  page,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  page: PageItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      px="2"
      py="1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: isActive
          ? "rgba(0, 0, 0, 0.08)"
          : hovered
          ? "rgba(0, 0, 0, 0.04)"
          : "transparent",
        transition: "background-color 0.15s ease",
        userSelect: "none",
        minHeight: "28px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Flex justify="between" align="center" style={{ width: "100%" }}>
        <Flex align="center" gap="2" style={{ overflow: "hidden", flex: 1 }}>
          <Text size="2" style={{ lineHeight: 1 }}>
            {page.icon || "📄"}
          </Text>
          <Text
            size="2"
            weight={isActive ? "medium" : "regular"}
            style={{
              color: isActive ? "var(--gray-12)" : "var(--gray-11)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontStyle: page.title ? "normal" : "italic",
              opacity: page.title ? 1 : 0.6,
            }}
          >
            {page.title || "Untitled"}
          </Text>
        </Flex>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              style={{
                visibility: hovered ? "visible" : "hidden",
                cursor: "pointer",
                width: "20px",
                height: "20px",
              }}
            >
              <MoreHorizontal size={13} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="1" color="gray" variant="soft">
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Flex align="center" gap="2">
                <Copy size={13} /> Nhân bản (Duplicate)
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Flex align="center" gap="2">
                <Trash2 size={13} /> Xóa trang (Delete)
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Box>
  );
}

export function SortableNavItem({
  id,
  item,
  onAddPage,
}: {
  id: string;
  item: NavGroupItem;
  onAddPage: (groupId: string, title?: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const activePageId = usePageStore((state) => state.activePageId);
  const setActivePage = usePageStore((state) => state.setActivePage);
  const deletePage = usePageStore((state) => state.deletePage);
  const duplicatePage = usePageStore((state) => state.duplicatePage);
  const [addHovered, setAddHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NavGroup
        title={item.title}
        onAddPage={() => onAddPage(item.id)}
      >
        {item.children.map((page: PageItem) => (
          <ChildItem
            key={page.id}
            page={page}
            isActive={activePageId === page.id}
            onSelect={() => setActivePage(page.id)}
            onDelete={() => deletePage(page.id)}
            onDuplicate={() => duplicatePage(page.id)}
          />
        ))}

        {/* Notion-style "+ Add a page" inline trigger */}
        <Box
          px="2"
          py="1"
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAddPage(item.id);
          }}
          style={{
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: addHovered
              ? "rgba(0, 0, 0, 0.04)"
              : "transparent",
            color: "var(--gray-9)",
            transition: "all 0.15s ease",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "26px",
          }}
        >
          <Plus size={13} strokeWidth={2} />
          <Text size="1" color="gray">
            Add a page
          </Text>
        </Box>
      </NavGroup>
    </div>
  );
}
