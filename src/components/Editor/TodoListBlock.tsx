import { useState, useRef } from 'react';
import { Box, Flex, Text, Button, IconButton, Badge, Progress } from '@radix-ui/themes';
import {
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface TodoListBlockProps {
  content: string;
  onChange: (newContent: string) => void;
}

// Parse markdown content into TodoItem array and optional non-todo preamble/notes
export function parseTodosFromContent(content: string): {
  preamble: string;
  todos: TodoItem[];
} {
  const lines = content.split('\n');
  const todos: TodoItem[] = [];
  const preambleLines: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
      const completed = trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ');
      let text = trimmed.slice(6);
      let priority: 'high' | 'medium' | 'low' = 'low';

      if (text.includes('🔥') || text.toLowerCase().includes('ưu tiên cao')) {
        priority = 'high';
      } else if (text.includes('⚡') || text.toLowerCase().includes('quan trọng')) {
        priority = 'medium';
      }

      todos.push({
        id: `todo-${index}-${Date.now()}`,
        text,
        completed,
        priority,
      });
    } else {
      preambleLines.push(line);
    }
  });

  return {
    preamble: preambleLines.join('\n').trim(),
    todos,
  };
}

// Convert TodoItem array and preamble back to markdown string
export function serializeTodosToContent(preamble: string, todos: TodoItem[]): string {
  const todoLines = todos.map((t) => `- [${t.completed ? 'x' : ' '}] ${t.text}`);
  if (preamble) {
    return `${preamble}\n\n${todoLines.join('\n')}`;
  }
  return todoLines.join('\n');
}

export default function TodoListBlock({ content, onChange }: TodoListBlockProps) {
  const { preamble, todos } = parseTodosFromContent(content);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newText, setNewText] = useState('');
  const lastInputRef = useRef<HTMLInputElement>(null);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = todos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const updateTodoList = (newTodos: TodoItem[]) => {
    const serialized = serializeTodosToContent(preamble, newTodos);
    onChange(serialized);
  };

  const handleToggle = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    updateTodoList(updated);
  };

  const handleTextChange = (id: string, text: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, text } : t));
    updateTodoList(updated);
  };

  const handleDelete = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    updateTodoList(updated);
  };

  const handleAddTodo = () => {
    if (!newText.trim()) return;
    const newItem: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newText.trim(),
      completed: false,
      priority: 'low',
    };
    updateTodoList([...todos, newItem]);
    setNewText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, id: string) => {
    // SHIFT + ENTER: Vẫn sử dụng khối block to-do đó (tạo thêm 1 to-do item mới ngay sau)
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const newItem: TodoItem = {
        id: `todo-${Date.now()}`,
        text: '',
        completed: false,
        priority: 'low',
      };
      const updated = [...todos];
      updated.splice(index + 1, 0, newItem);
      updateTodoList(updated);
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('.notion-todo-input');
        if (inputs[index + 1]) inputs[index + 1].focus();
      }, 50);
      return;
    }

    // ENTER THƯỜNG: Đổi sang khối block khác (chuyển focus xuống vùng soạn thảo văn bản thường bên dưới)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        const len = textarea.value.length;
        textarea.setSelectionRange(len, len);
      }
      return;
    }

    // BACKSPACE khi ô trống: xóa to-do item và lùi về ô trước
    if (e.key === 'Backspace' && todos[index]?.text === '') {
      e.preventDefault();
      handleDelete(id);
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('.notion-todo-input');
        if (inputs[index - 1]) inputs[index - 1].focus();
      }, 50);
    }
  };

  return (
    <Box
      style={{
        borderRadius: '8px',
        border: '1px solid var(--gray-4)',
        backgroundColor: 'var(--color-panel-solid, #ffffff)',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Header & Progress */}
      <Flex justify="between" align="center" mb="3" wrap="wrap" gap="2">
        <Flex align="center" gap="2">
          <Text size="3" weight="bold" style={{ color: 'var(--gray-12)' }}>
            Danh sách việc cần làm (To-do List)
          </Text>
          <Badge color={progressPercent === 100 ? 'green' : 'blue'} variant="soft" size="1">
            {completedCount}/{totalCount} việc ({progressPercent}%)
          </Badge>
        </Flex>

        {/* Filter buttons */}
        <Flex align="center" gap="1">
          <Button
            size="1"
            variant={filter === 'all' ? 'solid' : 'ghost'}
            color="gray"
            onClick={() => setFilter('all')}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            Tất cả ({totalCount})
          </Button>
          <Button
            size="1"
            variant={filter === 'pending' ? 'solid' : 'ghost'}
            color="gray"
            onClick={() => setFilter('pending')}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            Chưa xong ({totalCount - completedCount})
          </Button>
          <Button
            size="1"
            variant={filter === 'completed' ? 'solid' : 'ghost'}
            color="gray"
            onClick={() => setFilter('completed')}
            style={{ cursor: 'pointer', height: '24px', fontSize: '12px' }}
          >
            Đã xong ({completedCount})
          </Button>
        </Flex>
      </Flex>

      {/* Progress Bar */}
      <Box mb="4">
        <Progress value={progressPercent} color={progressPercent === 100 ? 'green' : 'indigo'} size="1" />
      </Box>

      {/* Todo Items */}
      <Flex direction="column" gap="2">
        {filteredTodos.map((todo, index) => (
          <Flex
            key={todo.id}
            align="center"
            justify="between"
            px="2"
            py="1"
            style={{
              borderRadius: '6px',
              backgroundColor: todo.completed ? 'var(--gray-2)' : 'transparent',
              transition: 'all 0.15s ease',
            }}
            className="todo-item-row"
          >
            <Flex align="center" gap="3" style={{ flex: 1 }}>
              {/* Notion square checkbox */}
              <Box
                onClick={() => handleToggle(todo.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: todo.completed ? 'none' : '1.5px solid var(--gray-8)',
                  backgroundColor: todo.completed ? 'var(--blue-9)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {todo.completed && <Check size={12} color="#ffffff" strokeWidth={3} />}
              </Box>

              {/* Editable Text Input */}
              <input
                className="notion-todo-input"
                type="text"
                value={todo.text}
                onChange={(e) => handleTextChange(todo.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, todo.id)}
                placeholder="Nhập tên công việc..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  color: todo.completed ? 'var(--gray-8)' : 'var(--gray-12)',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  fontFamily: 'inherit',
                  transition: 'color 0.15s ease',
                }}
              />
            </Flex>

            {/* Actions: Priority Tag & Delete */}
            <Flex align="center" gap="2">
              {todo.text.includes('🔥') && (
                <Badge color="red" variant="soft" size="1">
                  Ưu tiên cao
                </Badge>
              )}
              {todo.text.includes('⚡') && (
                <Badge color="amber" variant="soft" size="1">
                  Quan trọng
                </Badge>
              )}
              <IconButton
                size="1"
                variant="ghost"
                color="red"
                onClick={() => handleDelete(todo.id)}
                style={{
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  opacity: 0.6,
                }}
              >
                <Trash2 size={13} />
              </IconButton>
            </Flex>
          </Flex>
        ))}

        {filteredTodos.length === 0 && (
          <Flex justify="center" align="center" py="3">
            <Text size="2" color="gray" style={{ fontStyle: 'italic' }}>
              {filter === 'completed'
                ? 'Chưa có công việc nào hoàn thành.'
                : filter === 'pending'
                ? 'Tuyệt vời! Bạn đã hoàn thành tất cả công việc.'
                : 'Chưa có công việc nào. Hãy thêm công việc mới bên dưới.'}
            </Text>
          </Flex>
        )}
      </Flex>

      {/* Quick Add Row at Bottom */}
      <Flex align="center" gap="2" mt="3" pt="2" style={{ borderTop: '1px solid var(--gray-3)' }}>
        <input
          ref={lastInputRef}
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTodo();
            }
          }}
          placeholder="+ Thêm công việc mới (Nhấn Enter để thêm)..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: 'var(--gray-12)',
            padding: '4px 6px',
            fontFamily: 'inherit',
          }}
        />
        <Button
          size="1"
          variant="soft"
          color="gray"
          disabled={!newText.trim()}
          onClick={handleAddTodo}
          style={{ cursor: newText.trim() ? 'pointer' : 'default' }}
        >
          <Plus size={13} /> Thêm
        </Button>
      </Flex>
    </Box>
  );
}
