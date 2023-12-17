import {
  ActionIcon,
  Affix,
  AspectRatio,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Modal,
  Loader,
  MediaQuery,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { SaveIcon, CalendarIcon, UnSaveIcon } from '@/src/constants/icons';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import Link from 'next/link';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { useQueryClient } from 'react-query';
import { shimmer, toBase64 } from '@/utils/utils';
import moment from 'moment-timezone';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
type Props = {
  meeting_title: string;
  image: string;
  instructor: string;
  date_time: string;
  discount_price: any;
  layoutGrid?: boolean;
  show_price?: boolean;
  in_wishlist?: boolean;
  children?: React.ReactNode;
  href: string;
  id: string;
  ratio?: number;
  type?: string;
  fromBooking?: boolean;
};

type LayoutProps = Props & {
  blurDataUrl: string;
  saved: boolean | undefined;
  handleSave: (slug: string, type: string) => void;
  handleUnsave: (slug: string, type: string) => void;
  typ: string;
};
const Layout1 = ({
  discount_price,
  meeting_title,
  instructor,
  image,
  date_time,
  show_price,
  href,
  handleUnsave,
  handleSave,
  saved,
  id,
  ratio,
  type,
  fromBooking,
  typ,
}: LayoutProps) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [img, setImg] = useState(image);
  const { colorScheme } = useMantineColorScheme();
  // language
  return (
    <Card
      radius={8}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'none',
        backgroundColor: 'none',
      }}
      p={8}
    >
      {!fromBooking && (
        <ActionIcon
          id={typ !== undefined && typ !== '' && typ !== null ? `btn-${typ}Saved-${id}` : ''}
          variant="transparent"
          size="sm"
          radius="xl"
          disabled={saved == undefined}
          sx={{
            position: 'absolute',
            top: 15,
            right: 15,
            zIndex: 20,
            background: 'rgba(255,255,255,0.3)',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
          }}
          onClick={
            saved
              ? () => {
                  // @ts-ignore
                  handleUnsave(id, type);
                }
              : () => {
                  // @ts-ignore
                  handleSave(id, type);
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
      )}

      {/* <Stack
        py={3}
        px={5}
        sx={{
          position: 'absolute',
          top: 15,
          left: 15,
          zIndex: 20,
          background: type == 'in-person' ? 'green' : 'red',
          // height : 20,
          // width : 40,
          borderRadius: 6,
        }}
      >
        <Text sx={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{type}</Text>
      </Stack> */}

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
              size="xs"
              mt={10}
              weight={500}
              sx={(theme) => ({ color: theme?.other?.headingColor })}
            >
              <EllipsisText text={meeting_title || ''} length={50} />
            </Text>
            <Text size="xs" sx={(theme) => ({ color: '#298EAE' })}>
              <EllipsisText text={instructor || ''} length={15} />
            </Text>
            {/* style={{ gap:'0px' }} */}
            <Group
              sx={{
                width: '100%',
                display: 'flex !important',
                justifyContent: 'space-between',
              }}
              className="arabicprice"
            >
              <Group noWrap spacing={5} align="center" sx={{}}>
                <CalendarIcon color="#298EAE" width={20} height={20} />
                <Text
                  mt={3}
                  dir="ltr"
                  sx={(theme) => ({
                    color: theme.other.headingColor,
                    fontSize: 12,
                    marginTop: '-3px',
                    whiteSpace: 'nowrap',
                  })}
                >
                  {moment
                    .utc(date_time)
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format('D MMM')}
                  ,{' '}
                  {moment
                    .utc(date_time)
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format('hh:mm a')}
                </Text>
              </Group>

              {!show_price && (
                <Group align="center" noWrap>
                  <Text weight={500} sx={(theme) => ({ color: '#298EAE', fontSize: 14.5 })}>
                    {parseInt(discount_price || 0) == 0
                      ? `${t.free}`
                      : `${parseInt(discount_price || 0)}KWD`}
                  </Text>
                </Group>
              )}
              {show_price && (
                <Group align="center" noWrap>
                  <Text
                    sx={(theme) => ({
                      color: theme.other.placeholderColor,
                      fontSize: 14.5,
                    })}
                  >
                    {t.price}
                  </Text>
                  <Text weight={500} sx={(theme) => ({ color: '#298EAE', fontSize: 14.5 })}>
                    {parseInt(discount_price || 0) == 0
                      ? `${t.free}`
                      : `${parseInt(discount_price || 0)}KWD`}
                  </Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Text>
      </Link>
    </Card>
  );
};
const Layout2 = ({
  discount_price,
  meeting_title,
  instructor,
  image,
  children,
  date_time,
  saved,
  handleSave,
  handleUnsave,
  href,
  show_price = true,
  id,
  type,
  fromBooking,
  typ,
}: LayoutProps) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [img, setImg] = useState(image);
  const { colorScheme } = useMantineColorScheme();
  // language
  return (
    <Card
      radius={8}
      sx={{ width: '100%', position: 'relative', background: 'none', backgroundColor: 'none' }}
      p={8}
    >
      <Affix position={{ top: 10, right: 10 }} />
      <Stack
        style={{
          cursor: 'pointer',
        }}
      >
        <Link href={href} passHref>
          <SimpleGrid sx={{ gridTemplateColumns: '1fr 2fr' }}>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                <AspectRatio ratio={16 / 9} sx={{ borderRadius: 8, overflow: 'hidden' }}>
                  <NextImage
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
                <AspectRatio ratio={1 / 1} sx={{ borderRadius: 8, overflow: 'hidden' }}>
                  <NextImage
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

              {!fromBooking && (
                <ActionIcon
                  id={
                    typ !== undefined && typ !== '' && typ !== null ? `btn-${typ}Saved-${id}` : ''
                  }
                  variant="transparent"
                  size="sm"
                  radius="xl"
                  disabled={saved == undefined}
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    // zIndex: 20,
                    // left: 125,
                    background: 'rgba(255,255,255,0.3)',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                  }}
                  onClick={
                    saved
                      ? () => {
                          // @ts-ignore
                          handleUnsave(id, type);
                        }
                      : () => {
                          // @ts-ignore
                          handleSave(id, type);
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
              )}

              {/* <Stack
                py={3}
                px={5}
                sx={{
                  position: 'absolute',
                  top: 15,
                  left: 15,
                  zIndex: 20,
                  background: type == 'in-person' ? 'green' : 'red',
                  // height : 20,
                  // width : 40,
                  borderRadius: 6,
                }}
              >
                <Text sx={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{type}</Text>
              </Stack> */}
            </Box>

            <Text component="a" sx={{ cursor: 'pointer' }}>
              <Stack spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
                <Text
                  weight={500}
                  sx={(theme) => ({ fontSize: 12, color: theme?.other?.headingColor })}
                >
                  <EllipsisText text={meeting_title || ''} length={50} />
                </Text>
                <Text sx={(theme) => ({ fontSize: 12, color: '#298EAE' })}>
                  <EllipsisText text={instructor || ''} length={15} />
                </Text>

                <Group spacing={5} noWrap align="center">
                  <CalendarIcon color="#298EAE" width={20} height={20} />
                  <Text
                    dir="ltr"
                    sx={(theme) => ({
                      color: theme.other.headingColor,
                      fontSize: 12,
                      marginTop: '-3px',
                    })}
                  >
                    {moment
                      .utc(date_time)
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format('D MMM')}
                    ,{' '}
                    {moment
                      .utc(date_time)
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format('hh:mm a')}
                  </Text>
                </Group>
                {show_price && (
                  <Group noWrap>
                    <Text
                      sx={(theme) => ({
                        color: theme.other.placeholderColor,
                        fontSize: 14,
                      })}
                    >
                      {t.price}
                    </Text>
                    <Text sx={(theme) => ({ color: '#298EAE', fontSize: 14.5 })}>
                      {parseInt(discount_price || 0) == 0
                        ? `${t.free}`
                        : `${parseInt(discount_price || 0)}KWD`}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Text>
          </SimpleGrid>
        </Link>
        {children}
      </Stack>
    </Card>
  );
};

export const LiveSessionCard = ({ typ, fromBooking = false, ...props }: any) => {
  const { layoutGrid = true, show_price = true, ...rest } = props;
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [saved, setSaved] = useState(rest?.in_wishlist);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const isUser = getCookie('access_token');
  const client = useQueryClient();
  const [signing, setSigning] = useState<boolean>(false);

  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language

  useEffect(() => {
    setSigning(false);
  }, [router]);

  const handleSave = (slug: string, type: string) => {
    setSaved(undefined);
    if (isUser != undefined) {
      const obj =
        typ === 'in-person'
          ? {
              secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
              offline_session_id: slug,
            }
          : {
              secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
              meeting_id: slug,
            };
      const config = {
        method: 'post',
        url: 'addtowishlist',
        data: obj,
      };
      axios(config)
        .then((response) => {
          setSaved(true);
          showNotification({ message: response?.data, color: 'green' });
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

  const handleUnsave = (slug: string, type: string) => {
    setSaved(undefined);
    if (isUser != undefined) {
      client?.setQueryData(
        typ === 'live' ? 'wishlist/meetings' : 'wishlist/sessions',
        (oldData: any) => {
          if (oldData != undefined) {
            const newData: any = {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                results: page.results.filter((result: any) => {
                  if (result.meeting_id == props.id) {
                    return false;
                  } else {
                    return true;
                  }
                }),
              })),
            };
            return newData;
          }
        }
      );

      const obj =
        typ == 'in-person'
          ? {
              secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
              offline_session_id: slug,
            }
          : {
              secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
              meeting_id: slug,
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
                id="btn-liveModalCancel"
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
                id="btn-liveModalSignIn"
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
        show_price={show_price}
        saved={saved}
        fromBooking={fromBooking}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        ratio={props.ratio}
        typ={typ}
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
            <Text align="center">{t}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-liveSessionsModalCancel"
                variant="filled"
                onClick={() => {
                  setSigning(true);
                  setOpenConfirmModal(false);
                }}
                loading={signing}
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
                id="btn-liveSessionsModalSignIn"
                variant="filled"
                onClick={() => {
                  router.push('/signin');
                }}
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
        show_price={show_price}
        blurDataUrl={blurDataUrl || ''}
        saved={saved}
        fromBooking={fromBooking}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        typ={typ}
      />
    </>
  );
};
