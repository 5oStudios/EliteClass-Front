import {
  ActionIcon,
  Button,
  Container,
  Drawer,
  Group,
  InputWrapper,
  Radio,
  RadioGroup,
  RangeSlider,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFilter: (props: any) => void;
  haveDuration?: boolean;
  haveRating?: boolean;
  applyFilters: boolean;
  setApplyFilters: (value: boolean) => void;
};

export const FilterDrawer = (props: Props) => {
  const {
    isOpen,
    handleFilter,
    setIsOpen,
    setApplyFilters,
    applyFilters,
    haveDuration = true,
    haveRating = true,
  } = props;

  const [rating, setRating] = useState('null');
  const [cost, setCost] = useState<[number, number]>([0, 10000]);
  const [duration, setDuration] = useState<[number, number]>([0, 500]);
  const { colorScheme } = useMantineColorScheme();

  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language

  const handleClearValue = () => {
    setCost([0, 10000]);
    if (haveRating) {
      setRating('null');
    }
    if (haveDuration) {
      setDuration!([0, 500]);
    }
  };

  useEffect(() => {
    if (applyFilters) {
      handleFilter({ rating, cost, duration });
    }
  });

  return (
    <Container>
      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        withCloseButton={false}
        title={
          <Group position="apart" sx={{ width: '100%' }}>
            <Text size="lg" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
              {t.filter}
            </Text>
            <ActionIcon
              id="btn-filterClear"
              onClick={handleClearValue}
              sx={{ position: 'relative', right: '-10px' }}
            >
              <Text color="blue" size="xs" sx={{ whiteSpace: 'nowrap' }}>
                {t.clear}
              </Text>
            </ActionIcon>
          </Group>
        }
        padding="xl"
        position="bottom"
        styles={{
          header: {
            padding: '0',
            '& > *': {
              width: '100%',
            },
          },
          root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          title: {
            fontSize: '1.3rem',
          },
          drawer: {
            borderRadius: '20px 20px 0 0',
            height: 'max-content',
            background: colorScheme == 'dark' ? '#333333' : '#FFFFFF',
            //   'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #F4F9FE',
            // '@media (orientation: landscape)': {
            //   height: '80%',
            // },
          },
        }}
      >
        <Stack spacing="xl">
          <Stack spacing={0}>
            <InputWrapper
              label={t.cost}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <RangeSlider
                value={cost}
                onChange={setCost}
                min={0}
                max={10000}
                label={null}
                styles={{
                  thumb: {
                    width: '14px',
                    height: '14px',
                    background: colorScheme == 'dark' ? '#EDD491' : '#000000',
                    border: '0px',
                  },
                  track: {
                    backgroundColor: colorScheme == 'dark' ? '#fff' : '#ACB7CA50',
                    height: '5px',
                  },
                }}
              />
            </InputWrapper>
            <Group position="apart">
              <Text size="xs" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                {cost[0]}KWD
              </Text>
              <Text size="xs" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                {cost[1]}KWD
              </Text>
            </Group>
          </Stack>
          {haveRating && (
            <RadioGroup
              value={rating}
              onChange={setRating}
              size="sm"
              orientation="vertical"
              label={t.rating}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <Radio id="rdb-courseAll" value="null" label={t.all} />
              <Radio id="rdb-coursefourfive" value="4.5" label={`4.5 & ${t.above}`} />
              <Radio id="rdb-coursefour" value="4" label={`4 & ${t.above}`} />
              <Radio id="rdb-coursethree" value="3" label={`3 & ${t.above}`} />
            </RadioGroup>
          )}
          {haveDuration && (
            <Stack spacing={0}>
              <InputWrapper
                label={t.duration}
                labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              >
                <RangeSlider
                  value={duration}
                  onChange={setDuration}
                  label={null}
                  min={0}
                  max={500}
                  styles={{
                    thumb: {
                      width: '14px',
                      height: '14px',
                      background: colorScheme == 'dark' ? '#EDD491' : '#000000',
                      border: '0px',
                    },
                    track: {
                      backgroundColor: colorScheme == 'dark' ? '#fff' : '#ACB7CA50',
                      height: '5px',
                    },
                    bar: {
                      //backgroundColor : 'red'
                    },
                  }}
                />
              </InputWrapper>
              <Group position="apart">
                <Text size="xs" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                  {duration![0]} {t.hour}
                </Text>
                <Text size="xs" sx={{ color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
                  {duration![1]} {t.hour}
                </Text>
              </Group>
            </Stack>
          )}
          <Button
            id="btn-filterApply"
            size="md"
            radius={8}
            onClick={() => {
              setApplyFilters(true);
              setIsOpen(false);
            }}
            sx={{
              '@media (orientation: landscape)': {
                marginBottom: 30,
              },
            }}
          >
            {t.apply}
          </Button>
        </Stack>
      </Drawer>
    </Container>
  );
};
