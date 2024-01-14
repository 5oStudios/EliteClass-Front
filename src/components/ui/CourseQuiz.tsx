import React, { useEffect, useState } from 'react';
import axios from '@/components/axios/axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Button,
  Card,
  Container,
  Group,
  Radio,
  RadioGroup,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  Textarea,
  Image,
} from '@mantine/core';
import { CompletedMarkIcon } from '@/src/constants/icons';
import { WrongIcon } from '@/src/constants/icons/wrongIcon';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { PageHeader } from './pageHeader';
import { useTimer } from 'react-timer-hook';
import { CheckIcon } from '@modulz/radix-icons';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const ResultCard = ({ correct }: { correct: boolean }) => {
  // language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  // language
  return (
    <Group
      align="center"
      sx={{
        background: correct ? '#98D1B1' : '#D9847F',
        width: '200px',
        borderRadius: 20,
      }}
      py={8}
      px={10}
    >
      {correct ? <CompletedMarkIcon /> : <WrongIcon />}
      <Text
        sx={{
          color: '#000000', //correct ? '#199E3F' : '#FF3030',
        }}
      >
        {correct ? t.correct : t.incorrect}
      </Text>
    </Group>
  );
};

export const CourseQuiz = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { id, slug, class_id } = router.query;

  const [answers, setAnswers] = useState<{ id: number; ans: string }[]>([]);

  const [result, setResult] = useState<any>();

  const [isComplete, setIsComplete] = useState<boolean>();

  const getQuiz = async () => {
    const res = await axios.get(`quiz/start/${id}?secret= 11f24438-b63a-4de2-ae92-e1a1048706f5`);
    console.log(res.data);

    return res.data;
  };
  // was this question answered?
  const isAnswered = (id: number) => {
    let found = false;
    result?.result?.map((r: any) => {
      if (r.question_id === id && r.correct) {
        found = true;
      }
    });
    return found;
  };
  const { seconds, minutes, hours, restart, pause, isRunning } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      getResult.mutate();
    },
  });

  const { data, isLoading } = useQuery(['quiz', id], getQuiz, {
    onSuccess: (data) => {
      console.log(data);

      if (!isRunning) {
        setIsComplete(data?.is_complete);
        const time = new Date();
        time.setSeconds(time.getSeconds() + parseInt(data?.timer) * 60);
        restart(time);
      }
    },
  });

  const getQuestionids = () => {
    const questionsId: number[] = [];
    answers.forEach((ans) => {
      questionsId.push(ans.id);
    });
    return questionsId;
  };
  const getAnswers = () => {
    const answersid: string[] = [];
    console.log('ANSS:', answers);
    answers.forEach((ans) => {
      console.log(ans);

      answersid.push(ans.ans);
    });
    return answersid;
  };

  const cache = useQueryClient();

  const handleMarkComplete = async ({ class_id }: { class_id: string }) => {
    //console.log({ class_id });
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      class_id,
    };
    const config = {
      method: 'post',
      url: 'course/progress/update',
      data: obj,
    };
    // console.log({ obj });
    const res = await axios(config);

    if (res.status === 200) {
      // showNotification({
      //   message: 'Lesson marked as complete',
      //   icon: <CheckIcon />,
      //   color: 'teal',
      // });
    } else {
    }
    cache.invalidateQueries([`courses/lessons`, slug]);
  };

  const getResult = useMutation(
    async () => {
      console.log(getQuestionids(), getAnswers());
      const res = await axios.post('quiz/submit', {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        topic_id: id,
        course_id: data?.course_id,
        question_id: getQuestionids(),
        answer: getAnswers(),
      });
      //console.log({ res });
      return res.data;
    },
    {
      onSuccess: (data) => {
        setResult(data);
        console.log(result);

        if (!isComplete) {
          handleMarkComplete({ class_id: class_id as string });
        }
        pause();
      },
      onError: () => {
        showNotification({
          message: 'Something went wrong',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answers.length === 0) {
      showNotification({
        message: 'Please answer atleast one question',
        color: 'red',
      });
    } else {
      getResult.mutate();
    }
  };

  return (
    <>
      {!getResult.isSuccess ? (
        <PageHeader
          title={data?.title}
          rightSection={
            <Text dir="ltr" size="sm" sx={{ color: '#82B1CF', whiteSpace: 'nowrap' }} mr={10}>
              {!getResult.isSuccess && `${hours} : ${minutes} : ${seconds}`}
            </Text>
          }
        />
      ) : (
        <Card
          radius={0}
          p={0}
          sx={{
            background: 'transparent',
            //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Stack justify="center" sx={{ minHeight: 70, paddingLeft: 10 }}>
            <Text align="center" size="xl" sx={{ color: '#298EAE' }}>
              {t['your-grade-is']} {getResult.data?.grade_in_percent}
            </Text>
          </Stack>
        </Card>
      )}

      <Space h="xl" />
      <ScrollArea sx={{ height: 'calc(100vh - 120px)' }} scrollbarSize={10}>
        <Container sx={{ maxWidth: '100vw' }}>
          <form onSubmit={handleSubmit}>
            <Stack>
              {isLoading &&
                [1, 2, 3].map((i) => {
                  return (
                    <Stack key={i}>
                      <Skeleton height={30} width="100%" />
                      <Skeleton height={25} width="30%" />
                      <Skeleton height={25} width="30%" />
                      <Skeleton height={25} width="30%" />
                      <Skeleton height={25} width="30%" />
                    </Stack>
                  );
                })}

              {data?.questions?.map((question: any, i: number) => (
                <Stack key={question.id}>
                  {question.type === 'mcq' && (
                    <RadioGroup
                      className="questions"
                      label={
                        <SimpleGrid
                          sx={{ gridTemplateColumns: '75% max-content', alignItems: 'end' }}
                        >
                          <Text size="xs">{`${i + 1}- ${question.question}`}</Text>
                          <Text
                            px={6}
                            py={2}
                            size="xs"
                            mt={3}
                            sx={{
                              alignSelf: 'start',
                              color: 'white',
                              background: '#298EAE',
                              borderRadius: 5,
                              flexShrink: 0,
                            }}
                          >
                            {data?.per_quiz_mark} {t.point}
                          </Text>
                        </SimpleGrid>
                      }
                      required
                      orientation="vertical"
                      styles={{
                        required: {
                          display: 'none',
                        },
                      }}
                      sx={{
                        disabled: {
                          borderColor: '#edd491 !important',
                          backgroundColor: 'red',
                          color: 'red',
                        },
                      }}
                      size="xs"
                      color="blue"
                      onChange={(value: any) => {
                        setAnswers((state) => {
                          console.log('STATE:', state);
                          const newState = [...state];
                          const currentQuestion = state.findIndex((q) => q.id === question.id);
                          if (currentQuestion !== -1) {
                            newState[currentQuestion] = { id: question.id, ans: value };
                            return newState;
                          } else {
                            return [...newState, { id: question.id, ans: value }];
                          }
                        });
                      }}
                    >
                      <Radio
                        id={`rdb-a-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'a'}
                        label={question.a}
                      />
                      <Radio
                        id={`rdb-b-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'b'}
                        label={question.b}
                      />
                      <Radio
                        id={`rdb-c-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'c'}
                        label={question.c}
                      />
                      <Radio
                        id={`rdb-d-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'d'}
                        label={question.d}
                      />
                    </RadioGroup>
                  )}
                  {question.type === 'audio' && (
                    <Textarea
                      label={
                        <SimpleGrid
                          sx={{ gridTemplateColumns: '75% max-content', alignItems: 'end' }}
                        >
                          <Text size="xs">{`${i + 1}- ${question.question}`}</Text>
                          <Text
                            px={6}
                            py={2}
                            size="xs"
                            mt={3}
                            sx={{
                              alignSelf: 'start',
                              color: 'white',
                              background: '#298EAE',
                              borderRadius: 5,
                              flexShrink: 0,
                            }}
                          >
                            {data?.per_quiz_mark} {t.point}
                          </Text>
                        </SimpleGrid>
                      }
                      description={
                        <audio controls>
                          <track kind="captions" src="path/to/captions.vtt" label="English" />
                          <source
                            src={`${process.env.NEXT_PUBLIC_audio_PATH}${question.audio}`}
                            type="audio/mp3"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      }
                      placeholder="Type your answer here..."
                      onChange={(value: any) => {
                        setAnswers((state) => {
                          console.log('STATE:', state);
                          const newState = [...state];
                          const currentQuestion = state.findIndex((q) => q.id === question.id);
                          if (currentQuestion !== -1) {
                            newState[currentQuestion] = {
                              id: question.id,
                              ans: value.target.value,
                            };
                            return newState;
                          } else {
                            return [...newState, { id: question.id, ans: value.target.value }];
                          }
                        });
                      }}
                    />
                  )}
                  {question.type === 'image' && (
                    <RadioGroup
                      className="questions"
                      label={
                        <SimpleGrid
                          sx={{ gridTemplateColumns: '75% max-content', alignItems: 'end' }}
                        >
                          <Text size="xs">{`${i + 1}- ${question.question}`}</Text>
                          <Text
                            px={6}
                            py={2}
                            size="xs"
                            mt={3}
                            sx={{
                              alignSelf: 'start',
                              color: 'white',
                              background: '#298EAE',
                              borderRadius: 5,
                              flexShrink: 0,
                            }}
                          >
                            {data?.per_quiz_mark} {t.point}
                          </Text>
                          <Image
                            radius="md"
                            src={`${process.env.NEXT_PUBLIC_image_PATH}${question.question_img}`}
                          />
                        </SimpleGrid>
                      }
                      required
                      orientation="vertical"
                      styles={{
                        required: {
                          display: 'none',
                        },
                      }}
                      sx={{
                        disabled: {
                          borderColor: '#edd491 !important',
                          backgroundColor: 'red',
                          color: 'red',
                        },
                      }}
                      size="xs"
                      color="blue"
                      onChange={(value: any) => {
                        setAnswers((state) => {
                          console.log('STATE:', state);
                          const newState = [...state];
                          const currentQuestion = state.findIndex((q) => q.id === question.id);
                          if (currentQuestion !== -1) {
                            newState[currentQuestion] = { id: question.id, ans: value };
                            return newState;
                          } else {
                            return [...newState, { id: question.id, ans: value }];
                          }
                        });
                      }}
                    >
                      <Radio
                        id={`rdb-a-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'a'}
                        label={question.a}
                      />
                      <Radio
                        id={`rdb-b-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'b'}
                        label={question.b}
                      />
                      <Radio
                        id={`rdb-c-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'c'}
                        label={question.c}
                      />
                      <Radio
                        id={`rdb-d-${question.id}`}
                        className="reportcardRadio"
                        disabled={getResult.isSuccess}
                        value={'d'}
                        label={question.d}
                      />
                    </RadioGroup>
                  )}
                  {question.type === 'essay' && (
                    <Textarea
                      label={
                        <SimpleGrid
                          sx={{ gridTemplateColumns: '75% max-content', alignItems: 'end' }}
                        >
                          <Text size="xs">{`${i + 1}- ${question.question}`}</Text>
                          <Text
                            px={6}
                            py={2}
                            size="xs"
                            mt={3}
                            sx={{
                              alignSelf: 'start',
                              color: 'white',
                              background: '#298EAE',
                              borderRadius: 5,
                              flexShrink: 0,
                            }}
                          >
                            {data?.per_quiz_mark} {t.point}
                          </Text>
                        </SimpleGrid>
                      }
                      placeholder="Type your answer here..."
                      onChange={(value: any) => {
                        setAnswers((state) => {
                          console.log('STATE:', state);
                          const newState = [...state];
                          const currentQuestion = state.findIndex((q) => q.id === question.id);
                          if (currentQuestion !== -1) {
                            newState[currentQuestion] = {
                              id: question.id,
                              ans: value.target.value,
                            };
                            return newState;
                          } else {
                            return [...newState, { id: question.id, ans: value.target.value }];
                          }
                        });
                      }}
                    />
                  )}
                  {getResult.isSuccess && isAnswered(question.id) ? (
                    <ResultCard correct={true} />
                  ) : (
                    getResult.isSuccess && <ResultCard correct={false} />
                  )}
                </Stack>
              ))}
              <Space h="md" />
              {!getResult.isSuccess && (
                <Button
                  id="btn-quizSubmit"
                  size="md"
                  type="submit"
                  radius={8}
                  styles={{ label: { color: '#0A0909', fontWeight: 400 } }}
                  loading={getResult.isLoading}
                >
                  {t.submit}
                </Button>
              )}
              {getResult.isSuccess && (
                <Button
                  id="btn-showResult"
                  size="md"
                  radius={8}
                  onClick={() => {
                    router.replace(
                      `/courses/${slug}/quiz/${id}?class_id=${class_id}&status=final_report&grade=${getResult.data?.grade_in_percent}`
                    );
                  }}
                >
                  {t.show_result}
                </Button>
              )}
              <Space h="xl" />
            </Stack>
          </form>
        </Container>
      </ScrollArea>
    </>
  );
};
