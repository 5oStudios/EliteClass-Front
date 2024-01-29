import { LiveSessionLessionsTab } from '@/components/screens/live-sessions/tabs/live-classes';
import { LiveSessionOverviewTab } from '@/components/screens/live-sessions/tabs/overview';
import { Seo } from '@/components/seo';
import { Booking, BookmarkIcon, CalendarIcon, Clock, SocialShare } from '@/src/constants/icons';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Stack,
  Tabs,
  Text,
  Modal,
  Affix,
  Box,
  Spoiler,
  BackgroundImage,
  Loader,
  useMantineColorScheme,
} from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { showNotification } from '@mantine/notifications';
import { UnbookmarkIcon } from '@/src/constants/icons/unbookmark';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import moment from 'moment-timezone';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';
import { StarFav } from '@/src/constants/icons/star-fav';
import { StarNonFav } from '@/src/constants/icons/star-non-fav';

const LiveSessionOverview = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { slug, type = '', purchased } = router.query;
  console.log(type);

  const [alreadyPurchased, setAlreadyPurchased] = React.useState(false);
  const [sessiondetail, setSessionDetail] = React.useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [booking, setBooking] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [bookmarked, setBookmarked] = React.useState<Boolean>(false);
  const [bookmarkeddisable, setBookMarkedDisable] = React.useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const isUser = getCookie('access_token');
  const [signing, setSigning] = useState<boolean>(false);
  const [divHeight1, setDivHeight1] = useState<any>(0);
  const [divHeight2, setDivHeight2] = useState<any>(0);
  const [divHeight3, setDivHeight3] = useState<any>(0);
  const [is_cart, setIsCart] = React.useState(false);
  const [cartLoading, setCartLoading] = React.useState(false);
  const { colorScheme } = useMantineColorScheme();

  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);

  useEffect(() => {
    setDivHeight1(ref1?.current?.clientHeight);
    setDivHeight2(ref2?.current?.clientHeight);
    setDivHeight3(ref3?.current?.clientHeight);
    // console.log('height1: ', ref1.current.clientHeight);
    // console.log('height2: ', ref2.current.clientHeight);
    // console.log('height3: ', ref3.current.clientHeight);
  }, []);

  useEffect(() => {
    setBooking(false);
    setSigning(false);
  }, [router]);

  useEffect(() => {
    if (slug) {
      axios
        .get(`meeting/detail/${slug}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&&type=${type}`)
        .then((response) => {
          console.log('sessions-details', response);
          if (response.data.discount_type !== null && response.data.discount_price !== 0) {
            if (response.data.discount_type == 'fixed') {
              response.data.discount_price = response.data.price - response.data.discount_price;
            } else if (response.data.discount_type == 'percentage') {
              response.data.discount_price =
                response.data.price * ((100 - response.data.discount_price) / 100);
            }
          } else {
            response.data.discount_price = response.data.price;
          }

          setSessionDetail(response?.data);
          setIsCart(response?.data?.is_cart);
          setIsLoading(false);
          setBookmarked(response?.data?.in_wishlist);
          if (response?.data?.order_id === null || response?.data?.order_id === '') {
            setAlreadyPurchased(false);
            setActiveTab(1);
          } else {
            setAlreadyPurchased(true);
            setActiveTab(2);
          }
        })
        .catch((error) => {
          console.log('sessions-details', error);
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
          router.push('/');
        });
    }
  }, []);

  const onEnroll = async (isFreeEnroll = false) => {
    // debugger;
    setEnrolling(true);
    let config = {};
    if (isFreeEnroll) {
      const obj = {
        id: sessiondetail?.id,
        type: 'live-streaming',
      };
      config = {
        method: 'post',
        url: 'free/enroll',
        data: obj,
      };
    } else {
      const obj = {
        meeting_id: sessiondetail?.id,
      };
      config = {
        method: 'post',
        url: 'session/enrollment',
        data: obj,
      };
    }
    try {
      let response = await axios(config);

      setSessionDetail(response?.data);
      //setAlreadyPurchased(true);
      showNotification({
        message: 'Session Enrolled Successfuly!',
        color: 'green',
      });
      setEnrolling(false);
      window.location.reload();
    } catch (error: any) {
      setEnrolling(false);
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
    }
  };

  async function savedAsBookmark() {
    setBookMarkedDisable(true);
    if (isUser != undefined) {
      if (slug) {
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          meeting_id: slug,
        };
        const config = {
          method: 'post',
          url: 'addtowishlist',
          data: obj,
        };
        await axios(config)
          .then((response) => {
            console.log('saved live-session', response);
            showNotification({ message: response?.data, color: 'green' });
            setBookmarked(true);
          })
          .catch((error) => {
            console.log('saved live-session', error);
            setBookmarked(false);
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

  const removeBookmark = async () => {
    setBookMarkedDisable(true);
    if (isUser != undefined) {
      if (slug) {
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          meeting_id: slug,
        };
        const config = {
          method: 'post',
          url: 'remove/wishlist',
          data: obj,
        };
        await axios(config)
          .then((response) => {
            console.log('saved live-session', response);
            showNotification({ message: response?.data, color: 'green' });
            setBookmarked(false);
          })
          .catch((error) => {
            console.log('saved live-session', error);
            setBookmarked(true);
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
  };

  const meetingToCart = async () => {
    setCartLoading(true);
    const obj = {
      meeting_id: sessiondetail?.id,
    };
    console.log('COURSEID:', obj);
    const config = {
      method: 'post',
      url: is_cart ? 'remove/cart' : 'addtocart/meeting',
      data: obj,
    };
    const res = await axios(config)
      .then(async (response: any) => {
        // router.back();

        showNotification({
          message: is_cart
            ? 'Session removed from cart successfuly!'
            : 'Session added to cart successfuly!',
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

  function renderEnrollButton(isFreeEnroll = false) {
    // debugger;
    return (
      <Stack
        id="btn-livesessionEnroll"
        onClick={() => !enrolling && onEnroll(isFreeEnroll)}
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
          <Text sx={{ fontSize: '20px', color: '#000000', fontWeight: 500 }}>
            {t.enroll_session}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
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
                id="btn-liveSignInModalCancel"
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
                id="btn-liveSignInModalSignIn"
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
      <Seo title="session overview" description="Best LMS" path={`live-sessions/${slug}`} />
      <main>
        <Container p={0} ref={ref1}>
          <PageHeader
            title={sessiondetail?.meeting_title}
            rightSection={
              <Group noWrap spacing={2} mr={10}>
                {/* {sessiondetail?.order_id == null ? (
                  !sessiondetail?.isPartOfCourse ? (
                    !bookmarked ? (
                      <ActionIcon
                        disabled={bookmarkeddisable}
                        variant="transparent"
                        onClick={savedAsBookmark}
                      >
                        <BookmarkIcon />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        disabled={bookmarkeddisable}
                        variant="transparent"
                        onClick={removeBookmark}
                      >
                        <UnbookmarkIcon />
                      </ActionIcon>
                    )
                  ) : null
                ) : null} */}

                <ActionIcon
                  id="btn-livesessionShare"
                  variant="transparent"
                  onClick={() => {
                    //ZK: Share code triggering native view in mobile app
                    // @ts-ignore
                    if (window?.ReactNativeWebView === undefined) {
                      //This means we are not in ReactNative webView so open in new link as target blanks
                      window.open(`/live-sessions/${slug}`, '_blank');
                    } else {
                      const url = `${process.env.NEXT_PUBLIC_FE_URL}live-sessions/${slug}`;

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
        </Container>

        {!alreadyPurchased ? (
          <>
            <SimpleGrid
              sx={{
                gridTemplateRows: '1fr max-content',
                height: `calc(100vh - ${divHeight1}px)`,
                //backgroundColor: 'yellow',
              }}
            >
              <Container sx={{ width: '100%' }}>
                <Group ref={ref2} position="apart" py={20}>
                  <Stack>
                    <SimpleGrid sx={{ gridTemplateColumns: '30px 1fr', gap: 0 }}>
                      <CalendarIcon color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
                      <Text
                        size="sm"
                        dir="ltr"
                        align="left"
                        sx={{
                          color: '#939393',
                        }}
                      >
                        {moment
                          .utc(sessiondetail?.date_time)
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format('D MMM, YYYY')}
                      </Text>
                    </SimpleGrid>
                    <SimpleGrid sx={{ gridTemplateColumns: '30px 1fr', gap: 0, marginLeft: '3px' }}>
                      <Clock color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
                      <Text
                        size="sm"
                        dir="ltr"
                        align="left"
                        sx={{
                          color: '#939393',
                        }}
                      >
                        {moment
                          .utc(sessiondetail?.date_time)
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format('hh:mm a')}
                      </Text>
                    </SimpleGrid>
                  </Stack>
                  <Text
                    size="xl"
                    weight={500}
                    mt={-5}
                    sx={{ alignSelf: 'start', color: '#82B1CF' }}
                  >
                    {parseInt(sessiondetail?.discount_price || 0) == 0
                      ? `${t.free}`
                      : `${parseInt(sessiondetail?.discount_price || 0)}KWD`}
                  </Text>
                </Group>
                <Divider sx={{ borderColor: '#E4F2FF' }} />
                <Stack
                  pt={20}
                  style={{
                    maxHeight: `calc(100vh - ${divHeight1 + divHeight2 + divHeight3 + 100}px)`,
                    //backgroundColor: 'red',
                  }}
                >
                  <Text weight={500}>{t['session-details'].about_this_livesession}</Text>
                  <Stack style={{ overflow: 'scroll' }}>
                    <Spoiler
                      maxHeight={50}
                      styles={{
                        content: {
                          padding: 0,
                          fontSize: 12,
                        },
                        control: {
                          color: 'blue',
                          fontSize: '12px',
                        },
                      }}
                      showLabel={t.more}
                      hideLabel=""
                    >
                      <Box
                        pb={5}
                        sx={{ color: '#6B6666' }}
                        dangerouslySetInnerHTML={{ __html: sessiondetail?.agenda }}
                      />
                    </Spoiler>
                  </Stack>
                </Stack>
              </Container>

              <Stack spacing={0} sx={{ justifyContent: 'end' }}>
                <Stack spacing={0} ref={ref3}>
                  <Text size="lg" p={15} pt={0}>
                    {t.instructor}
                  </Text>
                  <Card
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      router.push(`/instructors/${sessiondetail?.instructor?.id}`);
                    }}
                  >
                    <SimpleGrid
                      sx={{
                        gridTemplateColumns: 'max-content 1fr max-content',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar size="lg" radius="xl">
                        {sessiondetail?.instructor?.image && (
                          <ImageWithFallback
                            //src = {sessiondetail?.instructor?.image}
                            src={
                              sessiondetail?.instructor?.image ||
                              `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${sessiondetail?.instructor?.name}`
                            }
                            layout="fill"
                            fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${sessiondetail?.instructor?.name}`}
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          />
                        )}
                      </Avatar>
                      <Stack spacing={0}>
                        <Text size="xs" weight={500}>
                          {sessiondetail?.instructor?.name}
                        </Text>
                        <Text
                          size="xs"
                          sx={(theme) => ({ color: theme.other.secondaryWriteColor })}
                        >
                          <EllipsisText
                            text={sessiondetail?.instructor?.short_info || ''}
                            length={60}
                          />
                        </Text>
                      </Stack>
                      <ChevronRightIcon className="rtl" width={30} height={30} />
                    </SimpleGrid>
                  </Card>
                </Stack>
                <Space h={80} />

                {sessiondetail?.order_id === null &&
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
                      {sessiondetail?.is_purchased ? (
                        renderEnrollButton(false)
                      ) : sessiondetail?.discount_price ? (
                        renderEnrollButton(true)
                      ) : (
                        <Stack
                          id="btn-livesessionAddToCart"
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
                              //console.log('CARTED:', data?.course?.is_chapter_carted);
                              isUser != undefined ? meetingToCart() : setOpenConfirmModal(true);
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
                                {`${parseInt(sessiondetail?.discount_price)} KW`}
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
                        id="btn-liveViewCart"
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

                {/* {sessiondetail?.order_id === null && type !== 'in-person' ? (
                  <Affix
                    position={{ bottom: 30, left: '50%' }}
                    zIndex={2}
                    sx={{
                      transform: 'translateX(-50%)',
                      width: '350px',
                      maxWidth: '100%',
                      display: 'flex',
                    }}
                  >
                    <Button
                      size="md"
                      radius={8}
                      mx={10}
                      sx={{ width: '100%' }}
                      loading={booking}
                      onClick={() =>
                        isUser != undefined
                          ? (setBooking(true),
                            router.replace({
                              pathname: `/live-sessions/${slug}/booking`,
                              query: router.query,
                            }))
                          : setOpenConfirmModal(true)
                      }
                    >
                      <Booking />
                      <Text ml={10} color="black" weight={300}>
                        {t['session-details'].book_class}
                      </Text>
                    </Button>
                  </Affix>
                ) : null} */}
              </Stack>
            </SimpleGrid>
            <Space h="xl" />
          </>
        ) : (
          <>
            <Space h={25} />
            <Container p={0}>
              <Tabs
                p={0}
                tabPadding="xs"
                variant="unstyled"
                active={activeTab}
                onTabChange={setActiveTab}
                styles={(theme) => ({
                  root: {
                    padding: '10px',
                  },
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
                    width: `calc(100% - 20px)`,
                    //padding: '0px 0px 10px 0px',
                    borderRadius: 20,
                    backgroundColor: '#F7F6F5',
                    marginLeft: '10px',
                    marginRight: '10px',
                  },
                  tabActive: {
                    backgroundColor: '#FFDD83',
                    color: '#000',
                  },
                })}
              >
                <Tabs.Tab id="tab-liveSessionsOverview" label={t.overview} p={0}>
                  <LiveSessionOverviewTab
                    divHeight1={divHeight1}
                    divHeight2={divHeight2}
                    divHeight3={divHeight3}
                    livetabdata={sessiondetail}
                  />
                </Tabs.Tab>
                <Tabs.Tab id="tab-liveClass" label={t['live-class']}>
                  <LiveSessionLessionsTab
                    date_time={sessiondetail?.date_time}
                    url={sessiondetail?.url}
                    class_id={sessiondetail?.class_id}
                    is_ended={sessiondetail?.is_ended}
                    is_complete={sessiondetail?.is_complete}
                    isPartOfCourse={sessiondetail?.isPartOfCourse}
                    isStarted={sessiondetail?.is_started}
                  />
                </Tabs.Tab>
              </Tabs>
            </Container>
          </>
        )}
      </main>
    </>
  );
};

export default LiveSessionOverview;
