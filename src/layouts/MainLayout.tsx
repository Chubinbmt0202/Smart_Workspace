import { Flex, Box } from '@radix-ui/themes';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Khu vực Sidebar bên trái */}
      <Box style={{ width: '250px', borderRight: '1px solid var(--gray-5)', flexShrink: 0 }}>
        <Sidebar />
      </Box>

      {/* Khu vực chính bên phải */}
      <Flex direction="column" style={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Khu vực Topbar[cite: 2] */}
        <Box style={{ height: '60px', borderBottom: '1px solid var(--gray-5)', flexShrink: 0 }}>
          <Topbar />
        </Box>

        {/* Khu vực Page content[cite: 2] */}
        <Box style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'var(--gray-2)' }}>
          {/* Bọc nội dung ở giữa để tạo khoảng cách như bản vẽ[cite: 2] */}
          <Box p="6" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {children}
          </Box>
        </Box>
        
      </Flex>
    </Flex>
  );
}