import { Text } from '@mantine/core';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const Pill = ({ children }: Props) => (
  <>
    <Text
      size="xs"
      sx={{
        background: 'white',
        padding: '7px 15px',
        borderRadius: 8,
        textAlign: 'center',
        color: '#298EAE'
      }}
    >
      {children}
    </Text>
  </>
);

export const Pills = ({ children }: Props) => (
  <>
    <Text
      size="xs"
      ml={4}
      sx={{
        background: '#f4f9fe',
        padding: '4px',
        borderRadius: 8,
        textAlign: 'center',
        display: 'initial',
        border: '1px solid #adb5bd',
        fontSize: '0.6rem'
      }}
    >
      {children}
    </Text>
  </>
);
