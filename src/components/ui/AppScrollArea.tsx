import { ScrollArea } from '@mantine/core';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  height: string;
};

export const AppScrollArea = ({ children, height }: Props) => {
  return (
    <div>
      <ScrollArea sx={{ minHeight: height }} scrollbarSize={10}>
        {children}
      </ScrollArea>
    </div>
  );
};
