import { Box, Container, SimpleGrid, Space, Tabs } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from 'react-query';
import { LiveSessionCard } from '../ui/cards/live-session-card';
import { NoRecordFound } from '../ui/no-record-found';
import { Skeletons } from './Skeletons';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { NoSaveFound } from '../ui/no-save-found';
import { TabsHeader } from '../tabs/TabsHeader';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { Live } from '../screens/saved-list/live';
import { InPerson } from '../screens/saved-list/in-person';

export const SavedLiveSessions = () => {
  // const { data, isLoading, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery(
  //     ['wishlist/sessions'],
  //     ({ pageParam }) =>
  //       getPaginatedData({
  //         page: pageParam,
  //         endpoint: 'wishlist/meetings?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&',
  //       }),
  //     {
  //       getNextPageParam: (lastPage) => lastPage.next,
  //     }
  //   );

  // const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  // useEffect(() => {
  //   refetch();
  // }, []);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [liveCheck, setLiveCheck] = useState(false);
  const [inpersonCheck, setInpersonCheck] = useState(false);

  return (
    <>
      <Space h="md" />
      <Container mb={30} px={0} pb={70}>
        <TabsHeader>
          <Tabs.Tab id="tab-liveSessions" label={t['live-sessions']} tabKey="Live">
            <Live setDiscoverCheck={setLiveCheck} discoverCheck={liveCheck} />
          </Tabs.Tab>
          <Tabs.Tab id="tab-inPersonSessions" label={t['in-person-sessions']} tabKey="In Person">
            <InPerson setInprogessCheck={setInpersonCheck} InprogessCheck={inpersonCheck} />
          </Tabs.Tab>
        </TabsHeader>
      </Container>
      {/* <InfiniteScroll
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<></>}
      >
        <SimpleGrid sx={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          {data?.pages?.map((page: any) =>
            page.results.map((item: any) => (
              <LiveSessionCard
                key={item?.meeting_id}
                //@ts-ignore
                href={{
                  pathname: `/live-sessions/${item?.meeting_id}`,
                  query: {
                    id: item?.meeting_id,
                    type: item?.type,
                  },
                }}
                ratio={1 / 1}
                discount_price={item?.discount_price}
                id={item?.meeting_id}
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
            <Box sx={{ gridColumn: 'span 2' }}>
              <NoSaveFound />
            </Box>
          )}
          {(isLoading || isFetchingNextPage) && <Skeletons />}
        </SimpleGrid>
      </InfiniteScroll> */}
    </>
  );
};
