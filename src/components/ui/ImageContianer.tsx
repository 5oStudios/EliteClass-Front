import { Box } from '@mantine/core';
import React from 'react';

type Props = {
  media?: { md: number; lg: number };
  h: [number, number, number];
  w: [number, number, number];
  children: React.ReactNode;
};

export const ImageContainer = ({ media, h, w, children }: Props) => (
  <>
    <Box
      sx={{
        position: 'relative',
        width: w[0],
        height: h[0],
        [`@media (min-width: ${media?.md || 500}px)`]: {
          width: w[1],
          height: h[1],
        },
        [`@media (min-width: ${media?.lg || 900}px)`]: {
          width: w[2],
          height: h[2],
        },
      }}
    >
      {children}
    </Box>
  </>
);
