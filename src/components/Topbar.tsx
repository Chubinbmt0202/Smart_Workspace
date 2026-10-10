import { Flex, Text, Button, IconButton, DropdownMenu, Tooltip } from '@radix-ui/themes';
import { 
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Link2,
  Star,
  MoreHorizontal,
  Check,
  Copy,
  Trash2,
  Table as TableIcon,
  FileText,
  Building2,
} from 'lucide-react';
import { usePageStore, useActivePage } from '../store/pageStore';
import { useState } from 'react';

export default function Topbar() {
  const activeData = useActivePage();
  const goBack = usePageStore((state) => state.goBack);
  const goForward = usePageStore((state) => state.goForward);
  const historyIndex = usePageStore((state) => state.historyIndex);
  const historyLength = usePageStore((state) => state.history.length);
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyLength - 1;
  const setActivePage = usePageStore((state) => state.setActivePage);
  const duplicatePage = usePageStore((state) => state.duplicatePage);
  const deletePage = usePageStore((state) => state.deletePage);
  const updatePage = usePageStore((state) => state.updatePage);

  const [isStarred, setIsStarred] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = activeData?.page.title || 'Untitled';
  const icon = activeData?.page.icon || '📄';
  const groupTitle = activeData?.group.title || 'Private';
  const pageId = activeData?.page.id;

  const handleCopyLink = () => {
    if (!pageId) return;
    navigator.clipboard.writeText(window.location.origin + '#' + pageId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex 
      justify="between" 
      align="center" 
      px="3" 
      style={{ 
        height: '45px', 
        width: '100%', 
        userSelect: 'none',
      }}
    >
      {/* ===== BÊN TRÁI: Thanh điều hướng (Navigation Bar / Breadcrumb) ===== */}
      <Flex align="center" gap="1" style={{ overflow: 'hidden' }}>
        
        {/* Lịch sử điều hướng: Back & Forward */}
        <Flex align="center" gap="1" mr="1">
          <Tooltip content="Quay lại trang trước">
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              disabled={!canGoBack}
              onClick={goBack}
              style={{
                cursor: canGoBack ? 'pointer' : 'default',
                opacity: canGoBack ? 1 : 0.35,
                width: '24px',
                height: '24px',
              }}
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </IconButton>
          </Tooltip>

          <Tooltip content="Tiến tới trang sau">
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              disabled={!canGoForward}
              onClick={goForward}
              style={{
                cursor: canGoForward ? 'pointer' : 'default',
                opacity: canGoForward ? 1 : 0.35,
                width: '24px',
                height: '24px',
              }}
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </IconButton>
          </Tooltip>
        </Flex>

        {/* Breadcrumb Trail: Workspace -> Group -> Page */}
        <Flex align="center" gap="1" style={{ fontSize: '13px', color: 'var(--gray-11)' }}>
          {/* Root Workspace */}
          <Flex 
            align="center" 
            gap="1" 
            px="1" 
            py="1" 
            style={{ 
              borderRadius: '4px', 
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            <Building2 size={13} color="var(--gray-9)" />
            <Text size="1" color="gray" weight="medium">Smart Workspace</Text>
          </Flex>

          <Text size="1" color="gray" style={{ opacity: 0.5 }}>/</Text>

          {/* Group Name với Menu chuyển nhanh trang trong nhóm */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Flex 
                align="center" 
                gap="1" 
                px="1" 
                py="1" 
                style={{ 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <Lock size={12} color="var(--gray-9)" />
                <Text size="1" color="gray" weight="medium">{groupTitle}</Text>
                <ChevronDown size={11} color="var(--gray-9)" />
              </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="1" color="gray" variant="soft">
              <DropdownMenu.Label>Các trang trong nhóm {groupTitle}</DropdownMenu.Label>
              {activeData?.group.children.map((sibling) => (
                <DropdownMenu.Item
                  key={sibling.id}
                  onClick={() => setActivePage(sibling.id)}
                >
                  <Flex align="center" gap="2">
                    <Text size="1">{sibling.icon || '📄'}</Text>
                    <Text size="1" weight={sibling.id === pageId ? 'bold' : 'regular'}>
                      {sibling.title || 'Untitled'}
                    </Text>
                  </Flex>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Text size="1" color="gray" style={{ opacity: 0.5 }}>/</Text>

          {/* Active Page (Tiêu đề trang hiện tại) */}
          <Flex 
            align="center" 
            gap="1" 
            px="2" 
            py="1" 
            style={{ 
              borderRadius: '4px', 
              cursor: 'pointer',
              maxWidth: '220px',
              overflow: 'hidden',
            }}
          >
            <Text size="1">{icon}</Text>
            <Text 
              size="1" 
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
        </Flex>

      </Flex>


      {/* ===== BÊN PHẢI: Trạng thái lưu & Các hành động ===== */}
      <Flex align="center" gap="2">
        
        {/* Trạng thái đã lưu */}
        <Flex align="center" gap="1" mr="1">
          <Check size={12} color="var(--green-9)" />
          <Text size="1" style={{ color: 'var(--gray-9)', fontSize: '12px' }}>
            Đã lưu
          </Text>
        </Flex>

        {/* Nút Share */}
        <Button 
          variant="ghost" 
          color="gray" 
          size="1" 
          style={{ cursor: 'pointer', height: '28px', color: 'var(--gray-11)', padding: '0 8px' }}
        >
          <Lock size={13} />
          Share
        </Button>

        {/* Copy Link */}
        <Tooltip content={copied ? 'Đã copy link!' : 'Sao chép liên kết trang'}>
          <IconButton 
            variant="ghost" 
            color={copied ? 'green' : 'gray'} 
            size="1" 
            onClick={handleCopyLink}
            style={{ cursor: 'pointer' }}
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
          </IconButton>
        </Tooltip>
        
        {/* Star / Favorite */}
        <Tooltip content={isStarred ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
          <IconButton 
            variant="ghost" 
            color={isStarred ? 'amber' : 'gray'} 
            size="1" 
            onClick={() => setIsStarred(!isStarred)}
            style={{ cursor: 'pointer' }}
          >
            <Star size={14} fill={isStarred ? 'currentColor' : 'none'} />
          </IconButton>
        </Tooltip>
        
        {/* Menu More Options */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" size="1" style={{ cursor: 'pointer' }}>
              <MoreHorizontal size={14} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="1" color="gray" variant="soft">
            {pageId && (
              <>
                <DropdownMenu.Item onClick={() => duplicatePage(pageId)}>
                  <Flex align="center" gap="2">
                    <Copy size={13} /> Nhân bản trang (Duplicate)
                  </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  onClick={() => 
                    updatePage(pageId, { 
                      type: activeData?.page.type === 'database' ? 'page' : 'database' 
                    })
                  }
                >
                  <Flex align="center" gap="2">
                    {activeData?.page.type === 'database' ? (
                      <><FileText size={13} /> Chuyển sang dạng Văn bản (Document)</>
                    ) : (
                      <><TableIcon size={13} /> Chuyển sang Bảng dữ liệu (Database)</>
                    )}
                  </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={() => deletePage(pageId)}>
                  <Flex align="center" gap="2">
                    <Trash2 size={13} /> Xóa trang (Delete)
                  </Flex>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

      </Flex>
    </Flex>
  );
}