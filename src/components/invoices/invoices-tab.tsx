import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { Stack } from '@mantine/core';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from 'react-query';
import { Skeletons } from '../saved-cards/Skeletons';
import { InvoiceCard } from '../ui/cards/invoice-card';
import { NoRecordFound } from '../ui/no-record-found';



export const InvoicesTab = () => {
  const { data, fetchNextPage, isSuccess, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ['invoices'],
      ({ pageParam }) => getPaginatedData({ page: pageParam, endpoint: 'invoices?' }),
      {
        getNextPageParam: (lastPage) => lastPage.next,
      }
    );

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <div>
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<></>}
      >
        <Stack>
          {data?.pages[0].results.length > 0
            ? data?.pages?.map((page: any) =>
                page?.results?.map((item: any) => (
                  <InvoiceCard key={item?.invoiceData?.transaction_id} invoiceData={item} />
                ))
              )
            : isSuccess && <NoRecordFound />}

          {(isFetchingNextPage || isLoading) && (
            <>
              <Skeletons />
            </>
          )}
        </Stack>
      </InfiniteScroll>
    </div>
  );
};
