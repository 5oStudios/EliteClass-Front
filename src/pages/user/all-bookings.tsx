import { Box, Container, Group, SimpleGrid, Space, Button, Skeleton, Tabs } from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Seo } from '@/components/seo';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { LiveSessionCard } from '@/components/ui/cards/live-session-card';
import { NoRecordFound } from '@/components/ui/no-record-found';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PageHeader } from '@/components/ui/pageHeader';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { NoBookingFound } from '@/components/ui/no-booking-found';
import { TabsHeader } from '@/components/tabs/TabsHeader';
import { Live } from '@/components/screens/booking-list/live';
import { InPerson } from '@/components/screens/booking-list/in-person';
import authMiddleware from '@/src/authMiddleware';

export const CoursesPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const client = useQueryClient();
  client.invalidateQueries([`booking/list`]);
  //const [listCheck, setListCheck] = useState<boolean>(true);
  const [liveCheck, setLiveCheck] = useState(false);
  const [inpersonCheck, setInpersonCheck] = useState(false);

  // const getData = async ({ pageParam = 1 }) => {
  //   const dataFromServer = await axios.get(`booking/list?page=${pageParam}`);
  //   if (dataFromServer.status !== 200) {
  //     throw new Error('Something went wrong');
  //   }
  //   const data: any = {
  //     results: dataFromServer.data.data,
  //     next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
  //   };
  //   return data;
  // };

  // const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery(['booking/list'], getData, {
  //     getNextPageParam: (lastPage) => lastPage.next,
  //     enabled: listCheck,
  //     onSettled: () => {
  //       setListCheck(false);
  //       console.log('booking list', data);
  //     },
  //   });

  // const bookinglistdataLength =
  //   data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <>
      <LoadingScreen isLoading={false} />
      <Seo title="All sessions booking" description="Best Lms" path="user/all-bookings" />
      <Box component="main" mb={30}>
        <PageHeader title={t['booking-list']} />
        <Space h="md" />
        <Container mb={30} pb={70}>
          <TabsHeader>
            <Tabs.Tab id="tab-bookingLive" label={t['live-sessions']} tabKey="Live">
              <Live setDiscoverCheck={setLiveCheck} discoverCheck={liveCheck} />
            </Tabs.Tab>
            <Tabs.Tab id="tab-bookingInperson" label={t['in-person-sessions']} tabKey="In Person">
              <InPerson setInprogessCheck={setInpersonCheck} InprogessCheck={inpersonCheck} />
            </Tabs.Tab>
          </TabsHeader>
        </Container>
        {/* <Space h="lg" />
        <InfiniteScroll
          dataLength={bookinglistdataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<></>}
        >
          <Container>
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
                                  type: item?.type,
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
          </Container>
        </InfiniteScroll> */}
      </Box>
    </>
  );
};

export default authMiddleware(CoursesPage);
