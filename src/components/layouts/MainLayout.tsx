import { Box } from '@mantine/core';
import React from 'react';
import { TabsMenu } from '../screens/home/tabs-menu';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => (
  <>
    {children}
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 10 }}>
      <TabsMenu />
    </Box>
  </>
);
