import { DropdownMenu, Text, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import {
  ChevronRight,
  LineDotRightHorizontal,
  Split,
  FileText,
  Volume2,
  Mail,
  Flag,
  Waypoints,
  Plus,
} from "lucide-react";
import { useState, type ReactNode } from "react";

interface NavGroupProps {
  title: string;
  children: ReactNode;
  onAddPage?: () => void;
}

export function NavGroup({ title, children, onAddPage }: NavGroupProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Flex direction="column" style={{ width: "100%" }}>
      <Flex
        justify="between"
        align="center"
        gap="1"
        px="2"
        py="1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          borderRadius: "6px",
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
          transition: "background-color 0.15s ease",
          userSelect: "none",
          minHeight: "28px",
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
              visibility: isHovered || isOpen ? "visible" : "hidden",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              marginLeft: "4px",
            }}
          />
        </Flex>

        <Flex align="center" gap="1">
          {onAddPage && (
            <Tooltip content="Thêm trang mới">
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddPage();
                  if (!isOpen) setIsOpen(true);
                }}
                style={{
                  cursor: "pointer",
                  visibility: isHovered ? "visible" : "hidden",
                  width: "22px",
                  height: "22px",
                }}
              >
                <Plus size={14} strokeWidth={1.75} />
              </IconButton>
            </Tooltip>
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                style={{
                  cursor: "pointer",
                  visibility: isHovered ? "visible" : "hidden",
                  width: "22px",
                  height: "22px",
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
              {onAddPage && (
                <DropdownMenu.Item onClick={onAddPage}>
                  <Flex gap="2" align="center">
                    <Plus size={14} /> Thêm trang mới
                  </Flex>
                </DropdownMenu.Item>
              )}
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
      </Flex>

      {isOpen && (
        <Flex direction="column" pl="1" pt="1" pb="2" gap="1">
          {children}
        </Flex>
      )}
    </Flex>
  );
}
