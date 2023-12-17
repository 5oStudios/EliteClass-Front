import { ActionIcon, Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
import { LessonLockIcon } from '@/src/constants/icons/lessonLock';
import { PaperIcon } from '@/src/constants/icons/paper-icon';
import { CompletedMarkIcon } from '@/src/constants/icons';

type props = {
  class_id?: string;
  quiz_id: number;
  duration: string;
  is_lock: boolean;
  is_complete: boolean;
  title: string;
  type: string;
  handleQuizClick: (quizId: number, class_id: string) => void;
};

export const LessonQuiz = ({
  duration,
  is_lock,
  title,
  type,
  quiz_id,
  class_id,
  handleQuizClick,
  is_complete,
}: props) => (
  <>
    <SimpleGrid
      onClick={() => (!is_lock ? handleQuizClick(quiz_id, class_id!) : null)}
      spacing={6}
      sx={{
        gridTemplateColumns: 'max-content 1fr max-content',
        alignItems: 'start',
        cursor: 'pointer',
      }}
    >
      <ActionIcon variant="filled" color="primary" size="xl" radius="xl">
        <PaperIcon />
      </ActionIcon>
      <Stack pr={5} spacing={0}>
        <Group noWrap spacing={5} align="start">
          <Text size="sm" transform="capitalize" weight={500}>
            {type} :{' '}
            <Box component="span" sx={{ fontWeight: 400, fontSize: 12 }}>
              {title}
            </Box>
          </Text>
        </Group>
        <Text size="xs" sx={{ color: '#ACB7CA' }}>
          {duration} questions
        </Text>
      </Stack>
      {is_lock && <LessonLockIcon />}
      {is_complete && <CompletedMarkIcon />}
    </SimpleGrid>
  </>
);
