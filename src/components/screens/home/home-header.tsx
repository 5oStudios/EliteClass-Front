import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Paper,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Bell } from '@/src/constants/icons/bell';
import { BellDark } from '@/src/constants/icons/bell-dark';
import { HomeLogo } from '@/src/constants/icons/home-logo';
import { HomeLogoDark } from '@/src/constants/icons/home-logo-dark';
import { FilterDrawer } from './filter-drawer';
import { Categories } from '@/src/constants/icons/categories';
import { useQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { getHomeContent } from '@/utils/axios/getHomeContent';
import CrossIcon from '@/src/constants/icons/cross';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { FilterButton } from '@/components/ui/FilterButton';
import { getCookie } from 'cookies-next';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { MessageIcon } from '@/src/constants/icons';
import { SearchIcon } from '@/src/constants/icons/search-icon';
import { Cart } from '@/src/constants/icons/cart';

export const HomeHeader = ({
  setData,
  setIsLoading,
  setResultLoading,
  setShowSearchResults,
  showSearchResults,
  setSearchData,
  initialData,
}: any) => {
  const isUser = getCookie('access_token');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [rating, setRating] = useState('null');
  const [cost, setCost] = useState<[number, number]>([0, 10000]);
  const [duration, setDuration] = useState<[number, number]>([0, 500]);
  const [applyFilters, setApplyFilters] = useState(false);
  const [signing, setSigning] = useState<boolean>(false);
  const router = useRouter();
  const [query, setQuery] = useState(
    router.asPath.includes('?search=') && !router.asPath.includes('&')
      ? router.asPath.split('=')[1]
      : ''
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [getHomeData, setGetHomeData] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  // language
  const t = router.locale === 'ar-kw' ? ar : en;
  // language

  function getSelectedLang() {
    const langFromCookie = getCookie('NEXT_LOCALE');
    let lang = 'en-us';
    if (langFromCookie) {
      // @ts-ignore
      lang = langFromCookie;
    }
    return lang.split('-')[0];
  }

  const { isLoading, isRefetching } = useQuery<any, any>(
    ['home', rating, cost[0], cost[1], duration[0], duration[1]],
    () =>
      getHomeContent({
        appSelectedLanguage: getSelectedLang(),
        cost,
        duration,
        rating,
        auth: isUser as string,

        ...(isUser === undefined && {
          //@ts-ignore
          category_id: JSON.parse(getCookie('initial_country')).id,
        }),
        ...(isUser === undefined && {
          scnd_category_id:
            //@ts-ignore
            JSON.parse(getCookie('initial_type')).id,
        }),
        ...(isUser === undefined && {
          //@ts-ignore
          sub_category: JSON.parse(getCookie('initial_stage')).id,
        }),
        ...(isUser === undefined && {
          //@ts-ignore
          ch_sub_category: JSON.parse(getCookie('initial_major')).id,
        }),
      }),
    {
      initialData,
      enabled: getHomeData,
      onSuccess: (data) => {
        setData(data);
        setApplyFilters(false);
        setGetHomeData(false);
      },
      onError: (err) => {
        console.log({ err });
        showNotification({
          message: 'Something went wrong',
          color: 'red',
        });
      },
    }
  );

  const {
    refetch,
    isLoading: resultLoading,
    isFetching: resultRefetching,
  } = useQuery<any, any>(
    ['search', decodeURIComponent(query)],
    () =>
      getHomeContent({
        appSelectedLanguage: getSelectedLang(),
        cost,
        duration,
        rating,
        search: decodeURIComponent(query),
        auth: isUser as string,

        ...(isUser === undefined && {
          //@ts-ignore
          category_id: JSON.parse(getCookie('initial_country')).id,
        }),
        ...(isUser === undefined && {
          //@ts-ignore
          scnd_category_id: JSON.parse(getCookie('initial_type')).id,
        }),
        ...(isUser === undefined && {
          //@ts-ignore
          sub_category: JSON.parse(getCookie('initial_stage')).id,
        }),
        ...(isUser === undefined && {
          //@ts-ignore
          ch_sub_category: JSON.parse(getCookie('initial_major')).id,
        }),
      }),
    {
      enabled: false,
      keepPreviousData: true,
      onSuccess: (data) => {
        data.packages.data.forEach((el: any) => {
          if (el.discount_type !== null && el.discount_price !== 0) {
            el.haveOffer = true;
            if (el.discountType === 'fixed') {
              el.discountAmount = `${Number(el.discount_price).toFixed(2)} KWD`;
              console.log(el.discountAmount);

              el.discount_price = el.price - el.discount_price;
            } else {
              el.discountAmount = `${Number(el.discount_price).toFixed(2)} %`;
              console.log(el.discountAmount, el.price);

              el.discount_price = ((100 - el.discount_price) / 100) * el.price;
            }
          }
        });
        data.courses.data.forEach((el: any) => {
          if (el.discount_type !== null && el.discount_price !== 0) {
            el.haveOffer = true;
            if (el.discountType === 'fixed') {
              el.discountAmount = `${el.price} KWD`;
              el.discount_price = el.price - el.discount_price;
            } else {
              el.discountAmount = `${el.price} %`;
              el.discount_price = ((100 - el.discount_price) / 100) * el.price;
            }
          }
        });

        setApplyFilters(false);
        setSearchData(data);
      },
      onError: (err) => {
        console.log({ err });
        showNotification({
          message: 'Something went wrong',
          color: 'red',
        });
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setSigning(false);
  }, [router]);

  useEffect(() => {
    setIsLoading(isLoading || isRefetching);
  }, [isLoading, isRefetching]);

  useEffect(() => {
    setResultLoading(resultLoading || resultRefetching);
  }, [resultLoading, resultRefetching]);

  const handleFilters = (props: any) => {
    setRating(props.rating);
    setCost(props.cost);
    setDuration(props.duration);
    setGetHomeData(true);
    setIsFilterDrawerOpen(false);
  };

  return (
    <>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t['login-popup']}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-homeModalCancel"
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
                id="btn-homeModalSignIn"
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
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          setIsOpen={setIsFilterDrawerOpen}
          handleFilter={handleFilters}
          applyFilters={applyFilters}
          setApplyFilters={setApplyFilters}
        />
      </Portal>
      <Paper
        sx={(theme) => ({
          height: 'max-content',
          backgroundColor: colorScheme == 'dark' ? '#333333' : '#ffffff',
        })}
      >
        <Container>
          <Stack my={25}>
            {!showSearchResults && (
              <Group align="center" position="apart">
                <Group>
                  {colorScheme === 'light' ? <HomeLogo /> : <HomeLogoDark />}
                  <Button
                    id="btn-selectCategories"
                    variant="light"
                    color="gray"
                    size="xs"
                    radius={10}
                    px={10}
                    styles={{
                      label: { color: '#200E32', fontWeight: 300 },
                      light: { background: '#EDF2F7' },
                      leftIcon: { marginRight: '5px' },
                    }}
                    leftIcon={<Categories />}
                    onClick={() => {
                      router.push('/user/onboarding');
                    }}
                  >
                    {t['home-categories']}
                  </Button>
                </Group>
                {isUser != undefined && (
                  <Group spacing={6}>
                    <ActionIcon
                      variant="transparent"
                      id="btn-notifications"
                      onClick={() =>
                        isUser != undefined
                          ? router.push('/user/notifications')
                          : setOpenConfirmModal(true)
                      }
                    >
                      {colorScheme === 'light' ? <Bell /> : <BellDark />}
                    </ActionIcon>
                    {
                      <ActionIcon
                        variant="transparent"
                        id="btn-cart"
                        onClick={() =>
                          isUser != undefined
                            ? router.push('/user/cart')
                            : setOpenConfirmModal(true)
                        }
                      >
                        {initialData?.cart_count > 0 && (
                          <Stack
                            sx={{
                              position: 'absolute',
                              height: 15,
                              width: 15,
                              background: '#298EAE',
                              borderRadius: '100%',
                              top: -2,
                              right: -2,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text sx={{ fontSize: 10, color: 'white', fontWeight: 500 }}>
                              {initialData?.cart_count}
                            </Text>
                          </Stack>
                        )}
                        {colorScheme === 'dark' ? <Cart dark /> : <Cart />}
                      </ActionIcon>
                    }
                  </Group>
                )}
              </Group>
            )}
            <SimpleGrid
              sx={{
                gridTemplateColumns: showSearchResults ? 'max-content 1fr' : '1fr max-content',
                justifyContent: 'space-between',
                alignItems: 'center',
                //backgroundColor : 'red'
              }}
            >
              {showSearchResults && (
                <ActionIcon
                  variant="transparent"
                  onClick={() => {
                    setGetHomeData(true);
                    setQuery('');
                    setShowSearchResults(false);
                    router.push('/');
                  }}
                >
                  <ArrowLeftIcon className="rtl" width={40} height={40} />
                </ActionIcon>
              )}
              <Box
                component="form"
                onSubmit={(e: any) => {
                  e.preventDefault();
                  if (query) {
                    refetch();
                    setShowSearchResults(true);
                    router.push(`/?search=${query}`, undefined, {
                      shallow: true,
                    });
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                }}
              >
                <TextInput
                  variant="filled"
                  id="inp-search"
                  icon={
                    <Box>
                      <SearchIcon color={colorScheme == 'dark' ? '#298EAE' : '#ACB7CA'} />
                    </Box>
                  }
                  //placeholder={t.home.search}
                  type="search"
                  value={decodeURIComponent(query)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  radius={8}
                  sx={{
                    height: '100%',
                  }}
                  styles={{
                    root: { width: '100%' },

                    input: {
                      background: '#F7F6F5',
                      color: 'black',
                      //' linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #F4F9FE',
                    },
                    icon: {
                      marginTop: 5,
                    },
                    rightSection: {
                      display: !query ? 'none' : 'flex',
                    },
                  }}
                  rightSection={
                    <ActionIcon onClick={() => setQuery('')}>
                      <CrossIcon />
                    </ActionIcon>
                  }
                />
                {showSearchResults && (
                  <ActionIcon type="submit" variant="transparent">
                    <Text size="xs" sx={{ color: '#ACB7CA' }}>
                      {t.home.search}
                    </Text>
                  </ActionIcon>
                )}
              </Box>
              {!showSearchResults && (
                <FilterButton
                  onClick={() => setIsFilterDrawerOpen(true)}
                  duration={duration}
                  cost={cost}
                  rating={rating}
                  transparent={false}
                />
              )}
            </SimpleGrid>
          </Stack>
        </Container>
      </Paper>
    </>
  );
};
