import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Portal,
  Progress,
  Select,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import React, { useState } from 'react';
import { ReviewCard } from '@/components/ui/cards/review-card';
import { WriteReview } from './write-review';
import StarRating from 'react-rating';
import { EmptyStar, FullStar } from '@/src/constants/icons';
import { getCookie } from 'cookies-next';
import { showNotification } from '@mantine/notifications';
import { Router, useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';
import axios from '@/components/axios/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const Ratings = (props: any) => {
  const { reviews_added, total_learn, total_price, total_rating, total_value, avg_rating, course } =
    props.ratingsData ?? {};

  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const sortOptions = [
    {
      label: t['courses-details']['most-recent'],
      value: 'most_recent',
    },
    {
      label: t['courses-details']['highest-rated'],
      value: 'highest_rated',
    },
    {
      label: t['courses-details']['lowest-rated'],
      value: 'lowest_rated',
    },
  ];
  const { slug } = router.query;
  const [sort, setSort] = useState<string | null>('most_recent');
  const [signing, setSigning] = useState<boolean>(false);
  const [userId, setUserId] = React.useState<string | null | undefined>();

  const [isOpen, setIsOpen] = React.useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const sortBy = sort === 'most_recent' ? 'date' : 'rating';
  const order = sort === 'most_recent' || sort === 'highest_rated' ? 'descending' : 'ascending';

  const getReviews = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(
      `course/reviews?secret=e01f5695-8777-4bc4-beb4-e910942fbee3&course_id=${slug}
      &sort_by=${sortBy}
      &sort_order=${order}&page=${pageParam}`
    );

    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }

    const data: any = {
      results: dataFromServer.data.review.data,
      next: dataFromServer.data.review.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  const { refetch, isRefetching, data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<any, any>(['reviews', sort, sortBy, order], getReviews, {
      getNextPageParam: (lastPage) => lastPage.next,
      keepPreviousData: true,
    });

  const dataLength = data?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;
  const isUser = getCookie('access_token');

  function addReviews() {
    if (isUser == undefined) {
      setOpenConfirmModal(true);
    } else if (reviews_added) {
      showNotification({
        message: 'Already added',
        color: 'red',
      });
    } else if (course?.order_id == null && !props?.chapterPurchased) {
      showNotification({
        message: 'Purchase this course',
        color: 'red',
      });
    } else if (
      isUser != undefined &&
      !reviews_added &&
      (course?.order_id != null || props?.chapterPurchased)
    ) {
      setIsOpen(true);
    }
  }

  React.useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    setUserId(user_id);
  }, []);

  React.useEffect(() => {
    props.refetch();
  }, [data]);

  React.useEffect(() => {
    setSigning(false);
  }, [router]);

  return (
    <>
      <SimpleGrid spacing={0} sx={{ gridTemplateColumns: '2fr 1fr', alignItems: 'stretch' }}>
        <Stack spacing={0}>
          <Group noWrap>
            <Text size="xs" pb={5}>
              {t['courses-details'].learn}
            </Text>
            {
              //@ts-ignore
              <StarRating
                className="rating"
                initialRating={total_learn}
                start={0}
                stop={5}
                fractions={4}
                emptySymbol={<EmptyStar width={20} height={20} />}
                fullSymbol={<FullStar width={20} height={20} />}
                readonly
              />
            }
          </Group>
          <Group noWrap>
            <Text size="xs" pb={5} pr={5}>
              {t['courses-details'].price}
            </Text>
            {
              //@ts-ignore
              <StarRating
                initialRating={total_price}
                start={0}
                stop={5}
                fractions={4}
                emptySymbol={<EmptyStar width={20} height={20} />}
                fullSymbol={<FullStar width={20} height={20} />}
                readonly
              />
            }
          </Group>
          <Group noWrap>
            <Text size="xs" pb={5}>
              {t['courses-details'].value}
            </Text>
            {
              //@ts-ignore
              <StarRating
                className="rating"
                initialRating={total_value}
                start={0}
                stop={5}
                fractions={4}
                emptySymbol={<EmptyStar width={20} height={20} />}
                fullSymbol={<FullStar width={20} height={20} />}
                readonly
              />
            }
          </Group>
        </Stack>

        <Stack>
          <Box sx={{ border: '2px solid #EEEEEE', borderRadius: 8 }}>
            <Center>
              <Stack spacing={0}>
                <Text size="sm" align="center" sx={{ color: '#666666' }}>
                  {parseInt(total_rating) <= 1
                    ? `${total_rating} ${t.review}`
                    : `${total_rating} ${t.reviews}`}
                </Text>
                <Text align="center" size="lg" sx={(theme) => ({ color: theme.colors.primary[5] })}>
                  {avg_rating}
                </Text>
                <Group spacing={0}>
                  {
                    //@ts-ignore
                    <StarRating
                      initialRating={parseFloat(avg_rating?.toFixed(1))}
                      start={0}
                      stop={5}
                      fractions={4}
                      emptySymbol={<EmptyStar width={15} height={15} />}
                      fullSymbol={<FullStar width={15} height={15} />}
                      readonly
                    />
                  }
                </Group>
              </Stack>
            </Center>
          </Box>

          <Modal
            opened={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            withCloseButton={false}
            centered
          >
            <Card>
              <Stack>
                <Text align="center">{t['login-popup']}.</Text>
                <SimpleGrid cols={2}>
                  <Button
                    id="btn-ratingModalCancel"
                    variant="filled"
                    onClick={() => {
                      setOpenConfirmModal(false);
                    }}
                    radius={20}
                    styles={{
                      filled: {
                        background: '#EDF2F7',
                        '&:hover': {
                          background: '#EDF2F7',
                        },
                      },
                      label: {
                        color: 'black',
                      },
                    }}
                  >
                    {t.Cancel}
                  </Button>
                  <Button
                    id="btn-ratingModalSignIn"
                    variant="filled"
                    onClick={() => {
                      setSigning(true);
                      router.push('/signin');
                    }}
                    loading={signing}
                    radius={20}
                    styles={{
                      filled: {
                        background: '#FF3030',
                        '&:hover': {
                          background: '#FF3030',
                        },
                      },
                      label: {
                        color: 'white',
                      },
                    }}
                  >
                    {t['sign-in']}
                  </Button>
                </SimpleGrid>
              </Stack>
            </Card>
          </Modal>

          <Portal>
            <WriteReview
              ratingRefetch={props.refetch}
              refetch={refetch}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              id={course?.id}
            />
          </Portal>
          <Button
            id="btn-writeReview"
            onClick={addReviews}
            size="sm"
            p={0}
            sx={{ fontSize: 12 }}
            disabled={reviews_added}
          >
            {t['courses-details'].write_review}
          </Button>
        </Stack>
      </SimpleGrid>
      <Space h="lg" />

      <Paper sx={{ background: '#F6F6F6' }} p={10}>
        <Group align="center" position="apart">
          <Text weight={400} size="md" sx={{ color: '#666666' }}>
            {isRefetching || isLoading ? (
              <Loader variant="dots" />
            ) : (
              props?.ratingsData?.reviews?.total
            )}{' '}
            {parseInt(props?.ratingsData?.reviews?.total) <= 1 ? `${t.review}` : `${t.reviews}`}
          </Text>
          <Select
            id="slt-reviewFilter"
            data={sortOptions}
            value={sort}
            onChange={(e) => setSort(e)}
            placeholder={t.sort_by_Default}
            variant="filled"
            size="xs"
            radius={8}
            styles={(theme: any) => ({
              root: {
                maxWidth: '120px',
              },
              input: {
                backgroundColor: '#fff', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                color: '#666666',
              },
              item: {
                fontSize: '12px',
              },
              label: {
                color: theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#000',
              },
            })}
          />
        </Group>
      </Paper>
      <Space h="xs" />

      <InfiniteScroll
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<></>}
      >
        <Stack>
          {data?.pages.map((page: any) => {
            return page?.results?.map((item: any, i: number) => {
              return (
                <>
                  <ReviewCard
                    key={item?.id}
                    user_id={item.user_id === userId ? item.user_id : null}
                    name={item?.name}
                    date={item?.created_at}
                    rating={parseInt(item?.total_rating, 10)}
                    avatar={item?.image}
                    review={item?.review}
                    reviewid={item?.id}
                    refetch={refetch}
                  />
                  <Divider sx={{ borderColor: '#EEEEEE' }} />
                </>
              );
            });
          })}
          {isFetchingNextPage && (
            <>
              <Skeleton radius={8} sx={{ minHeight: 70, height: '100%' }} width="100%" />
              <Skeleton radius={8} sx={{ minHeight: 70, height: '100%' }} width="100%" />
              <Skeleton radius={8} sx={{ minHeight: 70, height: '100%' }} width="100%" />
            </>
          )}
        </Stack>
      </InfiniteScroll>
    </>
  );
};
