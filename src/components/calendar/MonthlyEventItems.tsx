import { List, Text, Stack } from '@mantine/core';
import React from 'react';

type DefaultEventItemProps = {
  count: number;
  type: string;
};

export const MonthlyEventItem = ({ count, type }: DefaultEventItemProps) => (
  <List.Item sx={{ listStyle: 'none' }}>
    <Text
      align="center"
      sx={{
        fontSize: 13,
        width: 18,
        height: 18,
        borderRadius: '100%',
        background: type == 'in-person-session' ? '#FF3030' : '#3AA222',
        flexShrink: 0,
        color: 'white',
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      {count}
    </Text>
  </List.Item>
);
