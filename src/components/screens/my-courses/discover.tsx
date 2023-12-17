import {
  AspectRatio,
  Card,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';
import { Star } from '@/src/constants/icons';
import Link from 'next/link';
import { NoRecordFound } from '@/components/ui/no-record-found';
import axios from '@/components/axios/axios.js';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { showNotification } from '@mantine/notifications';
import Image from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import { shimmer, toBase64 } from '@/utils/utils';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { NoCourseFound } from '@/components/ui/no-course-found';

export const Discover = (props: any) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const getDiscoverData = async ({ pageParam = 1 }) => {
    const dataFromServer = await axios.get(
      `discover/courses?filter=${props?.filter}&page=${pageParam}`
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

  const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['discover/courses', props?.filter, 'discover'], getDiscoverData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: props?.discoverCheck,
      onSettled: () => {
        props?.setDiscoverCheck(false);
        console.log('discover courses', data);
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
                  <Link href={`/courses/${item?.id}`} passHref>
                    <Text component="a">
                      <Card radius={8} sx={{ position: 'relative' }} p={8}>
                        <SimpleGrid sx={{ gridTemplateColumns: '30% 1fr' }}>
                          <AspectRatio ratio={1 / 1} sx={{ borderRadius: 8, overflow: 'hidden' }}>
                            <ImageWithFallback
                              src={item?.image}
                              objectFit="cover"
                              layout="fill"
                              placeholder="blur"
                              fallbackSrc="/assets/images/default.png"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer(700, 475)
                              )}`}
                            />
                          </AspectRatio>
                          <Stack spacing={10}>
                            <Text weight={500} sx={{ fontSize: 12 }}>
                              <EllipsisText text={item?.title || ''} length={70} />
                            </Text>
                            <Text
                              sx={(theme) => ({
                                fontSize: 12,
                                color: theme.other.secondaryWriteColor,
                              })}
                            >
                              {item?.instructor}
                            </Text>

                            <Group spacing={2} align="center">
                              <Star />
                              <Text sx={{ fontSize: 12 }}>
                                {item?.rating} ({item?.reviews_by}) . {item?.lessons} {t.lessons}
                              </Text>
                            </Group>
                          </Stack>
                        </SimpleGrid>
                      </Card>
                    </Text>
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
