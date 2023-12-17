import { ActionIcon, Box, Group, Space, Text, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useEffect } from 'react';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

type Props = {
  setRefreshPosts: (value: boolean) => void;
  setPostLoading: (value: boolean) => void;
  refetch: () => void;
};

export const WritePost = ({ refetch, setRefreshPosts, setPostLoading }: Props) => {
  const [question, setQuestion] = React.useState('');
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { slug } = router.query;

  const postQuestion = async () => {
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      course_id: slug,
      question,
    };
    const config = {
      method: 'post',
      url: 'question/submit',
      data: obj,
    };
    const res = await axios(config);
    return res.data;
  };

  const newQuestion = useMutation(postQuestion, {
    onSettled: () => {
      setRefreshPosts(true);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error: any) => {
      refetch();
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
    },
  });

  useEffect(() => {
    setPostLoading(newQuestion.isLoading);
  }, [newQuestion.isLoading]);

  return (
    <Box
      p={8}
      pb={1}
      mt={'2vh'}
      sx={(theme) => ({
        borderRadius: 8,
        position: 'relative',
        backgroundColor: '#F7F6F5',
        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
      })}
    >
      <Textarea
        id="txtarea-writeQuestion"
        className="forPostInput"
        variant="unstyled"
        placeholder={t['courses-details'].write_your_question}
        minRows={3}
        radius={8}
        maxLength={300}
        value={question}
        sx={{
          textarea: {
            color: 'black',
          },
        }}
        onChange={(e) => {
          if (e.target.value.length <= 300) {
            setQuestion(e.target.value);
          } else {
            showNotification({
              message: 'Question is too long, max 300 characters',
              color: 'yellow',
            });
          }
        }}
      />
      <Space h={0} />
      <Group noWrap position="apart" px={10}>
        <Text size="xs" color="grey">
          {question.length}/300
        </Text>
        <ActionIcon
          id="btn-postQuestion"
          variant="transparent"
          onClick={() => {
            if (question.length > 1 && question.length <= 300) {
              newQuestion.mutate();
              setQuestion('');
            } else if (question.length === 0) {
              showNotification({
                message: 'Please write a question',
                color: 'red',
              });
            }
          }}
          color="blue"
        >
          <Text size="xs">{t.post}</Text>
        </ActionIcon>
      </Group>
    </Box>
  );
};
