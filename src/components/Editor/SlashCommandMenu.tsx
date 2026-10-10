import { useEffect, useRef } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Minus,
  Table as TableIcon,
  Code,
  Sparkles,
  Type,
  StickyNote,
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  keywords: string[];
  syntaxHint?: string;
  execute: () => void;
}

interface SlashCommandMenuProps {
  isOpen: boolean;
  query: string;
  position: { top: number; left: number };
  onClose: () => void;
  onSelectCommand: (commandId: string) => void;
  selectedIndex: number;
  onHoverIndex: (index: number) => void;
  commands: CommandItem[];
}

export function getDefaultCommands(
  insertText: (text: string) => void,
  switchToDatabase: () => void
): CommandItem[] {
  return [
    {
      id: 'text',
      title: 'Văn bản (Text)',
      description: 'Bắt đầu viết văn bản thuần túy.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Type size={18} color="var(--gray-11)" />,
      keywords: ['text', 'van ban', 'paragraph', 'p'],
      execute: () => insertText(''),
    },
    {
      id: 'h1',
      title: 'Tiêu đề lớn (Heading 1)',
      description: 'Tiêu đề phần lớn nhất.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Heading1 size={18} color="var(--purple-9)" />,
      keywords: ['h1', 'heading 1', 'tieu de', 'header'],
      syntaxHint: '# ',
      execute: () => insertText('# Tiêu đề lớn\n'),
    },
    {
      id: 'h2',
      title: 'Tiêu đề vừa (Heading 2)',
      description: 'Tiêu đề phần trung bình.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Heading2 size={18} color="var(--blue-9)" />,
      keywords: ['h2', 'heading 2', 'tieu de vua'],
      syntaxHint: '## ',
      execute: () => insertText('## Tiêu đề vừa\n'),
    },
    {
      id: 'h3',
      title: 'Tiêu đề nhỏ (Heading 3)',
      description: 'Tiêu đề phần phụ nhỏ.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Heading3 size={18} color="var(--teal-9)" />,
      keywords: ['h3', 'heading 3', 'tieu de nho'],
      syntaxHint: '### ',
      execute: () => insertText('### Tiêu đề nhỏ\n'),
    },
    {
      id: 'todo',
      title: 'Danh sách công việc (To-do list)',
      description: 'Theo dõi tiến độ với các ô đánh dấu check.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <CheckSquare size={18} color="var(--amber-9)" />,
      keywords: ['todo', 'to-do', 'check', 'task', 'cong viec'],
      syntaxHint: '[] ',
      execute: () => insertText('- [ ] Việc cần hoàn thành\n'),
    },
    {
      id: 'bullet',
      title: 'Danh sách dấu đầu dòng (Bulleted list)',
      description: 'Tạo danh sách gạch đầu dòng đơn giản.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <List size={18} color="var(--gray-11)" />,
      keywords: ['bullet', 'list', 'danh sach', 'gach dau dong'],
      syntaxHint: '- ',
      execute: () => insertText('- Mục danh sách\n'),
    },
    {
      id: 'numbered',
      title: 'Danh sách đánh số (Numbered list)',
      description: 'Tạo danh sách có số thứ tự tự động.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <ListOrdered size={18} color="var(--gray-11)" />,
      keywords: ['number', 'so thu tu', 'numbered', '1.'],
      syntaxHint: '1. ',
      execute: () => insertText('1. Bước đầu tiên\n'),
    },
    {
      id: 'callout',
      title: 'Hộp chú thích (Callout box)',
      description: 'Làm nổi bật thông tin quan trọng.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <StickyNote size={18} color="var(--orange-9)" />,
      keywords: ['callout', 'note', 'chu thich', 'box', 'highlight'],
      syntaxHint: '> 💡 ',
      execute: () => insertText('> 💡 Lưu ý quan trọng: Ghi chú nổi bật tại đây.\n'),
    },
    {
      id: 'quote',
      title: 'Trích dẫn (Quote)',
      description: 'Ghi lại đoạn trích dẫn nổi bật.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Quote size={18} color="var(--gray-11)" />,
      keywords: ['quote', 'trich dan'],
      syntaxHint: '> ',
      execute: () => insertText('> "Một câu trích dẫn truyền cảm hứng..."\n'),
    },
    {
      id: 'divider',
      title: 'Đường phân cách (Divider)',
      description: 'Đường kẻ ngang phân chia các khối nội dung.',
      category: 'Khối cơ bản (Basic blocks)',
      icon: <Minus size={18} color="var(--gray-9)" />,
      keywords: ['divider', 'line', 'duong ke', 'phan cach', 'hr'],
      syntaxHint: '---',
      execute: () => insertText('\n---\n\n'),
    },
    {
      id: 'code',
      title: 'Khối mã nguồn (Code block)',
      description: 'Chèn đoạn mã lập trình có định dạng.',
      category: 'Nâng cao (Advanced)',
      icon: <Code size={18} color="var(--indigo-9)" />,
      keywords: ['code', 'ma', 'snippet', 'lap trinh', 'js'],
      syntaxHint: '```',
      execute: () => insertText('```javascript\n// Viết mã nguồn tại đây\nconsole.log("Hello Notion");\n```\n'),
    },
    {
      id: 'ai',
      title: 'Trợ lý AI (Ask AI / Write with AI)',
      description: 'Nhờ AI tóm tắt hoặc viết tiếp nội dung.',
      category: 'AI & Tự động hóa',
      icon: <Sparkles size={18} color="var(--violet-9)" />,
      keywords: ['ai', 'ask ai', 'viet tiep', 'generate', 'tro ly'],
      execute: () => insertText('✨ [AI Assistant]: Đang phân tích và gợi ý nội dung tối ưu cho bạn...\n'),
    },
    {
      id: 'table',
      title: 'Bảng cơ sở dữ liệu (Table Database)',
      description: 'Chuyển trang sang dạng Bảng quản lý dữ liệu có bộ lọc và trạng thái.',
      category: 'Cơ sở dữ liệu (Database)',
      icon: <TableIcon size={18} color="var(--green-9)" />,
      keywords: ['table', 'database', 'bang', 'du lieu', 'grid'],
      execute: () => switchToDatabase(),
    },
  ];
}

export default function SlashCommandMenu({
  isOpen,
  query,
  position,
  onClose,
  onSelectCommand,
  selectedIndex,
  onHoverIndex,
  commands,
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!menuRef.current) return;
    const activeEl = menuRef.current.querySelector('[data-selected="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen || commands.length === 0) return null;

  // Group commands by category
  const categories: { [key: string]: CommandItem[] } = {};
  commands.forEach((cmd) => {
    if (!categories[cmd.category]) {
      categories[cmd.category] = [];
    }
    categories[cmd.category].push(cmd);
  });

  let globalIndex = 0;

  return (
    <Box
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '320px',
        maxHeight: '340px',
        overflowY: 'auto',
        backgroundColor: 'var(--color-panel-solid, #ffffff)',
        border: '1px solid var(--gray-5)',
        borderRadius: '8px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
        zIndex: 9999,
        padding: '6px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {query && (
        <Flex px="2" py="1" mb="1" style={{ borderBottom: '1px solid var(--gray-4)' }}>
          <Text size="1" color="gray">
            Tìm kiếm lệnh: <strong style={{ color: 'var(--gray-12)' }}>/{query}</strong>
          </Text>
        </Flex>
      )}

      {Object.entries(categories).map(([category, items]) => (
        <Box key={category} mb="2">
          <Text
            size="1"
            weight="medium"
            color="gray"
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              opacity: 0.7,
              display: 'block',
            }}
          >
            {category}
          </Text>

          {items.map((cmd) => {
            const isSelected = globalIndex === selectedIndex;
            const currentIndex = globalIndex;
            globalIndex++;

            return (
              <Flex
                key={cmd.id}
                align="center"
                justify="between"
                px="2"
                py="2"
                gap="3"
                data-selected={isSelected}
                onMouseEnter={() => onHoverIndex(currentIndex)}
                onClick={() => onSelectCommand(cmd.id)}
                style={{
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--gray-4)' : 'transparent',
                  transition: 'background-color 0.1s ease',
                  userSelect: 'none',
                }}
              >
                <Flex align="center" gap="3" style={{ overflow: 'hidden', flex: 1 }}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--gray-2)',
                      border: '1px solid var(--gray-4)',
                      flexShrink: 0,
                    }}
                  >
                    {cmd.icon}
                  </Flex>

                  <Box style={{ overflow: 'hidden' }}>
                    <Text size="2" weight="medium" style={{ color: 'var(--gray-12)', display: 'block' }}>
                      {cmd.title}
                    </Text>
                    <Text
                      size="1"
                      color="gray"
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                      }}
                    >
                      {cmd.description}
                    </Text>
                  </Box>
                </Flex>

                {cmd.syntaxHint && (
                  <Text size="1" color="gray" style={{ opacity: 0.6, fontFamily: 'monospace' }}>
                    {cmd.syntaxHint}
                  </Text>
                )}
              </Flex>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
