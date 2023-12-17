import { ActionIcon, Card, Container, Group, Skeleton, Text } from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import React, { ReactNode } from 'react';

type Props = {
  rightSection: ReactNode;
  title: string;
  handleClose: any;
};

export const DrawerHeader = ({ title, rightSection, handleClose }: Props) => {
  return (
    <>
      <Container p={0} sx={{ minWidth: '100vw' }}>
        <Card
          radius={0}
          sx={{
            minHeight: 70,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
            paddingLeft: 10,
            display: 'flex',
          }}
        >
          <Group noWrap position="apart" sx={{ width: '100%' }}>
            <ActionIcon
              id="btn-lesssonsBack"
              variant="transparent"
              className="rtl"
              onClick={handleClose}
            >
              <ArrowLeftIcon width={40} height={40} />
            </ActionIcon>
            {title ? (
              <Text
                sx={(theme) => ({ color: theme.colorScheme === 'dark' ? '#EDD491' : '' })}
                mr="auto"
              >
                {title}
              </Text>
            ) : (
              <Skeleton height={30} width={200} radius={8} mr="auto" />
            )}
            {/* {rightSection} */}
          </Group>
        </Card>
      </Container>
    </>
  );
};
