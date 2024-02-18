import {
  Button,
  Container,
  Skeleton,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import axios from '@/components/axios/axios.js';
import moment from 'moment';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import NextImage from 'next/image';
import momentWithTimeZone from 'moment-timezone';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { route } from 'next/dist/server/router';
import { NoRecordFound } from '@/components/ui/no-record-found';

type props = {
  date_time: string;
  url: any;
  class_id?: string;
  is_ended?: boolean;
  is_complete?: boolean;
  isPartOfCourse?: boolean;
  isStarted: string;
};
export const LiveSessionLessionsTab = ({
  date_time,
  url,
  class_id,
  is_ended,
  is_complete,
  isPartOfCourse,
  isStarted,
}: props) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [loading, Loading] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);
  const { colorScheme } = useMantineColorScheme();
  let isButton: boolean = false;
  const videoRef = useRef(null);

  const toggleFullscreen = () => {
    const videoElement: any = videoRef.current;

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    }
  };
  // const [isRecording, setIsRecording] = useState<boolean>(false);
  // let showDateTime: boolean = false;
  // let showTime: boolean = false;

  // let currentDate = new Date();
  // currentDate = new Date(
  //   `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`
  // ); //TODO: yar ya bad ma change krna h ios

  // const newcurrentDate = new Date(currentDate);
  // const meeting_date = new Date(date_time);

  // if (meeting_date > newcurrentDate) {
  //   showDateTime = true;
  //   isButton = true;
  //   console.log('date greater');
  // } else if (meeting_date < newcurrentDate) {
  //   is_ended = true;
  //   console.log('date less');
  // }
  // if (newcurrentDate.getTime() == meeting_date.getTime()) {

  //   var currentTime = moment(new Date().toLocaleTimeString(), 'h:mma');
  //   var startTime = moment(date_time, 'h:mma');

  //   console.log(currentTime.isAfter(startTime));
  //   console.log(currentTime.isBefore(startTime));

  //   if (currentTime.isAfter(startTime) && is_ended == false) {
  //     is_ended = false;
  //     isButton = false;
  //   } else if (currentTime.isAfter(startTime) && is_ended) {
  //     is_ended = true;
  //   } else if (currentTime.isBefore(startTime) && is_ended == false) {
  //     isButton = true;
  //     showTime = true;
  //   } else if (!currentTime.isBefore(startTime) && !currentTime.isAfter(startTime)) {
  //     isButton = false;
  //     showTime = false;
  //   }
  // }

  useEffect(() => {
    setJoining(false);
  }, [router]);

  if (isStarted !== null && is_ended === false) {
    isButton = false;
  } else if (isStarted === null && is_ended === false) {
    isButton = true;
  }

  // Due to change lesson scenario form class to chapter

  // useEffect(() => {
  //   if (is_ended && isPartOfCourse && !is_complete) {
  //     markAsCompleted();
  //   }
  // }, [is_ended, isPartOfCourse, is_complete]);

  const markAsCompleted = async () => {
    Loading(true);
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      class_id,
    };
    const config = {
      method: 'post',
      url: 'course/progress/update',
      data: obj,
    };
    const res = await axios(config)
      .then((response: any) => {
        Loading(false);
        // router.back();
        // showNotification({
        //   message: 'Meeting mark as completed successfuly.',
        //   color: 'green',
        // });
      })
      .catch((error: any) => {
        Loading(false);
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

  return (
    <>
      <Container
        p={0}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        {typeof url == 'string' ? (
          <Stack>
            <Stack
              spacing={5}
              align="center"
              //  mt={'9rem'}
            >
              <NextImage
                src={`/assets/live-session${colorScheme == 'dark' ? '-dark' : ''}.svg`}
                height={280}
                width={280}
                style={{ maxWidth: '700px' }}
                priority
              />
              <Text
                sx={{ fontSize: '20px' }}
                color={colorScheme === 'dark' ? '#EDD491' : '#000'}
                weight={500}
              >
                {t.the_livesession_will}
              </Text>
              <Text color={'#298EAE'}>
                {t['start-at']}{' '}
                {momentWithTimeZone
                  .utc(date_time)
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  .format('D MMM, YYYY')}{' '}
                {momentWithTimeZone
                  .utc(date_time)
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  .format('hh:mm a')}
              </Text>
            </Stack>
            <Space h={40} />
            {!is_ended && (
              <Button
                id="btn-liveSessionJoinNow"
                fullWidth
                loading={joining}
                disabled={isButton}
                onClick={() => {
                  // const config = {
                  //   method: 'POST',
                  //   url: 'https://lms.exodevs.com/api/join/meeting',
                  //   headers: {
                  //     accept:
                  //       'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                  //     'accept-language': 'en-US,en;q=0.9',
                  //     'cache-control': 'max-age=0',
                  //     'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                  //     'sec-ch-ua-mobile': '?0',
                  //     'sec-ch-ua-platform': '"Windows"',
                  //     'sec-fetch-dest': 'document',
                  //     'sec-fetch-mode': 'navigate',
                  //     'sec-fetch-site': 'same-site',
                  //     'sec-fetch-user': '?1',
                  //     'upgrade-insecure-requests': '1',
                  //   },
                  //   data: {
                  //     _token: 'rdrUb9e3D6kBLOFjsACSUhdDjqyCJr3CGiX4XklU',
                  //     meetingid: 'zakawat-lms',
                  //     name: 'Farhan',
                  //     password: '123456',
                  //   },
                  // };
                  // axios(config)
                  //   .then((response) => {
                  //     console.log(response);
                  //   })
                  //   .catch((err) => {
                  //     console.error(err);
                  //   });
                  // fetch("https://lms.exodevs.com/api/join/meeting", {
                  //   "headers": {
                  //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                  //     "accept-language": "en-US,en;q=0.9",
                  //     "cache-control": "max-age=0",
                  //     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                  //     "sec-ch-ua-mobile": "?0",
                  //     "sec-ch-ua-platform": "\"Windows\"",
                  //     "sec-fetch-dest": "document",
                  //     "sec-fetch-mode": "navigate",
                  //     "sec-fetch-site": "same-site",
                  //     "sec-fetch-user": "?1",
                  //     "upgrade-insecure-requests": "1"
                  //   },
                  //   "referrer": "https://lms.exodevs.com/",
                  //   "referrerPolicy": "strict-origin-when-cross-origin",
                  //   "body": "_token=qh39IX4kLxN1bUAlfc3rdW0yTCWC2xDLTbAwYcgy&meetingid=zakawat-lms&name=Farhan&password=123456",
                  //   "method": "POST",
                  //   "credentials": "include"
                  // });
                  setJoining(true);
                  router.push(url).then(() => {
                    // alert('here...')
                  });
                  //setJoining(false)
                }}
                size="md"
                radius={8}
                styles={{
                  filled: {
                    maxWidth: '300px',
                    margin: '0 auto',
                  },
                  label: {
                    color: '#000',
                    fontWeight: 400,
                  },
                }}
              >
                {t.join_now}
              </Button>
            )}
            <Space h={20} />
          </Stack>
        ) : url !== null ? (
          <Stack>
            {!url[0] ? (
              <Skeleton width={'auto'} height={250} radius={5} />
            ) : (
              <>
                <iframe
                  title="Recorded video"
                  style={{
                    marginTop: '0.6rem',
                    marginLeft: '0.6rem',
                    marginRight: '0.6rem',
                    borderRadius: '0.5rem',
                  }}
                  width={window.innerWidth - 20}
                  ref={videoRef}
                  height={'640vh'}
                  src={url[0] + '?l=content'}
                />
                <Button onClick={toggleFullscreen}>{t.fullscreen}</Button>

                {/* {is_ended && isPartOfCourse && !is_complete && (
                  <Button
                    fullWidth
                    loading={loading}
                    onClick={markAsCompleted}
                    size="md"
                    radius={8}
                    mb={8}
                    styles={{
                      filled: {
                        maxWidth: '300px',
                        margin: '0 auto',
                      },
                      label: {
                        color: '#000',
                        fontWeight: 400,
                      },
                    }}
                  >
                    {t['mark-complete']}
                  </Button>
                )} */}
              </>
            )}
          </Stack>
        ) : (
          <NoRecordFound />
        )}
      </Container>
    </>
  );
};
