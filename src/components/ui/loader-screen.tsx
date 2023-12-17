import { Box, LoadingOverlay } from '@mantine/core';
import React from 'react';
import { LoadingDots } from './loading-dots';

export const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => (
  <Box
    sx={(theme) => ({
      background: theme.colors.primary[4],
      zIndex: 10,
    })}
  >
    <LoadingOverlay
      visible={isLoading}
      transitionDuration={500}
      overlayOpacity={0}
      sx={(theme) => ({
        background: theme.colors.primary[4],
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })}
      loader={<LoadingDots color="#fff" size={14} height={80} width={80} />}
    />
  </Box>
);
