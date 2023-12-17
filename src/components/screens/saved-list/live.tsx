import {
  AspectRatio,
  Button,
  Card,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { Star } from '@/src/constants/icons';
import Link from 'next/link';
import { NoRecordFound } from '@/components/ui/no-record-found';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { showNotification } from '@mantine/notifications';
import Image from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import { shimmer, toBase64 } from '@/utils/utils';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { NoCourseFound } from '@/components/ui/no-course-found';
import { LiveSessionCard } from '@/components/ui/cards/live-session-card';
import { NoBookingFound } from '@/components/ui/no-booking-found';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { Box } from 'tabler-icons-react';
import { NoSaveFound } from '@/components/ui/no-save-found';
import { Skeletons } from '@/components/saved-cards/Skeletons';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';

export const Live = (props: any) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');

  const getLiveData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(`wishlist/meetings?page=${pageParam}`);
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }
    const data: any = {
      results: dataFromServer.data.data,
      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  // const { data, isLoading, refetch , isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery(['wishlist/meetings', 'live'], getLiveData, {
  //     getNextPageParam: (lastPage) => lastPage.next,
  //     enabled: props?.liveCheck,
  //     onSettled: () => {
  //       // props?.setDiscoverCheck(false);
  //       //console.log('discover courses', data);
  //     },
  //     cacheTime: 1000 * 60 * 60 * 24,
  //     staleTime: 0,
  //   });

  // if (isError) {
  //   //console.log('my courses', isError);
  //   showNotification({
  //     message: 'Error fetching courses',
  //     color: 'red',
  //   });
  // }

  const { data, isLoading, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['wishlist/meetings'],
      ({ pageParam }) =>
        getPaginatedData({
          page: pageParam,
          endpoint: 'wishlist/meetings?secret=11f24438-b63a-4de2-ae92-e1a1048706f5',
        }),
      {
        getNextPageParam: (lastPage) => lastPage.next,
      }
    );

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Stack p={0} sx={{ alignItems: 'center' }}>
      <Container p={0} mt={10} sx={{ width: '100%' }}>
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          <SimpleGrid
            sx={{
              gridTemplateColumns: 'repeat(3,1fr)',

              '@media screen and (max-width: 580px)': {
                gridTemplateColumns: 'repeat(2,1fr)',
              },

              '@media screen and (max-width: 310px)': {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {data?.pages?.map((page: any) =>
              page.results.map((item: any) => (
                <LiveSessionCard
                  key={parseInt(item?.meeting_id)}
                  //@ts-ignore
                  href={{
                    pathname: `/live-sessions/${item?.meeting_id}`,
                    query: {
                      id: item?.meeting_id,
                      type: item?.type,
                    },
                  }}
                  typ={'live'}
                  ratio={1 / 1}
                  discount_price={item?.discount_price}
                  id={parseInt(item?.meeting_id)}
                  in_wishlist={true}
                  image={item?.image}
                  instructor={item?.instructor}
                  date_time={item?.date_time}
                  layoutGrid
                  meeting_title={item?.meeting_title}
                  show_price
                />
              ))
            )}
            {data?.pages[0]?.results?.length === 0 && (
              <Stack sx={{ gridColumn: 'span 2' }}>
                <NoSaveFound />
              </Stack>
            )}
            {(isLoading || isFetchingNextPage) && <Skeletons />}
          </SimpleGrid>
          {/* <Container p={0} mt={10}>
              <SimpleGrid cols={1}>
                {data?.pages[0].results != '' ? (
                  data?.pages?.map((page: any, i) => (
                    <React.Fragment key={i}>
                      {page.results.map((item: any) => (
                        <LiveSessionCard
                          //href={`/live-sessions/${item?.id}`}
                          href={{
                            pathname: `/live-sessions/${item?.id}`,
                            query: {
                              id: item?.id,
                              type: item?.type,
                            },
                          }}
                          show_price={false}
                          meeting_title={item?.meeting_title}
                          layoutGrid={false}
                          key={item?.id}
                          {...item}
                        >
                          <Group noWrap>
                            <Button
                              radius="xl"
                              ml="auto"
                              styles={{
                                filled: {
                                  background: '#98D1B1',
                                  '&:hover': { background: '#98D1B1' },
                                },
                                label: {
                                  color: '#FFFFFF',
                                },
                              }}
                              onClick={() => {
                                //router.push(`/live-sessions/${item?.id}`);
                                router.push({
                                  pathname: `/live-sessions/${item?.id}`,
                                  query: {
                                    slug: item?.id,
                                    //type: item?.type,
                                    id: item?.id,
                                  },
                                });
                              }}
                            >
                              {t['booking-list-detail']['go-to-session']}
                            </Button>
                          </Group>
                        </LiveSessionCard>
                      ))}
                      {isFetchingNextPage && (
                        <>
                          <Skeleton height={80} width="100%" radius={8} sx={{ opacity: 0.7 }} />
                          <Skeleton height={80} width="100%" radius={8} sx={{ opacity: 0.7 }} />
                          <Skeleton height={80} width="100%" radius={8} sx={{ opacity: 0.7 }} />
                        </>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoBookingFound />
                )}
              </SimpleGrid>
            </Container> */}
        </InfiniteScroll>
      </Container>
    </Stack>
  );
};
