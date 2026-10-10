import { useEffect, useRef, useMemo, useState } from 'react';
import {
  Heading,
  Text,
  Box,
  Flex,
  Button,
  IconButton,
  Popover,
  Badge,
  Table,
} from '@radix-ui/themes';
import {
  FileText,
  Table as TableIcon,
  Smile,
  Image as ImageIcon,
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ListTodo,
} from 'lucide-react';
import { usePageStore, useActivePage } from '../store/pageStore';
import SlashCommandMenu, { getDefaultCommands } from '../components/Editor/SlashCommandMenu';
import TodoListBlock, { parseTodosFromContent, serializeTodosToContent } from '../components/Editor/TodoListBlock';

const EMOJI_LIST = [
  '📄', '📝', '💡', '🚀', '🤖', '📊', '🎨', '📁',
  '🎯', '⭐', '🔥', '💻', '🧠', '⚡', '📌', '🏆',
  '📚', '📅', '💬', '✨', '🔍', '🛠️', '🌿', '🔮'
];

const COVERS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
  'linear-gradient(to right, #434343 0%, black 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
];

interface DatabaseRow {
  id: string;
  name: string;
  status: 'Not started' | 'In progress' | 'Done';
  tag: string;
  date: string;
}

const DEFAULT_DB_ROWS: DatabaseRow[] = [
  { id: '1', name: 'Nghiên cứu thị trường', status: 'Done', tag: 'Research', date: '2026-03-01' },
  { id: '2', name: 'Thiết kế giao diện', status: 'In progress', tag: 'Design', date: '2026-03-05' },
  { id: '3', name: 'Triển khai Frontend & State', status: 'In progress', tag: 'Dev', date: '2026-03-10' },
  { id: '4', name: 'Kiểm thử & Tối ưu hiệu năng', status: 'Not started', tag: 'QA', date: '2026-03-15' },
];

export default function Home() {
  const activeData = useActivePage();
  const updatePage = usePageStore((state) => state.updatePage);
  const addPage = usePageStore((state) => state.addPage);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Slash Command State
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashStartIndex, setSlashStartIndex] = useState(-1);
  const [slashPosition, setSlashPosition] = useState({ top: 40, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // View mode: 'interactive' (Notion checklist block) or 'raw' (text)
  const [todoViewMode, setTodoViewMode] = useState<'interactive' | 'raw'>('interactive');

  // Focus title automatically if page is freshly created with empty title
  useEffect(() => {
    if (activeData?.page && !activeData.page.title) {
      titleInputRef.current?.focus();
    }
  }, [activeData?.page?.id]);

  // Check if page content contains todo markdown
  const hasTodos = useMemo(() => {
    const c = activeData?.page?.content || '';
    return c.includes('- [ ]') || c.includes('- [x]') || c.includes('- [X]');
  }, [activeData?.page?.content]);

  // Extract non-todo notes if page has todos
  const nonTodoNotes = useMemo(() => {
    if (!hasTodos) return '';
    const { preamble } = parseTodosFromContent(activeData?.page?.content || '');
    return preamble;
  }, [hasTodos, activeData?.page?.content]);

  // Database rows for database pages: parsed from content if valid JSON, otherwise fallback
  const dbRows: DatabaseRow[] = useMemo(() => {
    if (!activeData?.page || activeData.page.type !== 'database') return [];
    try {
      const parsed = JSON.parse(activeData.page.content || '');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // not JSON
    }
    return DEFAULT_DB_ROWS;
  }, [activeData?.page?.id, activeData?.page?.content, activeData?.page?.type]);

  const setDbRows = (rows: DatabaseRow[]) => {
    if (!activeData?.page) return;
    updatePage(activeData.page.id, { content: JSON.stringify(rows) });
  };

  // Auto-resize textarea to fit content and avoid scrollbar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [activeData?.page?.content, todoViewMode]);

  // Commands definition
  const allCommands = useMemo(() => {
    return getDefaultCommands(
      (textToInsert) => {
        if (!activeData?.page || !textareaRef.current) return;
        const textarea = textareaRef.current;
        const currentContent = (hasTodos && todoViewMode === 'interactive') ? nonTodoNotes : (activeData.page.content || '');
        const start = slashStartIndex >= 0 ? slashStartIndex : textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = currentContent.slice(0, start) + textToInsert + currentContent.slice(end);
        
        if (hasTodos && todoViewMode === 'interactive') {
          const { todos } = parseTodosFromContent(activeData.page.content || '');
          const updated = serializeTodosToContent(newContent, todos);
          updatePage(activeData.page.id, { content: updated });
        } else {
          updatePage(activeData.page.id, { content: newContent });
        }
        setSlashMenuOpen(false);

        setTimeout(() => {
          textarea.focus();
          const newCursor = start + textToInsert.length;
          textarea.setSelectionRange(newCursor, newCursor);
        }, 0);
      },
      () => {
        if (!activeData?.page) return;
        updatePage(activeData.page.id, {
          type: 'database',
          icon: '📊',
          content: JSON.stringify(DEFAULT_DB_ROWS),
        });
        setSlashMenuOpen(false);
      }
    );
  }, [activeData?.page?.id, slashStartIndex]);

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!slashQuery.trim()) return allCommands;
    const q = slashQuery.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [allCommands, slashQuery]);

  if (!activeData) {
    return (
      <Flex direction="column" align="center" justify="center" gap="4" py="9" style={{ minHeight: '50vh' }}>
        <Text size="3" color="gray">Chưa chọn trang nào hoặc danh sách đang trống.</Text>
        <Button onClick={() => addPage()} variant="solid" color="gray" style={{ cursor: 'pointer' }}>
          <Plus size={16} /> Tạo trang mới ngay
        </Button>
      </Flex>
    );
  }

  const { page } = activeData;
  const isDatabase = page.type === 'database';
  const isEmpty = !page.content && !isDatabase;
  const hasCover = Boolean(page.cover);

  const handleTitleChange = (newTitle: string) => {
    updatePage(page.id, { title: newTitle });
  };

  const handleIconSelect = (icon: string) => {
    updatePage(page.id, { icon });
  };

  const handleToggleCover = () => {
    if (hasCover) {
      updatePage(page.id, { cover: undefined });
    } else {
      updatePage(page.id, { cover: COVERS[0] });
    }
  };

  const handleChangeCover = () => {
    const currentIndex = COVERS.indexOf(page.cover || '');
    const nextCover = COVERS[(currentIndex + 1) % COVERS.length];
    updatePage(page.id, { cover: nextCover });
  };

  const handleApplyTemplate = (type: 'empty' | 'icon' | 'database' | 'meeting' | 'todo') => {
    if (type === 'empty') {
      updatePage(page.id, { content: '' });
      setTimeout(() => textareaRef.current?.focus(), 0);
    } else if (type === 'icon') {
      const randomIcon = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
      updatePage(page.id, {
        icon: randomIcon,
        content: '',
      });
      setTimeout(() => textareaRef.current?.focus(), 0);
    } else if (type === 'database') {
      updatePage(page.id, {
        icon: '📊',
        type: 'database',
        title: page.title || 'Bảng dữ liệu công việc',
        content: JSON.stringify(DEFAULT_DB_ROWS),
      });
    } else if (type === 'meeting') {
      updatePage(page.id, {
        icon: '📝',
        title: page.title || 'Biên bản cuộc họp (Meeting Notes)',
        content: `📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}
👥 Thành viên tham gia: Team Core, Product Manager

🎯 Mục tiêu cuộc họp:
- Rà soát tiến độ dự án tuần hiện tại
- Giải quyết các điểm nghẽn kỹ thuật

📝 Nội dung trao đổi:
1. Thống nhất cơ chế tạo trang mới chuẩn phong cách Notion
2. Tối ưu UX/UI với visual mượt mà

✅ Kế hoạch hành động:
- [ ] Hoàn thiện luồng tạo trang
- [ ] Kiểm thử tương tác trên trình duyệt`,
      });
    } else if (type === 'todo') {
      setTodoViewMode('interactive');
      updatePage(page.id, {
        icon: '📋',
        title: page.title || 'Kế hoạch công việc (Tasks Tracker)',
        content: `- [x] Tạo cơ chế tạo trang Notion 🔥
- [x] Kết nối kho lưu trữ và thanh điều hướng Breadcrumb
- [x] Thiết kế giao diện TodoList tương tác chuẩn Notion ⚡
- [ ] Tích hợp phím tắt nhanh và kiểm thử tải
- [ ] Hoàn thiện tài liệu hướng dẫn người dùng`,
      });
    }
  };

  const addDbRow = () => {
    const newRow: DatabaseRow = {
      id: `${Date.now()}`,
      name: 'Nhiệm vụ mới',
      status: 'Not started',
      tag: 'General',
      date: new Date().toISOString().split('T')[0],
    };
    setDbRows([...dbRows, newRow]);
  };

  // Focus the editor when clicking on any empty space below the content
  const handleFocusEditor = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Do not interfere if user clicked an interactive control
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('.todo-item-row') ||
      target.closest('table') ||
      target.closest('[role="dialog"]') ||
      target.closest('[role="menu"]') ||
      target.closest('[data-radix-popper-content-wrapper]')
    ) {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  const handleUpdateEditorContent = (newTextareaValue: string) => {
    if (hasTodos && todoViewMode === 'interactive') {
      const { todos } = parseTodosFromContent(page.content || '');
      const updated = serializeTodosToContent(newTextareaValue, todos);
      updatePage(page.id, { content: updated });
    } else {
      updatePage(page.id, { content: newTextareaValue });
    }
  };

  // Textarea input and slash trigger detection
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    handleUpdateEditorContent(value);

    // Look for slash before cursor
    const textBeforeCursor = value.slice(0, cursor);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const charBeforeSlash = lastSlashIndex > 0 ? textBeforeCursor[lastSlashIndex - 1] : '\n';
      const textAfterSlash = textBeforeCursor.slice(lastSlashIndex + 1);

      // Slash is valid if at line start or preceded by space, and no newline between / and cursor
      if (
        (charBeforeSlash === '\n' || charBeforeSlash === ' ') &&
        !textAfterSlash.includes('\n') &&
        textAfterSlash.length <= 15
      ) {
        setSlashMenuOpen(true);
        setSlashQuery(textAfterSlash);
        setSlashStartIndex(lastSlashIndex);
        setSelectedIndex(0);

        // Approximate vertical position based on line number
        const linesBefore = textBeforeCursor.split('\n').length;
        const top = Math.min(linesBefore * 27 + 8, 450);
        setSlashPosition({ top, left: 8 });
        return;
      }
    }

    setSlashMenuOpen(false);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Navigate slash menu if open
    if (slashMenuOpen && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.execute();
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setSlashMenuOpen(false);
        return;
      }
    }

    // Press 'space' for AI on empty page
    if (e.key === ' ' && (!page.content || page.content.trim() === '')) {
      e.preventDefault();
      updatePage(page.id, {
        content: '✨ [AI Assistant]: Tôi có thể giúp gì cho trang này của bạn? (Gõ yêu cầu và nhấn Enter)... \n\n',
      });
      return;
    }

    // Xử lý Enter và Shift + Enter cho các khối block
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const value = textarea.value;
      const cursor = textarea.selectionStart;

      // Trích xuất dòng hiện tại nơi con trỏ đang đứng
      const textBeforeCursor = value.slice(0, cursor);
      const textAfterCursor = value.slice(cursor);
      const lineStartIndex = textBeforeCursor.lastIndexOf('\n') + 1;
      const lineEndRelative = textAfterCursor.indexOf('\n');
      const lineEndIndex = lineEndRelative === -1 ? value.length : cursor + lineEndRelative;
      const currentLine = value.slice(lineStartIndex, lineEndIndex);

      // Nhận diện kiểu block của dòng hiện tại:
      const todoMatch = currentLine.match(/^(\s*-\s*\[([ xX])\]\s*)/);
      const bulletMatch = currentLine.match(/^(\s*[-*•]\s+)/);
      const numberMatch = currentLine.match(/^(\s*(\d+)\.\s+)/);
      const quoteMatch = currentLine.match(/^(\s*>\s*(💡\s*)?)/);
      const headingMatch = currentLine.match(/^(\s*#{1,6}\s+)/);

      // TRƯỜNG HỢP 1: SHIFT + ENTER -> Vẫn tiếp tục sử dụng khối block đó
      if (e.shiftKey) {
        e.preventDefault();

        let nextPrefix = '';
        if (numberMatch) {
          const currentNum = parseInt(numberMatch[2], 10);
          nextPrefix = `${currentNum + 1}. `;
        } else if (todoMatch) {
          nextPrefix = '- [ ] ';
        } else if (bulletMatch) {
          nextPrefix = '- ';
        } else if (quoteMatch) {
          nextPrefix = quoteMatch[0];
        } else if (headingMatch) {
          nextPrefix = headingMatch[0];
        }

        const inserted = '\n' + nextPrefix;
        const newText = textBeforeCursor + inserted + textAfterCursor;
        handleUpdateEditorContent(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = cursor + inserted.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 0);
        return;
      }

      // TRƯỜNG HỢP 2: ENTER THƯỜNG -> Danh sách cũ vẫn ở đó và chuyển ngay sang một dòng văn bản bình thường!
      if (!e.shiftKey) {
        e.preventDefault();

        // Danh sách cũ giữ nguyên 100%, chèn một dòng mới là văn bản thường (không mang tiền tố)
        const inserted = '\n';
        const newText = textBeforeCursor + inserted + textAfterCursor;
        handleUpdateEditorContent(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = cursor + inserted.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 0);
        return;
      }
    }
  };

  return (
    <Box
      key={page.id}
      onClick={handleFocusEditor}
      style={{
        width: '100%',
        flexGrow: 1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: isDatabase ? 'default' : 'text',
      }}
    >
      {/* Cover Image */}
      {hasCover && (
        <Box
          style={{
            height: '180px',
            borderRadius: '8px',
            marginBottom: '24px',
            background: page.cover,
            position: 'relative',
            cursor: 'default',
          }}
        >
          <Button
            size="1"
            variant="surface"
            color="gray"
            onClick={handleChangeCover}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(4px)',
            }}
          >
            Đổi màu bìa
          </Button>
        </Box>
      )}

      {/* Top action triggers: Add Icon / Add Cover */}
      <Flex gap="2" mb="2" align="center" style={{ opacity: 0.85, cursor: 'default' }}>
        <Popover.Root>
          <Popover.Trigger>
            <Button size="1" variant="ghost" color="gray" style={{ cursor: 'pointer', padding: '4px 6px' }}>
              <Smile size={14} />
              {page.icon ? 'Đổi biểu tượng' : 'Thêm biểu tượng'}
            </Button>
          </Popover.Trigger>
          <Popover.Content size="1" style={{ width: '260px' }}>
            <Text size="1" color="gray" mb="2" weight="medium">Chọn biểu tượng Notion</Text>
            <Flex wrap="wrap" gap="2">
              {EMOJI_LIST.map((emoji) => (
                <IconButton
                  key={emoji}
                  variant="ghost"
                  size="2"
                  onClick={() => handleIconSelect(emoji)}
                  style={{ cursor: 'pointer', fontSize: '18px' }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Flex>
          </Popover.Content>
        </Popover.Root>

        <Button
          size="1"
          variant="ghost"
          color="gray"
          onClick={handleToggleCover}
          style={{ cursor: 'pointer', padding: '4px 6px' }}
        >
          <ImageIcon size={14} />
          {hasCover ? 'Xóa ảnh bìa' : 'Thêm ảnh bìa'}
        </Button>
      </Flex>

      {/* Page Icon Banner */}
      {page.icon && (
        <Popover.Root>
          <Popover.Trigger>
            <Box
              style={{
                fontSize: '44px',
                cursor: 'pointer',
                display: 'inline-block',
                lineHeight: 1,
                marginBottom: '12px',
                userSelect: 'none',
              }}
              title="Click để đổi icon"
            >
              {page.icon}
            </Box>
          </Popover.Trigger>
          <Popover.Content size="1" style={{ width: '260px' }}>
            <Text size="1" color="gray" mb="2" weight="medium">Chọn biểu tượng Notion</Text>
            <Flex wrap="wrap" gap="2">
              {EMOJI_LIST.map((emoji) => (
                <IconButton
                  key={emoji}
                  variant="ghost"
                  size="2"
                  onClick={() => handleIconSelect(emoji)}
                  style={{ cursor: 'pointer', fontSize: '18px' }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )}

      {/* Notion Page Title: Large, borderless, live editing */}
      <Box mb="5">
        <input
          ref={titleInputRef}
          type="text"
          value={page.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          style={{
            width: '100%',
            fontSize: '34px',
            fontWeight: 700,
            color: 'var(--gray-12)',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: 0,
            margin: 0,
            fontFamily: 'inherit',
          }}
        />
      </Box>

      {/* Notion-style Quick Template Starters if page is completely empty */}
      {isEmpty && (
        <Box mb="6" style={{ cursor: 'default' }}>
          <Text size="2" color="gray" mb="3" as="p">
            Chọn mẫu để bắt đầu hoặc gõ văn bản ngay bên dưới:
          </Text>
          <Flex wrap="wrap" gap="2">
            <Button
              variant="surface"
              color="gray"
              size="2"
              onClick={() => handleApplyTemplate('empty')}
              style={{ cursor: 'pointer' }}
            >
              <FileText size={15} /> Trang trống (Empty page)
            </Button>

            <Button
              variant="surface"
              color="gray"
              size="2"
              onClick={() => handleApplyTemplate('icon')}
              style={{ cursor: 'pointer' }}
            >
              <Sparkles size={15} /> Trang có icon ngẫu nhiên
            </Button>

            <Button
              variant="surface"
              color="gray"
              size="2"
              onClick={() => handleApplyTemplate('database')}
              style={{ cursor: 'pointer' }}
            >
              <TableIcon size={15} /> Bảng cơ sở dữ liệu (Table)
            </Button>

            <Button
              variant="surface"
              color="gray"
              size="2"
              onClick={() => handleApplyTemplate('meeting')}
              style={{ cursor: 'pointer' }}
            >
              <Calendar size={15} /> Mẫu Họp (Meeting Notes)
            </Button>

            <Button
              variant="surface"
              color="gray"
              size="2"
              onClick={() => handleApplyTemplate('todo')}
              style={{ cursor: 'pointer' }}
            >
              <CheckSquare size={15} /> Danh sách công việc (To-do)
            </Button>
          </Flex>
        </Box>
      )}

      {/* Content View: Database View */}
      {isDatabase ? (
        <Box style={{ cursor: 'default' }}>
          <Flex justify="between" align="center" mb="3">
            <Flex gap="2" align="center">
              <Layers size={16} color="var(--gray-9)" />
              <Heading size="3">Bảng dữ liệu (Table Database)</Heading>
            </Flex>
            <Button size="1" variant="soft" color="gray" onClick={addDbRow} style={{ cursor: 'pointer' }}>
              <Plus size={14} /> Thêm hàng mới
            </Button>
          </Flex>

          <Box style={{ border: '1px solid var(--gray-5)', borderRadius: '6px', overflow: 'hidden' }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Tên công việc</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Trạng thái</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Nhãn (Tag)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Ngày</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dbRows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.RowHeaderCell>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDbRows(dbRows.map((r) => (r.id === row.id ? { ...r, name: val } : r)));
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          outline: 'none',
                          color: 'var(--gray-12)',
                        }}
                      />
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Badge
                        color={
                          row.status === 'Done' ? 'green' : row.status === 'In progress' ? 'blue' : 'gray'
                        }
                        variant="soft"
                      >
                        {row.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="purple" variant="outline">
                        {row.tag}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="1" color="gray">
                        {row.date}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="red"
                        onClick={() => setDbRows(dbRows.filter((r) => r.id !== row.id))}
                        style={{ cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      ) : (
        /* Content View: Rich Text / Markdown Editor with Interactive Todo List */
        <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Mode Switcher if page contains To-do items */}
          {hasTodos && (
            <Flex justify="between" align="center" mb="3" style={{ cursor: 'default' }}>
              <Flex align="center" gap="2">
                <ListTodo size={16} color="var(--blue-9)" />
                <Text size="2" weight="medium" color="gray">
                  Chế độ hiển thị:
                </Text>
              </Flex>
              <Flex gap="1">
                <Button
                  size="1"
                  variant={todoViewMode === 'interactive' ? 'solid' : 'ghost'}
                  color="blue"
                  onClick={() => setTodoViewMode('interactive')}
                  style={{ cursor: 'pointer', height: '24px' }}
                >
                  <CheckSquare size={13} /> Checklist tương tác
                </Button>
                <Button
                  size="1"
                  variant={todoViewMode === 'raw' ? 'solid' : 'ghost'}
                  color="gray"
                  onClick={() => setTodoViewMode('raw')}
                  style={{ cursor: 'pointer', height: '24px' }}
                >
                  <FileText size={13} /> Văn bản thuần
                </Button>
              </Flex>
            </Flex>
          )}

          {/* Interactive Notion Todo List Block */}
          {hasTodos && todoViewMode === 'interactive' && (
            <TodoListBlock
              content={page.content || ''}
              onChange={(newContent) => updatePage(page.id, { content: newContent })}
            />
          )}

          {/* Textarea Editor: Active in text mode, raw mode, or as continuous writing area below checklist */}
          <Box style={{ position: 'relative', marginTop: hasTodos && todoViewMode === 'interactive' ? '8px' : '0px' }}>
            {/* Floating Slash Command Menu */}
            <SlashCommandMenu
              isOpen={slashMenuOpen}
              query={slashQuery}
              position={slashPosition}
              onClose={() => setSlashMenuOpen(false)}
              onSelectCommand={(cmdId) => {
                const cmd = filteredCommands.find((c) => c.id === cmdId);
                if (cmd) cmd.execute();
              }}
              selectedIndex={selectedIndex}
              onHoverIndex={setSelectedIndex}
              commands={filteredCommands}
            />

            <textarea
              ref={textareaRef}
              value={hasTodos && todoViewMode === 'interactive' ? nonTodoNotes : (page.content || '')}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder={
                hasTodos && todoViewMode === 'interactive'
                  ? "Nhấp để viết thêm ghi chú bên dưới danh sách hoặc gõ '/'..."
                  : "Press 'space' for AI or '/' for commands"
              }
              style={{
                width: '100%',
                minHeight: '180px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                background: 'transparent',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'var(--gray-12)',
                fontFamily: 'inherit',
                padding: 0,
              }}
            />
          </Box>

          {/* Stretchable empty area below content that focuses editor when clicked */}
          <Box
            style={{
              flexGrow: 1,
              minHeight: '260px',
              cursor: 'text',
              width: '100%',
            }}
            onClick={handleFocusEditor}
          />
        </Box>
      )}
    </Box>
  );
}