import { Box, Group, Radio, SimpleGrid, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoRecordFound } from '../ui/no-record-found';
import { useInfiniteQuery } from 'react-query';
import { CoursesCard } from '../ui/cards/courses-card';
import { getPaginatedData } from '@/utils/axios/getPaginatedData';
import { NoSaveFound } from '../ui/no-save-found';
import { Skeletons } from '../saved-cards/Skeletons';
import { PieChart } from 'react-minimal-pie-chart';

export const InstructorCost = () => {
  const segmentsStyle = { transition: 'stroke .3s', cursor: 'pointer' };

  return (
    <Stack sx={{ background: '#F7F6F5', marginTop: 32, paddingBottom: 50 }}>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ECF0F2',
        }}
        px={25}
        py={22}
      >
        <Text sx={{ fontSize: '24px', fontWeight: 400 }}>Profit</Text>
        <Text sx={{ fontSize: '24px', fontWeight: 400 }}>200KWD</Text>
      </Stack>

      <PieChart
        data={[
          { title: 'One', value: 25, color: '#E0E0E1' },
          { title: 'Two', value: 15, color: '#D9847F' },
          { title: 'Three', value: 10, color: '#98D1B1' },
          { title: 'Four', value: 20, color: '#298EAE' },
        ]}
        radius={30}
        lineWidth={30}
        segmentsStyle={(index) => {
          return index === 0
            ? { ...segmentsStyle, strokeWidth: 15 }
            : index === 1
            ? { ...segmentsStyle, strokeWidth: 18 }
            : index === 2
            ? { ...segmentsStyle, strokeWidth: 21 }
            : { ...segmentsStyle, strokeWidth: 24 };
        }}
        segmentsTabIndex={1}
        // onKeyDown={(event, index) => {
        //   // Enter keypress
        //   if (event.keyCode === 13) {
        //     action('CLICK')(event, index);
        //     console.log('CLICK', { event, index });
        //     setSelected(selected === index ? undefined : index);
        //   }
        // }}
        // onFocus={(_, index) => {
        //   setFocused(index);
        // }}
        //onBlur={() => setFocused(undefined)}
      />

      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }} px={22}>
        <Group>
          <Stack
            sx={{
              height: 18,
              width: 18,
              background: '#D9847F',
              borderRadius: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ height: 9, width: 9, background: 'white', borderRadius: '100%' }} />
          </Stack>
          <Text>Course 1 (20%)</Text>
        </Group>
        <Group>
          <Stack
            sx={{
              height: 18,
              width: 18,
              background: '#98D1B1',
              borderRadius: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ height: 9, width: 9, background: 'white', borderRadius: '100%' }} />
          </Stack>
          <Text>Course 2 (20%)</Text>
        </Group>
      </Stack>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }} px={22}>
        <Group>
          <Stack
            sx={{
              height: 18,
              width: 18,
              background: '#298EAE',
              borderRadius: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ height: 9, width: 9, background: 'white', borderRadius: '100%' }} />
          </Stack>
          <Text>Course 3 (20%)</Text>
        </Group>
      </Stack>
    </Stack>
  );
};
