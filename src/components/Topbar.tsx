import { Flex, Text, Button, IconButton } from '@radix-ui/themes';
import { 
  Bookmark,   // Dùng làm icon màu tím bên trái
  Lock,       // Icon ổ khóa
  ChevronDown, // Icon mũi tên chỉ xuống
  Link2,      // Icon copy link
  Star,       // Icon yêu thích
  MoreHorizontal // Icon ba chấm (Options)
} from 'lucide-react';

export default function Topbar() {
  return (
    <Flex 
      justify="between" 
      align="center" 
      px="3" 
      style={{ 
        height: '45px', 
        width: '100%', 
      }}
    >
      {/* ===== BÊN TRÁI: Tiêu đề & Trạng thái ===== */}
      <Flex align="center" gap="1">
        
        {/* Nhóm Tiêu đề (Icon + Tên trang) */}
        <Flex 
          align="center" 
          gap="2" 
          py="1" 
          px="2"
          style={{ cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
          className="hover-bg-gray" // Thêm class này vào css để làm nền hover xám nhạt
        >
          <Bookmark size={16} fill="var(--purple-9)" color="var(--purple-9)" />
          <Text size="2" weight="regular" style={{ color: 'var(--gray-12)' }}>
            Campaign Apply
          </Text>
        </Flex>

        {/* Trạng thái Private */}
        <Flex 
          align="center" 
          gap="1" 
          py="1" 
          px="2"
          style={{ cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
          className="hover-bg-gray"
        >
          <Lock size={14} color="var(--gray-9)" />
          <Text size="2" style={{ color: 'var(--gray-9)' }}>Private</Text>
          <ChevronDown size={14} color="var(--gray-9)" />
        </Flex>

      </Flex>


      {/* ===== BÊN PHẢI: Trạng thái lưu & Các hành động =====[cite: 6] */}
      <Flex align="center" gap="2">
        
        {/* Dòng chữ trạng thái lưu[cite: 6] */}
        <Text size="2" style={{ color: 'var(--gray-9)' }} mr="2">
          Edited 1d ago
        </Text>

        {/* Nút Share[cite: 6] */}
        <Button 
          variant="ghost" 
          color="gray" 
          size="1" 
          style={{ cursor: 'pointer', height: '28px', color: 'var(--gray-11)' }}
        >
          <Lock size={14} />
          Share
        </Button>

        {/* Nhóm Icon Actions (Link, Star, More)[cite: 6] */}
        <Flex align="center" gap="1">
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <Link2 size={16} />
          </IconButton>
          
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <Star size={16} />
          </IconButton>
          
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <MoreHorizontal size={16} />
          </IconButton>
        </Flex>

      </Flex>
    </Flex>
  );
}