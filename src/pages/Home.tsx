import { Heading, Text, Box, Card } from '@radix-ui/themes';

export default function Home() {
  return (
    <Box>
      {/* Page title[cite: 2] */}
      <Heading size="7" mb="4">Page title</Heading>

      {/* Paragraph blocks[cite: 2] */}
      <Box mb="6">
        <Text as="p" mb="2">Paragraph block 1: Đây là đoạn văn bản mô tả cho trang.</Text>
        <Text as="p">Paragraph block 2: Nội dung chi tiết hơn về dữ liệu bên dưới.</Text>
      </Box>

      {/* Database / Table[cite: 2] */}
      <Card size="2">
        <Text weight="bold" mb="2">Database / Table</Text>
        <Box style={{ height: '200px', backgroundColor: 'var(--gray-3)', borderRadius: '4px' }}>
          {/* Thay thế bằng component Table thực tế của bạn tại đây */}
        </Box>
      </Card>
    </Box>
  );
}