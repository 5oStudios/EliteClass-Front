import { Tabs } from '@mantine/core';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onChange?: (index: number) => void;
};

export const TabsHeader = ({ children, onChange }: Props) => {
  return (
    <div>
      <Tabs
        tabPadding="xs"
        onTabChange={onChange}
        variant="unstyled"
        styles={(theme) => ({
          tabControl: {
            backgroundColor: '#F7F6F5',
            color: theme.colors.gray[9],
            fontSize: theme.fontSizes.sm,
            borderRadius: 20,
            flexGrow: 1,
            height: 32,
            whiteSpace: 'nowrap',
          },
          tabsList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(50px,1fr))',
            width: '100%',
            //padding: '0px 0px 10px 0px',
            borderRadius: 20,
            backgroundColor: '#F7F6F5',
          },
          tabActive: {
            backgroundColor: '#FFDD83',
            color: '#000',
          },
        })}
      >
        {children}
      </Tabs>
    </div>
  );
};
