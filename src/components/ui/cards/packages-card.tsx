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
import NextImage from 'next/image';
import { useBlur } from '@/utils/hooks/useBlur';
import { SaveIcon, UnSaveIcon } from '@/src/constants/icons';
import Link from 'next/link';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { useQueryClient } from 'react-query';
import useNextBlurhash from 'use-next-blurhash';
import { DiscountBadge } from '@/components/badges/discount-badge';

import { shimmer, toBase64 } from '@/utils/utils';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';

type Props = {
  title: any;
  image: string;
  total_courses: number;
  discountAmount?: number;
  price: any;
  discount_price: any;
  layoutGrid?: boolean;
  haveOffer?: boolean;
  in_wishlist?: boolean;
  href: string;
  id: string;
  ratio?: number;
  isBundle?: boolean;
};
type LayoutProps = Props & {
  blurDataUrl: string;
  saved: boolean | undefined;
  handleSave: (id: string) => void;
  handleUnsave: (id: string) => void;
};

const Layout1 = ({
  image,
  title,
  price,
  total_courses,
  discountAmount,
  haveOffer,
  discount_price,
  blurDataUrl,
  href,
  saved,
  handleSave,
  handleUnsave,
  id,
  ratio,
  isBundle = true,
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
        // width:"30%",
        background: 'none',
        backgroundColor: 'none',
        minHeight: 180,
        height: '100%',
        position: 'relative',
      }}
      p={8}
    >
      {
        <ActionIcon
          id={`btn-packagesSaved-${id}`}
          variant="transparent"
          size="sm"
          radius="xl"
          disabled={saved == undefined}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 20,
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
        <Text component="a" sx={{ cursor: 'pointer' }}>
          <Stack
            spacing={4}
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
                <Box>
                  {haveOffer && <DiscountBadge value={`${discountAmount}${t.KWD}`} dir={'left'} />}
                </Box>
              </AspectRatio>
            </MediaQuery>
            <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
              <AspectRatio
                ratio={ratio || 16 / 9}
                mx="auto"
                sx={{ width: '100%', overflow: 'hidden', borderRadius: 9, position: 'relative' }}
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
                <Box>
                  {haveOffer && <DiscountBadge value={`${discountAmount}${t.KWD}`} dir={'left'} />}
                </Box>{' '}
              </AspectRatio>
            </MediaQuery>
            <Text
              weight={500}
              sx={(theme) => ({
                fontSize: 12,
                wordBreak: 'break-all',
                color: theme?.other?.headingColor,
              })}
            >
              <EllipsisText text={title || ''} length={50} />
            </Text>
            <Text sx={{ fontSize: 12, color: '#939393' }}>
              {total_courses > 1 ? `${total_courses} ${t.courses}` : `${total_courses} ${t.course}`}
            </Text>
            <Group position="apart" spacing={7} noWrap>
              <Text weight={500} size="xs" sx={(theme) => ({ color: theme?.other?.blueToPrimary })}>
                {Number(price) == 0
                  ? `${t.free}`
                  : `${Number(discount_price == 0 ? price : discount_price)}${t.KWD}`}
              </Text>
              {haveOffer && (
                <Text
                  sx={(theme) => ({
                    textDecoration: 'line-through',
                    color: theme.other.placeholderColor,
                    fontSize: 12,
                  })}
                >
                  {Number(price || 0)}
                  {t.KWD}
                </Text>
              )}
            </Group>
          </Stack>
        </Text>
      </Link>
    </Card>
  );
};

const Layout2 = ({
  image,
  title,
  price,
  total_courses,
  discount_price,
  blurDataUrl,
  handleUnsave,
  handleSave,
  saved,
  href,
  id,
}: LayoutProps) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const [img, setImg] = useState(image);
  const { colorScheme } = useMantineColorScheme();
  console.log('lay2', discount_price);

  //language
  return (
    <Card
      radius={8}
      sx={{
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        background: 'none',
        backgroundColor: 'none',
      }}
      p={5}
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
                src={img}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                onError={() => {
                  setImg('/assets/images/default.png');
                }}
              />
              {
                <ActionIcon
                  variant="transparent"
                  size="sm"
                  radius="xl"
                  id={`btn-packagesSaved-${id}`}
                  disabled={saved == undefined}
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    zIndex: 20,
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
            <Stack py={3} spacing={3} sx={{ justifyContent: 'space-between', height: '100%' }}>
              <Text
                weight={500}
                sx={(theme) => ({ fontSize: 12, color: theme?.other?.headingColor })}
              >
                <EllipsisText text={title || ''} length={50} />
              </Text>
              <Text sx={{ fontSize: 12, color: '#939393' }}>
                {total_courses > 1
                  ? `${total_courses} ${t.courses}`
                  : `${total_courses} ${t.course}`}
              </Text>
              <Group position="apart" noWrap>
                <Text weight={500} sx={(theme) => ({ color: theme?.other?.blueToPrimary })}>
                  {Number(discount_price || 0) == 0
                    ? `${t.free}`
                    : `${Number(discount_price || 0)}${t.KWD}`}
                </Text>
                <Text
                  sx={(theme) => ({
                    textDecoration: 'line-through',
                    color: theme.other.placeholderColor,
                    fontSize: 12,
                  })}
                >
                  {Number(price || 0)}
                  {t.KWD}
                </Text>
              </Group>
            </Stack>
          </Text>
        </SimpleGrid>
      </Link>
    </Card>
  );
};

export const PackagesCard = ({ layoutGrid = true, ...rest }: Props) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [saved, setSaved] = useState(rest?.in_wishlist);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [signing, setSigning] = useState<boolean>(false);
  const isUser = getCookie('access_token');
  const client = useQueryClient();

  useEffect(() => {
    setSigning(false);
  }, [router]);

  const handleSave = (slug: string) => {
    setSaved(undefined);
    if (isUser != undefined) {
      const obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        bundle_id: slug,
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
      setSaved(false);
      setOpenConfirmModal(true);
    }
  };
  const handleUnsave = (slug: string) => {
    setSaved(undefined);
    client?.setQueryData('wishlist/packages', (oldData: any) => {
      if (oldData != undefined) {
        const newData: any = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter((result: any) => {
              if (result.bundle_id === rest.id) {
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
        bundle_id: slug,
      };
      const config = {
        method: 'post',
        url: 'remove/wishlist',
        data: obj,
      };
      axios(config)
        .then((response) => {
          setSaved(false);
          showNotification({ message: response?.data, color: 'green' });
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
      setSaved(true);
      setOpenConfirmModal(true);
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
                id="btn-packageModalCancel"
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
                id="btn-packageModalSignIn"
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
        {...rest}
        blurDataUrl={blurDataUrl || ''}
        saved={saved}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        ratio={rest.ratio}
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
                id="btn-packageCardModalCancel"
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
                id="btn-packageCardModalSignIn"
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
        {...rest}
        blurDataUrl={blurDataUrl || ''}
        saved={saved}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
      />
    </>
  );
};
