import {
  ActionIcon,
  Box,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Filter,
  GridLayoutIcon,
  GridLayoutIconWhite,
  SingleColIcon,
  SingleColIconWhite,
} from '@/src/constants/icons';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { PackagesCard } from '@/components/ui/cards/packages-card';
import { Seo } from '@/components/seo';
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { FilterDrawer } from '@/components/screens/home/filter-drawer';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCookie } from 'cookies-next';
import { FilterButton } from '@/components/ui/FilterButton';
import { PageHeader } from '@/components/ui/pageHeader';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const PackagesPage = ({
  respData,
  initial_country,
  initial_type,
  initial_stage,
  initial_major,
  isSkipTutorial,
  isMobile,
  userAgent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme } = useMantineColorScheme();
  //language
  const [layoutGrid, setLayoutGrid] = React.useState(true);
  // ----------------filters -------------------------------
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [rating, setRating] = useState('null');
  const [cost, setCost] = useState<[number, number]>([0, 10000]);
  const [duration, setDuration] = useState<[number, number]>([0, 500]);
  // --------------------------------------------------------
  const [loadNewData, setLoadNewData] = useState(true);
  const { search } = router.query;

  const client = useQueryClient();
  client.invalidateQueries([`packages`, cost, rating, search]);

  const getData = async ({ pageParam = 1 }) => {
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      min_price: cost[0],
      max_price: cost[1],
      min_time: duration[0],
      max_time: duration[1],
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
    const DataObj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      min_price: 0,
      max_price: 10000,
      min_time: 0,
      max_time: 10000,
      rating: 0,
    };
    const dataFromServer = await axios.post(
      initial_country || initial_type || initial_stage || initial_major || isSkipTutorial
        ? `bundle/courses?page=${pageParam}`
        : 'bundle/courses',
      initial_country || initial_type || initial_stage || initial_major || isSkipTutorial
        ? obj
        : DataObj
    );
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data.data,

      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  const isUser = getCookie('access_token');

  const { refetch, data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['packages', cost, duration, rating, search], getData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: loadNewData,
      onSuccess: () => {
        setLoadNewData(false);
        setApplyFilters(false);
      },
    });

  const handleFilters = (props: any) => {
    setRating(props.rating);
    setCost(props.cost);
    setDuration(props.duration);
    refetch();
    setIsFilterDrawerOpen(false);
  };

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;
  const getAllData = () => (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Courses" description="Best Lms" path="Courses" />
      <Box component="main" mb={30}>
        <Container p={0}>
          <PageHeader
            title={t.packages}
            rightSection={
              <Group mr={10}>
                <ActionIcon
                  id="btn-packagesLayout"
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
        </Container>

        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          {respData?.data.length > 0 ? (
            <Container>
              <SimpleGrid
                sx={{
                  gridTemplateColumns: layoutGrid ? 'repeat(3,minmax(auto,300px))' : '1fr',
                  '@media (orientation: landscape)': {
                    gridTemplateColumns: layoutGrid
                      ? 'repeat(auto-fit, minmax(150px,1fr))'
                      : '1fr 1fr',
                  },

                  '@media screen and (max-width: 580px)': {
                    gridTemplateColumns: layoutGrid ? 'repeat(2,minmax(auto,300px))' : '1fr',
                  },

                  '@media screen and (max-width: 310px)': {
                    gridTemplateColumns: layoutGrid ? '1fr' : '1fr',
                  },
                }}
              >
                {respData?.data?.map((course: any) => {
                  return (
                    <Fragment key={course?.id}>
                      <PackagesCard
                        id={course?.id}
                        in_wishlist
                        href={`/packages/${course?.id}?isBundled=true`}
                        layoutGrid={layoutGrid}
                        {...course}
                      />
                    </Fragment>
                  );
                })}

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
        applyFilters={applyFilters}
        haveRating={false}
        setApplyFilters={setApplyFilters}
      />
    </>
  );
  return initial_country || initial_type || initial_stage || initial_major || isSkipTutorial ? (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Courses" description="Best Lms" path="Courses" />
      <Box component="main" mb={30}>
        <Container p={0}>
          <PageHeader
            title={t.packages}
            rightSection={
              <Group mr={10}>
                <ActionIcon
                  id="btn-packagesLayout"
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
        </Container>

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
                  gridTemplateColumns: layoutGrid
                    ? 'repeat(4,minmax(auto,300px))'
                    : 'repeat(2, minmax(330px, 1fr))',
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
                {data?.pages.map((packages: any) =>
                  packages.results.map((course: any) => {
                    return (
                      <Fragment key={course?.id}>
                        <PackagesCard
                          id={course?.id}
                          in_wishlist
                          href={`/packages/${course?.id}`}
                          layoutGrid={layoutGrid}
                          {...course}
                        />
                      </Fragment>
                    );
                  })
                )}

                {isFetchingNextPage && (
                  <>
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="unset" />
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="unset" />
                    <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="unset" />
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
        applyFilters={applyFilters}
        haveRating={false}
        setApplyFilters={setApplyFilters}
      />
    </>
  ) : (
    getAllData()
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { guest_lang, access_token } = ctx.req.cookies;
  const { initial_country, initial_type, initial_stage, initial_major, isSkipTutorial } =
    ctx.req.cookies;

  const respData = await axios.post('bundle/courses', {
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    min_price: 0,
    max_price: 10000,
    min_time: 0,
    max_time: 10000,
    rating: 0,
  });
  const userAgent: any =
    typeof window === 'undefined'
      ? ctx.req.headers['user-agent']?.toLowerCase()
      : navigator.userAgent.toLowerCase();
  const isMobile: any = /iphone|ipod|ipad|android|blackberry|windows phone/gi?.test(userAgent);

  return {
    props: {
      initial_country: (initial_country && initial_country) || null,
      initial_type: (initial_type && initial_type) || null,
      initial_stage: initial_stage || null,
      initial_major: initial_major || null,
      isSkipTutorial: (isSkipTutorial && isSkipTutorial) || null,
      respData: respData?.data,
      isMobile,
      userAgent,
    },
  };

  // console.log('THE DEVICE I AM USING', isMobile ? 'Mobile' : 'desktop');
};

export default PackagesPage;
