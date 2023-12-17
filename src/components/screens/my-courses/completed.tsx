import { Anchor, Container, Skeleton, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CourseProgressCard } from '@/components/ui/cards/course-progress';
import Link from 'next/link';
import { NoRecordFound } from '@/components/ui/no-record-found';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoCourseFound } from '@/components/ui/no-course-found';

export const CourseCompletedTab = (props: any) => {
  const getDiscoverData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(
      `completed/courses?filter=${props?.filter}&page=${pageParam}`
    );
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }
    const data: any = {
      results: dataFromServer.data.data,
      next: dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  useEffect(() => {
    localStorage.setItem('completed_courses_filter', props?.filter);
  }, [props?.filter]);

  const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['completed/courses', props?.filter, 'completed'], getDiscoverData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: props?.completedCheck,
      onSettled: () => {
        props?.setcompletedCheck(false);
        console.log('completed courses', data);
      },
      cacheTime: 1000 * 60 * 60 * 24,
      staleTime: 0,
    });

  if (isError) {
    console.log('my courses', isError);
    showNotification({
      message: 'Error fetching courses',
      color: 'red',
    });
  }

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  return (
    <Container>
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<></>}
      >
        <Stack>
          {isLoading &&
            Array(3).fill(<Skeleton height={80} width="100%" radius={8} sx={{ opacity: 0.7 }} />)}
          {data?.pages[0].results != '' ? (
            data?.pages?.map((page: any, i) => (
              <React.Fragment key={i}>
                {page.results.map((item: any, i: number) => (
                  <Link href={`/courses/${item?.course_id}`} passHref>
                    <Anchor underline={false} style={{ cursor: 'pointer' }}>
                      <CourseProgressCard
                        course_id={item?.course_id}
                        key={item.course_id}
                        image={item.image}
                        title={item.title}
                        progress={item.progress}
                      />
                    </Anchor>
                  </Link>
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
            <NoCourseFound />
          )}
        </Stack>
      </InfiniteScroll>
    </Container>
  );
};
