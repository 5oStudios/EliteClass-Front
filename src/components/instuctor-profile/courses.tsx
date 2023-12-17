import { Box, SimpleGrid } from '@mantine/core';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoRecordFound } from '../ui/no-record-found';
import { useInfiniteQuery } from 'react-query';
import { CoursesCard } from '../ui/cards/courses-card';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { NoSaveFound } from '../ui/no-save-found';
import { Skeletons } from '../saved-cards/Skeletons';

export const InstructorCourses = () => {
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
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<></>}
    >
      <SimpleGrid
        sx={{
          '@media screen and (max-width: 310px)': {
            gridTemplateColumns: '1fr',
          },

          gridTemplateColumns: 'repeat(2,minmax(auto,300px))',
          '@media (orientation: landscape)': {
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))',
          },
        }}
      >
        {data?.pages?.map((page: any) =>
          page.results.map((item: any, i: number) => (
            <CoursesCard
              key={item?.id}
              ratio={1 / 1}
              id={item?.course_id}
              href={`/courses/${item?.course_id}`}
              layoutGrid={true}
              image={item?.image}
              in_wishlist={true}
              title={item?.title}
              rating={item?.total_rating}
              lessons={item?.lessons}
              instructor={item?.instructor}
              reviews_by={item?.reviews_by}
            />
          ))
        )}

        {data?.pages[0]?.results?.length === 0 && (
          <Box sx={{ gridColumn: 'span 2' }}>
            <NoSaveFound />
          </Box>
        )}
        {(isFetchingNextPage || isLoading) && <Skeletons />}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
