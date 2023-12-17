import { Filter } from '@/src/constants/icons';
import { ActionIcon, Box, Indicator, useMantineColorScheme } from '@mantine/core';
import React from 'react';

type Props = {
  cost: [number, number];
  duration?: [number, number];
  rating?: string | null;
  onClick: () => void;
  transparent?: boolean;
};

export const FilterButton = ({ cost, rating, duration, onClick, transparent = true }: Props) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const disabled =
    duration !== undefined
      ? rating === 'null' &&
        cost[0] === 0 &&
        cost[1] === 10000 &&
        duration[0] === 0 &&
        duration[1] === 500
      : cost[0] === 0 && cost[1] === 10000;
  return (
    <Box>
      <Indicator
        color="blue"
        position="top-end"
        offset={2}
        disabled={disabled}
        styles={{
          root: {
            zIndex: 1,
          },
        }}
      >
        <ActionIcon
          variant="transparent"
          radius={8}
          id="btn-filter"
          onClick={onClick}
          sx={{
            background: !transparent
              ? '#F7F6F5' //' linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #F4F9FE'
              : '',
            height: '37px',
            width: '37px',
            justifySelf: 'right',
          }}
        >
          <Filter color={colorScheme == 'dark' ? '#298EAE' : '#000000'} />
        </ActionIcon>
      </Indicator>
    </Box>
  );
};
