import { addYears, subYears, startOfMonth } from 'date-fns';
import format from 'date-fns/format';
import _parseISO from 'date-fns/parseISO';

import {
  ActionIcon,
  Button,
  Center,
  Drawer,
  Group,
  Loader,
  SimpleGrid,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@modulz/radix-icons';

type Props = {
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  date: Date;
  setCalendarCheck: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
};

const monthIndexToName = (index: number) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[index];
};
export const MonthlyNav = ({ setCurrentMonth, date, setCalendarCheck, isLoading }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [year, setYear] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const { colorScheme } = useMantineColorScheme();

  const handleNextYear = () => {
    setYear(addYears(year, 1));
  };
  const handlePreviousYear = () => {
    setYear(subYears(year, 1));
  };

  useEffect(() => {
    setCurrentMonth(startOfMonth(new Date(year.getFullYear(), month.getMonth(), month.getDate())));
    setCalendarCheck(true);
  }, [year, month]);

  return (
    <>
      <Center>
        <Group spacing="xl">
          <ActionIcon
            id="btn-openCalendar"
            onClick={() => setIsOpen(true)}
            variant="transparent"
            my={20}
          >
            <Group noWrap spacing={5}>
              <Text
                weight={500}
                sx={{ whiteSpace: 'nowrap', color: colorScheme == 'dark' ? '#EDD491' : '#298EAE' }}
              >
                {format(date, 'MMM, yyyy')}
              </Text>
              {isLoading && <Loader width={20} height={20} />}
            </Group>
          </ActionIcon>
        </Group>
      </Center>
      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        withCloseButton={false}
        position="bottom"
        size="max-content"
        styles={{
          drawer: {
            borderRadius: '30px 30px 0 0',
            background: colorScheme == 'dark' ? '#333333' : '#F7F6F5',
          },
        }}
      >
        <Space h="xs" />
        <Stack sx={{}}>
          <Group mt={10} align="center" position="apart">
            <ActionIcon ml={20} variant="transparent" onClick={handlePreviousYear}>
              <ChevronLeftIcon className="rtl" width={30} height={30} />
            </ActionIcon>
            <Text weight={500} sx={{ color: '#298EAE' }}>
              {year.getFullYear()}
            </Text>
            <ActionIcon mr={20} variant="transparent" onClick={handleNextYear}>
              <ChevronRightIcon className="rtl" width={30} height={30} />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={3} sx={{ justifyItems: 'center' }}>
            {[...Array(12)].map((_, index) => {
              const monthName = monthIndexToName(index);
              return (
                <Button
                  id={`btn-month-${index}`}
                  key={index}
                  variant={month.getMonth() === index ? 'filled' : 'light'}
                  radius={20}
                  sx={{
                    backgroundColor:
                      month.getMonth() === index
                        ? '#298EAE'
                        : colorScheme == 'dark'
                        ? '#F7F6F5'
                        : 'white',
                  }}
                  onClick={() => {
                    setMonth(new Date(year.getFullYear(), index));
                    setIsOpen(false);
                  }}
                  styles={{
                    root: {
                      minWidth: 75,
                    },
                    label: {
                      color: month.getMonth() === index ? 'white' : 'black',
                      fontSize: 12,
                    },
                  }}
                >
                  {monthName}
                </Button>
              );
            })}
          </SimpleGrid>
        </Stack>
        <Space h="sm" />
      </Drawer>
    </>
  );
};
