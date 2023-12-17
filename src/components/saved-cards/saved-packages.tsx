import { Box, SimpleGrid } from '@mantine/core';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PackagesCard } from '../ui/cards/packages-card';
import { NoRecordFound } from '../ui/no-record-found';
import { Skeletons } from './Skeletons';
import { useInfiniteQuery } from 'react-query';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { NoSaveFound } from '../ui/no-save-found';

export const SavedPackages = () => {
  const { data, isLoading, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['wishlist/packages'],
      ({ pageParam }) =>
        getPaginatedData({
          page: pageParam,
          endpoint: 'wishlist/bundles?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&',
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
    <div>
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
          {data?.pages?.map((page: any, i) => (
            <React.Fragment key={i}>
              {page.results.map((item: any) => (
                <PackagesCard
                  key={item?.bundle_id}
                  ratio={1 / 1}
                  in_wishlist={true}
                  id={item?.bundle_id}
                  href={`/packages/${item?.bundle_id}`}
                  title={item?.title}
                  image={item?.image}
                  price={item?.price}
                  total_courses={item?.total_courses}
                  discount_price={item?.discount_price}
                />
              ))}
            </React.Fragment>
          ))}
          {data?.pages[0]?.results?.length === 0 && (
            <Box sx={{ gridColumn: 'span 2' }}>
              <NoSaveFound />
            </Box>
          )}
          {(isFetchingNextPage || isLoading) && <Skeletons />}
        </SimpleGrid>
      </InfiniteScroll>
    </div>
  );
};
