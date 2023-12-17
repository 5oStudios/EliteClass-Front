import { Box, SimpleGrid, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoRecordFound } from '../ui/no-record-found';
import { useInfiniteQuery } from 'react-query';
import { CoursesCard } from '../ui/cards/courses-card';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { NoSaveFound } from '../ui/no-save-found';
import { Skeletons } from '../saved-cards/Skeletons';

export const InstructorStudents = () => {
  const { data, isLoading, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['wishlist/courses'],
      ({ pageParam }) =>
        getPaginatedData({
          page: pageParam,
          endpoint: 'wishlist/courses?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&',
        }),
      {
        getNextPageParam: (lastPage) => lastPage.next,
      }
    );

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;
  console.log('DATA_LENGTH:', dataLength);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <InfiniteScroll dataLength={10} next={fetchNextPage} hasMore={!!hasNextPage} loader={<></>}>
      <Stack mt={50} px={30}>
        {data?.pages?.map((page: any) =>
          page.results.map((item: any, i: number) => <Text>{`${i + 1}- Ghadeer radwan`}</Text>)
        )}
      </Stack>
      {data?.pages[0]?.results?.length === 0 && (
        <Box sx={{ gridColumn: 'span 2' }}>
          <NoSaveFound />
        </Box>
      )}
      {(isFetchingNextPage || isLoading) && <Skeletons />}
    </InfiniteScroll>
  );
};
