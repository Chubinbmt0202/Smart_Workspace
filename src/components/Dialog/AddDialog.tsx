import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Card,
  Grid,
  Box,
} from '@radix-ui/themes';
import {
  FileTextIcon,
  TableIcon,
} from '@radix-ui/react-icons';

export default function AddDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="gray">Add Page</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="900px"  style={{ padding: 0,color: 'var(--gray-a11)', overflow: 'hidden' }}>
        {/* Header Section */}
        <Flex
          align="center"
          justify="center"
          p="3"
          style={{ borderBottom: '1px solid var(--gray-a4)' }}
        >
          <TextField.Root
            placeholder="Search"
            size="2"
            style={{ width: '300px', padding: '8px 12px', borderRadius: '6px' }}
          >
          </TextField.Root>
        </Flex>

        {/* Scrollable Body Section */}
        <Box p="8" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Top Actions: Empty Page / Database */}
          <Grid columns="2" gap="4" mb="6">
            <Card variant="surface" style={{ cursor: 'pointer', padding: '16px' }}>
              <Flex direction="column" gap="4">
                <FileTextIcon width="24" height="24" color="gray" />
                <Text size="3" weight="bold">
                  Empty page
                </Text>
              </Flex>
            </Card>
            <Card variant="surface" style={{ cursor: 'pointer', padding: '16px' }}>
              <Flex direction="column" gap="4">
                <TableIcon width="24" height="24" color="gray" />
                <Text size="3" weight="bold">
                  Empty database[cite: 1]
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}