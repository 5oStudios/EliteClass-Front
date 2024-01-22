import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Card,
  Group,
  Loader,
  MediaQuery,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { SaveIcon, Star, UnSaveIcon } from '@/src/constants/icons';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import Link from 'next/link';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { useQueryClient } from 'react-query';
import { shimmer, toBase64 } from '@/utils/utils';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';

type Props = {
  title: any;
  image: string;
  instructor: string;
  rating: number;
  reviews_by: number;
  lessons: number;
  layoutGrid?: boolean;
  in_wishlist?: boolean;
  href: string;
  id: string;
  ratio?: number;
};

type LayoutProps = Props & {
  blurDataUrl: string;
  saved: boolean | undefined;
  handleSave: (id: string) => void;
  handleUnsave: (id: string) => void;
};

const Layout1 = ({
  image,
  instructor,
  rating,
  title,
  lessons,
  reviews_by,
  blurDataUrl,
  saved,
  handleSave,
  handleUnsave,
  href,
  id,
  ratio,
}: LayoutProps) => {
  //language
  const { query }: any = href;
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const [img, setImg] = useState(image);
  const { colorScheme } = useMantineColorScheme();
  //language
  return (
    <Card
      radius={8}
      sx={{
        background: 'none',
        backgroundColor: 'none',
        minHeight: 180,
        height: '100%',
        position: 'relative',
        overflow: 'visible',
      }}
      p={8}
    >
      {
        <ActionIcon
          variant="transparent"
          id={`btn-coursesSaved-${id}`}
          size="sm"
          radius="xl"
          disabled={saved == undefined}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            background: 'rgba(255,255,255,0.3)',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
          }}
          onClick={
            saved
              ? () => {
                  handleUnsave(id);
                }
              : () => {
                  handleSave(id);
                }
          }
        >
          {saved !== undefined ? (
            saved ? (
              <UnSaveIcon color={colorScheme === 'light' ? '#298EAE' : '#EDD491'} />
            ) : (
              <SaveIcon color={colorScheme === 'light' ? '#298EAE' : '#EDD491'} />
            )
          ) : (
            <Loader size={'xs'} color={'#298EAE'} />
          )}
        </ActionIcon>
      }
      <Link href={href} passHref>
        <Text component="a" style={{ cursor: 'pointer' }}>
          <Stack
            spacing={0}
            sx={{
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
              <AspectRatio
                ratio={16 / 9}
                mx="auto"
                sx={{ width: '100%', overflow: 'hidden', borderRadius: 9 }}
              >
                <NextImage
                  alt="image"
                  src={img}
                  objectFit="cover"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  onError={() => {
                    setImg('/assets/images/default.png');
                  }}
                />
              </AspectRatio>
            </MediaQuery>
            <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
              <AspectRatio
                ratio={ratio || 16 / 9}
                mx="auto"
                sx={{ width: '100%', overflow: 'hidden', borderRadius: 9 }}
              >
                <NextImage
                  alt="image"
                  src={img}
                  objectFit="cover"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  onError={() => {
                    setImg('/assets/images/default.png');
                  }}
                />
              </AspectRatio>
            </MediaQuery>
            <Text
              weight={500}
              sx={(theme) => ({ fontSize: 12, color: theme?.other?.headingColor })}
            >
              <EllipsisText text={title || ''} length={50} />
            </Text>
            <Text sx={(theme) => ({ fontSize: 12, color: '#298EAE' })} transform="capitalize">
              <EllipsisText text={instructor || ''} length={15} />
            </Text>
            <Group noWrap spacing={9} align="center">
              <Star />
              <Text sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {rating} ({reviews_by}) . {lessons} {lessons > 1 ? t.lessons : t.lesson}
              </Text>
            </Group>
          </Stack>
        </Text>
      </Link>
    </Card>
  );
};

const Layout2 = ({
  image,
  instructor,
  rating,
  title,
  lessons,
  reviews_by,
  blurDataUrl,
  saved,
  href,
  handleSave,
  handleUnsave,
  id,
}: LayoutProps) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const [img, setImg] = useState(image);
  const { colorScheme } = useMantineColorScheme();
  //language
  return (
    <Card
      radius={8}
      sx={{
        // border: '1px solid red',
        position: 'relative',
        background: 'none !important',
        backgroundColor: 'none !important',
      }}
      p={8}
    >
      <Link href={href} passHref>
        <SimpleGrid sx={{ gridTemplateColumns: '1fr 2fr' }}>
          <AspectRatio
            ratio={1 / 1}
            sx={{ borderRadius: 8, overflow: 'hidden', minWidth: 100, minHeight: 100 }}
          >
            <Box>
              <NextImage
                alt="image"
                style={{ cursor: 'pointer' }}
                src={img}
                objectFit="cover"
                layout="fill"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                onError={() => {
                  setImg('/assets/images/default.png');
                }}
              />

              {
                <ActionIcon
                  id={`btn-coursesSaved-${id}`}
                  variant="transparent"
                  size="sm"
                  radius="xl"
                  disabled={saved == undefined}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 3,
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.3)',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                  }}
                  onClick={
                    saved
                      ? () => {
                          handleUnsave(id);
                        }
                      : () => {
                          handleSave(id);
                        }
                  }
                >
                  {saved !== undefined ? (
                    saved ? (
                      <UnSaveIcon color={colorScheme === 'light' ? '#298EAE' : '#EDD491'} />
                    ) : (
                      <SaveIcon color={colorScheme === 'light' ? '#298EAE' : '#EDD491'} />
                    )
                  ) : (
                    <Loader size={'xs'} color={'#298EAE'} />
                  )}
                </ActionIcon>
              }
            </Box>
          </AspectRatio>

          <Text component="a" sx={{ cursor: 'pointer' }}>
            <Stack spacing={10}>
              <Text
                weight={500}
                sx={(theme) => ({ fontSize: 12, color: theme?.other?.headingColor })}
              >
                <EllipsisText text={title || ''} length={50} />
              </Text>
              <Text sx={(theme) => ({ fontSize: 12, color: '#298EAE' })}>
                <EllipsisText text={instructor || ''} length={15} />
              </Text>
              <Group spacing={2} align="center">
                <Star />
                <Text sx={{ fontSize: 12 }}>
                  {rating} ({reviews_by}) . {lessons} {lessons > 1 ? t.lessons : t.lesson}
                </Text>
              </Group>
            </Stack>
          </Text>
        </SimpleGrid>
      </Link>
    </Card>
  );
};

export const CoursesCard = (props: Props) => {
  const pageParam = 1;
  const { layoutGrid = true } = props;
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [saved, setSaved] = useState<boolean | undefined>(props?.in_wishlist);
  const [signing, setSigning] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const isUser = getCookie('access_token');
  //language
  const router = useRouter();
  const { slug, type, question_id, answer_id } = router.query;
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const client = useQueryClient();
  useEffect(() => {
    setSigning(false);
  }, [router]);

  const handleSave = (slug: string) => {
    setSaved(undefined);
    if (isUser != undefined) {
      const obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        course_id: slug,
      };
      const config = {
        method: 'post',
        url: 'addtowishlist',
        data: obj,
      };
      axios(config)
        .then((response) => {
          showNotification({ message: response?.data, color: 'green' });
          setSaved(true);
        })
        .catch((error) => {
          setSaved(false);
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          }
          if (error?.response?.status == 401) {
            setOpenConfirmModal(true);
          } else {
            //@ts-ignore
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
      setOpenConfirmModal(true);
      setSaved(false);
    }
  };

  const handleUnsave = (slug: string) => {
    setSaved(undefined);
    client?.setQueryData('wishlist/courses', (oldData: any) => {
      if (oldData != undefined) {
        const newData: any = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter((result: any) => {
              if (result.course_id === props.id) {
                return false;
              } else {
                return true;
              }
            }),
          })),
        };
        return newData;
      }
    });

    if (isUser != undefined) {
      const obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        course_id: slug,
      };
      const config = {
        method: 'post',
        url: 'remove/wishlist',
        data: obj,
      };
      axios(config)
        .then((response) => {
          showNotification({ message: response?.data, color: 'green' });
          setSaved(false);
        })
        .catch((error) => {
          setSaved(true);
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          }
          if (error?.response?.status == 401) {
            setOpenConfirmModal(true);
          } else {
            //@ts-ignore
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
      setOpenConfirmModal(true);
      setSaved(true);
    }
  };

  return layoutGrid ? (
    <>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t['login-popup']}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-coursesModalCancel"
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
                {t.Cancel}
              </Button>
              <Button
                id="btn-coursesModalSignIn"
                variant="filled"
                onClick={() => {
                  setSigning(true);
                  router.push('/signin');
                }}
                loading={signing}
                radius={20}
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
                {t['sign-in']}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Layout1
        {...props}
        blurDataUrl={blurDataUrl || ''}
        saved={saved}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        ratio={props.ratio}
      />
    </>
  ) : (
    <>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t['login-popup']}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-courseCardCancel"
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
                {t.Cancel}
              </Button>
              <Button
                id="btn-courseCardSignIn"
                variant="filled"
                onClick={() => {
                  setSigning(true);
                  router.push('/signin');
                }}
                loading={signing}
                radius={20}
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
                {t['sign-in']}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Layout2
        {...props}
        blurDataUrl={blurDataUrl || ''}
        saved={saved}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        ratio={props.ratio}
      />
    </>
  );
};
