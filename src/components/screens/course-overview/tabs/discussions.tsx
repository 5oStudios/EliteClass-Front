import { Posts } from '@/components/post/Posts';
import { Box, LoadingOverlay, Skeleton, Space, Stack } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
// import { getPosts } from '@/utils/axios/apis';
import { WritePost } from '@/components/ui/WritePost';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { getAnswer, getQuestion } from '@/utils/axios/apis';

export const DiscussionsTab = (props: any) => {
  const slug = props?.slug;
  const router = useRouter();
  // language
  const { question_id, answer_id } = router.query;

  console.log({ question_id, answer_id });

  const [refreshPosts, setRefreshPosts] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const [userId, setUserId] = React.useState<string | null | undefined>();

  React.useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    setUserId(user_id);
  }, []);

  const {
    data: posts,
    fetchNextPage,
    refetch,
    isSuccess,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['post', slug],
    ({ pageParam }) =>
      getPaginatedData({ page: pageParam, endpoint: `course/questions?course_id=${slug}&` }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
      onSuccess: () => {
        setRefreshPosts(false);
      },
    }
  );
  const dataLength = posts?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  const {
    data: question,
    isLoading: questionLoading,
    refetch: QuestionRefetch,
  } = useQuery(
    [`answer/question`, props.slug],
    () => (question_id !== undefined ? getQuestion({ question_id }) : null),
    {
      onSettled: () => {},
      onError: (error: any) => {
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          const err = error?.response?.data?.errors;
          Object.keys(err).forEach((i) => {
            err[i].forEach((item: any) => {
              showNotification({
                message: item,
                color: 'red',
              });
            });
          });
        }
      },
    }
  );

  const {
    data: answer,
    isLoading: answerLoading,
    refetch: AnswerRefetch,
  } = useQuery(
    [`answer/answer`, props.slug],
    () => (answer_id != undefined ? getAnswer({ answer_id }) : null),
    {
      onSettled: () => {},
      onError: (error: any) => {
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          const err = error?.response?.data?.errors;
          Object.keys(err).forEach((i) => {
            err[i].forEach((item: any) => {
              showNotification({
                message: item,
                color: 'red',
              });
            });
          });
        }
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Stack p={0}>
        <Box px={0} sx={{ position: 'relative' }}>
          <LoadingOverlay visible={postLoading} />
          {props.showEditText === undefined && (
            <WritePost
              setPostLoading={setPostLoading}
              setRefreshPosts={setRefreshPosts}
              refetch={refetch}
            />
          )}
        </Box>

        <Stack spacing={10} sx={{ width: '100%' }}>
          {refreshPosts && (
            <Skeleton height={100} width="100%" mx="auto" radius={8} sx={{ opacity: 0.7 }} />
          )}
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<></>}
          >
            <Stack>
              {questionLoading || answerLoading || !posts?.pages[0].results ? (
                <>
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                </>
              ) : posts?.pages[0].results.length > 0 ? (
                <>
                  {question_id !== undefined && answer_id !== undefined ? (
                    <>
                      <Posts
                        //@ts-ignore
                        user_id={question.user_id === userId ? question.user_id : null}
                        //@ts-ignore
                        key={question.question_id}
                        {...question}
                        course_id={slug}
                        Questionrefetch={QuestionRefetch}
                        //@ts-ignore
                        role={question.role}
                        // @ts-ignore
                        preAnswer={answer}
                      />
                    </>
                  ) : (
                    posts?.pages?.map((page: any, i) => (
                      <React.Fragment key={i}>
                        {page.results?.map((post: any) => (
                          <Posts
                            user_id={post.user_id === userId ? post.user_id : null}
                            key={post.question_id}
                            {...post}
                            course_id={slug}
                            Questionrefetch={refetch}
                            role={post.role}
                            preAnswer={null}
                          />
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </>
              ) : (
                <NoRecordFound />
              )}
              {isFetchingNextPage && (
                <>
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                  <Skeleton radius={8} sx={{ minHeight: 200, height: '100%' }} width="100%" />
                </>
              )}
              {/* {posts?.data?.map((post: any) => {
                 return <Posts key={post.question_id} {...post} course_id={slug} />;
               })} */}
            </Stack>
          </InfiniteScroll>
          {isLoading &&
            [1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height={100}
                width="95%"
                mx="auto"
                radius={8}
                sx={{ opacity: 0.7 }}
              />
            ))}
        </Stack>
      </Stack>
      <Space h={30} />
    </>
  );
};
