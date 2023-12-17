import {
  ActionIcon,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Seo } from '@/components/seo';
import { LiveSessionCard } from '@/components/ui/cards/live-session-card';
import {
  GridLayoutIcon,
  GridLayoutIconWhite,
  SingleColIcon,
  SingleColIconWhite,
} from '@/src/constants/icons';
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { FilterDrawer } from '@/components/screens/home/filter-drawer';
import { getCookie } from 'cookies-next';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FilterButton } from '@/components/ui/FilterButton';
import { PageHeader } from '@/components/ui/pageHeader';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const LiveSessions = ({
  isMobile,
  userAgent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [layoutGrid, setLayoutGrid] = React.useState(true);
  const { colorScheme } = useMantineColorScheme();
  // ----------------filters -------------------------------
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [rating, setRating] = useState('null');
  const [cost, setCost] = useState<[number, number]>([0, 10000]);
  const [applyFilters, setApplyFilters] = useState(false);
  // --------------------------------------------------------

  const [loadNewData, setLoadNewData] = useState(true);
  const { search } = router.query;

  const client = useQueryClient();
  client.invalidateQueries([`meetings`, cost, rating, search]);

  const getData = async ({ pageParam = 1 }) => {
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      // search_text:"for",
      min_price: cost[0],
      max_price: cost[1],
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
      perPage: userAgent.includes('ipad') ? 24 : userAgent.includes('mobile') ? 10 : 80,
    };
    const dataFromServer = await axios.post(`live/meetings?page=${pageParam}`, obj);
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data.data,
      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['meetings', cost, rating, search],
    getData,
    {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: loadNewData,
      onSettled: () => {
        setLoadNewData(false);
        setApplyFilters(false);
      },
    }
  );

  const isUser = getCookie('access_token');

  const handleFilters = (props: any) => {
    setRating(props.rating);
    setCost(props.cost);
    setLoadNewData(true);
    setIsFilterDrawerOpen(false);
  };

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Live-sessions" description="Best Lms" path="/live-sessions" />
      <Box component="main" mb={30}>
        <Container p={0}>
          <PageHeader
            title={t['live-sessions']}
            rightSection={
              <Group mr={10}>
                <ActionIcon id="btn-liveSessionsLayout" variant="transparent" onClick={() => setLayoutGrid(!layoutGrid)}>
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
                <FilterButton cost={cost} onClick={() => setIsFilterDrawerOpen(true)} />
              </Group>
            }
          />
        </Container>
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          <Container p={5}>
            {data?.pages[0].results.length > 0 ? (
              <Container p={0}>
                <SimpleGrid
                  sx={{
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(4,minmax(auto,300px))'
                      : 'repeat(auto-fit, minmax(330px, 1fr))',
                    '@media (orientation: landscape)': {
                      gridTemplateColumns: layoutGrid ? 'repeat(4, minmax(150px,1fr))' : '1fr 1fr',
                    },

                    '@media screen and (max-width: 580px)': {
                      gridTemplateColumns: layoutGrid ? 'repeat(2,minmax(auto,300px))' : '1fr',
                    },

                    '@media screen and (max-width: 310px)': {
                      gridTemplateColumns: layoutGrid ? '1fr' : '1fr',
                    },
                  }}
                >
                  {data?.pages.map((packages: any, i) =>
                    packages.results.map((course: any) => {
                      return (
                        <LiveSessionCard
                          //href={`/live-sessions/${course?.id}`}
                          href={{
                            pathname: `/live-sessions/${course?.id}`,
                            query: {
                              id: course?.id,
                              ///type: course?.type,
                            },
                          }}
                          typ={'live'}
                          layoutGrid={layoutGrid}
                          key={course?.id}
                          {...course}
                        />
                      );
                    })
                  )}

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
          </Container>
        </InfiniteScroll>
      </Box>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        setIsOpen={setIsFilterDrawerOpen}
        handleFilter={handleFilters}
        haveDuration={false}
        haveRating={false}
        applyFilters={applyFilters}
        setApplyFilters={setApplyFilters}
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
export default LiveSessions;
