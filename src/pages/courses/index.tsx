import {
  ActionIcon,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Button,
  useMantineColorScheme,
} from '@mantine/core';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
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
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { FilterDrawer } from '@/components/screens/home/filter-drawer';
import { useInfiniteQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import { FilterButton } from '@/components/ui/FilterButton';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

export const CoursesPage = ({
  isMobile,
  userAgent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { slug, type, question_id, answer_id } = router.query;

  //language
  const [layoutGrid, setLayoutGrid] = React.useState(true);
  const { colorScheme } = useMantineColorScheme();
  // ----------------filters -------------------------------
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [rating, setRating] = useState('null');
  const [cost, setCost] = useState<[number, number]>([0, 10000]);
  const [duration, setDuration] = useState<[number, number]>([0, 500]);
  // --------------------------------------------------------
  const [loadNewData, setLoadNewData] = useState(true);
  const { search } = router.query;
  const isBundled = false;
  // const client = useQueryClient();
  // client.invalidateQueries([`courses`, cost, duration, search]);
  console.log('The User Agent is', userAgent);
  const getData = async ({ pageParam = 1 }) => {
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      min_price: cost[0],
      max_price: cost[1],
      min_time: duration[0],
      max_time: duration[1],
      perPage: userAgent.includes('ipad') ? 24 : userAgent.includes('mobile') ? 10 : 80,
      ...(search && { search_text: search }),
      ...(rating != 'null' && { rating: parseFloat(rating) }),
      //@ts-ignore
      ...(isUser === undefined && { category_id: JSON.parse(getCookie('initial_country')).id }),
      //@ts-ignore
      ...(isUser === undefined && { scnd_category_id: JSON.parse(getCookie('initial_type')).id }),
      //@ts-ignore
      ...(isUser === undefined && { sub_category: JSON.parse(getCookie('initial_stage')).id }),
      //@ts-ignore
      ...(isUser === undefined && { ch_sub_category: JSON.parse(getCookie('initial_major')).id }),
    };

    const dataFromServer = await axios.post(`course?page=${pageParam}`, obj);
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
    useInfiniteQuery(['courses', cost, duration, search], getData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: loadNewData,
      onSettled: () => {
        setLoadNewData(false);
        setApplyFilters(false);
      },
    });
  const isUser = getCookie('access_token');
  console.log('courses', data);

  useEffect(() => {
    setLoadNewData(false);
  }, []);

  if (isError) {
    showNotification({
      message: 'Something went wrong',
      color: 'red',
    });
  }

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  const handleFilters = (props: any) => {
    setRating(props.rating);
    setCost(props.cost);
    setDuration(props.duration);
    setLoadNewData(true);
    setIsFilterDrawerOpen(false);
  };
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
                id="btn-coursesLayout"
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
              <FilterButton
                cost={cost}
                duration={duration}
                rating={rating}
                onClick={() => setIsFilterDrawerOpen(true)}
              />
            </Group>
          }
        />

        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          {data?.pages[0].results.length > 0 ? (
            <Container p={5}>
              <SimpleGrid
                sx={{
                  gridTemplateColumns: layoutGrid
                    ? 'repeat(auto-fit, minmax(150px, 1fr))'
                    : 'repeat(auto-fit, minmax(330px, 1fr))',
                  '@media screen and (min-width: 668px)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(4, minmax(180px, 1fr))'
                      : 'repeat(2, minmax(330px, 1fr))',
                  },
                  // gridTemplateColumns: layoutGrid ? 'repeat(4,minmax(auto,300px))' : '1fr',
                  '@media (orientation: landscape)': {
                    gridTemplateColumns: layoutGrid ? 'repeat(4, minmax(150px,1fr))' : '1fr 1fr',
                  },
                  '@media screen and (max-width: 580px)': {
                    // here are set one card design on see all courses
                    gridTemplateColumns: layoutGrid
                      ? data?.pages[0].results.length > 1
                        ? 'repeat(2,minmax(auto,300px))'
                        : 'repeat(2,minmax(auto,182px))'
                      : '1fr',
                    // gridTemplateColumns: layoutGrid ? 'repeat(2,minmax(auto,300px))' : '1fr',
                  },
                  '@media screen and (max-width: 310px)': {
                    gridTemplateColumns: layoutGrid ? '1fr' : '1fr',
                  },
                }}
              >
                {data?.pages?.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.results.map((course: any) => (
                      <CoursesCard
                        id={course?.id}
                        // href={`/courses/${course?.id}`}
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
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        setIsOpen={setIsFilterDrawerOpen}
        handleFilter={handleFilters}
        setApplyFilters={setApplyFilters}
        applyFilters={applyFilters}
      />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const userAgent: any =
    typeof window === 'undefined'
      ? ctx.req.headers['user-agent']?.toLowerCase()
      : navigator.userAgent.toLowerCase();
  const isMobile: any = /iphone|ipod|ipad|android|blackberry|windows phone/gi?.test(userAgent);

  return {
    props: {
      isMobile,
      userAgent,
    },
  };
};

export default CoursesPage;

// signup --> otp --> login --> onboarding --> home
