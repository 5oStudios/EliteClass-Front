// import { coursesData } from '@/src/constants/data/carousal-data';
import {
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  GridLayoutIcon,
  GridLayoutIconWhite,
  SingleColIcon,
  SingleColIconWhite,
} from '@/src/constants/icons';
import { CoursesCard } from '@/components/ui/cards/courses-card';
import { Seo } from '@/components/seo';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { NoRecordFound } from '@/components/ui/no-record-found';
// import { coursesData } from '@/src/constants/data/carousal-data';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery } from 'react-query';
import { getCookie } from 'cookies-next';
import { showNotification } from '@mantine/notifications';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PageHeader } from '@/components/ui/pageHeader';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

export const CoursesPage = () => {
  // packages and instructor see all courses

  //language
  const router: any = useRouter();

  const t = router.locale === 'en-us' ? en : ar;
  //language
  const { slug } = router.query;
  const [isBundled, setIsBundled] = useState(true);
  const [layoutGrid, setLayoutGrid] = React.useState(true);
  const { colorScheme } = useMantineColorScheme();
  const [loadNewData, setLoadNewData] = useState(true);
  console.log();
  const getData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(
      `bundle/courses/${slug}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&page=${pageParam}`
    );
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }
    console.log({ dataFromServer });

    const data: any = {
      results: dataFromServer.data.data,
      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['package/courses'], getData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: loadNewData,
      onSettled: () => {
        setLoadNewData(false);
        console.log('package/courses', data);
      },
    });

  const isUser = getCookie('access_token');

  if (isError) {
    showNotification({
      message: 'Something went wrong',
      color: 'red',
    });
  }

  useEffect(() => {
    setLoadNewData(false);
  }, []);

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Courses" description="Best Lms" path="Courses" />
      <Box component="main" mb={30}>
        <PageHeader
          title={t.courses}
          rightSection={
            <Group mr={10}>
              <ActionIcon
                id="btn-packageCoursesLayout"
                variant="transparent"
                onClick={() => setLayoutGrid(!layoutGrid)}
              >
                {layoutGrid ? (
                  colorScheme == 'dark' ? (
                    <GridLayoutIconWhite />
                  ) : (
                    <GridLayoutIcon />
                  )
                ) : colorScheme == 'dark' ? (
                  <SingleColIconWhite />
                ) : (
                  <SingleColIcon />
                )}
              </ActionIcon>
            </Group>
          }
        />
        <Space h="lg" />
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          {data?.pages[0].results.length > 0 ? (
            <Container>
              <SimpleGrid
                sx={{
                  '@media screen and (max-width: 310px)': {
                    gridTemplateColumns: layoutGrid ? '1fr' : '1fr',
                  },
                  gridTemplateColumns: layoutGrid
                    ? 'repeat(auto-fit, minmax(150px, 1fr))'
                    : 'repeat(auto-fit, minmax(330px, 1fr))',
                  '@media screen and (min-width: 668px)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(auto-fit, minmax(180px, 1fr))'
                      : 'repeat(auto-fit, minmax(330px, 1fr))',
                  },
                  // gridTemplateColumns: layoutGrid
                  //   ? 'repeat(auto-fit,minmax(auto,300px))'
                  //   : 'repeat(auto-fit, minmax(330px, 1fr))',
                  '@media (orientation: landscape)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(auto-fit, minmax(150px,1fr))'
                      : '1fr 1fr',
                  },
                }}
              >
                {data?.pages?.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.results.map((course: any) => (
                      <CoursesCard
                        id={course?.id}
                        href={{
                          pathname: `/courses/${course?.id}`,
                          query: { isBundled },
                        }}
                        layoutGrid={layoutGrid}
                        in_wishlist
                        key={course?.id}
                        {...course}
                      />
                    ))}
                  </React.Fragment>
                ))}
                {isFetchingNextPage && (
                  <>
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                  </>
                )}
              </SimpleGrid>
            </Container>
          ) : (
            <NoRecordFound />
          )}
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default CoursesPage;
