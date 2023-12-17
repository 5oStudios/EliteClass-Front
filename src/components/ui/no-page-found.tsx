import { Box, Stack, Text, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { SignIn } from '@/src/constants/icons/sign-in';
import { Button } from './Button';
import { NoPage } from '@/src/constants/icons/no-page';
import { NoPageWhite } from '@/src/constants/icons/no-page-white';
import { NewButton } from '@/src/constants/icons/new-button';
import { NoCourse } from '@/src/constants/icons/no-course';
import { AppleIcon } from '@/src/constants/icons/apple';

export const NoPageFound = ({ asPath }: any) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language
  return (
    <Stack align="center" mt={200} px={50}>
      <Box ml="-20px" sx={{ maxWidth: '100%' }}>
        {colorScheme == 'dark' ? <NoPageWhite /> : <NoPage />}
      </Box>
      <Text
        align="center"
        sx={{
          fontSize: 24,
          color: colorScheme == 'dark' ? '#E2BB50' : '#000000',
          fontWeight: 600,
        }}
      >
        {t.no_page}
      </Text>
      <Text align="center" sx={{ fontSize: 16, color: '#298EAE', fontWeight: 500 }}>
        {t.no_page_exp}
      </Text>
      <Text
        align="center"
        sx={{ marginTop: '2rem', fontSize: 16, color: '#E2BB50', fontWeight: 500 }}
      >
        {asPath}
      </Text>
      <Button title="Return-Home" onClick={() => router.replace('/')} />
    </Stack>
  );
};

// baul@gmail.com
// 123456
