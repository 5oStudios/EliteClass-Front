import { MainLayout } from '@/components/layouts/MainLayout';
import { CourseCompletedTab } from '@/components/screens/my-courses/completed';
import { Discover } from '@/components/screens/my-courses/discover';
import { ProgressTab } from '@/components/screens/my-courses/in-progress';
import { Seo } from '@/components/seo';
import { Filter } from '@/src/constants/icons';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Select,
  Space,
  Stack,
  Tabs,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { TabsHeader } from '@/components/tabs/TabsHeader';

import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

export const MyCourses = () => {
  const [filter, setFilter] = React.useState('newest');
  const [lastPlayed, setLastPlayed] = React.useState(true);
  const [signing, setSigning] = useState<boolean>(false);
  const [discoverCheck, setDiscoverCheck] = useState<boolean>(true);
  const [isProgressCheck, setInprogessCheck] = useState<boolean>(false);
  const [completedCheck, setcompletedCheck] = useState<boolean>(false);
  const [isAuthenticated, setisAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { colorScheme } = useMantineColorScheme();

  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const access_token = getCookie('access_token');

  useEffect(() => {
    if (access_token) {
      setisAuthenticated(true);
    } else {
      setisAuthenticated(false);
    }
    if (!isAuthenticated) {
      router.prefetch('/signin');
    }
  }, []);

  const getDiscoverData = async ({ pageParam = 1 }) => {
    const dataFromServer = access_token
      ? await axios.get(`in-progress/courses?filter=${filter}&page=${pageParam}`)
      : null;
    if (dataFromServer && dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }
    const data: any = {
      results: dataFromServer && dataFromServer.data.data,
      next:
        dataFromServer && dataFromServer.data.next_page_url === null ? undefined : pageParam + 1,
    };
    return data;
  };

  const { data, isLoading, isFetching, isFetchingNextPage, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['in-progress/courses', filter, 'Inprogress'], getDiscoverData, {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: isProgressCheck,
      // onSettled: () => {
      //   props?.setInprogessCheck(false);
      // },
      cacheTime: 1000 * 60 * 60 * 24,
      staleTime: 0,
    });

  const resultLengths = data ? data?.pages.map((page) => page?.results?.length) : [];
  const totalResultsLength = resultLengths?.reduce((acc, cur) => acc + cur, 0);

  useEffect(() => {
    setSigning(false);
  }, [router]);

  useEffect(() => {
    setDiscoverCheck(true);
    setInprogessCheck(true);
    setcompletedCheck(true);
  }, [filter]);

  useEffect(() => {
    setFilter('newest');

    // if (activeTab === 0) {
    //   setLastPlayed(false);
    // } else if (activeTab === 1) {
    //   setLastPlayed(true);
    // } else if (activeTab === 2) {
    //   setLastPlayed(true);
    // }
  }, [activeTab]);

  if (!isAuthenticated && isAuthenticated !== null) {
    return (
      <Stack
        align="center"
        sx={{
          background: '#EDD491',
          height: '100vh',
          width: '100%',
        }}
      >
        <Text
          weight={500}
          pt="100px"
          component="p"
          align="center"
          sx={{ color: 'white', fontSize: '1.8rem' }}
        >
          {t['my-courses'].You_need_to_login_first}
        </Text>
        <Button
          id="btn-myCoursesSignIn"
          size="md"
          radius={20}
          loading={signing}
          styles={{
            root: {
              width: '200px',
            },
            filled: {
              background: '#82B1CF',
              '&:hover': {
                background: '#82B1CF',
              },
            },
            label: {
              color: 'white',
            },
          }}
          onClick={() => {
            setSigning(true);
            router.push('/signin');
          }}
        >
          {t['sign-in']}
        </Button>
      </Stack>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Seo title="my courses" description="Best LMS" path="user/my-courses" />
        <main>
          {isAuthenticated && (
            <>
              <Container p={0}>
                <Card
                  radius={0}
                  sx={{
                    height: 75,
                    //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                    background: 'transparent',
                    paddingLeft: 10,
                  }}
                >
                  <Stack justify="end" sx={{ height: '100%' }}>
                    <Group align="center" position="apart">
                      <Text
                        sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000', fontSize: '16px' }}
                      >
                        {t['my-courses'].title}
                      </Text>
                      {totalResultsLength > 0 ? (
                        <Select
                          id="slt-coursesFilters"
                          className="my-courese"
                          value={filter}
                          onChange={(value) => setFilter(value!)}
                          data={
                            !lastPlayed
                              ? [
                                  { value: 'newest', label: t['my-courses'].newest },
                                  { value: 'recommended', label: t['my-courses'].recommended },
                                  { value: 'popular', label: t['my-courses'].most_popular },
                                ]
                              : [
                                  { value: 'newest', label: t['my-courses'].newest },
                                  {
                                    value: 'lastPlayed',
                                    label: t['my-courses'].last_played_by_you,
                                  },
                                ]
                          }
                          dropdownPosition="flip"
                          icon={
                            router.locale === 'ar-kw' ? (
                              <Filter
                                color={colorScheme == 'dark' ? '#000' : '#298EAE'}
                                width={20}
                                height={15}
                                style={{ position: 'relative', right: '120px', top: '4px' }}
                              />
                            ) : (
                              <Filter
                                color={colorScheme == 'dark' ? '#000' : '#298EAE'}
                                width={20}
                                height={15}
                                style={{ position: 'relative', left: '120px', top: '4px' }}
                              />
                            )
                          }
                          variant="filled"
                          radius={8}
                          size="xs"
                          styles={{
                            rightSection: {
                              zIndex: 0,
                            },
                            input: {
                              height: 35,
                              paddingLeft: '10px !important',
                              background: colorScheme == 'dark' ? '#EDD491' : '#EEEEEE',
                              color: '#000',
                            },
                            wrapper: {
                              maxWidth: '150px',
                            },
                            label: {
                              whiteSpace: 'nowrap',
                            },
                            selected: {
                              background: 'transparent',
                              color: colorScheme == 'dark' ? '#EDD491' : '#298EAE',
                            },
                            dropdown: {
                              borderRadius: '20px',
                              borderColor: colorScheme == 'dark' ? '#EDD491' : '#298EAE',
                              borderWidth: 0.5,
                            },
                            item: {
                              whiteSpace: 'nowrap',
                              borderRadius: '20px',
                              //backgroundColor : 'red',
                            },
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </Group>
                  </Stack>
                </Card>
              </Container>
              <Space h="md" />
              <Container mb={30} px={0} pb={70}>
                <ProgressTab
                  filter={filter}
                  setInprogessCheck={setInprogessCheck}
                  InprogessCheck={isProgressCheck}
                />
                {/* <TabsHeader onChange={setActiveTab}>
                  <Tabs.Tab label={t['my-courses'].discover} tabKey="Discover">
                    <Discover
                      filter={filter}
                      setDiscoverCheck={setDiscoverCheck}
                      discoverCheck={discoverCheck}
                    />
                  </Tabs.Tab>
                  <Tabs.Tab label={t['my-courses'].inprogress} tabKey="In Progress">
                    <ProgressTab
                      filter={filter}
                      setInprogessCheck={setInprogessCheck}
                      InprogessCheck={isProgressCheck}
                    />
                  </Tabs.Tab>
                  <Tabs.Tab label={t['my-courses'].completed} tabKey="Completed">
                    <CourseCompletedTab
                      filter={filter}
                      setcompletedCheck={setcompletedCheck}
                      completedCheck={completedCheck}
                    />
                  </Tabs.Tab>
                </TabsHeader> */}
              </Container>
            </>
          )}
        </main>
      </>
    );
  }
  return null;
};

//@ts-ignore
MyCourses.getLayout = (page) => (
  <>
    <MainLayout>{page}</MainLayout>
  </>
);

export default MyCourses;
