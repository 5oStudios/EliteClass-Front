import { Seo } from '@/components/seo';
import { InstructorCard } from '@/components/ui/cards/instructor-card';
import {
  ActionIcon,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import React from 'react';
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { useInfiniteQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import {
  GridLayoutIcon,
  GridLayoutIconWhite,
  SingleColIcon,
  SingleColIconWhite,
} from '@/src/constants/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

async function getData({ pageParam = 1 }) {
  const dataFromServer = await axios.post(`instructors?page=${pageParam}`, {
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    //@ts-ignore
    ...(isUser === undefined && { category_id: JSON.parse(getCookie('initial_country')).id }),
  });
  const data: any = {
    results: dataFromServer.data.data,
    next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
  };
  return data;
}

const isUser = getCookie('access_token');

const InstructorsPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme } = useMantineColorScheme();
  // language
  const [layoutGrid, setLayoutGrid] = React.useState(true);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = useInfiniteQuery<any, any>('instructors', getData, {
    getNextPageParam: (lastPage) => lastPage.next,
  });

  if (isError) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
    }
  }

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Instructors" description="Best Lms" path="Courses" />
      <Box component="main" mb={30}>
        <PageHeader
          title={t.instructors}
          rightSection={
            <Group mr={10}>
              <ActionIcon variant="transparent" onClick={() => setLayoutGrid(!layoutGrid)}>
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
        <Container p={5}>
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<></>}
          >
            {data?.pages !== null ? (
              <SimpleGrid
                sx={{
                  '@media screen and (max-width: 310px)': {
                    gridTemplateColumns: layoutGrid ? '1fr' : '1fr',
                  },

                  gridTemplateColumns: layoutGrid ? 'repeat(2,minmax(142px,300px))' : '1fr',
                  '@media (orientation: landscape)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(auto-fit, minmax(150px,1fr))'
                      : '1fr 1fr',
                  },
                }}
              >
                {data?.pages?.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.results.map((instructor: any) => (
                      <InstructorCard
                        key={instructor?.id}
                        href={`/instructors/${instructor?.id}`}
                        layoutGrid={layoutGrid}
                        name={instructor?.fname}
                        image_path={
                          instructor?.image || '/assets/images/placeholders/instructor.png'
                        }
                        job_title={instructor?.short_info || ''}
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
            ) : (
              <NoRecordFound />
            )}
          </InfiniteScroll>
        </Container>
      </Box>
    </>
  );
};

export default InstructorsPage;
