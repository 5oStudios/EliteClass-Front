import { format } from 'date-fns';
import { useMonthlyCalendar } from '@zach.codes/react-calendar';
import { Fragment, ReactNode, useState } from 'react';
import { useMonthlyBody } from './MonthlyBody';
import { Button, Divider, Group, List, Modal, Stack, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import momentWithTimeZone from 'moment-timezone';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

type MonthlyDayProps<DayData> = {
  renderDay: (events: DayData[]) => ReactNode;
};

export function MonthlyDay<DayData>({ renderDay }: MonthlyDayProps<DayData>) {
  const { locale } = useMonthlyCalendar();
  const { day, events } = useMonthlyBody<DayData>();
  const dayNumber = format(day, 'd', { locale });
  const [opened, setOpened] = useState(false);

  const date = format(day, ' d MMM, yyyy', { locale });

  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  return (
    <>
      <Stack
        aria-label={`Events for day ${dayNumber}`}
        spacing={5}
        sx={{ minHeight: 60, cursor: 'pointer' }}
        onClick={() => setOpened(events.length > 0)}
      >
        <Stack align="center">
          <Text sx={{ color: '#939393' }}>{dayNumber}</Text>
        </Stack>
        {/* @ts-ignore */}
        <List sx={{ display: 'flex', justifyContent: 'center' }}>{renderDay(events)?.[0]}</List>
      </Stack>

      <Modal
        opened={opened}
        centered
        onClose={() => setOpened(false)}
        radius={8}
        title={
          <Group dir="ltr" spacing={7} align="center">
            <Text
              dir="ltr"
              sx={{
                fontSize: 20,
              }}
              weight={600}
            >
              {/* {date.split(',')[0]}, */}
              {momentWithTimeZone
                .utc(date)
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format('D MMM,')}
            </Text>
            <Text
              sx={(theme) => ({
                fontSize: 20,
                color: theme.colors.gray[5],
              })}
            >
              {/* {date.split(',')[1]} */}
              {momentWithTimeZone
                .utc(date)
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format('YYYY')}
            </Text>
          </Group>
        }
        withCloseButton={false}
        size="sm"
      >
        <Stack>
          {events.map((event, i) => (
            <Fragment key={i}>
              <Group
                noWrap
                position="apart"
                style={
                  event.type == 'live-streaming'
                    ? { borderLeft: '2px solid green', paddingLeft: '3px' }
                    : { borderLeft: '2px solid red', paddingLeft: '3px' }
                }
              >
                <Stack spacing={0}>
                  <Text size="xs" weight={500}>
                    {event?.title}
                  </Text>
                  {/* <Text
                    size="xs"
                    sx={{
                      color: '#B5B5B5',
                    }}
                  >
                    {t.meeting_id} {event?.meetingid}
                  </Text> */}
                  <Text
                    size="xs"
                    sx={{
                      color: '#B5B5B5',
                    }}
                  >
                    {momentWithTimeZone
                      .utc(event?.time)
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format('hh:mm a')}
                  </Text>
                </Stack>
                <Button
                  id="btn-calendarDetails"
                  onClick={() => {
                    //router.push(`/live-sessions/${event?.event_id}`);
                    router.push({
                      pathname:
                        event?.type == 'live-streaming'
                          ? `/live-sessions/${event?.id}`
                          : `/in-person-sessions/${event?.id}`,
                      query: {
                        id: event?.id,
                        type: event?.type,
                      },
                    });
                  }}
                  styles={{
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
                  radius={8}
                >
                  {t.calender.detail}
                </Button>
              </Group>
              {events.length > 1 && (
                <Divider
                  sx={{
                    borderColor: 'rgba(217, 217, 217, 0.42)',
                  }}
                />
              )}
            </Fragment>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
