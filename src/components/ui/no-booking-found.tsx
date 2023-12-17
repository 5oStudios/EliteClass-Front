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

export const NoBookingFound = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language
  return (
    <Stack align="center" sx={{ justifyContent: 'center' }} mt={50} px={50}>
      <Box ml="-20px" sx={{ maxWidth: '100%' }}>
        {colorScheme == 'dark' ? <NoPageWhite /> : <NoPage />}
      </Box>
      <Text
        align="center"
        sx={{
          fontSize: 20,
          color: colorScheme == 'dark' ? '#E2BB50' : '#000000',
          fontWeight: 600,
        }}
      >
        {t.no_booking}
      </Text>
      <Text align="center" sx={{ fontSize: 15, color: '#298EAE', fontWeight: 500 }}>
        {t.no_booking_exp}
      </Text>
      {/* <Button title="try-again" onClick={() => router.replace('/')} /> */}
    </Stack>
  );
};

// baul@gmail.com
// 123456
