import { NewButton } from '@/src/constants/icons/new-button';
import { NewButtonWhite } from '@/src/constants/icons/new-button-white';
import { shimmer, toBase64 } from '@/utils/utils';
import {
  Box,
  Center,
  Loader,
  ScrollArea,
  Text,
  useMantineColorScheme,
  Image,
  Stack,
  BackgroundImage,
  Card,
  SimpleGrid,
  Group,
  ActionIcon,
  Affix,
  RingProgress,
} from '@mantine/core';
import { useRouter } from 'next/router';
import axios from '@/components/axios/axios.js';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import React, { ReactNode, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { NoSave } from '@/src/constants/icons/no-save';
import { NoCourse } from '@/src/constants/icons/no-course';
import { Right } from '@/src/constants/icons/right';
import { Down } from '@/src/constants/icons/down';
import { Left } from '@/src/constants/icons/left';
import { Play } from '@/src/constants/icons/play';
import { Pause } from '@/src/constants/icons/pause';
import { Lesson } from './lesson';
import { BookIcon } from '@/src/constants/icons/book';
import { PageIcon } from '@/src/constants/icons/page';
import { LiveIcon } from '@/src/constants/icons/live';
import { LockIcon } from '@/src/constants/icons';
import { showNotification } from '@mantine/notifications';
import { PdfIcon } from '@/src/constants/icons/pdf';
import Doc from '@/public/assets/images/Doc.svg';
import { Cross } from 'tabler-icons-react';
import NextImage from 'next/image';
import { Close } from '@/src/constants/icons/Close';
import { markComplete } from '@/utils/axios/markLessonComplete';
import * as Sentry from '@sentry/react';
import { LiveSession } from '@/src/constants/icons/livesession';
import { InPerson } from '@/src/constants/icons/InPerson';
import { DynamicFileViewer } from './DynamicFileViewer';
import { PptIcon } from '@/src/constants/icons/Ppt';
import { Xls } from '@/src/constants/icons/Xls';
import { Zip } from '@/src/constants/Zip';
import { Rar } from '@/src/constants/Rar';
import { Docxs } from '@/src/constants/Docx';
import { useMediaQuery } from '@mantine/hooks';

type Props = {
  children: ReactNode;
  height: string;
};

export const Chapter = ({
  onClick,
  chapter,
  index,
  playing,
  intro,
  stopIntro,
  refetch,
  refetching,
  isCartCourse,
  iFrame,
  videoUrl,
  cIndex,
  setCIndex,
  pIndex,
  setPIndex,
  setloadUrl,
  sendIndex,
  addingCourse,
  isUser,
  setModal,
  addingChapter,
  updatedData,
  expenedIndex,
  alreadyPurchased,
}: any) => {
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();
  const [expent, setExpent] = useState(index === cIndex);
  const [cartLoading, Loading] = useState(refetching?.loading);
  const [play, setPlay] = useState(false);
  const [cart, setCart] = useState(false);
  const t = router.locale === 'en-us' ? en : ar;
  const isSmallScreen = useMediaQuery('(max-width: 450px)');
  useEffect(() => {
    if (intro) {
      setPIndex(-1);
      setCIndex(-1);
    }
  }, [intro]);

  useEffect(() => {
    if (pIndex > -1) {
      stopIntro();
    }
  }, [pIndex]);

  // useEffect(() => {
  //   addingChapter(refetching?.loading);
  // }, [refetching]);

  const handleComplete = (id: any) => {
    //setIsLoading(true);
    markComplete({ class_id: id as string })
      .then(() => {
        //setComplete(true);
      })
      .catch((err) => {
        Sentry.captureException(err);
      })
      .finally(() => {
        //setIsLoading(false);
      });
    //cache.invalidateQueries([`courses/lessons`, slug]);
  };

  const chapterToCart = async (id: any, is_cart: boolean) => {
    Loading(true);
    addingChapter(true);
    const token = getCookie('access_token');
    const obj = {
      chapter_id: id,
    };
    const config = {
      method: 'post',
      url: is_cart ? 'remove/cart' : 'addtocart/chapter',
      data: obj,
    };
    await axios(config)
      .then(async (res: any) => {
        // router.back();
        //sendIndex(index);
        //const res = await refetch(index);
        updatedData(res?.data);
        Loading(false);
        addingChapter(false);
        showNotification({
          message: is_cart
            ? 'Chapter removed from cart successfuly!'
            : 'Chapter added to cart successfuly!',
          color: 'green',
        });
      })
      .catch((error: any) => {
        Loading(false);
        addingChapter(false);
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

  const freeChapterDirectEnroll = async (id: any, is_cart: boolean) => {
    Loading(true);
    addingChapter(true);
    const token = getCookie('access_token');
    const obj = {
      id,
      type: 'chapter',
    };
    const config = {
      method: 'post',
      url: 'free/enroll',
      data: obj,
    };

    try {
      let res = await axios(config);
      //updatedData(res?.data);
      //Loading(false);
      addingChapter(false);
      showNotification({
        message: 'Chapter enrolled successfuly!',
        color: 'green',
      });
      window.location.reload(); //TODO: Please fix me
    } catch (error: any) {
      Loading(false);
      addingChapter(false);
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
    }
  };

  const handleClick = (type?: string, id?: string, status?: string, type_id?: string) => {
    // if (checkLessonALLowed({ id: pdf_id! })) {
    if (
      type === 'pdf' ||
      type === 'docx' ||
      type === 'doc' ||
      type === 'xls' ||
      type === 'xlsx' ||
      type === 'zip' ||
      type === 'rar' ||
      type === 'ppt' ||
      type === 'pptx' ||
      type === 'csv'
    ) {
      // router.push(
      //   `${router.asPath.trim().substring(0, router.asPath.trim().indexOf('?'))}/chapter/${
      //     chapter?.id
      //   }/pdf/${id}?status=${status}`
      // );
      router.push(`/chapter/${chapter?.id}/pdf/${id}?status=${status}`);
    } else if (type === 'text') {
      // setReadingContent({ content, title, class_id: class_id });
      router.push(`/chapter/${chapter?.id}/reading/${id}?status=${status}`);
    } else if (type === 'quiz') {
      router.replace(
        `/chapter/${chapter?.id}/quiz/${type_id}/?status=initial_report&class_id=${id}`
      );
    } else if (type === 'meeting') {
      router.push(`/live-sessions/${type_id}`);
    } else if (type === 'offline_session') {
      router.push(`/in-person-sessions/${type_id}`);
    }
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous lesson',
    //     color: 'yellow',
    //   });
    // }
  };
  return (
    <Card
      //onClick={onClick}
      radius={8}
      //style={{ background: 'red' }}
      p={0}
      sx={{ background: 'transparent' }}
    >
      <Stack
        spacing={0}
        sx={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          //background: 'red',
        }}
      >
        {/* <Group noWrap spacing={5} align="center"> */}
        <Stack
          id={`btn-chapter-${chapter?.id}`}
          onClick={() => {
            if (!chapter?.is_lock) {
              if (chapter?.type === 'live-streaming') {
                router.push({
                  pathname: `/live-sessions/[typeId]`,
                  query: { typeId: chapter?.type_id, type: 'course' },
                });
              } else if (chapter?.type === 'in-person-session') {
                router.push({
                  pathname: `/in-person-sessions/[typeId]`,
                  query: { typeId: chapter?.type_id, type: 'course' },
                });
              } else {
                setExpent(!expent);
              }
            }
          }}
          sx={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
          spacing={0}
        >
          <Box sx={{ width: '30px' }}>
            <Text transform="capitalize" weight={500} sx={{ fontSize: 24, color: '#298EAE' }}>
              {index < 9 ? '0' : ''}
              {index + 1}
            </Text>
          </Box>
          <ActionIcon
            onClick={() => {
              if (chapter?.type === 'live-streaming') {
                router.push({
                  pathname: `/live-sessions/[typeId]`,
                  query: { typeId: chapter?.type_id, type: 'course' },
                });
              } else if (chapter?.type === 'in-person-session') {
                router.push({
                  pathname: `/in-person-sessions/[typeId]`,
                  query: { typeId: chapter?.type_id, type: 'course' },
                });
              } else {
                setExpent(!expent);
              }
            }}
            variant="transparent"
          >
            {/* <ChevronRightIcon className="rtl" width={30} height={30} /> */}
            {expent ? <Down /> : router.locale === 'en-us' ? <Right /> : <Left />}
          </ActionIcon>
          <Box sx={{ width: '80%' }}>
            <Text
              transform="capitalize"
              weight={500}
              sx={{ fontSize: 14, color: colorScheme == 'dark' ? '#EDD491' : '#000' }}
            >
              <Stack
                sx={{
                  width: isSmallScreen ? '150px' : '250px',
                  borderRadius: '100%',
                  justifyContent: 'start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  display: 'flex',
                  zIndex: 1,
                }}
              >
                {/* isSmallScreen */}
                {isSmallScreen ? chapter.name.slice(0, 50) : chapter.name}
                {chapter?.type === 'live-streaming' && <LiveSession />}
                {chapter?.type === 'in-person-session' && <InPerson />}
              </Stack>
            </Text>
          </Box>
          {chapter.is_lock && <LockIcon />}
        </Stack>
        {/* </Group> */}

        {chapter?.is_purchasable && chapter?.is_lock && !alreadyPurchased && (
          <Stack
            id="btn-chapterAddToCart"
            className="priceOfcourse"
            onClick={() => {
              if (!isCartCourse && !cartLoading && !addingCourse) {
                if (isUser != undefined) {
                  parseInt(chapter?.price || 0) > 0
                    ? chapterToCart(chapter?.id, chapter?.is_cart)
                    : freeChapterDirectEnroll(chapter?.id, chapter?.is_cart);
                } else {
                  setModal(true);
                }
              }
            }}
            py={0}
            sx={{
              background: chapter?.is_cart ? '#FFDD83' : '#F7F6F5',
              height: 35, //chapter?.is_cart ? undefined : 35,
              width: 90, //chapter?.is_cart ? undefined : 90,
              borderRadius: 20, //chapter?.is_cart ? '100%' : 20,
              justifyContent: 'center',
              alignItems: 'center',
              //border: chapter?.is_cart ? '0px solid red' : '0px',
              opacity: isCartCourse || addingCourse ? 0.5 : 1,
            }}
          >
            <Group spacing={5}>
              {cartLoading ? ( //|| (refetching?.index === index && refetching?.loading)
                <Loader size="sm" color={chapter?.is_cart ? '#fff' : '#FFDD83'} />
              ) : // <Text sx={{ fontSize: 14, color: '#000000' }}>{`${chapter.price}KW`}</Text>
              // chapter?.is_cart ? (
              //   <Close />
              // )
              // :
              parseInt(chapter?.price || 0) > 0 ? (
                <Group spacing={0}>
                  <Text sx={{ fontSize: 14, color: '#000000' }}>
                    {`${parseInt(chapter.price)} `}
                  </Text>
                  <Text sx={{ fontSize: 14, color: '#000000', marginLeft: '0.3rem' }}>{` KW`}</Text>
                </Group>
              ) : (
                <Text sx={{ fontSize: 14, color: '#298EAE' }}>{t.free.toUpperCase()}</Text>
              )}
            </Group>
          </Stack>
        )}
      </Stack>

      {expent &&
        chapter.chapter_lessons.map((item: any, indx: any) => {
          // return <Lesson playing={(val: any) => playing(val)} item={item} indx={indx} chapter = {chapter} />;
          return (
            <Stack
              id={`btn-lesson-${item?.class_id}`}
              key={item?.id}
              onClick={() => {
                if (!chapter?.is_lock) {
                  if (item?.type == 'video') {
                    //iFrame(item?.iframe_url);
                    setloadUrl(true);
                    playing(false);
                    setTimeout(() => {
                      try {
                        videoUrl(item?.video_url);
                        cIndex === index && pIndex === `${index}${indx}`
                          ? setCIndex(-1)
                          : setCIndex(index);
                        pIndex === `${index}${indx}` ? setPIndex(-1) : setPIndex(`${index}${indx}`);
                        pIndex !== `${index}${indx}` ? playing(true) : playing(false);
                        setloadUrl(false);
                      } catch (err) {
                        Sentry.captureException(err);
                      }
                      handleComplete(item?.class_id);
                    }, 200);
                  } else {
                    setPIndex(-1);
                    playing(false);
                    handleClick(item?.type, item?.class_id, item?.is_complete, item?.type_id);
                  }
                }
              }}
              spacing={5}
              px={'8vw'}
              my={'1.5vh'}
              sx={{ justifyContent: 'center' }}
            >
              <Stack sx={{ paddingRight: 30 }}>
                <Text
                  transform="capitalize"
                  weight={500}
                  sx={{ fontSize: 14, color: colorScheme == 'dark' ? '#FFDD83' : '#000' }}
                >
                  {`${item.title}`}
                </Text>
              </Stack>
              <Group noWrap spacing={5}>
                <Text transform="capitalize" weight={500} color={'#298EAE'} sx={{ fontSize: 12 }}>
                  {item?.duration}
                </Text>
                <Text weight={500} color={'#298EAE'} sx={{ fontSize: 12 }}>
                  {'min'}
                </Text>
              </Group>
              <Stack
                sx={{
                  position: 'absolute',
                  right: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Stack
                  sx={{
                    background: chapter?.is_lock
                      ? 'transparent'
                      : item?.iscomplete
                      ? '#2EFC41'
                      : '#FFDD83',
                    height: '50px',
                    width: '50px',
                    borderRadius: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  {chapter?.is_lock ? (
                    <LockIcon />
                  ) : item?.type == 'video' ? (
                    pIndex === `${index}${indx}` && cIndex === index ? (
                      <Pause />
                    ) : (
                      <Play />
                    )
                  ) : item?.type == 'text' ? (
                    <BookIcon />
                  ) : item?.type == 'quiz' ? (
                    <PageIcon />
                  ) : item?.type == 'pdf' ? (
                    <PdfIcon />
                  ) : item?.type == 'in-person' ? (
                    <LiveIcon />
                  ) : item?.type == 'pptx' || item?.type == 'ppt' ? (
                    <PptIcon />
                  ) : item?.type == 'xls' || item?.type == 'xlsx' ? (
                    <Xls />
                  ) : item?.type == 'zip' ? (
                    <Zip />
                  ) : item?.type == 'rar' ? (
                    <Rar />
                  ) : item?.type == 'doc' || item?.type == 'docx' ? (
                    <Docxs />
                  ) : (
                    <LiveIcon />
                  )}
                </Stack>
                <Stack
                  sx={{
                    position: 'absolute',
                    height: '50px',
                    width: '50px',
                    //background: '#FFDD83',
                    borderRadius: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* <RingProgress
                    size={62}
                    thickness={3}
                    sections={[{ value: 70, color: 'blue' }]}
                    //sx = {{position : 'absolute', right : 0, top : 0}}
                    styles={{
                      root: {
                        background: 'transparent',
                      },
                    }}
                    label={
                      null
                      // <Text color="blue" weight={500} align="center" size="xl">
                      //   40%
                      // </Text>
                    }
                  /> */}
                </Stack>
              </Stack>
            </Stack>
          );
        })}

      {/* <Stack align={'end'}>
          <ActionIcon variant="transparent">
            <ChevronRightIcon className="rtl" width={30} height={30} />
          </ActionIcon>
        </Stack> */}
      {/* </SimpleGrid> */}
    </Card>
  );
};
