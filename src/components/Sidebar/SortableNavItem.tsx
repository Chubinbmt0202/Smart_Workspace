import { useSortable } from "@dnd-kit/sortable";
import { NavGroup } from "./NavGroup";
import { Text, Box, Dialog, Button, Flex, TextField } from "@radix-ui/themes";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import AddDialog from "../Dialog/AddDialog";

function ChildItem({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Box
      px="1"
      py="1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: hovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
        transition: "background-color 0.15s ease",
        userSelect: "none",
      }}
    >
      <Text color="gray" size="2">
        {label}
      </Text>
    </Box>
  );
}

export function SortableNavItem({
  id,
  item,
}: {
  id: string;
  item: any;
  onAddChild?: (parentId: string, childName: string) => void;
}) {
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
          <ChildItem  key={index} label={child} />
        ))}
        <AddDialog />
      </NavGroup>
    </div>
  );
}
