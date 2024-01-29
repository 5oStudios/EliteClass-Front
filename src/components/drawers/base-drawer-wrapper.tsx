import React, { useEffect } from 'react';
import {
  ActionIcon,
  Drawer,
  Group,
  InputWrapper,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';

export const BaseDrawerWrapper = ({
  children,
  title,
  closeEventHandler,
}: {
  children: React.ReactNode;
  title: string;
  closeEventHandler: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  useEffect(() => {
    // Perform action when closeEventHandler changes to false
    if (!closeEventHandler) {
      // Add your action here
      setIsOpen(false);
    }
  }, [closeEventHandler]);
  return (
    <Drawer
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      withCloseButton={false}
      title={
        <Group position="apart" sx={{ width: '100%' }}>
          <Text size="lg" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
            {title}
          </Text>
          <ActionIcon
            id="btn-filterClear"
            onClick={() => setIsOpen(false)}
            sx={{
              position: 'relative',
              right: '-10px',
            }}
          >
            <Text color="blue" size="xs" sx={{ whiteSpace: 'nowrap' }}>
              {t.skip}
            </Text>
          </ActionIcon>
        </Group>
      }
      padding="xl"
      position="bottom"
      styles={{
        header: {
          padding: '0',
          '& > *': {
            width: '100%',
          },
        },
        root: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        title: {
          fontSize: '1.3rem',
        },
        drawer: {
          borderRadius: '20px 20px 0 0',
          height: 'max-content',
          background: colorScheme == 'dark' ? '#333333' : '#FFFFFF',
          //   'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #F4F9FE',
          // '@media (orientation: landscape)': {
          //   height: '80%',
          // },
        },
      }}
    >
      <InputWrapper
        labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
      >
        {children}
      </InputWrapper>
    </Drawer>
  );
};
