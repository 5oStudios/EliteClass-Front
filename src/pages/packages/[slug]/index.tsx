import { CoursesCarousal } from '@/components/screens/home/carousals/courses-carousal';
import { Seo } from '@/components/seo';
// import { coursesData } from '@/src/constants/data/carousal-data';
import { BookmarkIcon, SocialShare } from '@/src/constants/icons';
import {
  ActionIcon,
  Affix,
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import axios from '@/components/axios/axios.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { UnbookmarkIcon } from '@/src/constants/icons/unbookmark';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import momentWithTimeZone from 'moment-timezone';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { StarFav } from '@/src/constants/icons/star-fav';
import { StarNonFav } from '@/src/constants/icons/star-non-fav';

const PackagesDetails = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { slug } = router.query;
  const isBundled = true;
  console.log('slug', slug);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(false);
  const [coursesData, setCoursesData] = React.useState<any>(null);
  const [packagesData, setPackagesData] = React.useState<any>(null);

  const [bookmarked, setBookmarked] = React.useState<Boolean>(false);
  const [bookmarkeddisable, setBookMarkedDisable] = React.useState<boolean>(false);
  const [signing, setSigning] = React.useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [is_cart, setIsCart] = React.useState(false);
  const [cartLoading, setCartLoading] = React.useState(false);
  const [enrolling, setEnrolling] = React.useState(false);

  const isUser = getCookie('access_token');

  useEffect(() => {
    setBooking(false);
    setSigning(false);
  }, [router]);

  useEffect(() => {
    const config = {
      method: 'get',
      url: `bundle/detail/${slug}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        setCoursesData(response?.data?.courses?.data);
        setPackagesData(response?.data);
        setIsCart(response?.data?.is_cart);
        setBookmarked(response?.data?.in_wishlist);
      })
      .catch((error) => {
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          let err = error?.response?.data?.errors;
          if (err) {
            Object.keys(err).map((i) => {
              err[i].map((item: any) => {
                showNotification({
                  message: item,
                  color: 'red',
                });
              });
            });
            router.push('/');
          }
        }
      });
  }, []);

  // wishlist for packages
  async function savedAsBookmark() {
    if (isUser != undefined) {
      if (slug) {
        setBookMarkedDisable(true);
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          bundle_id: slug,
        };
        const config = {
          method: 'post',
          url: 'addtowishlist',
          data: obj,
        };
        await axios(config)
          .then((response) => {
            showNotification({ message: response?.data, color: 'green' });
            setBookmarked(true);
          })
          .catch((error) => {
            if (error?.message === 'Network Error') {
              showNotification({
                message: 'Network error',
                color: 'red',
              });
            }
            if (error?.response?.status == 401) {
              setOpenConfirmModal(true);
            } else {
              //@ts-ignore
              let err = error?.response?.data?.errors;
              if (err) {
                Object.keys(err).map((i) => {
                  err[i].map((item: any) => {
                    showNotification({
                      message: item,
                      color: 'red',
                    });
                  });
                });
              }
            }
          });
      }
    } else {
      setOpenConfirmModal(true);
    }
    setBookMarkedDisable(false);
  }

  async function removeBookmark() {
    if (isUser != undefined) {
      if (slug) {
        setBookMarkedDisable(true);
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          bundle_id: slug,
        };
        const config = {
          method: 'post',
          url: 'remove/wishlist',
          data: obj,
        };
        await axios(config)
          .then((response) => {
            showNotification({ message: response?.data, color: 'green' });
            setBookmarked(false);
          })
          .catch((error) => {
            if (error?.message === 'Network Error') {
              showNotification({
                message: 'Network error',
                color: 'red',
              });
            }
            if (error?.response?.status == 401) {
              setOpenConfirmModal(true);
            } else {
              //@ts-ignore
              let err = error?.response?.data?.errors;
              if (err) {
                Object.keys(err).map((i) => {
                  err[i].map((item: any) => {
                    showNotification({
                      message: item,
                      color: 'red',
                    });
                  });
                });
              }
            }
          });
      }
    } else {
      setOpenConfirmModal(true);
    }
    setBookMarkedDisable(false);
  }

  const bundleToCart = async () => {
    setCartLoading(true);
    const obj = {
      bundle_id: packagesData?.id,
    };
    const config = {
      method: 'post',
      url: is_cart ? 'remove/cart' : 'addtocart/bundle',
      data: obj,
    };
    const res = await axios(config)
      .then(async (response: any) => {
        // router.back();

        showNotification({
          message: is_cart
            ? 'Bundle removed from cart successfuly!'
            : 'Bundle added to cart successfuly!',
          color: 'green',
        });
        setCartLoading(false);

        setIsCart(!is_cart);
        //let updatedData = { ...data, is_cart: data?.is_cart ? false : true };

        //setDetails(updatedData);
        //Loading(false);
      })
      .catch((error: any) => {
        setCartLoading(false);
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          let err = error?.response?.data?.errors;
          if (err) {
            Object.keys(err).map((i) => {
              err[i].map((item: any) => {
                showNotification({
                  message: item,
                  color: 'red',
                });
              });
            });
          }
        }
      });
  };

  const onPackageEnroll = async () => {
    setEnrolling(true);
    const obj = {
      type: 'package',
      id: packagesData?.id,
    };
    const config = {
      method: 'post',
      url: 'free/enroll',
      data: obj,
    };
    try {
      let response = await axios(config);
      setPackagesData(response?.data);
      showNotification({
        message: 'Package Enrolled Successfuly!',
        color: 'green',
      });

      setEnrolling(false);
      window.location.reload();
    } catch (error) {
      setEnrolling(false);
      if ((error as any)?.message === 'Network Error') {
        showNotification({
          message: 'Network error',
          color: 'red',
        });
      }
      if ((error as any)?.response?.status == 401) {
        setOpenConfirmModal(true);
      } else {
        //@ts-ignore
        let err = error?.response?.data?.errors;
        if (err) {
          Object.keys(err).map((i) => {
            err[i].map((item: any) => {
              showNotification({
                message: item,
                color: 'red',
              });
            });
          });
        }
      }
    }
    setEnrolling(false);
  };

  return (
    <div>
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
                id="btn-packagesModalCancel"
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
                id="btn-packagesModalSignIn"
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
      <Seo title="session overview" description="Best LMS" path={`packages/${slug}`} />
      <main>
        <PageHeader
          title={packagesData?.title}
          rightSection={
            <Group noWrap spacing={2} mr={10}>
              {packagesData?.order_id == null ? (
                !bookmarked ? (
                  <ActionIcon
                    id="btn-packageSaved"
                    disabled={bookmarkeddisable}
                    variant="transparent"
                    onClick={savedAsBookmark}
                  >
                    <BookmarkIcon color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    id="btn-packageUnsaved"
                    disabled={bookmarkeddisable}
                    variant="transparent"
                    onClick={removeBookmark}
                  >
                    <UnbookmarkIcon color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
                  </ActionIcon>
                )
              ) : null}

              <ActionIcon
                variant="transparent"
                id="btn-packageShare"
                onClick={() => {
                  //ZK: Share code triggering native view in mobile app
                  // @ts-ignore
                  if (window?.ReactNativeWebView === undefined) {
                    //This means we are not in ReactNative webView so open in new link as target blanks
                    window.open(`/packages/${slug}`, '_blank');
                  } else {
                    const url = `${process.env.NEXT_PUBLIC_FE_URL}packages/${slug}`;
                    const shareableObject = {
                      event: 'share',
                      url,
                    };
                    const objStringfy = JSON.stringify(shareableObject);
                    // @ts-ignore
                    window.ReactNativeWebView.postMessage(objStringfy);
                  }
                }}
              >
                <SocialShare color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
              </ActionIcon>
            </Group>
          }
        />
        {isLoading ? (
          <LoadingScreen isLoading={isLoading} />
        ) : (
          <>
            <Container mt={-10} sx={{}}>
              <Stack spacing={5} sx={{ width: '100%' }} py={10}>
                <Group position="apart" noWrap>
                  <Text
                    size="lg"
                    weight={500}
                    sx={{ color: colorScheme == 'dark' ? '#ffffff' : '#298EAE' }}
                  >
                    {parseInt(packagesData?.discount_price || 0) == 0
                      ? `${t.free}`
                      : `${parseInt(packagesData?.discount_price || 0)}KWD`}
                  </Text>
                  <Text size="xs" sx={{ textDecoration: 'line-through', color: '#ACB7CA' }}>
                    {parseInt(packagesData?.price || 0)}KWD
                  </Text>
                </Group>
                <Stack spacing={8}>
                  <Group noWrap align="center">
                    <Text
                      size="xs"
                      sx={(theme) => ({
                        color: colorScheme == 'dark' ? theme?.colors[5] : '#000000',
                      })}
                    >
                      {t['bundle-detail']['last-updated']} :
                    </Text>
                    <Text
                      component="span"
                      dir="ltr"
                      size="xs"
                      sx={{ color: colorScheme == 'dark' ? '#ffffff' : '#298EAE' }}
                    >
                      {momentWithTimeZone
                        .utc(packagesData?.last_updated)
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format('MMM D, YYYY')}
                    </Text>
                  </Group>
                  <Group noWrap align="center">
                    <Text
                      size="xs"
                      sx={(theme) => ({
                        color: colorScheme == 'dark' ? theme?.colors[5] : '#000000',
                      })}
                    >
                      {t['bundle-detail']['no-of-courses']} :
                    </Text>
                    <Text
                      component="span"
                      size="xs"
                      sx={{ color: colorScheme == 'dark' ? '#ffffff' : '#298EAE' }}
                    >
                      {packagesData?.total_courses}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Container>
            <Space h="xl" />
            <Container>
              <Stack>
                <Text>{t['bundle-detail']['about-this-package']}</Text>
                <Stack style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                  <Spoiler
                    sx={{ fontSize: 12, color: '#939393' }}
                    styles={(theme) => ({
                      control: {
                        fontSize: 12,
                        color: theme.colorScheme === 'light' ? 'blue' : theme?.colors[5],
                      },
                    })}
                    maxHeight={90}
                    showLabel={t.more}
                    hideLabel=""
                  >
                    <Box
                      sx={{ color: colorScheme == 'dark' ? '#ffffff' : '#298EAE' }}
                      dangerouslySetInnerHTML={{ __html: packagesData?.detail }}
                    />
                    <Space h={10} />
                  </Spoiler>
                </Stack>
              </Stack>
            </Container>
            <Container my={30} p="xs">
              <Group position="apart" align="center">
                <Text
                  sx={{
                    fontSize: '16px',
                    '@media (min-width: 640px)': {
                      fontSize: '24px',
                    },
                  }}
                  weight={500}
                >
                  {t.courses}
                </Text>
                <Link
                  href={{
                    pathname: '/packages/[slug]/courses',
                    query: { slug, isBundled },
                  }}
                  passHref
                >
                  <Anchor
                    sx={(theme) => ({
                      color: theme.other.headingColor,
                      '@media (min-width: 640px)': {
                        fontSize: '16px',
                      },
                    })}
                    size="xs"
                  >
                    <span>{t['see-all']}</span>
                    <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 2 }} />
                  </Anchor>
                </Link>
              </Group>
              <Space h="xs" />
              {coursesData !== '' ? (
                <CoursesCarousal CCarousal={coursesData} isBundled={'true'} />
              ) : null}
              <Space h={50} />
              <Stack px={20}>
                {/* {packagesData?.order_id === null ? (
                  <Affix
                    position={{ bottom: 20, left: '50%' }}
                    sx={{ transform: 'translateX(-50%)', width: 300 }}
                  >
                    <Button
                      size="md"
                      radius={8}
                      fullWidth
                      loading={booking}
                      onClick={() =>
                        isUser != undefined
                          ? (setBooking(true),
                            router.replace({
                              pathname: '/packages/[slug]/booking',
                              query: { slug: router.query.slug },
                            }))
                          : setOpenConfirmModal(true)
                      }
                      mx="auto"
                      sx={{
                        maxWidth: '300px',
                      }}
                      styles={{
                        label: {
                          color: ' #0A0909',
                          fontWeight: 400,
                        },
                      }}
                    >
                      {t['buy-now']}
                    </Button>
                  </Affix>
                ) : null} */}
                {packagesData?.order_id === null &&
                  (!is_cart ? (
                    <Affix
                      position={{ bottom: 15 }}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: '12px',
                      }}
                      zIndex={10}
                    >
                      <ActionIcon
                        id="btn-packageSavedUnsaved"
                        onClick={() => (bookmarked ? removeBookmark() : savedAsBookmark())}
                        disabled={bookmarkeddisable}
                        sx={{
                          width: '15%',
                          height: '44px',
                          borderRadius: '20px',
                          background: '#FFDD83',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {bookmarkeddisable ? (
                          <Loader color={'#298EAE'} size={'sm'} />
                        ) : bookmarked ? (
                          <StarFav />
                        ) : (
                          <StarNonFav />
                        )}
                      </ActionIcon>
                      {parseInt(packagesData?.discount_price) === 0 ? (
                        <Stack
                          id="btn-packageEnroll"
                          onClick={() => !enrolling && onPackageEnroll()}
                          sx={{
                            height: '44px',
                            width: '83%',
                            borderRadius: '20px',
                            background: '#FFDD83',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {enrolling ? (
                            <Loader size="sm" color={'#000'} />
                          ) : (
                            <Text sx={{ fontSize: '18px', color: '#000000', fontWeight: 500 }}>
                              {t.enroll_package}
                            </Text>
                          )}
                        </Stack>
                      ) : (
                        <Stack
                          id="btn-packageAddToCart"
                          sx={{
                            height: '44px',
                            width: '83%',
                            borderRadius: '20px',
                            background: '#F7F6F5',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                          onClick={() => {
                            if (!cartLoading) {
                              isUser != undefined ? bundleToCart() : setOpenConfirmModal(true);
                            }
                          }}
                        >
                          <Text mx={'3vw'} sx={{ fontSize: '15px', color: '#000' }}>
                            {t.full_course_cart}
                          </Text>
                          <Stack
                            sx={{
                              background: '#FFDD83', //is_cart ? '#FFDD83' : '#FFFFFF',
                              height: 44,
                              width: '40%',
                              borderRadius: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                              //opacity: disableAddCourseButton ? 0.5 : 1,
                            }}
                          >
                            {cartLoading ? (
                              <Loader size="sm" color={'#000'} />
                            ) : (
                              <Text sx={{ fontSize: '20px', color: '#000000', fontWeight: 500 }}>
                                {`${parseInt(packagesData?.discount_price || 0)} KW`}
                              </Text>
                            )}
                          </Stack>
                        </Stack>
                      )}
                    </Affix>
                  ) : (
                    <Affix
                      position={{ bottom: 15 }}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        padding: '12px',
                      }}
                      zIndex={10}
                    >
                      <Stack
                        id="btn-packagesViewCart"
                        onClick={() => router.push('/user/cart')}
                        sx={{
                          height: '44px',
                          width: '100%',
                          borderRadius: '20px',
                          background: '#298EAE',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text sx={{ fontSize: 16, color: 'white' }}>{t.view_cart}</Text>
                      </Stack>
                    </Affix>
                  ))}
              </Stack>
            </Container>
          </>
        )}
      </main>
    </div>
  );
};

export default PackagesDetails;
