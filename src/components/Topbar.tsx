import { Flex, Text } from '@radix-ui/themes';

export default function Topbar() {
  return (
    <Flex align="center" px="4" style={{ height: '100%' }}>
      <Text weight="medium">Topbar (User Profile, Search, etc.)</Text>
    </Flex>
  );
}