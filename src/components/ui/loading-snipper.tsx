import { Box, Loader } from '@mantine/core';
import React from 'react';

export const LoadingSnipper = ({ width, height }: { width: number; height: number }) => (
  <Box sx={{ margin: 'auto', width: 'max-content' }}>
    <Loader strokeWidth={1} width={width} height={height} />
  </Box>
);
