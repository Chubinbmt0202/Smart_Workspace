import { Flex, Text, Kbd, IconButton } from '@radix-ui/themes';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Bookmark, 
  Plus 
} from 'lucide-react';

export default function SidebarContent() {
  return (
    <Flex direction="column" gap="3" px="3" py="2" style={{ width: '100%' }}>
      
      {/* 1. Ô tìm kiếm: Search or ask + phím tắt Ctrl+K */}
      <Flex 
        align="center" 
        justify="between" 
        px="2" 
        py="1"
        style={{ 
          border: '1px solid var(--gray-5)', 
          borderRadius: '6px', 
          cursor: 'pointer',
          backgroundColor: 'var(--gray-1)',
          height: '32px'
        }}
      >
        <Text size="2" color="gray">Search or ask</Text>
        <Kbd size="1" style={{ color: 'var(--gray-10)' }}>Ctrl+K</Kbd>
      </Flex>

      {/* 2. Hàng tab điều hướng nhanh: Home (Active), Chat, Calendar */}
      <Flex align="center" gap="2">
        {/* Nút Home (Đang được chọn - Active) */}
        <Flex 
          align="center" 
          gap="2" 
          px="2" 
          py="1" 
          style={{ 
            backgroundColor: 'var(--gray-4)', 
            borderRadius: '6px', 
            cursor: 'pointer',
            height: '28px'
          }}
        >
          <Home size={15} strokeWidth={2.2} />
          <Text size="2" weight="medium">Home</Text>
        </Flex>

        {/* Nút Chat */}
        <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer', width: '28px', height: '28px' }}>
          <MessageSquare size={16} />
        </IconButton>

        {/* Nút Calendar */}
        <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer', width: '28px', height: '28px' }}>
          <Calendar size={16} />
        </IconButton>
      </Flex>

      {/* 3. Danh sách mục điều hướng chung */}
      <Flex direction="column" gap="1">
        {[
          'Upcoming events',
          'Recents',
          'Agents',
          'Teamspaces',
        ].map((item) => (
          <Flex
            key={item}
            align="center"
            px="2"
            style={{ 
              height: '30px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              transition: 'background 0.15s' 
            }}
            className="hover-bg-gray"
          >
            <Text size="2" color="gray">{item}</Text>
          </Flex>
        ))}
      </Flex>

      {/* 4. Nhóm Private & Trang con */}
      <Flex direction="column" gap="1" mt="2">
        {/* Tiêu đề nhóm */}
        <Text size="1" color="gray" weight="medium" style={{ opacity: 0.8 }}>
          Private
        </Text>

        {/* Trang đang mở: Campaign Apply (Active block) */}
        <Flex 
          align="center" 
          gap="2" 
          px="2" 
          style={{ 
            height: '32px', 
            borderRadius: '6px', 
            backgroundColor: 'var(--gray-4)', // Nền xám nổi bật khi active
            cursor: 'pointer' 
          }}
        >
          <Bookmark size={15} fill="var(--purple-9)" color="var(--purple-9)" />
          <Text size="2" weight="regular" style={{ color: 'var(--gray-12)' }}>
            Campaign Apply
          </Text>
        </Flex>

        {/* Nút thêm mới (+ Add new) */}
        <Flex 
          align="center" 
          gap="2" 
          px="2" 
          style={{ 
            height: '30px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            transition: 'background 0.15s' 
          }}
          className="hover-bg-gray"
        >
          <Plus size={15} color="var(--gray-9)" />
          <Text size="2" color="gray">Add new</Text>
        </Flex>
      </Flex>

    </Flex>
  );
}