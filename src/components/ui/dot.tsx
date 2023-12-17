import { Box } from '@mantine/core';
import React from 'react';

type Props = {
  active?: boolean;
  width?: number;
  height?: number;
};

export const Dot = ({ active, width, height }: Props) => (
  <>
    <Box
      component="span"
      sx={{
        width: width || '1rem',
        height: height || '1rem',
        borderRadius: '50%',
        background: active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.4)',
      }}
    />
  </>
);
