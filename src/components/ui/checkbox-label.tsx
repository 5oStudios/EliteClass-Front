import { Text } from '@mantine/core';
import React from 'react';

export const CheckboxLabel = ({ label }: { label: string[] }) => (
  <>
    <Text sx={{ fontSize: 10, color: '#000000' }}>
      {label[0]}{' '}
      <Text component="span" size="xs" weight={500} color="#298EAE">
        {label[1]}{' '}
      </Text>{' '}
      {label[2]}{' '}
      <Text
        component="span"
        sx={(theme) => ({
          color: theme.other.secondaryWriteColor,
          fontSize: 10,
          whiteSpace: 'nowrap',
        })}
      >
        {label[3]}
      </Text>
    </Text>
  </>
);
