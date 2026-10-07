import { Flex, Text } from '@radix-ui/themes';

export default function Sidebar() {
  return (
    <Flex direction="column" p="4" style={{ height: '100%' }}>
      <Text weight="bold" size="5" mb="6">My App</Text>
      {/* Thêm các menu item tại đây */}
      <Text color="gray">Menu Item 1</Text>
      <Text color="gray">Menu Item 2</Text>
    </Flex>
  );
}