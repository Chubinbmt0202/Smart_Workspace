import { useState, type ReactNode } from 'react';
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

interface AddDialogProps {
  groupId: string;
  onAddPage: (groupId: string, title: string) => void;
  trigger?: ReactNode;
}

export default function AddDialog({
  groupId,
  onAddPage,
  trigger,
}: AddDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const buildPageName = (template: 'page' | 'database') => {
    const fallback = template === 'page' ? 'Untitled page' : 'Empty database';
    const trimmed = query.trim();

    if (!trimmed) {
      return fallback;
    }

    return trimmed;
  };

  const handleCreate = (template: 'page' | 'database') => {
    const title = buildPageName(template);
    onAddPage(groupId, title);
    setQuery('');
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger ?? (
          <Button color="gray" size="1" variant="soft">
            Add Page
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content
        maxWidth="900px"
        style={{ padding: 0, color: 'var(--gray-a11)', overflow: 'hidden' }}
      >
        <Flex
          align="center"
          justify="center"
          p="3"
          style={{ borderBottom: '1px solid var(--gray-a4)' }}
        >
          <TextField.Root
            placeholder="Search or name your page"
            size="2"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ width: '300px', padding: '8px 12px', borderRadius: '6px' }}
          />
        </Flex>

        <Box p="8" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid columns="2" gap="4" mb="6">
            <Card
              variant="surface"
              style={{ cursor: 'pointer', padding: '16px' }}
              onClick={() => handleCreate('page')}
            >
              <Flex direction="column" gap="4">
                <FileTextIcon width="24" height="24" color="gray" />
                <Text size="3" weight="bold">
                  Empty page
                </Text>
              </Flex>
            </Card>
            <Card
              variant="surface"
              style={{ cursor: 'pointer', padding: '16px' }}
              onClick={() => handleCreate('database')}
            >
              <Flex direction="column" gap="4">
                <TableIcon width="24" height="24" color="gray" />
                <Text size="3" weight="bold">
                  Empty database
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}