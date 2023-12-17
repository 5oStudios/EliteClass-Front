import {
  ActionIcon,
  Card,
  Container,
  Group,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import useNextBlurhash from 'use-next-blurhash';
import axios from '@/components/axios/axios.js';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { PageHeader } from '@/components/ui/pageHeader';
import { LoadingScreen } from '@/components/ui/loader-screen';
import InfiniteScroll from 'react-infinite-scroll-component';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import momentWithTimeZone from 'moment-timezone';

//╦ ╦┌─┐┬  ┬  ┌─┐┌┬┐      ╔╦╗┬┌─┐┌─┐┌┐ ┬  ┌─┐┌┬┐
//║║║├─┤│  │  ├┤  │        ║║│└─┐├─┤├┴┐│  ├┤  ││
//╚╩╝┴ ┴┴─┘┴─┘└─┘ ┴       ═╩╝┴└─┘┴ ┴└─┘┴─┘└─┘─┴┘
//   Wallet feature has been deprecated:
//   Visit this link for more info
//   https://app.clickup.com/t/864e2n55v

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

export const WalletPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const [incomeCheck, setIncomeCheck] = useState<boolean>(true);
  const [outcomeCheck, setOutcomeCheck] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');

  const getCreditData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(`wallet/Credit?page=${pageParam}`);
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data,
      next: pageParam == undefined ? 1 : pageParam + 1,
    };
    return data;
  };

  const {
    refetch,
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(['income'], getCreditData, {
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: incomeCheck,
  });

  const getDebitData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(`wallet/Debit?page=${pageParam}`);
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data,
      next: pageParam == undefined ? 1 : pageParam + 1,
    };
    return data;
  };

  const {
    refetch: is_refetch,
    data: debitData,
    isLoading: debitLoading,
    isFetching: debitisFetching,
    isFetchingNextPage: debitisFetchingNextPage,
    isError: debitisError,
    fetchNextPage: debitfetchNextPage,
    hasNextPage: debithasNextPage,
  } = useInfiniteQuery(['outcome'], getDebitData, {
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: outcomeCheck,
  });

  const onChange = (active: number, tabKey: string) => {
    if (tabKey === 'Income') {
      setIncomeCheck(true);
      setActiveTab(0);
    } else {
      setOutcomeCheck(true);
      setActiveTab(1);
    }
  };

  useEffect(() => {
    refetch();
    is_refetch();
  }, [data, debitData]);

  const dataLength = 10;
  const dataLengthDebit = 10;

  return (
    <div>
      <PageHeader
        title={t.wallet}
        rightSection={
          <ActionIcon variant="transparent" onClick={() => router.push('/user/refill')} mr={10}>
            <Text sx={{ color: '#2F43BB' }} size="sm">
              {t['wallet-details'].refill}
            </Text>
          </ActionIcon>
        }
      />
      <ScrollArea scrollbarSize={10}>
        <Space h={20} />
        <Container>
          <Card radius={10} sx={{ backgroundColor: '#FFDD83' }}>
            <SimpleGrid sx={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
              <Stack spacing={0} sx={{ justifySelf: 'center' }}>
                <Text
                  weight={500}
                  sx={{
                    color: '#82B1CF',
                    fontSize: 12,
                  }}
                >
                  {t['wallet-details']['current-balance']}
                </Text>
                <Text
                  weight={500}
                  sx={{
                    color: '#82B1CF',
                    fontSize: 32,
                  }}
                >
                  <Group noWrap spacing={0}>
                    {parseInt(data?.pages[0]?.results?.corrent_balance) ?? (
                      <Skeleton height={30} width={60} sx={{ opacity: 0.5 }} />
                    )}
                    KWD
                  </Group>
                </Text>
              </Stack>
              {activeTab == 0 ? (
                <Image
                  src="/assets/images/Financial Consulting 1.png"
                  width={120}
                  height={100}
                  quality={100}
                  priority
                />
              ) : (
                <Image
                  src="/assets/images/Financial Consulting 2.png"
                  width={120}
                  height={100}
                  quality={100}
                  priority
                />
              )}
            </SimpleGrid>
          </Card>
        </Container>
        <Space h={20} />
        <Container p={0}>
          <Container>
            <Tabs
              onTabChange={onChange}
              tabPadding="xs"
              variant="unstyled"
              styles={(theme) => ({
                tabControl: {
                  backgroundColor: '#F7F6F5',
                  color: theme.colors.gray[9],
                  fontSize: theme.fontSizes.sm,
                  borderRadius: 20,
                  flexGrow: 1,
                  height: 32,
                  whiteSpace: 'nowrap',
                },
                tabsList: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(50px,1fr))',
                  width: '100%',
                  //padding: '0px 0px 10px 0px',
                  borderRadius: 20,
                  backgroundColor: '#F7F6F5',
                },
                tabActive: {
                  backgroundColor: '#FFDD83',
                  color: '#000',
                },
              })}
            >
              <Tabs.Tab
                id="tab-wallentDetailsIncome"
                label={t['wallet-details'].income}
                tabKey="Income"
              >
                <Space h={15} />
                <Group
                  className="item"
                  px={16}
                  sx={{ height: '45px' }}
                  position="apart"
                  align="center"
                >
                  <Text size="xs">{t['wallet-details']['total-income-balance']}:</Text>
                  <Text size="xs" weight={700}>
                    {parseInt(data?.pages[0]?.results?.total || 0)} KWD
                  </Text>
                </Group>
                <Space h={10} />

                <InfiniteScroll
                  dataLength={dataLength}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={<></>}
                >
                  <Stack>
                    {data?.pages[0]?.results?.history != null
                      ? data?.pages.map((iskey: any, isindex) =>
                          Object.keys(iskey?.results?.history).map(
                            (historyItem: any, index: number) => (
                              <Stack
                                key={index}
                                spacing={0}
                                // sx={{
                                //   '& .item:not(:last-of-type)': {
                                //     borderBottom: '1px solid #E3E4E5',
                                //   },
                                // }}
                              >
                                <Text px={16} size="xs" weight={500} color={'#298EAE'}>
                                  {momentWithTimeZone
                                    .utc(historyItem)
                                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                    .format('YYYY-MM-DD')}
                                  {/* {historyItem} */}
                                </Text>
                                <Space h={10} />
                                {iskey.results?.history[historyItem].map(
                                  (element: any) => (
                                    <Group
                                      className="item"
                                      key={element?.id}
                                      px={16}
                                      sx={{ height: '45px' }}
                                      position="apart"
                                      align="center"
                                    >
                                      <Text size="xs">{element?.detail}</Text>
                                      <Text size="xs">
                                        +{parseInt(element?.total_amount || 0)} {element?.currency}
                                      </Text>
                                    </Group>
                                  ),
                                  isFetching && <Skeleton width={'100%'} height={50} />
                                )}
                              </Stack>
                            )
                          )
                        )
                      : <LoadingScreen isLoading={isLoading} /> || <NoRecordFound />}
                  </Stack>
                  {!isLoading && isFetching && <Skeleton width={'100%'} height={50} />}
                </InfiniteScroll>
              </Tabs.Tab>
              <Tabs.Tab id="tab-wallentDetailsOutcome" label={t['wallet-details'].outcome} tabKey="Outcome">
                <Space h={15} />
                <Group
                  className="item"
                  px={16}
                  sx={{ height: '45px' }}
                  position="apart"
                  align="center"
                >
                  <Text size="xs">{t['wallet-details']['total-outcome-balance']}:</Text>
                  <Text size="xs" weight={700}>
                    {parseInt(debitData?.pages[0]?.results?.total || 0)} KWD
                  </Text>
                </Group>
                <Space h={10} />
                <Stack>
                  <InfiniteScroll
                    dataLength={dataLengthDebit}
                    next={debitfetchNextPage}
                    hasMore={!!debithasNextPage}
                    loader={<></>}
                  >
                    <Stack>
                      {data?.pages[0]?.results?.history != null
                        ? debitData?.pages.map((iskey: any, isindex) =>
                            Object.keys(iskey?.results?.history).map(
                              (historyItem: any, index: number) => (
                                <Stack
                                  key={index}
                                  spacing={0}
                                  // sx={{
                                  //   '& .item:not(:last-of-type)': {
                                  //     borderBottom: '1px solid #E3E4E5',
                                  //   },
                                  // }}
                                >
                                  <Text px={16} size="xs" weight={500} color={'#298EAE'}>
                                    {/* {historyItem} */}
                                    {momentWithTimeZone
                                      .utc(historyItem)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD')}
                                  </Text>
                                  <Space h={10} />
                                  {iskey.results?.history[historyItem].map((element: any) => (
                                    <Group
                                      className="item"
                                      key={element?.id}
                                      px={16}
                                      sx={{ height: '45px' }}
                                      position="apart"
                                      align="center"
                                    >
                                      <Text size="xs">{element?.detail}</Text>
                                      <Text size="xs">
                                        {parseInt(element?.total_amount || 0) > 0 ? '-' : ''}
                                        {parseInt(element?.total_amount || 0)} {element?.currency}
                                      </Text>
                                    </Group>
                                  ))}
                                </Stack>
                              )
                            )
                          )
                        : <LoadingScreen isLoading={debitLoading} /> || <NoRecordFound />}
                    </Stack>
                    {!debitLoading && debitisFetching && <Skeleton width={'100%'} height={50} />}
                  </InfiniteScroll>
                </Stack>
              </Tabs.Tab>
            </Tabs>
          </Container>
          <Space h={90} />
        </Container>
      </ScrollArea>
    </div>
  );
};

export default WalletPage;
