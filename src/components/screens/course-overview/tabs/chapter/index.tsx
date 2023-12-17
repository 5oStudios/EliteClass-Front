import { Container, SimpleGrid, Skeleton, Space, Stack } from '@mantine/core';
import axios from '@/components/axios/axios.js';
import React, { useEffect, useState } from 'react';
import { LessonNotes } from './lesson-notes';
import { LessonQuiz } from './lesson-quiz';
import { LessonVideo } from './lesson-video';
import { useRouter } from 'next/router';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { showNotification } from '@mantine/notifications';
import { CheckIcon } from '@modulz/radix-icons';
import { useQuery, useQueryClient } from 'react-query';
import { getLessonData } from '@/utils/axios/apis';

export const ChapterTab = (props: any) => {
  const router = useRouter();
  const [lessons, setLessons] = useState<any>(null);

  const client = useQueryClient();

  const { data, isLoading } = useQuery(
    [`courses/lessons`, props.slug],
    () => getLessonData({ course_id: props.slug }),
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
    setLessons(data?.data);
  }, [data]);

  const handleVideoPlay = (class_id: string, status: string) => {
    //if (checkLessonALLowed({ id: class_id })) {
    router.push(
      `${router.asPath
        .trim()
        .substring(0, router.asPath.trim().indexOf('?'))}/video/${class_id}?status=${status}`
    );
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous lesson',
    //     color: 'yellow',
    //   });
    // }
  };

  const handleLiveMeeting = (class_id: string, status: string, meeting_id?: string) => {
    //if (checkLessonALLowed({ id: class_id })) {
    router.push({
      pathname: `/live-sessions/${meeting_id}`,
      query: {
        id: meeting_id,
        type: 'live-streaming',
      },
    });
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous lesson',
    //     color: 'yellow',
    //   });
    // }
  };

  const checkLessonALLowed = ({ id }: { id: string }) => {
    const lessonIndex = lessons.findIndex((lesson: any) => lesson.class_id === id);
    if (lessonIndex === 0) {
      return true;
    } else {
      return lessons?.[lessonIndex - 1].is_complete;
    }
  };

  const handleReadingMaterialClick = (type?: string, pdf_id?: string, status?: string) => {
    // if (checkLessonALLowed({ id: pdf_id! })) {
    if (type === 'pdf') {
      router.push(
        `${router.asPath
          .trim()
          .substring(0, router.asPath.trim().indexOf('?'))}/pdf/${pdf_id}?status=${status}`
      );
    } else if (type === 'text') {
      // setReadingContent({ content, title, class_id: class_id });
      router.push(
        `${router.asPath
          .trim()
          .substring(0, router.asPath.trim().indexOf('?'))}/reading/${pdf_id}?status=${status}`
      );
    }
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous lesson',
    //     color: 'yellow',
    //   });
    // }
  };

  const handleQuizClick = (quizId: number, class_id: string) => {
    //if (checkLessonALLowed({ id: class_id })) {
    router.replace(
      `${router.asPath
        .trim()
        .substring(
          0,
          router.asPath.trim().indexOf('?')
        )}/quiz/${quizId}/?status=initial_report&class_id=${class_id}`
    );
    // } else {
    //   showNotification({
    //     message: 'Please first finish previous lesson',
    //     color: 'yellow',
    //   });
    // }
  };

  return (
    <>
      <Container>
        <SimpleGrid
          sx={{
            minHeight: 'calc(100vh - 300px)',
            gridTemplateRows: '1fr max-content',
          }}
        >
          <Stack>
            {isLoading &&
              Array(4).fill(
                <SimpleGrid sx={{ gridTemplateColumns: '40px 1fr 30px', alignItems: 'center' }}>
                  <Skeleton circle width={40} height={40} sx={{ opacity: 0.5 }} />
                  <Skeleton sx={{ opacity: 0.5 }} height={40} radius={8} />
                  <Skeleton circle width={25} height={25} sx={{ opacity: 0.5 }} />
                </SimpleGrid>
              )}

              
            {lessons != '' ? (
              lessons?.map((item: any, i: number) => {
                if (item?.type === 'video') {
                  return (
                    <LessonVideo
                      key={`lesson-video-${i}`}
                      class_id={item?.class_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                      handlePlay={handleVideoPlay}
                    />
                  );
                }
                if (item?.type === 'meeting') {
                  // video element use for meeting , meeting code inside the video element
                  return (
                    <LessonVideo
                      key={`lesson-video-${i}`}
                      class_id={item?.class_id}
                      meeting_id={item?.meeting_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                      handlePlay={handleLiveMeeting}
                    />
                  );
                } else if (item?.type === 'image') {
                  return null;
                } else if (item?.type === 'zip') {
                  return (
                    <LessonNotes
                      handleReadingDrawer={handleReadingMaterialClick}
                      key={`note-${i}`}
                      class_id={item?.class_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                      // url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    />
                  );
                } else if (item?.type === 'pdf') {
                  return (
                    <LessonNotes
                      handleReadingDrawer={handleReadingMaterialClick}
                      key={`note-${i}`}
                      class_id={item?.class_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                    />
                  );
                } else if (item?.type === 'text') {
                  return (
                    <LessonNotes
                      handleReadingDrawer={handleReadingMaterialClick}
                      key={`note-${i}`}
                      class_id={item?.class_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                    />
                  );
                } else if (item?.type === 'quiz') {
                  return (
                    <LessonQuiz
                      key={`quiz-${i}`}
                      quiz_id={item?.quiz_id}
                      class_id={item?.class_id}
                      title={item?.title}
                      duration={item?.duration}
                      type={item?.type}
                      is_lock={item?.is_lock}
                      is_complete={item?.is_complete}
                      handleQuizClick={handleQuizClick}
                    />
                  );
                }
                return null;
              })
            ) : (
              <NoRecordFound />
            )}
          </Stack>
          <Space h={30} />
        </SimpleGrid>
      </Container>
    </>
  );
};
