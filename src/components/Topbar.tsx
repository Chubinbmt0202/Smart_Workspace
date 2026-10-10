import { Flex, Text, Button, IconButton } from '@radix-ui/themes';
import { 
  Lock,
  ChevronDown,
  Link2,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { usePageStore } from '../store/pageStore';

export default function Topbar() {
  const getActivePage = usePageStore((state) => state.getActivePage);
  const activeData = getActivePage();

  const title = activeData?.page.title || 'Untitled';
  const icon = activeData?.page.icon || '📄';
  const groupTitle = activeData?.group.title || 'Private';

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
          style={{ 
            cursor: 'pointer', 
            borderRadius: '4px', 
            transition: 'background 0.2s',
            maxWidth: '300px',
            overflow: 'hidden',
          }}
        >
          <Text size="2">{icon}</Text>
          <Text 
            size="2" 
            weight="medium" 
            style={{ 
              color: 'var(--gray-12)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontStyle: activeData?.page.title ? 'normal' : 'italic',
              opacity: activeData?.page.title ? 1 : 0.65,
            }}
          >
            {title}
          </Text>
        </Flex>

        {/* Trạng thái Nhóm (Private / Workspace) */}
        <Flex 
          align="center" 
          gap="1" 
          py="1" 
          px="2"
          style={{ cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
        >
          <Lock size={13} color="var(--gray-9)" />
          <Text size="2" style={{ color: 'var(--gray-9)' }}>{groupTitle}</Text>
          <ChevronDown size={13} color="var(--gray-9)" />
        </Flex>

      </Flex>


      {/* ===== BÊN PHẢI: Trạng thái lưu & Các hành động ===== */}
      <Flex align="center" gap="2">
        
        {/* Dòng chữ trạng thái lưu */}
        <Text size="1" style={{ color: 'var(--gray-9)' }} mr="2">
          Đã lưu
        </Text>

        {/* Nút Share */}
        <Button 
          variant="ghost" 
          color="gray" 
          size="1" 
          style={{ cursor: 'pointer', height: '28px', color: 'var(--gray-11)' }}
        >
          <Lock size={13} />
          Share
        </Button>

        {/* Nhóm Icon Actions (Link, Star, More) */}
        <Flex align="center" gap="1">
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <Link2 size={15} />
          </IconButton>
          
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <Star size={15} />
          </IconButton>
          
          <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
            <MoreHorizontal size={15} />
          </IconButton>
        </Flex>

      </Flex>
    </Flex>
  );
}