import { NewButton } from '@/src/constants/icons/new-button';
import { NewButtonWhite } from '@/src/constants/icons/new-button-white';
import { toBase64 } from '@/utils/utils';
import {
  Box,
  Center,
  Loader,
  ScrollArea,
  Text,
  useMantineColorScheme,
  Image,
  Stack,
  BackgroundImage,
} from '@mantine/core';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import React, { ReactNode } from 'react';
import { NoSave } from '@/src/constants/icons/no-save';
import { NoCourse } from '@/src/constants/icons/no-course';

type Props = {
  children: ReactNode;
  height: string;
};

export const Button = ({ loading = false, onClick, btnId, title = 'get-start' }: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  return (
    <Stack
      sx={{
        marginTop: 50,

        '@media only screen and (min-width: 580px)': {
          marginTop: 20,
        },
      }}
    >
      <Stack
        id={btnId}
        onClick={onClick}
        sx={{
          width: 180,
          height: 90,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',

          '@media only screen and (min-width: 580px)': {
            width: '100%',
            height: 'auto',
          },
        }}
      >
        <BackgroundImage
          src={colorScheme == 'dark' ? '/assets/newButtonWhite.svg' : '/assets/newButton.svg'}
          sx={{
            width: '180px',
            height: '90px',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',

            '@media only screen and (min-width: 580px)': {
              width: 'auto',
              minWidth: '255px',
              height: 'auto',
              padding: '60px',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            },

            '@media only screen and (min-width: 850px)': {
              minWidth: '332px',
              // padding: '80px 130px',
            },
          }}
        >
          <Center sx={{ height: '100%' }}>
            {/* {colorScheme == 'dark' ? (
          <Image src={'/assets/newButtonWhite.svg'} />
        ) : (
          <Image src={'/assets/newButton.svg'} />
        )} */}
            {loading ? (
              <Loader sx={{}} color={colorScheme == 'dark' ? '#FFDD83' : '#000000'} size={30} />
            ) : (
              <Text
                sx={{
                  fontSize: '2rem',
                  '@media only screen and (max-width: 1024px)': {
                    fontSize: '3.5vw',
                    // padding: '80px 130px',
                  },
                  // position: 'absolute',
                  color: colorScheme == 'dark' ? '#FFDD83' : 'Black',
                }}
                weight={500}
              >
                {
                  //@ts-ignore
                  t[`${title}`]
                }
              </Text>
            )}
          </Center>
        </BackgroundImage>
      </Stack>
    </Stack>
  );
};
