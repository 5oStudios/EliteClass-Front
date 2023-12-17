import { Box, Stack, Text, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { NoSearch } from '@/src/constants/icons/no-search';
import { Button } from './Button';
import { NoSearchWhite } from '@/src/constants/icons/no-search-white';
import { NoLive } from '@/src/constants/icons/no-live';
import { NoLiveWhite } from '@/src/constants/icons/no-live-white';
import { Complete } from '@/src/constants/icons/complete';
import { CompleteWhite } from '@/src/constants/icons/complete-white';

export const Completed = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language
  return (
    <Box>
      <Stack align="center" mt={50} px={50}>
        <Box ml="-20px" sx={{ maxWidth: '100%' }}>
          {colorScheme == 'dark' ? <CompleteWhite /> : <Complete />}
        </Box>
        <Text
          align="center"
          sx={{ fontSize: 16, color: '#298EAE', fontWeight: 500, marginTop: -50 }}
        >
          {t['purchase-completed']}
        </Text>
        {/* <Button title = 'get-start'/> */}
      </Stack>
    </Box>
  );
};

// baul@gmail.com
// 123456
