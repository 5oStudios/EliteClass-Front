import {
  ActionIcon,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Space,
  useMantineColorScheme,
} from '@mantine/core';
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
import axios from '@/components/axios/axios.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { useInfiniteQuery } from 'react-query';
import { PageHeader } from '@/components/ui/pageHeader';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const CoursesPage = () => {
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { slug, type, question_id, answer_id } = router.query;
  const [layoutGrid, setLayoutGrid] = React.useState(true);
  const { colorScheme } = useMantineColorScheme();
  const [loadNewData, setLoadNewData] = useState(true);

  const getData = async ({ pageParam = 1 }) => {
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      instructor_id: slug,
    };
    const dataFromServer = await axios.post(`instructor/courses?page=${pageParam}`, obj);
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data.data,
      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };
  const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['instructors/courses'], getData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: loadNewData,
      onSettled: () => {
        setLoadNewData(false);
        console.log('instructors/courses', data);
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
            <>
              <Group mr={10}>
                <ActionIcon id="btn-instructorCoursesLayout" variant="transparent" onClick={() => setLayoutGrid(!layoutGrid)}>
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
            </>
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
                  // border: '1px solid red',
                  // width: '30%',
                  gridTemplateColumns: layoutGrid
                    ? 'repeat(auto-fit, minmax(150px, 1fr))'
                    : 'repeat(auto-fit, minmax(330px, 1fr))',
                    '@media screen and (max-width: 580px)': {
                      // here are set one card design on see all courses
                      gridTemplateColumns: layoutGrid ? data?.pages[0].results.length > 1 ? 'repeat(2,minmax(auto,300px))' : 'repeat(2,minmax(auto,182px))' : '1fr',
                      // gridTemplateColumns: layoutGrid ? 'repeat(2,minmax(auto,300px))' : '1fr',
                    }, 
                  '@media screen and (min-width: 668px)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(4,minmax(auto,300px))'
                      : data?.pages[0].results.length <= 2
                      ? 'repeat(4,minmax(auto,330px))'
                      : 'repeat(auto-fit, minmax(330px, 1fr))',
                  },
                }}
              >
                {data?.pages?.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.results.map((course: any) => (
                      <CoursesCard
                        id={course?.id}
                        href={`/courses/${course?.id}`}
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
