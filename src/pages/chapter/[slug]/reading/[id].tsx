import { useRouter } from 'next/router';
import axios from '@/components/axios/axios';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import en from '@/src/constants/locales/en-us/common.json';

import ar from '@/src/constants/locales/ar-kw/common.json';
import {
  Affix,
  Box,
  Button,
  Container,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  TypographyStylesProvider,
} from '@mantine/core';
import { CompletedMarkIcon } from '@/src/constants/icons';
import { DrawerHeader } from '@/components/ui/DrawerHeader';
import { markComplete } from '@/utils/axios/markLessonComplete';
import { useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { ChevronsUpLeft } from 'tabler-icons-react';
import * as Sentry from '@sentry/react';
import authMiddleware from '@/src/authMiddleware';

const PdfReader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [content, setContent] = useState<any>();
  const [rendering, setRendering] = useState(true);
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { id, slug, status } = router.query;

  useEffect(() => {
    const getReadingMaterial = async () => {
      try {
        const res = await axios.get(`course/lesson-content?class_id=${id}`);
        console.log('res status', res.status);
        setContent(res.data);
        setRendering(false);
      } catch (_err: any) {
        Sentry.captureException(_err);
        let err = _err?.response?.data?.errors;
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
    };

    if (id) {
      getReadingMaterial();
    }
  }, [id]);

  const cache = useQueryClient();

  useEffect(() => {
    if (!rendering) {
      handleComplete();
    }
  }, [rendering]);

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
      <Affix position={{ top: 0, left: 0, right: 0 }} sx={{ minWidth: '100vw' }}>
        <DrawerHeader
          title={content?.title}
          handleClose={() => {
            router.back();
          }}
          rightSection={complete && <CompletedMarkIcon />}
        />
      </Affix>
      <Space h={90} />
      <Container
        sx={(theme) =>
          theme.colorScheme === 'dark'
            ? { background: '#000', color: '#939393' }
            : { background: '#F4F9FE' }
        }
      >
        <Stack>
          <SimpleGrid
            sx={{
              gridTemplateRows: '1fr max-content',
              minHeight: '100vh',
              marginTop: '70px',
              paddingTop: '10px',
            }}
          >
            {!content &&
              [1, 2, 3].map((_, i) => (
                <>
                  <Stack key={i}>
                    {[1, 2, 3].map((_, i) => (
                      <Skeleton key={i} width="90%" height={25} radius={8} />
                    ))}
                    {[1, 2].map((_, i) => (
                      <Skeleton key={i} width="60%" height={25} radius={8} />
                    ))}
                  </Stack>
                </>
              ))}

            <Container sx={{ maxWidth: '100%', textAlign: 'justify', padding: '0px' }}>
              <TypographyStylesProvider sx={{ wordBreak: 'break-word' }}>
                <Box dangerouslySetInnerHTML={{ __html: content?.long_text }} />
              </TypographyStylesProvider>
            </Container>
            {/* {!complete && status === 'in_complete' && !rendering && (
              <Button
                size="md"
                radius={7}
                styles={{
                  label: { color: 'black', fontWeight: 400 },
                }}
                loading={isLoading}
                onClick={handleComplete}
              >
                {t['mark-complete']}
              </Button>
            )} */}
          </SimpleGrid>
        </Stack>
        <Space h={20} />
      </Container>
    </>
  );
};

export default authMiddleware(PdfReader);
