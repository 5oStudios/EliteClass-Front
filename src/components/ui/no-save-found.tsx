import { Box, Stack, Text, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { NoSearch } from '@/src/constants/icons/no-search';
import { Button } from './Button';
import { NoSearchWhite } from '@/src/constants/icons/no-search-white';
import { NoSaveWhite } from '@/src/constants/icons/no-save-white';
import { NoSave } from '@/src/constants/icons/no-save';

export const NoSaveFound = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language
  return (
    <Box>
      <Stack align="center" mt={50} px={50}>
        <Box ml="-20px" sx={{ maxWidth: '100%' }}>
          {colorScheme == 'dark' ? <NoSaveWhite /> : <NoSave />}
        </Box>
        <Text
          align="center"
          sx={{
            fontSize: 16,
            color: colorScheme == 'dark' ? '#E2BB50' : '#000000',
            fontWeight: 600,
            marginTop: -50,
          }}
        >
          {t.no_save}
        </Text>
        <Text align="center" sx={{ fontSize: 16, color: '#298EAE', fontWeight: 500 }}>
          {t.no_save_exp}
        </Text>
        {/* <Button title = 'get-start'/> */}
      </Stack>
    </Box>
  );
};

// baul@gmail.com
// 123456
