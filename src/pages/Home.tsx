import { useEffect, useRef, useMemo, useState } from 'react';
import {
  Text,
  Box,
  Flex,
  Button,
  IconButton,
  Popover,
} from '@radix-ui/themes';
import {
  FileText,
  Smile,
  Image as ImageIcon,
  CheckSquare,
  Plus,
  CalendarDays,
} from 'lucide-react';
import { usePageStore, useActivePage } from '../store/pageStore';
import SlashCommandMenu, { getDefaultCommands } from '../components/Editor/SlashCommandMenu';
import TodoListBlock, { parseTodosFromContent, serializeTodosToContent } from '../components/Editor/TodoListBlock';
import ScheduleBlock, { DEFAULT_SCHEDULE } from '../components/Editor/ScheduleBlock';

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

  // Focus title automatically if page is freshly created with empty title
  useEffect(() => {
    if (activeData?.page && !activeData.page.title) {
      titleInputRef.current?.focus();
    }
  }, [activeData?.page?.id]);

  if (!activeData) {
    return (
      <Flex direction="column" align="center" justify="center" gap="4" py="9" style={{ minHeight: '50vh' }}>
        <Text size="3" color="gray">Chưa chọn trang nào hoặc danh sách đang trống.</Text>
        <Button onClick={() => addPage('notes')} variant="solid" color="gray" style={{ cursor: 'pointer' }}>
          <Plus size={16} /> Tạo trang ghi chú mới
        </Button>
      </Flex>
    );
  }

  const { page } = activeData;
  const pageType = page.type || 'note';
  const isSchedule = pageType === 'schedule';
  const isTodo = pageType === 'todo';
  const isNote = pageType === 'note';

  const isEmpty = !page.content && isNote;
  const hasCover = Boolean(page.cover);

  // Check if page content contains todo markdown
  const hasTodos = useMemo(() => {
    const c = page.content || '';
    return c.includes('- [ ]') || c.includes('- [x]') || c.includes('- [X]');
  }, [page.content]);

  // Extract non-todo notes if page has todos
  const nonTodoNotes = useMemo(() => {
    if (!hasTodos) return '';
    const { preamble } = parseTodosFromContent(page.content || '');
    return preamble;
  }, [hasTodos, page.content]);

  // Auto-resize textarea to fit content and avoid internal scrollbar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [page.content, pageType]);

  const handleUpdateEditorContent = (newTextareaValue: string) => {
    if (isTodo || hasTodos) {
      const { todos } = parseTodosFromContent(page.content || '');
      const updated = serializeTodosToContent(newTextareaValue, todos);
      updatePage(page.id, { content: updated });
    } else {
      updatePage(page.id, { content: newTextareaValue });
    }
  };

  // Commands definition
  const allCommands = useMemo(() => {
    return getDefaultCommands(
      (textToInsert) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const currentContent = (isTodo || hasTodos) ? nonTodoNotes : (page.content || '');
        const start = slashStartIndex >= 0 ? slashStartIndex : textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = currentContent.slice(0, start) + textToInsert + currentContent.slice(end);

        handleUpdateEditorContent(newContent);
        setSlashMenuOpen(false);

        setTimeout(() => {
          textarea.focus();
          const newCursor = start + textToInsert.length;
          textarea.setSelectionRange(newCursor, newCursor);
        }, 0);
      },
      // Chuyển sang Lên lịch làm việc
      () => {
        updatePage(page.id, {
          type: 'schedule',
          icon: '📅',
          content: JSON.stringify(DEFAULT_SCHEDULE),
        });
        setSlashMenuOpen(false);
      },
      // Chuyển sang Những việc cần làm
      () => {
        updatePage(page.id, {
          type: 'todo',
          icon: '☑️',
          content: `- [ ] Công việc mới cần hoàn thành\n`,
        });
        setSlashMenuOpen(false);
      }
    );
  }, [page.id, page.content, isTodo, hasTodos, nonTodoNotes, slashStartIndex]);

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

  // Chọn 1 trong 3 mẫu chính khi trang rỗng
  const handleApplyTemplate = (type: 'note' | 'schedule' | 'todo') => {
    if (type === 'note') {
      updatePage(page.id, {
        type: 'note',
        icon: '📝',
        title: page.title || 'Ghi chú mới',
        content: '',
      });
      setTimeout(() => textareaRef.current?.focus(), 0);
    } else if (type === 'schedule') {
      updatePage(page.id, {
        type: 'schedule',
        icon: '📅',
        title: page.title || 'Lịch làm việc & Kế hoạch',
        content: JSON.stringify(DEFAULT_SCHEDULE),
      });
    } else if (type === 'todo') {
      updatePage(page.id, {
        type: 'todo',
        icon: '☑️',
        title: page.title || 'Danh sách việc cần làm',
        content: `- [x] Nhiệm vụ mẫu đã hoàn thành 🔥
- [ ] Nhiệm vụ quan trọng cần làm hôm nay ⚡
- [ ] Nhiệm vụ tiếp theo trong tuần`,
      });
    }
  };

  // Focus the editor when clicking on any empty space below the content
  const handleFocusEditor = (e: React.MouseEvent) => {
    if (isSchedule) return;
    const target = e.target as HTMLElement;
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

      if (
        (charBeforeSlash === '\n' || charBeforeSlash === ' ') &&
        !textAfterSlash.includes('\n') &&
        textAfterSlash.length <= 15
      ) {
        setSlashMenuOpen(true);
        setSlashQuery(textAfterSlash);
        setSlashStartIndex(lastSlashIndex);
        setSelectedIndex(0);

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

      const textBeforeCursor = value.slice(0, cursor);
      const textAfterCursor = value.slice(cursor);
      const lineStartIndex = textBeforeCursor.lastIndexOf('\n') + 1;
      const lineEndRelative = textAfterCursor.indexOf('\n');
      const lineEndIndex = lineEndRelative === -1 ? value.length : cursor + lineEndRelative;
      const currentLine = value.slice(lineStartIndex, lineEndIndex);

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
        cursor: 'text',
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

      {/* Top action triggers & 3 Chức năng Switcher */}
      <Flex justify="between" align="center" mb="2" wrap="wrap" gap="2" style={{ cursor: 'default' }}>
        <Flex gap="2" align="center">
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

        {/* 3 Chức năng chính Switcher */}
        <Flex align="center" gap="1">
          <Button
            size="1"
            variant={isNote ? 'solid' : 'ghost'}
            color={isNote ? 'blue' : 'gray'}
            onClick={() => {
              const currentContent = page.content || '';
              const isJson = currentContent.trim().startsWith('[') || currentContent.trim().startsWith('{');
              updatePage(page.id, {
                type: 'note',
                icon: page.icon === '📅' || page.icon === '☑️' ? '📝' : page.icon,
                content: isJson ? '' : currentContent,
              });
            }}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            <FileText size={12} /> 1. Ghi chú
          </Button>
          <Button
            size="1"
            variant={isSchedule ? 'solid' : 'ghost'}
            color={isSchedule ? 'indigo' : 'gray'}
            onClick={() => updatePage(page.id, { type: 'schedule', icon: '📅', content: page.content || JSON.stringify(DEFAULT_SCHEDULE) })}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            <CalendarDays size={12} /> 2. Lên lịch
          </Button>
          <Button
            size="1"
            variant={isTodo ? 'solid' : 'ghost'}
            color={isTodo ? 'amber' : 'gray'}
            onClick={() => updatePage(page.id, { type: 'todo', icon: '☑️' })}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            <CheckSquare size={12} /> 3. Việc cần làm
          </Button>
        </Flex>
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

      {/* Page Title */}
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

      {/* 3 Mẫu khởi đầu lớn khi trang mới hoàn toàn */}
      {isEmpty && (
        <Box mb="6" style={{ cursor: 'default' }}>
          <Text size="2" color="gray" mb="3" as="p" weight="medium">
            Chọn 1 trong 3 chức năng chính để bắt đầu:
          </Text>
          <Flex wrap="wrap" gap="3">
            <Button
              variant="surface"
              color="blue"
              size="2"
              onClick={() => handleApplyTemplate('note')}
              style={{ cursor: 'pointer', padding: '12px 16px' }}
            >
              <FileText size={16} /> 📝 Ghi chú
            </Button>

            <Button
              variant="surface"
              color="indigo"
              size="2"
              onClick={() => handleApplyTemplate('schedule')}
              style={{ cursor: 'pointer', padding: '12px 16px' }}
            >
              <CalendarDays size={16} /> 📅 Lên lịch làm việc
            </Button>

            <Button
              variant="surface"
              color="amber"
              size="2"
              onClick={() => handleApplyTemplate('todo')}
              style={{ cursor: 'pointer', padding: '12px 16px' }}
            >
              <CheckSquare size={16} /> ☑️ Những việc cần làm (To-do)
            </Button>
          </Flex>
        </Box>
      )}

      {/* ========================================================
          HIỂN THỊ NỘI DUNG THEO 3 CHỨC NĂNG CHÍNH
          ======================================================== */}

      {/* 1. CHỨC NĂNG: LÊN LỊCH LÀM VIỆC (SCHEDULE) */}
      {isSchedule && (
        <Box style={{ cursor: 'default' }}>
          <ScheduleBlock
            content={page.content || JSON.stringify(DEFAULT_SCHEDULE)}
            onChange={(newContent) => updatePage(page.id, { content: newContent })}
          />
        </Box>
      )}

      {/* 2. CHỨC NĂNG: NHỮNG VIỆC CẦN LÀM (TO-DO LIST) */}
      {isTodo && (
        <Box style={{ cursor: 'default' }}>
          <TodoListBlock
            content={page.content || ''}
            onChange={(newContent) => updatePage(page.id, { content: newContent })}
          />
        </Box>
      )}

      {/* 3. CHỨC NĂNG: GHI CHÚ (NOTES) HOẶC VÙNG SOẠN THẢO VĂN BẢN (Ẩn khi đang xem lịch để không hiển thị raw JSON) */}
      {!isSchedule && (
        <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Trường hợp trang Note có sẵn checklist hoặc to-do xen kẽ */}
          {isNote && hasTodos && (
            <TodoListBlock
              content={page.content || ''}
              onChange={(newContent) => updatePage(page.id, { content: newContent })}
            />
          )}

          {/* Khung soạn thảo văn bản ghi chú với Slash commands */}
          <Box style={{ position: 'relative' }}>
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
              value={(isTodo || hasTodos) ? nonTodoNotes : (page.content || '')}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder={
                isTodo || hasTodos
                  ? "Thêm ghi chú bổ sung cho danh sách việc cần làm hoặc dùng '/'..."
                  : "Press 'space' for AI or '/' for commands"
              }
              style={{
                width: '100%',
                minHeight: '200px',
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

          {/* Vùng trống bên dưới - click vào để kích hoạt con trỏ soạn thảo */}
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