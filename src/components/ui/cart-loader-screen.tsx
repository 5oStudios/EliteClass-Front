import { Box, LoadingOverlay } from '@mantine/core';
import React from 'react';
import { LoadingDots } from './loading-dots';

export const CartLoadingScreen = ({
  isLoading,
  color,
  indicatorColor,
}: {
  isLoading: boolean;
  color: string;
  indicatorColor: string;
}) => (
  <Box
    sx={(theme) => ({
      background: color,
      zIndex: 10,
    })}
  >
    <LoadingOverlay
      visible={isLoading}
      transitionDuration={500}
      overlayOpacity={0}
      sx={(theme) => ({
        background: color,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.9,
      })}
      loader={<LoadingDots color={indicatorColor} size={14} height={80} width={80} />}
    />
  </Box>
);
