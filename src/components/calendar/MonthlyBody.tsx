import React, { ReactNode, useContext } from 'react';
import { isSameDay } from 'date-fns';
import { handleOmittedDays, useMonthlyCalendar } from '@zach.codes/react-calendar';
import { Box, Container, Divider, SimpleGrid, Text, useMantineColorScheme } from '@mantine/core';

const MonthlyBodyContext = React.createContext({} as any);
type BodyState = {
  day: Date;
  events: any[];
};

export function useMonthlyBody<DayData>() {
  return useContext<BodyState>(MonthlyBodyContext);
}

type MonthlyBodyProps<DayData> = {
  omitDays?: number[];
  events: (DayData & { date: Date })[];
  children: ReactNode;
};

export function MonthlyBody<DayData>({ omitDays, events, children }: MonthlyBodyProps<DayData>) {
  const { days, locale } = useMonthlyCalendar();
  const { colorScheme } = useMantineColorScheme();
  const { headings, daysToRender, padding } = handleOmittedDays({
    days,
    omitDays,
    locale,
  });

  const headingClassName = 'rc-border-b-2 rc-p-2 rc-border-r-2 lg:rc-block rc-hidden';
  return (
    <Box>
      <Container>
        <SimpleGrid sx={{ gridTemplateColumns: 'repeat(7,1fr)' }}>
          {headings.map((day) => (
            <Text
              align="center"
              weight={500}
              key={day.day}
              className={headingClassName}
              aria-label="Day of Week"
            >
              {day.label[0]}
            </Text>
          ))}
        </SimpleGrid>
      </Container>
      <Divider mt={10} mb={20} color={colorScheme == 'dark' ? '#EDD491' : '#66666620'} />
      <Container>
        <SimpleGrid sx={{ gridTemplateColumns: 'repeat(7,1fr)' }}>
          {padding.map((_, index) => (
            <div key={index} className={headingClassName} aria-label="Empty Day" />
          ))}
          {daysToRender.map((day) => (
            <MonthlyBodyContext.Provider
              key={day.toISOString()}
              value={{
                day,
                events: events.filter((data) => isSameDay(data.date, day)),
              }}
            >
              {children}
            </MonthlyBodyContext.Provider>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
