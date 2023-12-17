import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useState } from 'react';
import { EmptyStar, FullStar } from '@/src/constants/icons';
import StarRating from 'react-rating';
import { TrashIcon } from '@modulz/radix-icons';
import Image from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import { shimmer, toBase64 } from '@/utils/utils';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import momentWithTimeZone from 'moment-timezone';
import ImageWithFallback from '../ImageWithFeedback';

type ReviewCardProps = {
  user_id: number | null;
  name: string;
  avatar: string;
  rating: any;
  date: string;
  review: string;
  reviewid: string;
  refetch: () => void;
};

export const ReviewCard = ({
  user_id,
  date,
  name,
  rating,
  avatar,
  review,
  reviewid,
  refetch,
}: ReviewCardProps) => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language

  console.log('AVATARR:', avatar);

  function reviewDelete(id: string) {
    setDeleting(true);
    let obj = {
      review_id: id,
    };
    let config = {
      method: 'delete',
      url: 'review/delete',
      data: obj,
    };
    axios(config)
      .then((response) => {
        setDeleting(false);
        setOpenConfirmModal(false);
        showNotification({ message: 'Review delete successfully.', color: 'green' });
        refetch();
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
            <Text align="center">{t.delete_this_review}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-reviewModalNo"
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
                id="btn-reviewModalYes"
                variant="filled"
                onClick={() => {
                  reviewDelete(reviewid);
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
      <SimpleGrid sx={{ gridTemplateColumns: 'max-content 1fr' }}>
        <Avatar size="md" radius="xl">
          <ImageWithFallback
            src={
              avatar ||
              `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${name}`
            }
            layout="fill"
            fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${name}`}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
        </Avatar>
        <Stack spacing={3}>
          <Group position="apart">
            <Stack spacing={0}>
              <Text weight={500}>{name}</Text>
              <StarRating
                start={0}
                stop={5}
                fractions={4}
                emptySymbol={<EmptyStar width={15} height={15} />}
                fullSymbol={<FullStar width={15} height={15} />}
                initialRating={rating}
                readonly
              />
            </Stack>

            <Stack>
              <Text size="xs" sx={{ alignSelf: 'start', color: '#ADA4A4' }}>
                at{' '}
                {momentWithTimeZone
                  .utc(date)
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  .format('D-MMM-YYYY')}
              </Text>
              {user_id && (
                <Stack
                  style={{ alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: -15 }}
                >
                  <ActionIcon
                    id={`btn-deleteReview-${user_id}`}
                    variant="transparent"
                    onClick={() => {
                      setOpenConfirmModal(true);
                    }}
                    sx={{}}
                  >
                    <TrashIcon className="ltr" width={20} height={20} />
                  </ActionIcon>
                </Stack>
              )}
            </Stack>
          </Group>
          <Text size="xs" color={'#939393'}>
            {review}
          </Text>
        </Stack>
      </SimpleGrid>
    </>
  );
};
