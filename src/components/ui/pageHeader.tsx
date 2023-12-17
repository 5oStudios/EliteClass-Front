import {
  ActionIcon,
  Affix,
  Card,
  Group,
  Skeleton,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';

export const PageHeader = ({
  title,
  rightSection = null,
  path = null,
  headerButton = false,
}: {
  rightSection?: ReactNode;
  title: ReactNode;
  path?: string | null;
  headerButton?: boolean;
}) => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  return (
    <>
      <Affix zIndex={100} position={{ top: 0, left: 0, right: 0 }}>
        <Card
          radius={0}
          p={0}
          sx={{
            //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
            backgroundColor: colorScheme == 'dark' ? '#333333' : '#ffffff', //'transparent',
            // zIndex : 100
          }}
        >
          <Stack justify="center" sx={{ minHeight: 70, paddingLeft: 10 }}>
            <Group noWrap position="apart">
              <Group noWrap>
                <ActionIcon
                  id="btn-headerBack"
                  variant="transparent"
                  onClick={
                    typeof window !== 'undefined' && window.history.state.idx === 0
                      ? () => router.replace('/')
                      : path
                      ? () => router.push(path)
                      : () => router.back()
                  }
                >
                  <ArrowLeftIcon className="rtl" width={40} height={40} />
                </ActionIcon>
                {!title ? (
                  <Skeleton radius={8} height={30} width={100} />
                ) : (
                  <Text sx={{ lineHeight: 1.1, color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                    <EllipsisText text={title || ''} length={60} />
                  </Text>
                )}
              </Group>
              {rightSection}
            </Group>
          </Stack>
        </Card>
      </Affix>
      <Space h={80} />
    </>
  );
};
