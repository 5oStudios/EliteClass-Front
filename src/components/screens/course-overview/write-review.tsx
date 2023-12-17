import { EmptyStar, FullStar } from '@/src/constants/icons';
import {
  Box,
  Button,
  Container,
  Drawer,
  Group,
  InputWrapper,
  Space,
  Stack,
  Text,
  Textarea,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect } from 'react';
import axios from '@/components/axios/axios.js';
import StarRating from 'react-rating';
import { showNotification } from '@mantine/notifications';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

type Props = {
  isOpen: boolean;
  refetch: () => void;
  ratingRefetch: () => void;
  setIsOpen: (isOpen: boolean) => void;
  id: string;
};

export const WriteReview = ({ isOpen, setIsOpen, id, refetch, ratingRefetch }: Props) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const [learnRating, setLearnRating] = React.useState(0);
  const [priceRating, setPriceRating] = React.useState(0);
  const [valueRating, setValueRating] = React.useState(0);
  const [reviewtext, setReviewText] = React.useState('');
  const [isSubmit, setIsSubmit] = React.useState(false);
  const { colorScheme } = useMantineColorScheme();

  function sendHandle() {
    if (learnRating && priceRating && valueRating && reviewtext) {
      setIsSubmit(true);
      const obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        course_id: id,
        learn: learnRating,
        price: priceRating,
        value: valueRating,
        review: reviewtext,
      };
      const config = {
        method: 'post',
        url: 'review/submit',
        data: obj,
      };
      axios(config)
        .then((response) => {
          console.log(response);
          refetch();
          ratingRefetch();
          setIsSubmit(false);
          setIsOpen(false);
        })
        .catch((error) => {
          console.log(error);
          setIsSubmit(false);
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
    } else {
      showNotification({
        message: 'Please enter review before submission and must be select the stars values.',
        color: 'red',
      });
    }
  }

  useEffect(() => {
    setLearnRating(0);
    setPriceRating(0);
    setValueRating(0);
    setReviewText('');
    setIsSubmit(false);
  }, [isOpen]);

  return (
    <>
      <Drawer
        withCloseButton={false}
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        styles={{
          drawer: {
            borderRadius: '30px 30px 0 0',
            background: colorScheme == 'dark' ? '#333333' : '#fff',
          },
        }}
        size="max-content"
      >
        <Container mt={'3vh'} px={'5vw'}>
          <Stack>
            <Stack>
              <Text mt={10} size="xl" color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                {t['courses-details'].rate_this_course}
              </Text>
              <Group position="apart">
                <Text color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                  {t['courses-details'].learn}
                </Text>
                {
                  //@ts-ignore
                  <StarRating
                    start={0}
                    stop={5}
                    fractions={4}
                    emptySymbol={<EmptyStar />}
                    fullSymbol={<FullStar />}
                    onChange={(rating) => setLearnRating(rating)}
                    initialRating={learnRating}
                  />
                }
              </Group>
              <Group position="apart">
                <Text color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                  {t['courses-details'].price}
                </Text>
                {
                  //@ts-ignore
                  <StarRating
                    start={0}
                    stop={5}
                    fractions={4}
                    emptySymbol={<EmptyStar />}
                    fullSymbol={<FullStar />}
                    onChange={(rating) => setPriceRating(rating)}
                    initialRating={priceRating}
                  />
                }
              </Group>

              <Group position="apart">
                <Text color={colorScheme == 'dark' ? '#EDD491' : '#000'}>
                  {t['courses-details'].value}
                </Text>
                {
                  //@ts-ignore
                  <StarRating
                    start={0}
                    stop={5}
                    fractions={4}
                    emptySymbol={<EmptyStar />}
                    fullSymbol={<FullStar />}
                    onChange={(rating) => setValueRating(rating)}
                    initialRating={valueRating}
                  />
                }
              </Group>
            </Stack>

            <Box
              p={5}
              sx={(theme) => ({
                borderRadius: 8,
                position: 'relative',
                backgroundColor: '#f7f6f5', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#F2F2F2',
                alignItems: 'flex-end',
              })}
            >
              <Textarea
                id="txtarea-writeReview"
                variant="unstyled"
                placeholder={t['courses-details'].write_review}
                minRows={3}
                radius={8}
                maxLength={300}
                value={reviewtext}
                sx={{
                  textarea: {
                    color: 'black',
                  },
                }}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setReviewText(e.target.value);
                  }
                }}
              />
              <Space h={0} />
              <Stack px={10} sx={{ alignItems: 'end' }}>
                <Text size="xs" color="grey">
                  {reviewtext.length}/300
                </Text>
              </Stack>
            </Box>

            <Button
              id="btn-submitReview"
              loading={isSubmit}
              radius={8}
              size="md"
              onClick={() => {
                if (reviewtext.length <= 300) {
                  sendHandle();
                }
              }}
            >
              {t.submit}
            </Button>
          </Stack>
        </Container>
        <Space h={20} />
      </Drawer>
    </>
  );
};
