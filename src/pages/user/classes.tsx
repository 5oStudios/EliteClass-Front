import { MainLayout } from '@/components/layouts/MainLayout';
import { Bookmark2 } from '@/src/constants/icons';
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
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { parseISO, format, startOfMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { MonthlyCalendar } from '@zach.codes/react-calendar';
import { MonthlyBody } from '@/components/calendar/MonthlyBody';
import { MonthlyNav } from '@/components/calendar/MonthlyNav';
import { MonthlyDay } from '@/components/calendar/MonthlyDay';
import { MonthlyEventItem } from '@/components/calendar/MonthlyEventItems';
import { useQuery } from 'react-query';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { Seo } from '@/components/seo';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
// function _interopRequireDefault(obj: any) {
//   return obj && obj.__esModule ? obj : { default: obj };
// }
var _index = _interopRequireDefault(require('node_modules/date-fns/toDate/index.js'));
// import { format, formatDistance } from "date-fns";

function _interopRequireDefault(obj: any) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var _index = _interopRequireDefault(require('node_modules/date-fns/toDate/index.js'));

type IEvents = {
  [key: string]: {
    enroll_start: string;
    meeting_id: string;
    meetingid: string;
    start_time: string;
    title: string;
  }[];
};

export const ClassesCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [calendarCheck, setCalendarCheck] = useState<boolean>(true);
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);
  const [event, setEvents] = useState<any[]>([]);
  const { colorScheme } = useMantineColorScheme();
  const [modal, setModal] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState<boolean | null>(null);

  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language

  useEffect(() => {
    const access_token = getCookie('access_token');
    if (access_token) {
      setisAuthenticated(true);
    } else {
      setisAuthenticated(false);
    }
    if (!isAuthenticated) {
      router.prefetch('/signin');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && isAuthenticated !== null) {
      router.prefetch('/signin');
    }
  }, []);

  useEffect(() => {
    setSigning(false);
  }, [router]);

  function addMonths(date: any, months: any) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  const { isLoading, isRefetching, error, refetch } = useQuery<any, any>(
    ['mycalendar', currentMonth],
    () => {
      setFetchingEvents(true);
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        currentMonth.getDate()
      );

      const obj = {
        from: format(newDate, 'yyyy-MM-dd'),
        to: format(addMonths(newDate, 1), 'yyyy-MM-dd'),
      };

      const config = {
        method: 'post',
        url: 'my/calendar',
        data: obj,
      };
      axios(config)
        .then((res) => {
          setCalendarCheck(false);
          const events: any[] = [];
          Object.keys(res?.data).forEach((key) => {
            res?.data[key].forEach((item: any) => {
              events.push({
                title: item?.title,
                date: parseISO(item?.session_time),
                //time: item?.start_time,
                //is_ended: item?.is_ended,
                event_id: item?.meeting_id,
                id: item?.id,
                type: item?.type,
              });
            });
          });
          setEvents(events);
        })
        .finally(() => {
          setFetchingEvents(false);
        });
    },
    { enabled: isAuthenticated !== null && isAuthenticated, staleTime: 0, cacheTime: 0 }
  );

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [calendarCheck, isAuthenticated]);

  if (error) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: error?.message,
        color: 'red',
      });
    }
  }

  if (!isAuthenticated && isAuthenticated !== null) {
    return (
      <Stack
        align="center"
        sx={{
          background: '#EDD491',
          height: '100vh',
          width: '100%',
        }}
      >
        <Text
          weight={500}
          pt="100px"
          component="p"
          align="center"
          sx={{ color: 'white', fontSize: '1.8rem' }}
        >
          {t['my-courses'].You_need_to_login_first}
        </Text>
        <Button
          loading={signing}
          size="md"
          radius={20}
          styles={{
            root: {
              width: '200px',
            },
            filled: {
              background: '#82B1CF',
              '&:hover': {
                background: '#82B1CF',
              },
            },
            label: {
              color: 'white',
            },
          }}
          onClick={() => {
            setSigning(true);
            router.push('/signin');
          }}
        >
          {t['sign-in']}
        </Button>
      </Stack>
    );
  }

  if (isAuthenticated) {
    return (
      <Box>
        <LoadingScreen isLoading={isLoading} />
        <Seo title="classes" description="EliteClass user booked classes" path="/user/classes" />
        <Modal opened={modal} onClose={() => setModal(false)} withCloseButton={false} centered>
          <Card>
            <Stack>
              <Text align="center">{t['booking-popup']}</Text>
              <SimpleGrid cols={2}>
                <Button
                  id="btn-bookingPopupInpreson"
                  variant="filled"
                  onClick={() => {
                    router.push('/in-person-sessions');
                  }}
                  radius={20}
                  styles={{
                    filled: {
                      background: '#298EAE',
                      '&:hover': {
                        background: '#298EAE',
                      },
                    },
                    label: {
                      color: 'white',
                    },
                  }}
                >
                  {t['in-person']}
                </Button>
                <Button
                  id="btn-bookingPopupLive"
                  variant="filled"
                  onClick={() => {
                    router.push('/live-sessions');
                  }}
                  loading={signing}
                  radius={20}
                  styles={{
                    filled: {
                      background: '#298EAE',
                      '&:hover': {
                        background: '#298EAE',
                      },
                    },
                    label: {
                      color: 'white',
                    },
                  }}
                >
                  {t.live}
                </Button>
              </SimpleGrid>
            </Stack>
          </Card>
        </Modal>
        {isAuthenticated && (
          <>
            <Container className="calenderIssues" p={0}>
              <Card
                radius={0}
                sx={{
                  height: 75,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                  paddingLeft: 10,
                  background: 'transparent',
                }}
              >
                <Stack justify="center" sx={{ height: '100%' }}>
                  <Group position="apart">
                    <Group>
                      <ActionIcon variant="transparent">
                        <Bookmark2 color={colorScheme == 'dark' ? '#EDD491' : '#292D32'} />
                      </ActionIcon>
                      <Text sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                        {t.calender['available-sesssions']}
                      </Text>
                    </Group>
                    {fetchingEvents && <Loader width={20} height={20} />}
                  </Group>
                </Stack>
              </Card>
            </Container>
            <ScrollArea scrollbarSize={10}>
              <Container p={0} sx={{ height: 'calc(100vh - 175px)' }}>
                <MonthlyCalendar
                  currentMonth={currentMonth}
                  onCurrentMonthChange={(date) => setCurrentMonth(date)}
                >
                  <MonthlyNav
                    isLoading={false}
                    setCalendarCheck={setCalendarCheck}
                    setCurrentMonth={setCurrentMonth}
                    date={currentMonth}
                  />
                  <MonthlyBody events={event}>
                    <MonthlyDay<any>
                      renderDay={(data) =>
                        data.map((item, index) => {
                          var inPersonSession = 0;
                          var liveSession = 0;
                          {
                            data.forEach((element) => {
                              if (element.type == 'in-person-session') {
                                inPersonSession++;
                              } else {
                                liveSession++;
                              }
                            });
                          }
                          return (
                            <>
                              {liveSession != 0 && (
                                <MonthlyEventItem
                                  key={index}
                                  count={liveSession}
                                  type={'live-streaming'}
                                />
                              )}
                              {inPersonSession != 0 && (
                                <MonthlyEventItem
                                  key={index + 1}
                                  count={inPersonSession}
                                  type={'in-person-session'}
                                />
                              )}
                            </>
                          );
                        })
                      }
                    />
                  </MonthlyBody>
                </MonthlyCalendar>
                <Space h={10} />
                <Group align="center" position="center">
                  <Group spacing={5}>
                    <Box
                      sx={{
                        background: '#3AC922',
                        width: '12px',
                        height: '12px',
                        borderRadius: '100%',
                      }}
                    />
                    <Text>{t.calender['live-sessions']}</Text>
                  </Group>
                  <Group spacing={5}>
                    <Box
                      sx={{
                        background: '#FF3030',
                        width: '12px',
                        height: '12px',
                        borderRadius: '100%',
                      }}
                    />
                    <Text>{t.calender['inperson-sessions']}</Text>
                  </Group>
                </Group>
                <Container>
                  <Stack
                    id="btn-bookNow"
                    onClick={() => {
                      //  router.push('/user/cart')
                      setModal(true);
                    }}
                    sx={{
                      height: '44px',
                      width: '100%',
                      borderRadius: '20px',
                      background: '#298EAE',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px',
                    }}
                  >
                    <Text sx={{ fontSize: 16, color: 'white' }}>
                      {t['session-details'].book_now}
                    </Text>
                  </Stack>
                </Container>
              </Container>
            </ScrollArea>
          </>
        )}
        <Space h={100} />
      </Box>
    );
  }
  return null;
};

//@ts-ignore
ClassesCalendar.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default ClassesCalendar;
