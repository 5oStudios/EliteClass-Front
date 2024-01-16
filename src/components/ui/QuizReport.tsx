import {
  ActionIcon,
  Affix,
  Button,
  Card,
  Container,
  Group,
  Skeleton,
  Space,
  Divider,
  Stack,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import axios from '@/components/axios/axios';
import { useQuery } from 'react-query';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

export const QuizReport = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { id, slug, status, class_id, grade } = router.query;

  const getReport = async () => {
    const res = await axios.get(`quiz/${id}?secret= 11f24438-b63a-4de2-ae92-e1a1048706f5`);
    console.log(res);
    return res.data;
  };

  const { data, isLoading } = useQuery(['quiz', status], getReport, {
    staleTime: 0,
    cacheTime: 0,
  });
  console.log(data);
  console.log({ class_id });

  const removeLastChar = (str: string) => parseInt(str?.slice(0, -1));

  return (
    <div>
      <Affix position={{ top: 0, left: 0, right: 0 }}>
        <Card
          radius={0}
          p={0}
          sx={{
            background: 'transparent',
            //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Stack justify="center" sx={{ minHeight: 70, paddingLeft: 10 }}>
            <Group noWrap position="apart">
              <Group noWrap>
                <ActionIcon
                  variant="transparent"
                  onClick={() => router.back()} //router.replace(`/courses/${slug}`
                >
                  <ArrowLeftIcon className="rtl" width={40} height={40} />
                </ActionIcon>
                {!data?.title ? (
                  <Skeleton radius={8} height={30} width={100} />
                ) : (
                  <Text sx={{ lineHeight: 1.1 }}>{data?.title}</Text>
                )}
              </Group>
            </Group>
          </Stack>
        </Card>
      </Affix>
      <Space h={80} />
      <Space h="xl" />
      <Container>
        {isLoading ? (
          <Skeleton height={40} width="80%" m="auto" />
        ) : (
          <Text align="center" size="xl" color={'#298EAE'}>
            {data?.questions} {t.questions} . {data?.timer} {t.minutes}
          </Text>
        )}
        <Space h="xl" />
        <Stack px="xl" spacing="sm">
          {/* <Text>Receive grade</Text> */}
          <Text sx={{}}>{`${t.receive_grade}`}</Text>
          <Text color={'#298EAE'}>
            {isLoading ? (
              <Skeleton height={25} width={200} />
            ) : (
              `${t.to_Pass} ${data?.passing_percent_age} ${t.or_higher}`
            )}
          </Text>

          {
            <>
              {/* <Divider sx={{ borderColor: 'gray' }} /> */}
              {data?.grade >= 0 && data?.fullyMarked && <Text>{t['your-grade']}</Text>}
              {data?.grade >= 0 && !data?.fullyMarked && <Text>{t['your-mcq-grade-is']}</Text>}
              <Text
                sx={{
                  color:
                    removeLastChar(grade as string) > removeLastChar(data?.passing_percent_age)
                      ? '#3AC922'
                      : '#939393',
                  fontSize: 24,
                  whiteSpace: 'nowrap',
                }}
                weight={500}
              >
                {isLoading ? (
                  <Skeleton height={25} width={40} />
                ) : data?.grade !== null ? (
                  data?.grade + '%'
                ) : (
                  '_'
                )}
              </Text>
              <br />
              {data?.grade >= 0 && !data?.fullyMarked && <Text>{t.final}</Text>}
            </>
          }
          {
            <>
              <Text>{t['instructor-remark']}</Text>
              <Text
                sx={{
                  fontSize: 18,
                  whiteSpace: 'nowrap',
                }}
                weight={200}
              >
                {isLoading ? (
                  <Skeleton height={25} width={40} />
                ) : data?.remark !== null ? (
                  data?.remark?.content
                ) : (
                  <Text> {t['instructor Remark will appear here when be available']} </Text>
                )}
              </Text>
            </>
          }
          {/* <Space h="xl" /> */}
          {isLoading ? (
            <Skeleton height={40} width="80%" m="auto" />
          ) : (
            <>
              {data?.grade === null && data?.earned_marks === null && (
                <Button
                  id="btn-startQuiz"
                  size="md"
                  radius={8}
                  mt={20}
                  styles={{ label: { color: '#0A0909', fontWeight: 400 } }}
                  onClick={() => {
                    router.replace(`/courses/${slug}/quiz/${id}?status=start&class_id=${class_id}`);
                  }}
                >
                  {t['start-quiz']}
                </Button>
              )}
              {data?.reattempt && data?.grade !== null && (
                <Button
                  id="btn-quizTryAgain"
                  size="md"
                  radius={8}
                  mt={20}
                  styles={{ label: { color: '#0A0909', fontWeight: 400 } }}
                  onClick={() => {
                    router.replace(`/courses/${slug}/quiz/${id}?status=start&class_id=${class_id}`);
                  }}
                >
                  {t['try-again']}
                </Button>
              )}
            </>
          )}
        </Stack>
      </Container>
    </div>
  );
};
