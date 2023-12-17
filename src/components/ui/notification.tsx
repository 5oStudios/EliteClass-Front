import { Avatar, Card, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
import momentWithTimeZone from 'moment-timezone';

type Props = {
  avatar: string;
  message: string;
  name: string;
  time: string;
  subMessage?: string;
  onClick: () => void;
};

export const Notification = ({ onClick, name, time, avatar, message, subMessage }: Props) => (
  <Card sx={(theme) => ({ backgroundColor: theme.colorScheme === 'light' ? '#f7f6f5' : '#25262b' })} radius={8} px={8} onClick={onClick}>
    <SimpleGrid
      spacing={7}
      sx={{ gridTemplateColumns: 'max-content 1fr max-content', alignItems: 'center' }}
    >
      <Avatar src={avatar} radius="xl" size="md" />
      <Stack spacing={3}>
        <Text
          weight={500}
          pr={5}
          sx={(theme) => ({
            fontSize: 12, alignSelf: 'start', flexShrink: 0, color: theme.other.headingColor
          })}
        >
          {name}
        </Text>
        <Text
          sx={(theme) => ({
            fontSize: 12,
            color: '#298EAE', //theme.other.placeholderColor,
          })}
        >
          {message}
        </Text>
      </Stack>
      <Text
        sx={(theme) => ({
          fontSize: 12,
          color: theme.colorScheme === 'light' ? '#000' : '#fff',
          alignSelf: 'start',
        })}
      >
        {momentWithTimeZone
          .utc(time)
          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
          .fromNow()}
      </Text>
    </SimpleGrid>
  </Card>
);
