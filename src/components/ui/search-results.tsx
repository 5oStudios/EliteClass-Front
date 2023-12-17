import {
  Anchor,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CoursesCarousal } from '../screens/home/carousals/courses-carousal';
import { LiveSessionCarousal } from '../screens/home/carousals/live-session-carousal';
import { PackagesCarousal } from '../screens/home/carousals/packages-carousal';
import { NoSearchFound } from './no-search-found';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

type Props = {
  title: string;
  path: string;
  counter?: number;
};

const CarousalTitle = ({ title, path, counter }: Props) => {
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  return (
    <Group position="apart" align="center">
      <Text
        transform="capitalize"
        sx={{
          fontSize: '16px',
          '@media screen and (min-width : 740px)': {
            fontSize: 24,
          },
        }}
        weight={500}
      >
        {title}
      </Text>
      <Link href={path} passHref>
        <Anchor
          sx={(theme) => ({
            color: theme.other.placeholderColor,
            '@media screen and (min-width : 740px)': {
              fontSize: 16,
            },
          })}
          size="xs"
        >
          <Box component="span" mr={3}>
            ({counter})
          </Box>
          <span>
            {t['see-all']}
            {/* TODO: Mudassar fix this */}
          </span>
          <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
        </Anchor>
      </Link>
    </Group>
  );
};

export const SearchResults = (props: any) => {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    });
    // @ts-ignore
    setSearch(params.search);
  });

  if (props.resultsLoading) {
    return (
      <Container>
        <Stack>
          <Group position="apart">
            <Skeleton width={90} height={20} radius={8} />
            <Skeleton width={90} height={20} radius={8} />
          </Group>
          <SimpleGrid cols={3}>
            <Skeleton width="100%" height={160} radius={8} />
            <Skeleton width="100%" height={160} radius={8} />
            <Skeleton width="100%" height={160} radius={8} />
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  const { packages, courses, meetings, sessions } = props.searchData ?? {};
  if (packages?.data.length > 0 || courses?.data.length > 0 || meetings?.data.length > 0) {
    return (
      <Container
        p={0}
        fluid
        sx={{
          maxWidth: '100vw',
          height: '80vh',
          overflowY: 'scroll',
        }}
      >
        {packages?.data.length > 0 && (
          <Container p="xs">
            <CarousalTitle
              counter={packages?.total}
              title={t.packages}
              path={`/packages?search=${search}`}
            />
            <Space h="xs" />
              <PackagesCarousal PCarousal={packages?.data} />
            {/* <PackagesCarousal ratio={1.2} slides={[2.3, 3.3]} PCarousal={packages?.data} /> */}
          </Container>
        )}
        {courses?.data.length > 0 && (
          <Container my={0} p="xs">
            <CarousalTitle
              counter={courses?.total}
              title={t.courses}
              path={`/courses?search=${search}`}
            />
            <Space h="xs" />
            <CoursesCarousal CCarousal={courses?.data} />
          </Container>
        )}
        {meetings?.data.length > 0 && (
          <Container my={0} p="xs">
            <CarousalTitle
              counter={meetings?.total}
              title={t['live-sessions']}
              path={`/live-sessions?search=${search}`}
            />
            <Space h="xs" />
            <LiveSessionCarousal show_price LCarousal={meetings?.data} />
          </Container>
        )}
        {sessions?.data.length > 0 && (
          <Container my={0} p="xs">
            <CarousalTitle
              counter={sessions?.total}
              title={t['in-person-sessions']}
              path={`/in-person-sessions?search=${search}`}
            />
            <Space h="xs" />
            <LiveSessionCarousal show_price LCarousal={sessions?.data} />
          </Container>
        )}
      </Container>
    );
  } else {
    return <NoSearchFound />;
  }
};
