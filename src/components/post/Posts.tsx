import { PostIcon } from '@/src/constants/icons/post';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Popover,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
  Pagination,
  Space,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import { LoadingSnipper } from '../ui/loading-snipper';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoRecordFound } from '../ui/no-record-found';
import { DotsVerticalIcon } from '@modulz/radix-icons';
import { Pills } from '../ui/pill';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { shimmer, toBase64 } from '@/utils/utils';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import { usePagination } from '@mantine/hooks';
import { getDate } from 'date-fns/esm';
import ImageWithFallback from '../ui/ImageWithFeedback';

type Props = {
  user_id: string | null;
  question_id: string;
  user: string;
  imagepath: string;
  question: string;
  created_at: string;
  answer: string;
  course_id: string;
  Questionrefetch: () => void;
  role: string;
  preAnswer: Answer | null;
};

type Answer = {
  question_id: string | null;
  answer_id: number | null;
  user: string | null;
  role: string | null;
  user_id: number | null;
  imagepath: string | null;
  answer: string | null;
  created_at: string | null;
};

export const Posts = (props: Props) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [allowReply, setAllowReply] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openedParentPopOver, setOpenedParentPopOver] = useState(false);
  const [activePopoverIndex, setActivePopoverIndex] = useState(-1);
  const [refetchReplies, setRefetchReplies] = useState(true);
  const [activePage, setPage] = useState(1);
  const [deletedId, setDeletedId] = useState('');

  const {
    user_id,
    question_id,
    user,
    imagepath,
    question,
    created_at,
    answer,
    course_id,
    Questionrefetch,
    role,
  } = props;
  const [answerCounter, setAnswerCounter] = useState<number>(parseInt(answer) || 0);
  const [userReply, setUserReply] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [userId, setUserId] = React.useState<string | null | undefined>();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openAnswerDeleteModal, setOpenAnswerDeleteModal] = useState(false);
  const [answerId, setAnswerID] = useState(0);
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [replies, setReplies] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [deleAnsNoti, setDeleAnsNoti] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  const handleReply = async () => {
    if (userReply.length === 0) {
      return;
    }
    return axios
      .post('answer/submit', {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        course_id,
        question_id,
        answer: userReply,
      })
      .then(() => {
        setAnswerCounter((state) => state + 1);
        if (activePage > 1) {
          setPage(1);
        }
        setSent(!sent);
      });
  };

  const replyMutation = useMutation(handleReply, {
    onSuccess: () => {
      setUserReply('');
      setShowReply(true);
      setPage(1);
      // setRefetchReplies(true);
      //refetch();
    },
    onSettled: () => {
      setRefetchReplies(true);
    },
    onError: (error: any) => {
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

  // const {
  //   data: replies,
  //   isRefetching,
  //   //fetchNextPage: repliesFatchNextpage,
  //   refetch,
  //   isSuccess,
  //   isLoading,
  //   isFetchingNextPage,
  //   hasNextPage: replicesHasNextPage,
  // } = useInfiniteQuery(
  //   ['replies', question_id, activePage],
  //   ({ pageParam }) =>
  //       getPaginatedData({
  //       //page: activePage,
  //       endpoint: `course/question/answer?question_id=${question_id}&page=${2}`,
  //       })
  //     ,
  //   {
  //     //getNextPageParam: (lastPage) => lastPage.next,
  //     onSettled: (data) => {
  //       setRefetchReplies(false);
  //       // setAnswerCounter(data?.total);
  //     },
  //     enabled: false,
  //   }
  // );
  // const repliesdataLength =
  //   replies?.pages.reduce((counter, page) => counter + page.results.length, 0) || 10;

  // const pagination = usePagination({ total: 10, initialPage: 1 });

  // const {
  //   isLoading,
  //   error,
  //   data: replies,
  //   refetch,
  // } = useQuery(['replies', question_id], () =>
  //   fetch(`course/question/answer?question_id=${question_id}`).then((res) => {
  //     alert("RRR:"+res)
  //     res.json();
  //   })
  // );

  useEffect(() => {
    if (showReply) {
      setIsLoading(true);
      let config = {
        method: 'get',
        url: `course/question/answer?question_id=${question_id}&page=${activePage}`,
      };
      // return console.log(props.preAnswer);
      axios(config)
        .then((response) => {
          setIsLoading(false);
          setAnswerCounter(response?.data?.total);
          setReplies(response?.data);
          setTotalPages(response?.data?.last_page);
          setDeleting(false);
          setOpenAnswerDeleteModal(false);
          if (deleAnsNoti) {
            showNotification({ message: 'Answer deleted successfully.', color: 'green' });
            setDeleAnsNoti(false);
          }
          //setAllowReply(false);
          //console.log('RES:', response);
        })
        .catch((error) => {
          setIsLoading(false);
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
    }
  }, [activePage, showReply, sent]);

  //console.log('REPLIES:', replies);

  React.useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    setUserId(user_id);
  }, []);

  function deleteQuestion(questuionId: string) {
    setDeleting(true);
    console.log(questuionId);
    let obj = {
      question_id: questuionId,
    };
    let config = {
      method: 'delete',
      url: 'question/delete',
      data: obj,
    };
    // return console.log(props.preAnswer);
    axios(config)
      .then((response) => {
        setDeletedId(question_id);
        if (props.preAnswer !== null) {
          router.back();
        } else {
          Questionrefetch();
        }
        setTimeout(() => {
          setDeleting(false);
          setOpenConfirmModal(false);
          showNotification({ message: 'Question deleted successfully.', color: 'green' });
        }, 3000);
      })
      .catch((error) => {
        setDeleting(false);
        setOpenConfirmModal(false);
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
  }

  function deleteAnswer() {
    setDeleting(true);
    let obj = {
      answer_id: answerId,
    };
    let config = {
      method: 'delete',
      url: 'answer/delete',
      data: obj,
    };
    axios(config)
      .then((response) => {
        if (replies?.data.length == 1 && totalPages > 1) {
          setPage(activePage - 1);
          // const res = replies?.data?.filter((x: any) => x.answer_id !== answerId);
          // setReplies({
          //   ...replies,
          //   data: res,
          // });
        }
        //else {
        setDeleAnsNoti(true);
        setSent(!sent);
        // }
        // setDeleting(false);
        // setOpenAnswerDeleteModal(false);

        // showNotification({ message: 'Answer deleted successfully.', color: 'green' });
        //setAnswerCounter((state) => state - 1);
        //refetch();
      })
      .catch((error) => {
        setDeleting(false);
        setOpenAnswerDeleteModal(false);
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
  }

  return (
    <>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t.Are_you_sure_you_want_to_delete_this_question}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-questionDeleteNo"
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
                {t.no}
              </Button>
              <Button
                id="btn-questionDeleteYes"
                variant="filled"
                onClick={() => {
                  deleteQuestion(question_id);
                }}
                loading={deleting}
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
                {t.yes}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Modal
        opened={openAnswerDeleteModal}
        onClose={() => setOpenAnswerDeleteModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t.Are_you_sure_you_want_to_delete_this_answer}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-answerDeleteNo"
                variant="filled"
                onClick={() => {
                  setOpenAnswerDeleteModal(false);
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
                {t.no}
              </Button>
              <Button
                id="btn-answerDeleteYes"
                variant="filled"
                onClick={() => {
                  deleteAnswer();
                }}
                radius={20}
                loading={deleting}
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
                {t.yes}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Box>
        <Card
          pb={0}
          pt={'1vh'}
          px={0}
          sx={{
            wordBreak: 'break-word',
            background: 'transparent',
            opacity: deletedId == question_id ? 0.5 : 1,
          }}
        >
          <Stack p={0}>
            <Group sx={{ margin: '0px' }}>
              <Avatar radius="xl">
                <ImageWithFallback
                  src={
                    imagepath ||
                    `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${user}`
                  }
                  fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${user}`}
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
              </Avatar>
              <Stack spacing={0}>
                {role == 'User' ? (
                  <Text size="xs" weight={500} color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                    {user}
                  </Text>
                ) : (
                  <Text size="xs" weight={500} color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                    {user} <Pills>{role}</Pills>
                  </Text>
                )}
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  {created_at}
                </Text>
              </Stack>
              {user_id == userId && deletedId !== question_id ? (
                <Stack
                  style={{
                    position: 'absolute',
                    right: router.locale === 'en-us' ? 0 : undefined,
                    left: router.locale === 'en-us' ? undefined : 0,
                  }}
                >
                  <ActionIcon
                    id={`btn-deleteQuestionPopover-${user_id}`}
                    variant="transparent"
                    onClick={() => setOpenedParentPopOver(true)}
                    sx={{}}
                  >
                    <DotsVerticalIcon className="ltr" width={15} height={15} />
                  </ActionIcon>
                  <Popover
                    radius="xs"
                    spacing="xs"
                    shadow="xs"
                    placement="end"
                    gutter={-15}
                    opened={openedParentPopOver}
                    onClose={() => setOpenedParentPopOver(false)}
                    target={<></>}
                    //  width={100}
                    position="bottom"
                    withArrow
                  >
                    <Stack
                      id="btn-questionDelete"
                      style={{ display: 'block' }}
                      onClick={() => {
                        setOpenedParentPopOver(false);
                        setOpenConfirmModal(true);
                      }}
                    >
                      <Text size="sm">{t.delete}</Text>
                    </Stack>
                  </Popover>
                </Stack>
              ) : null}
            </Group>
            <Text size="xs" color={colorScheme == 'dark' ? '#CEC9C4' : '#000'}>
              {question}
            </Text>
            <Group sx={{ margin: '0px' }}>
              {answerCounter && (
                <UnstyledButton
                  id={`btn-showAnswers-${question_id}`}
                  disabled={answerCounter == null}
                  sx={{
                    color: '#298EAE',
                    fontSize: 12,
                    fontWeight: 600,
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                  onClick={() => {
                    setShowReply(!showReply);
                    //setAllowReply(!allowReply)
                    if (!showReply) {
                      // refetch();
                      //setReplies({})
                      //setPage(1);
                    }
                  }}
                >
                  {answerCounter
                    ? answerCounter == null
                      ? `0 ${answer}`
                      : `${answerCounter} ${answerCounter > 1 ? t.answers : t.answer}`
                    : null}
                </UnstyledButton>
              )}
              {isLoading && (
                <Box ml="auto" sx={{ position: 'absolute', right: 5, top: 10 }}>
                  <LoadingSnipper height={20} width={20} />
                </Box>
              )}

              <Button
                id={`btn-questionReply-${question_id}`}
                py={0}
                variant="filled"
                sx={{
                  marginLeft: '0.5rem',
                  maxWidth: 'max-content',
                  fontWeight: 400,
                  fontSize: 10,
                  borderRadius: 8,
                }}
                styles={{
                  root: {
                    height: 25,
                  },
                  filled: {
                    background: '#98D1B1',
                    '&:hover': {
                      background: '#98D1B1',
                    },
                  },
                  label: { color: colorScheme == 'dark' ? '#333333' : 'white' },
                }}
                onClick={() => setAllowReply(!allowReply)}
              >
                {t.reply}
              </Button>
            </Group>
            {(showReply || props.preAnswer || allowReply) && (
              <Divider sx={{ borderColor: '1px solid #ACB7CA' }} />
            )}
            {allowReply && (
              <Box sx={{ position: 'relative' }}>
                <Textarea
                  id={`txtarea-writeAnswer-${user_id}`}
                  variant="filled"
                  placeholder={t.write_your_answer}
                  size="xs"
                  sx={{
                    textarea: {
                      color: 'black',
                    },
                  }}
                  value={userReply}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setUserReply(e.target.value);
                    }
                  }}
                  minRows={2}
                  autosize
                  styles={(theme) => ({
                    input: {
                      height: 40,
                      backgroundColor: '#F7F6F5',
                      //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#F6F6F6',
                    },
                  })}
                  radius={8}
                  rightSection={
                    <Stack sx={{ height: '100%', paddingBottom: '1.5vh', justifyContent: 'end' }}>
                      {replyMutation.isLoading ? (
                        <Box mt={10}>
                          <LoadingSnipper width={20} height={20} />
                        </Box>
                      ) : (
                        <ActionIcon
                          id={`btn-postAnswer-${user_id}`}
                          onClick={() => {
                            if (userReply.length > 0 && userReply.length <= 300) {
                              replyMutation.mutate();
                            } else {
                              showNotification({
                                message: 'Answer must be less than 300 characters',
                                color: 'red',
                              });
                            }
                          }}
                        >
                          <PostIcon />
                        </ActionIcon>
                      )}
                      <Text
                        sx={{ fontSize: 9, position: 'absolute', right: 10, bottom: 2 }}
                        color="grey"
                      >
                        {userReply.length}/300
                      </Text>
                    </Stack>
                  }
                  rightSectionWidth={50}
                />
              </Box>
            )}
            <Stack
              spacing="sm"
              sx={{ position: 'relative', maxHeight: '45vh', overflowY: 'scroll' }}
            >
              {showReply ? (
                <>
                  {/* <InfiniteScroll
                    dataLength={repliesdataLength}
                    next={repliesFatchNextpage}
                    hasMore={!!replicesHasNextPage}
                    loader={<></>}
                  > */}
                  <Stack>
                    {!replies?.data ? (
                      <>
                        <Skeleton sx={{ zIndex: 1 }} radius={8} height={20} width="100%" />
                        <Skeleton sx={{ zIndex: 1 }} radius={8} height={20} width="100%" />
                        <Skeleton sx={{ zIndex: 1 }} radius={8} height={20} width="100%" />
                      </>
                    ) : replies?.data.length > 0 ? (
                      <React.Fragment key="0">
                        {replies?.data?.map((reply: any, index: number) => (
                          <Box key={reply.answer_id} mt={2}>
                            <Group noWrap>
                              <Avatar radius="xl" sx={{ alignSelf: 'start' }}>
                                <ImageWithFallback
                                  src={
                                    reply.imagepath ||
                                    `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${reply.user}`
                                  }
                                  fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${reply.user}`}
                                  layout="fill"
                                  placeholder="blur"
                                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                    shimmer(700, 475)
                                  )}`}
                                />
                              </Avatar>
                              <Stack spacing={5}>
                                <Group spacing={8}>
                                  {reply?.role == 'User' ? (
                                    <Text
                                      size="xs"
                                      weight={500}
                                      color={colorScheme == 'dark' ? '#EDD491' : '#000'}
                                    >
                                      {reply.user}
                                    </Text>
                                  ) : (
                                    <Text
                                      size="xs"
                                      weight={500}
                                      color={colorScheme == 'dark' ? '#EDD491' : '#000'}
                                    >
                                      {reply.user}
                                      <Pills>{reply?.role}</Pills>
                                    </Text>
                                  )}

                                  <Text size="xs" sx={{ color: '#298EAE' }}>
                                    {reply.created_at}
                                  </Text>
                                </Group>
                                {userId == reply?.user_id ? (
                                  <Stack
                                    style={{
                                      position: 'absolute',
                                      right: router.locale === 'en-us' ? 0 : undefined,
                                      left: router.locale === 'en-us' ? undefined : 0,
                                    }}
                                  >
                                    <ActionIcon
                                      id={`btn-answerPopover-${user_id}`}
                                      variant="transparent"
                                      onClick={() => {
                                        setActivePopoverIndex(index);
                                        setOpened(true);
                                      }}
                                      sx={{}}
                                    >
                                      <DotsVerticalIcon className="ltr" width={15} height={15} />
                                    </ActionIcon>
                                    {activePopoverIndex === index ? (
                                      <Popover
                                        radius="xs"
                                        spacing="xs"
                                        shadow="xs"
                                        placement="end"
                                        gutter={-15}
                                        opened={opened}
                                        onClose={() => {
                                          setActivePopoverIndex(-1);
                                          setOpened(false);
                                        }}
                                        target={<></>}
                                        //  width={100}
                                        position="bottom"
                                        withArrow
                                      >
                                        <Stack
                                          id="btn-answerDelete"
                                          className="magicHelper"
                                          style={{ display: 'block' }}
                                          onClick={() => {
                                            setAnswerID(reply.answer_id);
                                            setOpened(false);
                                            setOpenAnswerDeleteModal(true);
                                          }}
                                        >
                                          <Text size="sm">{t.delete}</Text>
                                        </Stack>
                                      </Popover>
                                    ) : null}
                                  </Stack>
                                ) : null}
                                <Text
                                  sx={{
                                    color: '#298EAE',
                                    fontSize: 9,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {reply.answer}
                                </Text>
                              </Stack>
                            </Group>
                          </Box>
                        ))}
                      </React.Fragment>
                    ) : // <NoRecordFound />
                    null}
                    {/* {isFetchingNextPage && (
                        <>
                          <Skeleton radius={8} height={20} width="100%" />
                          <Skeleton radius={8} height={20} width="100%" />
                          <Skeleton radius={8} height={20} width="100%" />
                        </>
                      )} */}
                  </Stack>

                  {totalPages > 1 && (
                    <Pagination
                      sx={{ justifyContent: 'flex-end', padding: 15 }}
                      page={activePage}
                      total={totalPages}
                      onChange={(el) => {
                        setReplies({});
                        setPage(el);
                      }}
                      size="xs"
                      radius="xl"
                    />
                  )}
                  {/* <Space h="sm" /> */}
                </>
              ) : props.preAnswer ? (
                <>
                  <Box mt={2}>
                    <Group noWrap>
                      <Avatar radius="xl" sx={{ alignSelf: 'start' }}>
                        <ImageWithFallback
                          src={
                            props.preAnswer.imagepath ||
                            `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${props.preAnswer.user}`
                          }
                          fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${props.preAnswer.user}`}
                          layout="fill"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                        />
                      </Avatar>
                      <Stack spacing={5}>
                        <Group spacing={8}>
                          {props.preAnswer?.role == 'User' ? (
                            <Text size="xs" weight={500}>
                              {props.preAnswer.user}
                            </Text>
                          ) : (
                            <Text size="xs" weight={500}>
                              {props.preAnswer.user}
                              <Pills>{props.preAnswer?.role}</Pills>
                            </Text>
                          )}

                          <Text size="xs" sx={{ color: '#ACB7CA' }}>
                            {props.preAnswer.created_at}
                          </Text>
                        </Group>

                        <Text sx={{ color: '#939393', fontSize: 10, wordBreak: 'break-word' }}>
                          {props.preAnswer.answer}
                        </Text>
                      </Stack>
                    </Group>
                  </Box>
                </>
              ) : null}
            </Stack>
          </Stack>
        </Card>
      </Box>
    </>
  );
};
