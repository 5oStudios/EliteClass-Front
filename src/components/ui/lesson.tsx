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
  Card,
  SimpleGrid,
  Group,
  ActionIcon,
  Affix,
  RingProgress,
} from '@mantine/core';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import React, { ReactNode, useState } from 'react';
import { NoSave } from '@/src/constants/icons/no-save';
import { NoCourse } from '@/src/constants/icons/no-course';
import { Right } from '@/src/constants/icons/right';
import { Down } from '@/src/constants/icons/down';
import { Left } from '@/src/constants/icons/left';
import { Play } from '@/src/constants/icons/play';
import { Pause } from '@/src/constants/icons/pause';

type Props = {
  children: ReactNode;
  height: string;
};

export const Lesson = ({ onClick, chapter, index, playing }: any) => {
  const { colorScheme } = useMantineColorScheme();
  const [play, setPlay] = useState(false);

  return (
    <Stack spacing={5} px={'8vw'} my={'1.5vh'} sx={{ justifyContent: 'center' }}>

      <Text
        transform="capitalize"
        weight={500}
        sx={{ fontSize: 14, color: colorScheme == 'dark' ? '#FFDD83' : '#000' }}
      >
        {chapter.chapter_name}
      </Text>
      <Group noWrap spacing={5}>
        <Text transform="capitalize" weight={500} color={'#298EAE'} sx={{ fontSize: 12 }}>
          {'6:10'}
        </Text>
        <Text weight={500} color={'#298EAE'} sx={{ fontSize: 12 }}>
          {'am'}
        </Text>
      </Group>
      <Stack
        sx={{
          position: 'absolute',
          right: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          onClick={() => {
            setPlay(!play);
            playing(!play);
          }}
          sx={{
            background: '#FFDD83',
            height: '50px',
            width: '50px',
            borderRadius: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {!play ? <Play /> : <Pause />}
        </Stack>
        <Stack
          sx={{
            position: 'absolute',
            height: '50px',
            width: '50px',
            //background: '#FFDD83',
            borderRadius: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <RingProgress
            size={62}
            thickness={3}
            sections={[{ value: 70, color: 'blue' }]}
            //sx = {{position : 'absolute', right : 0, top : 0}}
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            label={
              null
              // <Text color="blue" weight={500} align="center" size="xl">
              //   40%
              // </Text>
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

{
  /* <Stack align={'end'}>
          <ActionIcon variant="transparent">
            <ChevronRightIcon className="rtl" width={30} height={30} />
          </ActionIcon>
        </Stack> */
}
{
  /* </SimpleGrid> */
}
