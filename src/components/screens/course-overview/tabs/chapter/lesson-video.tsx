import { ActionIcon, Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
import { CompletedMarkIcon, PlayBtnIcon } from '@/src/constants/icons';
import { LessonLockIcon } from '@/src/constants/icons/lessonLock';
import { useRouter } from 'next/router';

type Props = {
  class_id: string;
  url: string;
  title: string;
  type: string;
  is_lock: boolean;
  is_complete: boolean;
  duration: string;
  meeting_id?: string;
  handlePlay?: (class_id: string, status: string, meeting_id?: string) => void;
};

export const LessonVideo = ({
  class_id,
  duration,
  type,
  title,
  is_lock,
  is_complete,
  meeting_id,
  handlePlay,
}: Props) => {
  const router = useRouter();
  return (
    <>
      {type === 'meeting' ? (
        <SimpleGrid
          spacing={6}
          onClick={() =>
            !is_lock
              ? handlePlay &&
                handlePlay(class_id, is_complete ? 'complete' : 'in_complete', meeting_id)
              : null
          }
          sx={{
            gridTemplateColumns: 'max-content 1fr max-content',
            alignItems: 'start',
            cursor: 'pointer',
          }}
        >
          <ActionIcon variant="filled" color="primary" size="xl" radius="xl">
            <PlayBtnIcon />
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
            <Text size="xs" sx={{ color: '#ACB7CA', whiteSpace: 'nowrap' }}>
              {duration} min
            </Text>
          </Stack>
          <Box sx={{ alignSelf: 'center' }}>
            {is_lock && <LessonLockIcon />}
            {is_complete && <CompletedMarkIcon />}
          </Box>
        </SimpleGrid>
      ) : (
        <SimpleGrid
          spacing={6}
          onClick={() =>
            !is_lock
              ? handlePlay && handlePlay(class_id, is_complete ? 'complete' : 'in_complete')
              : null
          }
          sx={{
            gridTemplateColumns: 'max-content 1fr max-content',
            alignItems: 'start',
            cursor: 'pointer',
          }}
        >
          <ActionIcon variant="filled" color="primary" size="xl" radius="xl">
            <PlayBtnIcon />
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
            <Text size="xs" sx={{ color: '#ACB7CA', whiteSpace: 'nowrap' }}>
              {duration} min
            </Text>
          </Stack>
          <Box sx={{ alignSelf: 'center' }}>
            {is_lock && <LessonLockIcon />}
            {is_complete && <CompletedMarkIcon />}
          </Box>
        </SimpleGrid>
      )}
    </>
  );
};
