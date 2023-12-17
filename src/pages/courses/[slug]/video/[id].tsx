import { Videoplayer } from '@/components/ui/videoplayer';
import { AspectRatio, Box, Button, Container, SimpleGrid, Skeleton, Space } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CompletedMarkIcon } from '@/src/constants/icons';
import { PageHeader } from '@/components/ui/pageHeader';
import { useRouter } from 'next/router';
import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import { markComplete } from '@/utils/axios/markLessonComplete';
import { useQueryClient } from 'react-query';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import authMiddleware from '@/src/authMiddleware';

export const VideoPage = () => {
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>();
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { id, slug, status } = router.query;

  useEffect(() => {
    axios
      .get(`course/lesson-content?class_id=${id}`)
      .then((response) => {
        setContent(response.data);
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
          }
        }
      });
  }, [id]);

  const cache = useQueryClient();

  useEffect(() => {
    if (!complete && status === 'in_complete') {
      handleComplete();
    }
  }, [complete, status]);

  const handleComplete = () => {
    setIsLoading(true);
    markComplete({ class_id: id as string })
      .then(() => {
        setComplete(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    cache.invalidateQueries([`courses/lessons`, slug]);
  };

  return (
    <>
      <Box>
        <PageHeader
          title={content?.title}
          rightSection={content?.is_complete && <CompletedMarkIcon />}
        />
        <Container
          sx={{
            background: '#F4F9FE',
          }}
        >
          <SimpleGrid
            sx={{
              gridTemplateRows: '1fr max-content',
              alignItems: 'start',
              height: '100%',
              // this height change for mobile
              // height: 'calc(100vh - 130px)',
            }}
          >
            {/* <AspectRatio ratio={16 / 9}>
              {content ? <Videoplayer src={content.content} /> : <Skeleton radius={8} />}
            </AspectRatio> */}
            {!content ? (
              <Skeleton radius={8} height={300} />
            ) : (
              <Box dangerouslySetInnerHTML={{ __html: content?.content }} />
            )}
            {/* {!complete && status === 'in_complete' && (
              <Button
                size="md"
                radius={7}
                mb={'lg'}
                styles={{
                  label: { color: 'black', fontWeight: 400 },
                }}
                loading={isLoading}
                onClick={handleComplete}
              >
                {t["mark-complete"]}
              </Button>
            )} */}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
};

export default authMiddleware(VideoPage);
