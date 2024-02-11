import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LessonsTab } from '@/components/screens/course-overview/tabs/lesson';
import { OverviewTab } from '@/components/screens/course-overview/tabs/overview';
import { Seo } from '@/components/seo';
import { CourseStats } from '@/components/ui/course-stats';
import { BookmarkIcon, SocialShare, Star } from '@/src/constants/icons';
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { DiscussionsTab } from '@/components/screens/course-overview/tabs/discussions';
import { useQuery, useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { UnbookmarkIcon } from '@/src/constants/icons/unbookmark';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import { getLessonData, getPosts } from '@/utils/axios/apis';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { WhatsAppIcon } from '@/src/constants/icons/whastsApp';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { StarFav } from '@/src/constants/icons/star-fav';
import { StarNonFav } from '@/src/constants/icons/star-non-fav';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicFileViewer } from '@/components/ui/DynamicFileViewer';

const CourseDetails: NextPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { slug, isBundled } = router.query;
  console.log('line no 52', isBundled);
  // alert(type)

  const [activeTab, setActiveTab] = useState(0);
  const [coursedetails, setCourseDetails] = useState<any>(Object);
  const [instructordetails, setInstructorDetails] = useState<any>(Object);
  const [booking, setBooking] = useState(false);
  const [discussionData, setDiscussionData] = useState<any>(null);
  const [alreadyPurchased, setAlreadyPurchased] = React.useState<Boolean | null>();
  const [bookmarked, setBookmarked] = React.useState<Boolean>(false);
  const [bookmarkeddisable, setBookMarkedDisable] = React.useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const isUser = getCookie('access_token');
  const [playing, setPlaying] = useState(false);
  const [cartLoading, Loading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [is_cart, setCart] = useState(false);
  const [cover, setCover] = useState('');
  const [details, setDetails] = useState<any>({});
  const [refetchChapter, setRefetchChapter] = useState(false);
  const [courseConfirmModal, setCourseConfirmModal] = useState(false);
  const [disableAddCourseButton, setDisableAddCourseButton] = useState(false);
  const [chapterPurchased, setChapterPurchased] = useState(false);
  const [iFrame, setiFrame] = useState();
  const [videoUrl, setVideoUrl] = useState('');
  const [loadUrl, setloadUrl] = useState(false);
  const [cIndex, setCIndex] = useState(-1);
  const [pIndex, setPIndex] = useState(-1);
  const [intro, setInto] = useState();
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    setActiveTab(Number(localStorage.getItem('courses_active_tab') || '0'));
  }, []);

  useEffect(() => {
    setBooking(false);
    setSigning(false);
  }, [router]);

  useEffect(() => {
    localStorage.setItem('courses_active_tab', activeTab.toString());
  }, [activeTab]);
  const getCourseDetails = async (slug: string, isBundled: boolean) => {
    try {
      const response: any = await axios.post('course/detail', {
        course_id: slug,
        is_bundle: isBundled,
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      });
      console.log(response);

      if (
        response.data.course.discount_type !== null &&
        response.data.course.discount_price !== 0
      ) {
        response.data.course.haveOffer = true;
        console.log(response.data.course.discount_price, 'haveoffer');

        if (response.data.course.discount_type === 'fixed') {
          response.data.course.discount_price =
            response.data.course.price - response.data.course.discount_price;
          console.log(response.data.course.discount_price, 'fixed');
        } else {
          console.log(response.data.course.discount_type, 'percent');

          response.data.course.discount_price =
            ((100 - response.data.course.discount_price) / 100) * response.data.course.price;
        }
      }

      return response?.data;
    } catch (error: any) {
      return error?.response;
    }
  };

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery<any, any>(
    ['course', slug, isBundled],
    () => getCourseDetails(slug as string, isBundled as any)
  );

  // const client = useQueryClient();
  // client.prefetchQuery([`courses/lessons`, slug], () =>
  //   getLessonData({ course_id: slug as string })
  // );

  //client.prefetchQuery([`posts`, slug], () => getPosts({ course_id: slug as string }));

  useEffect(() => {
    if (data?.status) {
      data?.data?.errors?.course_id?.map((i: any) => {
        showNotification({
          message: i,
          color: 'red',
        });
      });

      router.push('/');
    }
    if (data) {
      setDetails(data);
      setAlreadyPurchased(data?.course?.order_id !== null);
      setCourseDetails(data?.course);
      setBookmarked(data?.course?.in_wishlist);
      setInstructorDetails(data?.instructor);
      setCart(data?.course?.is_cart);
      setChapterPurchased(data?.course?.is_chapter_purchased);
      //if(data?.course?.image !== "" && data?.course?.image !== null){
      setCover(data?.course?.image);
      //}
      // setWhatlearns(data?.whatlearns);
    }
  }, [data]);
  if (isError) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
      router.push('/');
    }
    router.push('/');
  }

  async function savedAsBookmark() {
    setBookMarkedDisable(true);
    if (isUser != undefined) {
      if (slug) {
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          course_id: slug,
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
      setBookmarked(false);
    }
    setBookMarkedDisable(false);
  }

  const removeBookmark = async () => {
    setBookMarkedDisable(true);
    if (isUser != undefined) {
      if (slug) {
        const obj = {
          secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
          course_id: slug,
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
      setBookmarked(false);
    }
    setBookMarkedDisable(false);
  };

  const courseToCart = async () => {
    Loading(true);
    const obj = {
      course_id: data?.course?.id,
    };
    const config = {
      method: 'post',
      url: is_cart ? 'remove/cart' : 'addtocart/course',
      data: obj,
    };
    const res = await axios(config)
      .then(async (response: any) => {
        // router.back();

        showNotification({
          message: is_cart
            ? 'Course removed from cart successfuly!'
            : 'Course added to cart successfuly!',
          color: 'green',
        });

        setRefetchChapter(!refetchChapter);
        setCart(!is_cart);
        refetch();
        //let updatedData = { ...data, is_cart: data?.is_cart ? false : true };

        //setDetails(updatedData);
        //Loading(false);
      })
      .catch((error: any) => {
        Loading(false);
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

  const onCourseEnroll = async () => {
    setEnrolling(true);
    const obj = {
      type: 'course',
      id: data?.course?.id,
    };
    const config = {
      method: 'post',
      url: 'free/enroll',
      data: obj,
    };
    try {
      let response = await axios(config);
      setCourseDetails(response?.data);
      showNotification({
        message: 'Course Enrolled Successfuly!',
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
    <>
      <LoadingScreen isLoading={isLoading} />
      {!data?.status && (
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
                    id="btn-CoursesSignInModalCancel"
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
                    id="btn-CoursesSignInModalSignIn"
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
          <Modal
            opened={courseConfirmModal}
            onClose={() => setCourseConfirmModal(false)}
            withCloseButton={false}
            centered
          >
            <Card>
              <Stack>
                <Text align="center">
                  You have chapters from this course in your cart. Are you sure to remove chapters
                  of this course and add full course?
                </Text>
                <SimpleGrid cols={2}>
                  <Button
                    id="btn-fullCourseModalCancel"
                    variant="filled"
                    onClick={() => {
                      setCourseConfirmModal(false);
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
                    id="btn-fullCourseModalRemove"
                    variant="filled"
                    onClick={() => {
                      courseToCart();
                      setCourseConfirmModal(false);
                    }}
                    loading={signing}
                    radius={20}
                    //sx={{ width: '50%' }}
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
                    {t.remove}
                  </Button>
                </SimpleGrid>
              </Stack>
            </Card>
          </Modal>
          <Seo title="course details" description="Best LMS" path="" />
          <main>
            {/* <PageHeader
          title={coursedetails?.title}
          rightSection={
            <Group noWrap spacing={2} mr={10}>
              {coursedetails?.order_id == null ? (
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
              ) : null}
              {coursedetails?.order_id != null &&
              coursedetails?.wtsap_link != null &&
              coursedetails?.wtsap_link != '' ? (
                <ActionIcon
                  variant="transparent"
                  onClick={() => {
                    router.push(coursedetails.wtsap_link);
                  }}
                >
                  <WhatsAppIcon />
                </ActionIcon>
              ) : null}
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  //ZK: Share code triggering native view in mobile app
                  const url = `${process.env.NEXT_PUBLIC_FE_URL}courses/${slug}`;
                  // @ts-ignore
                  if (window?.ReactNativeWebView === undefined) {
                    //This means we are not in ReactNative webView so open the new link in another widows of browser
                    window.open(url, '_blank');
                  } else {
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
                <SocialShare />
              </ActionIcon>
            </Group>
          }
        /> */}
            <Stack sx={{ width: '100%' }}>
              <Stack
                justify="center"
                sx={{ minHeight: 70, paddingLeft: 10, position: 'absolute', zIndex: 1 }}
              >
                <Group noWrap>
                  <ActionIcon
                    id="btn-courseDetailsBack"
                    variant="transparent"
                    onClick={
                      typeof window !== 'undefined' && window.history.state.idx === 0
                        ? () => router.replace('/')
                        : () => router.back()
                    }
                    style={{ background: '#FFFFFF50' }}
                  >
                    <ArrowLeftIcon className="rtl" width={40} height={40} color={'#000'} />
                  </ActionIcon>
                </Group>
              </Stack>
              <Stack
                className="viewImage"
                sx={{
                  height: '14rem',
                  width: '100%',
                  background: 'black',
                }}
              >
                {loadUrl ? (
                  <Stack sx={{ alignSelf: 'center' }} pt={'25%'}>
                    <Loader color={'#fff'} />
                  </Stack>
                ) : !playing ? (
                  cover !== '' && (
                    <ImageWithFallback
                      src={cover}
                      // objectFit="/scale-down"
                      width={'100'}
                      height={'100'}
                      layout="responsive"
                      placeholder="blur"
                      fallbackSrc="/assets/images/default.png"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    />
                  )
                ) : (
                  <Stack
                    sx={{
                      height: '100%',
                      width: '100%',
                      background: 'black',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {videoUrl ? (
                      <iframe
                        title={'Player'}
                        src={`${videoUrl}`} //"https://player.vimeo.com/video/226053498?h=a1599a8ee9"
                        width={'100%'}
                        height={'100%'}
                        frameBorder="0"
                        allow="accelerometer; gyroscope; encrypted-media; autoplay; picture-in-picture"
                        allowFullScreen={false}
                      />
                    ) : (
                      <Text sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        {'Unable to play video at the moment'}
                      </Text>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>
            <Box mt={-8}>
              <CourseStats
                rating={data?.avg_rating}
                ratingCount={data?.total_rating}
                duration={data?.duration}
                discount_price={data?.course?.discount_price}
                instructor={instructordetails?.name}
                alreadyPurchased={alreadyPurchased}
                hideWhatsApp={coursedetails?.wtsap_link}
                onWhatsApp={coursedetails?.wtsap_link}
                onShare={() => {
                  //ZK: Share code triggering native view in mobile app
                  const url = `${process.env.NEXT_PUBLIC_FE_URL}courses/${slug}`;
                  // @ts-ignore
                  if (window?.ReactNativeWebView === undefined) {
                    //This means we are not in ReactNative webView so open the new link in another widows of browser
                    window.open(url, '_blank');
                  } else {
                    const shareableObject = {
                      event: 'share',
                      url,
                    };
                    const objStringfy = JSON.stringify(shareableObject);
                    // @ts-ignore
                    window.ReactNativeWebView.postMessage(objStringfy);
                  }
                }}
                // instructorAvatar="/assets/images/placeholders/instructor.png"
                instructorAvatar={instructordetails?.image}
                id={instructordetails?.id}
              />
            </Box>
            <Space h="md" />
            <Container mb={30} mt={'2vh'}>
              <Box>
                <Tabs
                  tabPadding="xs"
                  active={activeTab}
                  onTabChange={setActiveTab}
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
                  <Tabs.Tab id="tab-lessons" label={t.chapters} tabKey="lessons">
                    <LessonsTab
                      onFav={() => (bookmarked ? removeBookmark() : savedAsBookmark())}
                      fav={bookmarked}
                      slug={slug}
                      isBundled={isBundled}
                      chapterIndex={cIndex}
                      playingIndex={pIndex}
                      introStatus={intro}
                      setIntroStatus={(val: any) => setInto(val)}
                      setChapterIndex={(val: any) => setCIndex(val)}
                      setPlayingIndex={(val: any) => setPIndex(val)}
                      loading={bookmarkeddisable}
                      alreadyPurchased={alreadyPurchased}
                      setCourseButtonLoading={(loading: any) => {
                        Loading(loading);
                        //setCart(!is_cart);
                      }}
                      refetchChapter={refetchChapter}
                      iFrame={(iframe: any) => setiFrame(iframe)}
                      videoUrl={(url: any) => setVideoUrl(url)}
                      playing={(val: boolean) => setPlaying(val)}
                      setloadUrl={(res: any) => setloadUrl(res)}
                      addingCourse={cartLoading}
                      addingChapter={(val: any) => setDisableAddCourseButton(val)}
                      isUser={isUser}
                      setModal={(res: any) => setOpenConfirmModal(res)}
                      updatedData={(res: any) => {
                        setDetails(res?.overview?.original);
                      }}
                      refetchDetails={() => {
                        refetch();
                      }}
                    />
                  </Tabs.Tab>
                  <Tabs.Tab id="tab-courseoverView" label={t.overview} tabKey="Overview">
                    <OverviewTab
                      refetch={refetch}
                      overViewData={details}
                      chapterPurchased={chapterPurchased}
                    />
                  </Tabs.Tab>
                  {alreadyPurchased || chapterPurchased ? (
                    <Tabs.Tab id="tab-discussion" label={t.discussion} tabKey="Discussion">
                      <DiscussionsTab discussiontabData={discussionData} slug={slug} />
                    </Tabs.Tab>
                  ) : null}
                </Tabs>
              </Box>
              {/* <DynamicFileViewer/> */}
              {/* {!alreadyPurchased ? (
            <Affix
              position={{ bottom: 15 }}
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              zIndex={10}
            >
              <Button
                size="md"
                radius={8}
                loading={booking}
                onClick={() =>
                  isUser != undefined
                    ? (setBooking(true),
                      router.replace({
                        pathname: '/courses/[slug]/booking',
                        query: { slug: router.query.slug },
                      }))
                    : setOpenConfirmModal(true)
                }
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                }}
              >
                {t['buy-now']}
              </Button>
            </Affix>
          ) : null} */}
              {!alreadyPurchased &&
                (!details?.course?.is_chapter_carted && !details?.course?.is_cart ? (
                  <Affix
                    position={{ bottom: 15 }}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      padding: '12px',
                    }}
                    zIndex={100}
                  >
                    <ActionIcon
                      id="btn-courseSaved"
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

                    {Number(data?.course?.price) == 0 ? (
                      <Stack
                        id="btn-courseEnroll"
                        onClick={() => !enrolling && onCourseEnroll()}
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
                            {t.enroll_course}
                          </Text>
                        )}
                      </Stack>
                    ) : (
                      <Stack
                        id="btn-courseAddToCart"
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
                          if (!cartLoading && !disableAddCourseButton) {
                            isUser != undefined
                              ? is_cart
                                ? courseToCart()
                                : details?.course?.is_chapter_carted
                                ? setCourseConfirmModal(true)
                                : courseToCart()
                              : setOpenConfirmModal(true);
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
                            width: '55%',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: disableAddCourseButton ? 0.5 : 1,
                          }}
                        >
                          {cartLoading ? (
                            <Loader size="sm" color={'#000'} />
                          ) : (
                            <Text sx={{ fontSize: '20px', color: '#000000', fontWeight: 500 }}>
                              {`${Number(
                                data?.course?.discount_price == 0
                                  ? data?.course?.price
                                  : data?.course?.discount_price
                              )}  ${t.KWD}`}

                              {data?.course?.haveOffer && (
                                <span
                                  style={{
                                    color: 'red',
                                    textDecoration: 'line-through',
                                    marginLeft: '5px',
                                    fontSize: '15px',
                                  }}
                                >
                                  {`  ${data?.course?.price}`}
                                </span>
                              )}
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
                    zIndex={100}
                  >
                    <Stack
                      id="btn-coursesViewCart"
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
            </Container>
          </main>
        </>
      )}
    </>
  );
};

export default CourseDetails;
