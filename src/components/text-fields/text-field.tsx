import { TextInput } from '@mantine/core';
import React from 'react';

export const TextField = () => (
  <>
    <TextInput
      styles={(theme) => ({
        input: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
        },
      })}
    />
  </>
);
