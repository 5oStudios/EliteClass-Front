import { ActionIcon, Card, Container, Group, Skeleton, Space, Stack, Text } from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Notification } from '@/components/ui/notification';
import { Seo } from '@/components/seo';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery } from 'react-query';
import { LoadingScreen } from '@/components/ui/loader-screen';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoNotificationsFound } from '@/components/ui/no-notifications-found';
import { PageHeader } from '@/components/ui/pageHeader';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import authMiddleware from '@/src/authMiddleware';

const NotificationsPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { data, fetchNextPage, isSuccess, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ['notifications'],
      ({ pageParam }) => getPaginatedData({ page: pageParam, endpoint: 'notifications?' }),
      {
        getNextPageParam: (lastPage) => lastPage.next,
      }
    );

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <>
      <Seo title="notifications" description="Best LMS" path="notifications" />
      <LoadingScreen isLoading={isLoading} />
      <main>
        <PageHeader title={t.notifications} />
        <Space h="md" />
        <Container>
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<></>}
          >
            <Stack>
              {data?.pages[0].results != '' ? (
                data?.pages?.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.results.map((item: any) => {
                      return (
                        <Notification
                          onClick={() => {
                            if (item.action === 'enrolled') {
                              let pathType =
                                item.item === 'Live Session'
                                  ? 'live-sessions'
                                  : item.item === 'Course Package'
                                  ? 'packages'
                                  : 'courses';
                              router.push({
                                pathname: `/${pathType}/[slug]`,
                                query: { slug: item.id },
                              });
                            } else if (item.action === 'topup') {
                              router.push('wallet');
                            } else if (item.action === 'answer_added') {
                              if (item.course_id) {
                                localStorage.setItem('courses_active_tab', '2');
                                router.push({
                                  pathname: `/answer`,
                                  query: {
                                    slug: item.course_id * 1,
                                    question_id: item.question_id,
                                    answer_id: item.id,
                                  },
                                });
                              } else {
                                router.push({
                                  pathname: `/answer/[slug]`,
                                  query: {
                                    slug: 'question-or-answer-deleted',
                                  },
                                });
                              }
                            }
                          }}
                          key={item?.id}
                          name={item?.title}
                          time={`${item?.date}`}
                          message={
                            item?.item === 'answer'
                              ? `${item?.title} has added and answer`
                              : item?.data
                          }
                          avatar={item?.image}
                        />
                      );
                    })}
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
                <NoNotificationsFound />
              )}
            </Stack>
          </InfiniteScroll>
          <Space h="md" />
        </Container>
      </main>
    </>
  );
};
export default authMiddleware(NotificationsPage);
