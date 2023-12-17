import { Skeleton } from '@mantine/core';
import React from 'react';

export const CardSkeleton = ({ isLoading, howmany }: { isLoading: boolean; howmany: number }) => (
  <>
    {Array(howmany || 1).fill(
      <Skeleton radius={8} color="primary" visible={isLoading} height={150} width="100%" />
    )}
  </>
);
