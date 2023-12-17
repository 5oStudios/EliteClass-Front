import { ActionIcon, Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
import { BookIcon } from '@/src/constants/icons/book';
import { LessonLockIcon } from '@/src/constants/icons/lessonLock';
import { CompletedMarkIcon } from '@/src/constants/icons';

type Props = {
  class_id: string;
  title: string;
  is_lock: boolean;
  is_complete: boolean;
  duration: string;
  type: string;
  handleReadingDrawer: (type: string, pdf_id: string, status?: string) => void;
};

export const LessonNotes = ({
  handleReadingDrawer,
  class_id,
  duration,
  title,
  type,
  is_lock,
  is_complete,
}: Props) => (
  <>
    <SimpleGrid
      spacing={6}
      onClick={() => {
        !is_lock
          ? handleReadingDrawer(type, class_id, is_complete ? 'complete' : 'in_complete')
          : null;
      }}
      sx={{
        gridTemplateColumns: 'max-content 1fr max-content',
        alignItems: 'start',
        cursor: 'pointer',
      }}
    >
      <ActionIcon variant="filled" color="primary" size="xl" radius="xl">
        <BookIcon />
      </ActionIcon>

      <Stack pr={5} spacing={0}>
        <Group noWrap spacing={5} align="start">
          <Text size="sm" transform="capitalize" weight={500}>
            {type} :
            <Box component="span" sx={{ fontWeight: 400, fontSize: 12 }}>
              {title}
            </Box>
          </Text>
        </Group>
        <Text size="xs" sx={{ color: '#ACB7CA', whiteSpace: 'nowrap' }}>
          {duration} min
        </Text>
      </Stack>
      {is_lock && <LessonLockIcon />}
      {is_complete && <CompletedMarkIcon />}
    </SimpleGrid>
  </>
);
