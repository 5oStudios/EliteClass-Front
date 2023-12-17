import {
  Avatar,
  Box,
  Container,
  Group,
  List,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Text,
  ActionIcon,
  useMantineColorScheme,
  Loader,
  Affix,
} from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import React from 'react';
import { Pill } from '@/components/ui/pill';
import { Reviews } from '../reviews';
import { useRouter } from 'next/router';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import { shimmer, toBase64 } from '@/utils/utils';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';

export const OverviewTab = (data: any) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { course, instructor, whatlearns } = data?.overViewData ?? {};
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const { colorScheme } = useMantineColorScheme();

  // console.log("DATA:", data)
  // console.log("INST:", course)

  return (
    <>
      <Container p={0}>
        <Container p={0}>
          <Text weight={500} component="h2">
            {t['about-course']}
          </Text>
          <Stack style={{ maxHeight: '50vh', overflow: 'scroll' }}>
            <Spoiler
              maxHeight={50}
              styles={(theme) => ({
                content: {
                  padding: 0,
                  fontSize: 12,
                  color: theme?.colorScheme === 'light' ? '#298EAE' : '#fff',
                },
                control: {
                  color: theme?.colorScheme === 'light' ? 'blue' : theme?.colors[5],
                  fontSize: '12px',
                },
              })}
              showLabel={t.more}
              hideLabel=""
            >
              <Box dangerouslySetInnerHTML={{ __html: course?.detail }} />
              <Space h={10} />
            </Spoiler>
          </Stack>
          <Box component="section">
            <Text weight={500} component="h2">
              {t['courses-details'].skills_you_will_gain}
            </Text>
            <Group spacing={7}>
              {course?.course_tags?.map((skill: any, index: number) => (
                <Pill key={index}>{skill}</Pill>
              ))}
            </Group>
          </Box>
          <Box component="section">
            <Text weight={500} component="h2">
              {t['courses-details'].what_we_learn_in_course}
            </Text>
            <List
              type="ordered"
              spacing="sm"
              size="xs"
              styles={{
                root: {
                  listStyleType: 'none',
                },
              }}
            >
              {whatlearns?.map((_skill: any, index: number) => (
                <List.Item key={index} sx={{ color: '#666666' }}>
                  <Group noWrap spacing={3} align="center">
                    <Text size="sm" weight={500} color={'#298EAE'}>
                      {index + 1}-
                    </Text>
                    <Text size="xs" color={'#298EAE'}>
                      {_skill?.detail}
                    </Text>
                  </Group>
                </List.Item>
              ))}
            </List>
          </Box>
          <Space h="md" />
          <Text weight={500}>{t.instructor}</Text>
          <Space h="md" />
        </Container>
        <Container
          sx={{ background: 'white', borderRadius: 5 }}
          py={20}
          px={colorScheme == 'dark' ? undefined : 0}
        >
          <SimpleGrid
            id="row-coursesInstructor"
            sx={{
              gridTemplateColumns: 'max-content 1fr max-content',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              router.push(`/instructors/${instructor?.id}`);
            }}
          >
            <Avatar size="lg" radius="xl">
              {instructor?.image && (
                <ImageWithFallback
                  src={
                    instructor?.image ||
                    `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${instructor?.name}`
                  }
                  layout="fill"
                  fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${instructor?.name}`}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
              )}
            </Avatar>
            <Stack spacing={0}>
              <Text size="xs" weight={500}>
                {instructor?.name}
              </Text>
              <Text size="xs" sx={(theme) => ({ color: theme.other.secondaryWriteColor })}>
                <EllipsisText text={instructor?.short_info || ''} length={60} />
              </Text>
            </Stack>
            <ActionIcon variant="transparent">
              <ChevronRightIcon className="rtl" width={30} height={30} />
            </ActionIcon>
          </SimpleGrid>
        </Container>
        <Space h="md" />
        <Reviews
          refetch={data.refetch}
          reviewData={data.overViewData}
          chapterPurchased={data?.chapterPurchased}
        />
        <Space h={30} />
      </Container>
    </>
  );
};
