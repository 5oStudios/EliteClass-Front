import { ActionIcon, Affix, Box, Button, Container, Space, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Dots } from '@/src/constants/icons';
import { SplashScreen1 } from './SplashScreen1';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const SplashStepper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;

  const handleSkip = () => {
    router.push('/user/onboarding');
  };

  // useEffect(() => {
  //   router.prefetch('/user/onboarding');
  // }, []);

  return (
    <Container sx={{ background: '#EDD491', position: 'relative', minHeight: '100vh' }}>
      <ActionIcon
        onClick={handleSkip}
        variant="transparent"
        sx={{ position: 'absolute', top: 30, right: 30, zIndex: 2 }}
      >
        <Text color="white" weight={500} onClick={handleSkip}>
          {t.skip}
        </Text>
      </ActionIcon>
      <Box sx={{ position: 'absolute', left: 0, top: 90 }}>
        <Dots />
      </Box>
      <Space h={170} />
      <SplashScreen1 />
      <Space h={60} />
      <Affix sx={{ bottom: 10, left: 10, position: 'absolute' }}>
        <Button
          color="blue"
          variant="filled"
          size="md"
          radius="xl"
          fullWidth
          onClick={() => {
            router.push('/user/onboarding');
            setIsLoading(true);
          }}
          loading={isLoading}
          styles={{
            root: {
              maxWidth: '200px',
              margin: 'auto',
            },
            label: { color: 'white' },
            filled: {
              background: '#82B1CF',
              '&:hover': {
                background: '#82B1CF',
              },
            },
          }}
        >
          {t.get_started}
        </Button>
      </Affix>
      <Space h="xl" />
    </Container>
  );
};
