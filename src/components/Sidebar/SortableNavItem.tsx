import { useSortable } from "@dnd-kit/sortable";
import { NavGroup } from "./NavGroup";
import { Text, Box, Flex } from "@radix-ui/themes";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { useState } from "react";

function ChildItem({ label }: { label: string }) {
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

function AddChildButton({
  groupTitle,
  onAdd,
}: {
  groupTitle: string;
  onAdd: (name: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const getLabel = () => {
    if (groupTitle.toLowerCase().includes("agent")) return "New agent";
    if (groupTitle.toLowerCase().includes("team") || groupTitle.toLowerCase().includes("project")) {
      return "New project";
    }
    return "New page";
  };

  const handleCommit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName("");
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommit();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setName("");
    }
  };

  if (isAdding) {
    return (
      <Box
        px="2"
        py="1"
        onPointerDown={(e) => e.stopPropagation()}
        style={{ width: "100%" }}
      >
        <input
          autoFocus
          value={name}
          placeholder={`Tên ${getLabel().toLowerCase()}...`}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCommit}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "4px 8px",
            fontSize: "13px",
            borderRadius: "5px",
            border: "1px solid var(--gray-6, #ccc)",
            outline: "none",
            backgroundColor: "transparent",
            color: "inherit",
          }}
        />
      </Box>
    );
  }

  return (
    <Flex
      align="center"
      gap="2"
      px="2"
      py="1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        setIsAdding(true);
      }}
      style={{
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
        color: isHovered ? "var(--gray-12, #1c2024)" : "var(--gray-9, #8d8d8d)",
        transition: "background-color 0.15s ease, color 0.15s ease",
        userSelect: "none",
      }}
    >
      <Plus size={14} strokeWidth={1.5} style={{ opacity: 0.75 }} />
      <Text size="2" color="gray" style={{ opacity: 0.9 }}>
        {getLabel()}
      </Text>
    </Flex>
  );
}

export function SortableNavItem({
  id,
  item,
  onAddChild,
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
          <ChildItem key={index} label={child} />
        ))}
        {onAddChild && (
          <AddChildButton
            groupTitle={item.title}
            onAdd={(newChildName) => onAddChild(item.id, newChildName)}
          />
        )}
      </NavGroup>
    </div>
  );
}
