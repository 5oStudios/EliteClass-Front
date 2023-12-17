import { ActionIcon, Avatar, Center, Container, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import { Clock, SocialShare, Star } from '@/src/constants/icons';
import Image from 'next/image';
import Link from 'next/link';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import ImageWithFallback from './ImageWithFeedback';
import { WhatsAppIcon } from '@/src/constants/icons/whastsApp';

type CourseStatsProps = {
  rating: number;
  ratingCount: number;
  duration: string;
  instructor: string;
  instructorAvatar: string;
  discount_price: number;
  id: string;
  onWhatsApp: any;
  onShare: any;
  alreadyPurchased: any;
  hideWhatsApp: any;
};

export const CourseStats = (props: CourseStatsProps) => {
  const {
    discount_price,
    rating,
    duration,
    instructor,
    ratingCount,
    instructorAvatar,
    id,
    alreadyPurchased,
    onWhatsApp,
    hideWhatsApp,
    onShare,
  } = props;
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  return (
    <>
      <Container sx={{ background: '#F6F6F6', maxWidth: '100vw' }}>
        <Center sx={{ width: '100%', paddingTop: '12px', paddingBottom: '6px' }}>
          <Stack sx={{ width: '100%' }}>
            <Stack align="center" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Group sx={{ display: 'flex' }}>
                <Text size="xs" weight={400} sx={{ color: '#000', fontSize: '12px' }}>
                  {t['courses-details'].course_by}:{' '}
                </Text>
                <Group>
                  {/* <Avatar size="sm" radius="xl">
                    {instructorAvatar && (
                      <ImageWithFallback
                        src={instructorAvatar}
                        fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${instructor}`}
                        layout="fill"
                      />
                    )}
                  </Avatar> */}
                  <Link href={`/instructors/${id}`} passHref>
                    <Text size="xs" sx={{ color: '#298EAE', cursor: 'pointer', fontSize: '12px' }}>
                      {instructor}
                    </Text>
                  </Link>
                </Group>
              </Group>

              <Group spacing={10}>
                {alreadyPurchased && hideWhatsApp !== null && (
                  <Link href={onWhatsApp} passHref>
                    <ActionIcon id="btn-whatsApp" variant="transparent">
                      <WhatsAppIcon />
                    </ActionIcon>
                  </Link>
                  // </ActionIcon>
                )}
                <ActionIcon id="btn-courseShare" variant="transparent" onClick={onShare}>
                  <SocialShare color={'#000'} />
                </ActionIcon>
              </Group>

              {/* <Text sx={{ color: '#82B1CF' }}>
                {discount_price == 0 ? `FREE` : `${discount_price}KWD`}
              </Text> */}
            </Stack>
            {/* <Group>
              <Text size="xs" weight={400} sx={{ color: '#939393' }}>
                {t['courses-details'].course_by}:{' '}
              </Text>
              <Group>
                <Avatar size="sm" radius="xl">
                  {instructorAvatar && (
                    <ImageWithFallback
                      src={instructorAvatar}
                      fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${instructor}`}
                      layout="fill"
                    />
                  )}
                </Avatar>
                <Link href={`/instructors/${id}`} passHref>
                  <Text size="xs" sx={{ color: '#82B1CF', cursor: 'pointer' }}>
                    {instructor}
                  </Text>
                </Link>
              </Group>
            </Group> */}
          </Stack>
        </Center>
      </Container>
    </>
  );
};
