import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { Stack, Card, Button, Group, Radio, RadioGroup, Space, Divider, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from 'react-query';
import { Skeletons } from '../saved-cards/Skeletons';
import { PaymentCard } from '../ui/cards/installment-card';
import { NoRecordFound } from '../ui/no-record-found';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import axios from '@/components/axios/axios.js';
import { getCookie } from 'cookies-next';

export const InstallmentsTab = () => {
  const [pendingPaymentCard, setPendingPaymentCard] = React.useState<string>('KNET');
  const [getPendingData, setGetPendingData] = useState(null);
  
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const token = getCookie('access_token');
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const {
    // data,
    isLoading,
    // isSuccess,
    // isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchInstallments,
    isFetching,
  } = useInfiniteQuery('');
  const test = async () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/pending/instalments',
    };

    axios
      .request(config)
      .then((response) => {
        setGetPendingData(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dataLength = 10;

  // console.log("data-----------",data)
  return (
    <div>
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<></>}
        style={{
          overflow: 'hidden',
        }}
      >
        <Stack>
          {/* {
          getPendingData ?
            getPendingData?.installments?.map((item: any) => ( */}
          <PaymentCard
            // key={item?.paymentData?.instalment_id}
            paymentData={getPendingData}
            setPendingData={setGetPendingData}
            refetchInstallments={refetchInstallments}
            isFetching={isFetching}
            isLoading={isLoading}
            updatedUi={test}
          />
          {/* ))
              
            :  <Skeletons />} */}
        </Stack>
      </InfiniteScroll>
    </div>
  );
};
