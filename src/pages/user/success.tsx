import {
  Button,
  Center,
  Container,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React from 'react';
import { Seo } from '@/components/seo';
import { useRouter } from 'next/router';
import NextImage from 'next/image';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const SuccessPage = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme } = useMantineColorScheme();

  //language

  return (
    <>
      <Seo title="Checkout" description="Best LMS" path="checkout" />
      <main>
        <Space h="xl" />
        <Container>
          <Center>
            <Stack align="center" style={{ marginTop: '12rem' }}>
              <NextImage
                src={`/assets/success${colorScheme == 'dark' ? '-dark' : ''}.svg`}
                priority
                height={250}
                width={250}
                style={{ marginBottom: '2rem' }}
              />
              <Text mt={'10%'}>{t['purchase-completed']}</Text>
              <Button
                id="btn-goToHomeSuccess"
                radius={8}
                type="submit"
                size="md"
                variant="filled"
                sx={{ alignSelf: 'stretch', fontSize: '16px' }}
                onClick={() => {
                  router.replace('/');
                }}
              >
                {t.go_to_home}
              </Button>
            </Stack>
          </Center>
        </Container>
      </main>
    </>
  );
};

export default SuccessPage;
