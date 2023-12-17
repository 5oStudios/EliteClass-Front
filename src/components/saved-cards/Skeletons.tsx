import { Skeleton } from '@mantine/core';

export const Skeletons = () => {
  return (
    <>
      <Skeleton height={180} width="100%" radius={8} sx={{ opacity: 0.7 }} />
      <Skeleton height={180} width="100%" radius={8} sx={{ opacity: 0.7 }} />
      <Skeleton height={180} width="100%" radius={8} sx={{ opacity: 0.7 }} />
    </>
  );
};
