import { NoRecordFound } from '@/components/ui/no-record-found';
import { getChapters } from '@/utils/axios/apis';
import {
  ActionIcon,
  Affix,
  Card,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ChevronRightIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { NoContentFound } from '@/components/ui/no-content-found';
import { Right } from '@/src/constants/icons/right';
import { Chapter } from '@/components/ui/chapters';
import { Star } from '@/src/constants/icons';
import { StarFav } from '@/src/constants/icons/star-fav';
import { LoadingSnipper } from '@/components/ui/loading-snipper';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { PageIcon } from '@/src/constants/icons/page';
import { Pause } from '@/src/constants/icons/pause';
import { Play } from '@/src/constants/icons/play';
import axios from '@/components/axios/axios';

export const LessonsTab = ({
  onFav,
  loading,
  fav,
  playing,
  iFrame,
  videoUrl,
  alreadyPurchased,
  refetchChapter,
  setCourseButtonLoading,
  addingCourse,
  isUser,
  setModal,
  refetchDetails,
  addingChapter,
  updatedData,
  setloadUrl,
  chapterIndex,
  setChapterIndex,
  playingIndex,
  setPlayingIndex,
  introStatus,
  setIntroStatus,
  ...props
}: any) => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const [lessons, setLessons] = useState<any>([]);
  const [intro, setIntro] = useState<boolean>(introStatus);
  const [cartLoading, Loading] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const client = useQueryClient();
  const [refetching, setFetching] = useState({ loading: false, index: -1 });
  const [cIndex, setCIndex] = useState(chapterIndex);
  const [pIndex, setPIndex] = useState(playingIndex);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  const { data, refetch } = useQuery(
    // [`course/chapters?course_id`, props.slug],
    [`course/chapterswithlessons?course_id`, props.slug],
    () => getChapters({ course_id: props.slug, is_bundle: props.isBundled || false }),
    {
      onSettled: () => {
        const progress_filter = localStorage.getItem('in_progress_filter');
        const completed_filter = localStorage.getItem('completed_courses_filter');
        client.invalidateQueries(['in-progress/courses', progress_filter, 'Inprogress']);
        client.invalidateQueries(['completed/courses', completed_filter, 'completed']);
      },
      onError: (error: any) => {
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          const err = error?.response?.data?.errors;
          if (err) {
            Object.keys(err).forEach((i) => {
              err[i].forEach((item: any) => {
                showNotification({
                  message: item,
                  color: 'red',
                });
              });
            });
          } else {
            console.log(err);
            showNotification({
              message: 'something went wrong',
              color: 'red',
            });
          }
          router.push('/');
        }
      },
    }
  );

  useEffect(() => {
    refetch().then(() => {
      setCourseButtonLoading(false);
    });
  }, [refetchChapter]);

  useEffect(() => {
    if (data) {
      setLessons(data);
      setIsLoading(false);
    }
    //setFetching(false);
  }, [data]);

  useEffect(() => {
    setChapterIndex(cIndex);
    setPlayingIndex(pIndex);
  }, [cIndex, pIndex]);

  useEffect(() => {
    setIntroStatus(intro);
  }, [intro]);

  const checkLessonALLowed = ({ id }: { id: string }) => {
    const lessonIndex = lessons.findIndex((lesson: any) => lesson.class_id === id);
    if (lessonIndex === 0) {
      return true;
    } else {
      return lessons?.[lessonIndex - 1].is_complete;
    }
  };

  function handleChapterClick(chapterId: string, chapterName: string) {
    // if (checkChapterALLowed({ id: chapterId })) {
    router.push({
      pathname: `/chapter/[slug]`,
      query: { slug: chapterId, chapter_name: chapterName },
    });
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous chapter',
    //     color: 'yellow',
    //   });
    // }
  }

  const checkChapterALLowed = ({ id }: { id: string }) => {
    const lessonIndex = lessons.findIndex((lesson: any) => lesson.id === id);
    if (lessonIndex === 0) {
      return true;
    } else {
      return lessons?.[lessonIndex - 1].is_complete;
    }
  };

  return (
    <>
      {data && (
        <Container p={0}>
          <SimpleGrid
            sx={{
              //minHeight: 'calc(100vh - 300px)',
              gridTemplateRows: '1fr max-content',
            }}
          >
            <Stack mt={'xl'}>
              {isLoading ? (
                // Array(4).fill(
                //   <SimpleGrid>
                //     {/* <Skeleton circle width={40} height={40} sx={{ opacity: 0.5 }} /> */}
                //     <Skeleton width="100%" sx={{ opacity: 0.5 }} height={40} radius={8} />
                //     {/* <Skeleton circle width={25} height={25} sx={{ opacity: 0.5 }} /> */}
                //   </SimpleGrid>
                // )
                Array(4).map((e, i) => (
                  <SimpleGrid key={i}>
                    {/* <Skeleton circle width={40} height={40} sx={{ opacity: 0.5 }} /> */}
                    <Skeleton width="100%" sx={{ opacity: 0.5 }} height={40} radius={8} />
                    {/* <Skeleton circle width={25} height={25} sx={{ opacity: 0.5 }} /> */}
                  </SimpleGrid>
                ))
              ) : (
                <>
                  {lessons?.introduction?.video_url && (
                    <Stack spacing={5} px={'8vw'} my={'1.5vh'} sx={{ justifyContent: 'center' }}>
                      <Text
                        transform="capitalize"
                        weight={500}
                        sx={{ fontSize: 14, color: colorScheme == 'dark' ? '#FFDD83' : '#000' }}
                      >
                        {'Introduction'}
                      </Text>
                      <Group noWrap spacing={5}>
                        <Text
                          transform="capitalize"
                          weight={500}
                          color={'#298EAE'}
                          sx={{ fontSize: 12 }}
                        >
                          {lessons?.introduction?.duration || 0}
                        </Text>
                        <Text weight={500} color={'#298EAE'} sx={{ fontSize: 12 }}>
                          {'min'}
                        </Text>
                      </Group>
                      <Stack
                        sx={{
                          position: 'absolute',
                          right: '20px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Stack
                          onClick={() => {
                            // iFrame(lessons?.introduction?.iframe_url);
                            videoUrl(lessons?.introduction?.video_url);
                            !intro ? playing(true) : playing(false);
                            setIntro(!intro);
                          }}
                          sx={{
                            background: '#FFDD83',
                            height: '50px',
                            width: '50px',
                            borderRadius: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                          }}
                        >
                          {intro ? <Pause /> : <Play />}
                          {/* <Play /> */}
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
                  )}
                  {lessons?.chapters?.length > 0 ? (
                    <>
                      {lessons?.chapters?.map((chapter: any, index: number) => {
                        // var h: number = parseInt(chapter.total_time / 60)
                        // var m: number = parseInt(chapter.total_time % 60);

                        let time = function getTimeFromMins() {
                          let h = Math.trunc(chapter.total_time / 60);
                          let m = chapter.total_time % 60;
                          return h ? `${h} hr ${m} min` : `${m} min`;
                        };
                        return (
                          <Chapter
                            key={chapter?.id}
                            index={index}
                            cIndex={cIndex}
                            expendedIndex={cIndex}
                            setCIndex={(val: any) => setCIndex(val)}
                            pIndex={pIndex}
                            setPIndex={(val: any) => setPIndex(val)}
                            refetching={refetching}
                            chapter={chapter}
                            isCartCourse={lessons?.is_cart}
                            iFrame={(iframe: any) => iFrame(iframe)}
                            videoUrl={(url: any) => videoUrl(url)}
                            setloadUrl={setloadUrl}
                            // sendIndex={(indx: any) => {
                            //   setLoadingIndex(indx);
                            // }}
                            refetch={(index: any) => {
                              refetchDetails();
                              setFetching({ loading: true, index });
                              refetch().then((res) => {
                                setFetching({ loading: false, index });
                                return res;
                              });
                            }}
                            stopIntro={() => setIntro(false)}
                            intro={intro}
                            playing={(val: any) => playing(val)}
                            addingCourse={addingCourse}
                            isUser={isUser}
                            setModal={setModal}
                            onClick={() => {
                              handleChapterClick(chapter.id, chapter.name);
                            }}
                            addingChapter={addingChapter}
                            alreadyPurchased={alreadyPurchased}
                            updatedData={(res: any) => {
                              setLessons(res?.coursechapters?.original);
                              updatedData(res);
                            }}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <NoContentFound />
                  )}
                </>
              )}
            </Stack>
            <Space h={30} />
            {/* {!alreadyPurchased && (
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
                onClick={onFav}
                disabled={fav}
                sx={{
                  width: '58px',
                  height: '44px',
                  borderRadius: '20px',
                  background: '#FFDD83',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {loading ? <Loader color={'#298EAE'} size={'sm'} /> : fav ? <Star /> : <StarFav />}
              </ActionIcon>
              <Stack
                sx={{
                  height: '44px',
                  width: '85%',
                  borderRadius: '20px',
                  background: '#F7F6F5',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text mx={'3vw'} sx={{ fontSize: '20px', color: '#000' }}>
                  Add to Cart
                </Text>
                <Stack
                  onClick={() => {
                    if (!cartLoading) {
                      courseToCart();
                    }
                  }}
                  sx={{
                    background: lessons?.is_cart ? '#FFDD83' : '#FFFFFF',
                    height: 44,
                    width: '40%',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
                  }}
                >
                  {cartLoading ? (
                    <Loader size="sm" color={lessons?.is_cart ? '#fff' : '#FFDD83'} />
                  ) : (
                    <Text
                      sx={{ fontSize: '20px', color: '#000000', fontWeight: 500 }}
                    >{`${lessons?.discount_price || '0'} KW`}</Text>
                  )}
                </Stack>
              </Stack>
            </Affix>
          )} */}
          </SimpleGrid>
        </Container>
      )}
    </>
  );
};
