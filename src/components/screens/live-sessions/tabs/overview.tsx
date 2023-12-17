import { CalendarIcon, Clock } from '@/src/constants/icons';
import {
  Avatar,
  Box,
  Card,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronRightIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import moment from 'moment-timezone';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import Link from 'next/link';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import useNextBlurhash from 'use-next-blurhash';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/utils';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';

export const LiveSessionOverviewTab = ({
  divHeight1,
  divHeight2,
  divHeight3,
  showLocation = false,
  alreadyPurchased,
  divHeight4 = alreadyPurchased && showLocation ? 200 : 0,
  ...props
}: any) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Stack
        spacing={0}
        sx={{
          minHeight: 'calc(100vh - 172px)',
          //gridTemplateRows: '1fr max-content',
          //backgroundColor: 'yellow',
        }}
      >
        <Stack spacing={0} px={8} mt={20}>
          <Group position="apart" pb={20}>
            <Stack>
              <SimpleGrid sx={{ gridTemplateColumns: '30px 1fr', gap: 0 }}>
                <CalendarIcon color={colorScheme == 'light' ? '#200E32' : '#EDD491'} />
                <Text
                  size="sm"
                  dir="ltr"
                  align="left"
                  sx={{
                    color: '#939393',
                  }}
                >
                  {moment
                    .utc(props.livetabdata?.date_time)
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format('D MMM, YYYY')}
                </Text>
              </SimpleGrid>
              <SimpleGrid sx={{ gridTemplateColumns: '30px 1fr', gap: 0, marginLeft: '3px' }}>
                <Clock color={colorScheme == 'light' ? '#200E32' : '#EDD491'} />
                <Text
                  size="sm"
                  dir="ltr"
                  align="left"
                  sx={{
                    color: '#939393',
                  }}
                >
                  {moment
                    .utc(props.livetabdata?.date_time)
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format('hh:mm a')}
                </Text>
              </SimpleGrid>
            </Stack>
            <Text size="xl" weight={500} mt={-5} sx={{ alignSelf: 'start', color: '#82B1CF' }}>
              {parseInt(props.livetabdata?.discount_price || 0) == 0
                ? `${t.free}`
                : `${parseInt(props.livetabdata?.discount_price || 0)}KWD`}
            </Text>
          </Group>
          <Divider sx={{ borderColor: '#E4F2FF' }} />
          <Container
            p={0}
            sx={{
              height: `calc(100vh - ${divHeight1 + divHeight2 + divHeight3 + 40}px)`,
              overflow: 'scroll',
              width: '100%',
              //background: 'red',
            }}
          >
            {alreadyPurchased && showLocation && (
              <Stack
                py={20}
                style={
                  {
                    //background : 'red',
                    // height : '250px'
                    //maxHeight: `calc(100vh - ${divHeight1 + divHeight2 + divHeight3 + 80}px)`,
                    //backgroundColor: 'white',
                  }
                }
              >
                <Text weight={500}>{t['session-details'].location}</Text>
                <Stack sx={{ width: '100%' }}>
                  <Text sx={{ fontSize: 12 }}>{props.livetabdata?.location}</Text>
                  {props.livetabdata?.google_map_link !== null && (
                    <Link href={props.livetabdata?.google_map_link}>
                      <Box sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
                        <Text sx={{ fontSize: 12, color: 'blue' }}>{`${props.livetabdata?.google_map_link}`}</Text>
                      </Box>
                    </Link>
                  )}
                </Stack>
              </Stack>
            )}

            <Stack
              py={20}
              style={{
                maxHeight: `calc(100vh - ${divHeight1 + divHeight2 + divHeight3}px)`,
                //backgroundColor: 'white',
              }}
            >
              <Text weight={500}>{t['session-details'].about_this_livesession}</Text>
              <Stack style={{ overflow: 'scroll' }}>
                <Spoiler
                  maxHeight={50}
                  styles={{
                    content: {
                      padding: 0,
                      fontSize: 12,
                    },
                    control: {
                      color: colorScheme == 'light' ? 'blue' : '#EDD491',
                      fontSize: '12px',
                    },
                  }}
                  showLabel={t.more}
                  hideLabel=""
                >
                  <Box
                    pb={5}
                    sx={{ color: '#6B6666' }}
                    dangerouslySetInnerHTML={{ __html: props.livetabdata?.agenda }}
                  />
                </Spoiler>
              </Stack>
            </Stack>
          </Container>
        </Stack>
        <Stack
          spacing={0}
          //sx={{ position: 'absolute', bottom: 0 }}
          //sx={{ background: 'blue' }}
        >
          <Text size="lg" p={15}>
            {t.instructor}
          </Text>

          <Card
            sx={{ cursor: 'pointer', width: '100vw' }}
            onClick={() => {
              router.push(`/instructors/${props.livetabdata?.instructor?.id}`);
            }}
          >
            <SimpleGrid
              sx={{ gridTemplateColumns: 'max-content 1fr max-content', alignItems: 'center' }}
            >
              <Avatar size="lg" radius="xl">
                <ImageWithFallback
                  src={
                    props.livetabdata?.instructor.image ||
                    `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${props.livetabdata?.instructor?.name}`
                  }
                  layout="fill"
                  placeholder="blur"
                  fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${props.livetabdata?.instructor?.name}`}
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
              </Avatar>
              <Stack spacing={0}>
                <Text
                  size="xs"
                  weight={500}
                  sx={(theme) => ({ color: theme?.other?.headingColor })}
                >
                  {props.livetabdata?.instructor?.name}
                </Text>
                <Text size="xs" sx={(theme) => ({ color: theme.other.secondaryWriteColor })}>
                  <EllipsisText
                    text={props.livetabdata?.instructor?.short_info || ''}
                    length={60}
                  />
                </Text>
              </Stack>
              <ChevronRightIcon className="rtl" width={30} height={30} />
            </SimpleGrid>
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
