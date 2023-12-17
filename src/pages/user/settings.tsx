import { Seo } from '@/components/seo';
import { userSettings1, userSettings2 } from '@/src/constants/data/user-settings';
import {
  Darkmode,
  LangIcon,
  LockIcon,
  Logout,
  NotificationIcon,
} from '@/src/constants/icons/settings';
import { DeleteIcon } from '@/src/constants/icons/settings/deleteIcon';
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  Container,
  Drawer,
  Group,
  InputWrapper,
  Modal,
  PasswordInput,
  Radio,
  RadioGroup,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Switch,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { axiosServer } from '@/components/axios/axios-server';
import { ShareLink } from '@/components/forms/share-link';
import axios from '@/components/axios/axios.js';
import { ReferalLink } from '@/components/forms/Referal-link';
import { showNotification } from '@mantine/notifications';
import { ProfileImageForm } from '@/components/forms';
import { useQueryClient } from 'react-query';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/utils';

export const SettingsPage = ({ user: data, isAuthenticated }: any) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const t = router.locale === 'ar-kw' ? ar : en;
  const [lang, setLang] = useState('');
  const [openLangDrawer, setOpenLangDrawer] = useState(false);
  const [openResetPasswordDrawer, setOpenResetPasswordDrawer] = useState(false);
  const [openConfirmSignoutModal, setOpenConfirmSignoutModal] = useState(false);
  const [viewProfile, setViewProfileModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [notifications_On_Off, setNotifications_On_Off] = useState(user?.notifications_on);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [signing1, setSigning1] = useState<boolean>(false);
  const [signing2, setSigning2] = useState<boolean>(false);
  const [isTestUser, setIsTestUser] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      const config = {
        method: 'post',
        url: 'show/profile?secret=11f24438-b63a-4de2-ae92-e1a1048706f5',
      };
      axios(config)
        .then((response) => {
          setUser(response?.data);
          // form.setValues((state) => ({
          //   ...state,
          //   email: response?.data?.email,
          //   mobile: response?.data?.mobile,
          //   fname: response?.data?.fname,
          //   lname: response?.data?.lname,
          // }));
          setLoading(false);
          let testUser = response?.data?.is_testUser;
          if (testUser === true && testUser !== null && testUser !== undefined && testUser !== '') {
            setIsTestUser(true);
          }
        })
        .catch((error) => {
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
  }, [lang]);

  useEffect(() => {
    if (!lang) {
      const locale = getCookie('NEXT_LOCALE');
      setLang(locale as string);
    }
  }, [lang]);

  useEffect(() => {
    setSigning1(false);
    setSigning2(false);
  }, [router]);

  function handleLangChange(locale: string) {
    setIsLoading(true);

    setCookie('guest_lang', locale, {
      maxAge: 24 * 60 * 60 * 30,
    });
    setCookie('NEXT_LOCALE', locale, {
      maxAge: 24 * 60 * 60 * 30,
    });

    // document.cookie = `NEXT_LOCALE="${locale}";max-age="86400"`;
    // document.cookie = `guest_lang="${locale}";max-age="86400"`;

    //ZK: Send the cookies to RN
    // @ts-ignore
    // if (window.ReactNativeWebView) {
    //   const obj = {
    //     event: 'setCookie',
    //     cookies: {
    //       NEXT_LOCALE: locale,
    //       guest_lang: locale,
    //     },
    //   };
    //   const objStringfy = JSON.stringify(obj);
    //   // @ts-ignore
    //   window.ReactNativeWebView.postMessage(objStringfy);
    // }

    document.dir = locale === 'ar-kw' ? 'rtl' : 'ltr';
    setLang(locale);
    setOpenLangDrawer(false);
    router.push(router.asPath, undefined, { locale }).then(() => {
      setIsLoading(false);
    });
  }

  const client = useQueryClient();

  const handleLogout = async () => {
    setSignOutLoading(true);
    await axios
      .post('logout')
      .then((response) => {
        setSignOutLoading(false);
        client.clear();
        deleteCookie('access_token');
        localStorage.removeItem('user_id');
        router.push('/signin');
      })
      .then((error) => {
        setSignOutLoading(false);
      });
    setSignOutLoading(false);
  };

  const form = useForm({
    initialValues: {
      old_password: '',
      password: '',
    },
    validate: {
      old_password: (value) => {
        if (!value) {
          return 'Required';
        }
        return value.length < 8 ? 'Password must be at least 8 characters' : null;
      },
      password: (value) => {
        if (!value) {
          return 'Required';
        }
        return value.length < 8 ? 'Password must be at least 8 characters' : null;
      },
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = (values: FormValues) => {
    setUpdating(true);
    const config = {
      method: 'post',
      url: 'change-pass',
      data: values,
    };
    axios(config)
      .then((response) => {
        setOpenResetPasswordDrawer(false);
        // setOpenResetPasswordDrawer(false);
        // router.replace('/signin');
        deleteCookie('access_token');
        // deleteCookie('skipHome');
        router.push('/signin');
      })
      .catch((error) => {
        console.log('reset-password', error);

        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        }
        if (error?.response?.status == 401) {
          if (window.confirm('Please login first') == true) {
            router.push('/signin');
          }
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
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  function notificationsHandle() {
    axios
      .get('notifications-on')
      .then((response) => {
        setNotifications_On_Off(!notifications_On_Off);
      })
      .catch((error) => {
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
      <LoadingScreen isLoading={isLoading || Loading} />
      <Seo title="Settings" description="Best LMS" path="user/settings" />
      <Drawer
        opened={openLangDrawer}
        onClose={() => setOpenLangDrawer(false)}
        position="bottom"
        title={t.language}
        size={200}
        styles={{
          title: {
            padding: '20px',
            fontSize: '20px',
            color: colorScheme == 'dark' ? '#EDD491' : '#000',
          },
          closeButton: {
            marginRight: '20px',
          },
          drawer: {
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <Container>
          <RadioGroup
            value={lang}
            onChange={handleLangChange}
            sx={{ color: colorScheme === 'dark' ? '#EDD491' : '#000' }}
            orientation="vertical"
            required
          >
            <Radio id="rdb-english" dir="ltr" value="ar-kw" label={t.arabic} />
            <Radio id="rdb-arabic" dir="ltr" value="en-us" label={t.english} />
          </RadioGroup>
        </Container>
      </Drawer>
      <Drawer
        opened={openResetPasswordDrawer}
        onClose={() => setOpenResetPasswordDrawer(false)}
        position="bottom"
        title={t['reset-password']}
        styles={{
          title: {
            padding: '20px 20px 0 20px',
            fontSize: '20px',
            color: colorScheme == 'dark' ? '#EDD491' : '#000',
          },
          closeButton: {
            margin: '20px 20px 0 20px',
          },
          drawer: {
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <Container>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <ScrollArea scrollbarSize={5} sx={{ height: '170px' }}>
                <InputWrapper
                  label={t['old-password']}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                >
                  <PasswordInput
                    id="inp-oldPassword"
                    icon={<LockIcon />}
                    variant="filled"
                    placeholder={t.password}
                    aria-label="Your password"
                    size="md"
                    radius={8}
                    minLength={8}
                    {...form.getInputProps('old_password')}
                    styles={(theme) => ({
                      filledVariant: {
                        backgroundColor: '#F7F6F5',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#F4F9FE',
                      },
                      innerInput: {
                        color: '#298EAE',
                      },
                      visibilityToggle: {
                        color: theme.colors.gray[6],
                      },
                    })}
                    visibilityToggleIcon={({ reveal, size }) =>
                      reveal ? (
                        <EyeCheck size={size} color="#298EAE" />
                      ) : (
                        <EyeOff size={size} color="#298EAE" />
                      )
                    }
                  />
                </InputWrapper>
                <InputWrapper
                  label={t['new-password']}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                  mt={'1vh'}
                >
                  <PasswordInput
                    id="inp-newPassword"
                    icon={<LockIcon />}
                    variant="filled"
                    placeholder={t.password}
                    aria-label="Your password"
                    size="md"
                    minLength={8}
                    {...form.getInputProps('password')}
                    radius={8}
                    styles={(theme) => ({
                      filledVariant: {
                        backgroundColor: '#F7F6F5',
                        // theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#F4F9FE',
                      },
                      innerInput: {
                        color: '#298EAE',
                      },
                      visibilityToggle: {
                        color: theme.colors.gray[6],
                      },
                    })}
                    visibilityToggleIcon={({ reveal, size }) =>
                      reveal ? (
                        <EyeCheck size={size} color="#298EAE" />
                      ) : (
                        <EyeOff size={size} color="#298EAE" />
                      )
                    }
                  />
                </InputWrapper>
              </ScrollArea>
              <Button
                id="btn-profilePasswordReset"
                loading={updating}
                type="submit"
                mb="md"
                size="md"
                radius={8}
              >
                {t.reset}
              </Button>
            </Stack>
          </form>
        </Container>
      </Drawer>
      {/* signout modal */}
      <Modal
        opened={openConfirmSignoutModal}
        onClose={() => setOpenConfirmSignoutModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center" sx={{ whiteSpace: 'nowrap' }}>
              {t['sure-want-to-sign-out']}
            </Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-modalNo"
                variant="filled"
                onClick={() => {
                  setOpenConfirmSignoutModal(false);
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
                id="btn-modalSignOut"
                variant="filled"
                onClick={handleLogout}
                loading={signOutLoading}
                radius={20}
                styles={{
                  filled: {
                    background: 'red',
                    '&:hover': {
                      background: 'red',
                    },
                    padding: '0px !important',
                  },
                  label: {
                    color: 'white',
                  },
                }}
              >
                {t['sign-out']}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>

      <Modal
        opened={viewProfile}
        onClose={() => setViewProfileModal(false)}
        withCloseButton={false}
        centered
      >
        <Card sx={{ height: '50vh' }}>
          <ImageWithFallback
            src={
              newImage ? URL.createObjectURL(newImage) : user?.image
              //'http://panel.lms.elite-class.com/images/course/16550189231000_F_65595070_yu9z2Z1Nd4oUSQxpeJHwiZu6y8yKDTq2.jpg'
            }
            layout="fill"
            objectFit="contain"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
        </Card>
        <CloseButton
          id="btn-settingModalClose"
          onClick={() => setViewProfileModal(false)}
          sx={(theme) => ({
            height: '10px',
            width: '10px',
            boxShadow: theme.shadows.xs,
            borderRadius: '100%',
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'white',
          })}
          aria-label="Close modal"
        />
      </Modal>

      <Container
        p={0}
        //sx={{ height: '100vh', backgroundColor: colorScheme == 'dark' ? '#333333' : '#F7F6F5' }}
      >
        <Container p={0} sx={{}}>
          <Card
            sx={(theme) => ({
              background: '#FFDD83',
              borderRadius: '0px 0px 20px 20px',
            })}
            px={30}
          >
            <Group align="center" position="left" sx={{ width: '100%', minHeight: '175px' }} noWrap>
              {isAuthenticated ? (
                <>
                  <Box
                    sx={{
                      borderRadius: '100%',
                      paddingTop: '2px',
                      height: '85px',
                      width: '85px',
                      //paddingBottom : '1px',
                      // width: 'max-content',
                      background: '#fff',
                      alignSelf: 'center',
                    }}
                  >
                    <Center sx={{ height: '100%' }}>
                      <ProfileImageForm
                        onView={(new_img: any) => {
                          setNewImage(new_img);
                          setViewProfileModal(true);
                        }}
                        isEditable={false}
                        name={`${user?.fname} ${user?.lname}`}
                        url={user?.image}
                      />
                    </Center>
                  </Box>
                  <Stack align="stretch" spacing={3} sx={{ width: '60%' }}>
                    <Text size="md" weight={500} color="#000000">
                      {user?.fname} {user?.lname}
                    </Text>
                    <Box sx={{ flexWrap: 'wrap', wordWrap: 'break-word', width: '100%' }}>
                      <Text size="xs" sx={{ color: '#298EAE' }}>
                        {`${user?.email}`}
                      </Text>
                    </Box>
                    {/* <Text size="xs" sx={{ color: '#939393' }}>
                      {user?.email}
                    </Text> */}
                  </Stack>
                </>
              ) : (
                <div style={{ display: 'flex' }}>
                  <Button
                    id="btn-profileSignin"
                    color="blue"
                    variant="filled"
                    loading={signing1}
                    size="md"
                    radius="xl"
                    fullWidth
                    onClick={() => {
                      setSigning1(true);
                      router.push('/signin');
                    }}
                    styles={{
                      root: {
                        maxWidth: '200px',
                        margin: 'auto',
                      },
                      label: { color: 'white' },
                      filled: {
                        background: '#82B1CF',
                        '&:hover': {
                          background: '#82B1CF',
                        },
                      },
                    }}
                  >
                    {t['sign-in']}
                  </Button>

                  <Button
                    id="btn-profileSignup"
                    color="blue"
                    variant="filled"
                    loading={signing2}
                    size="md"
                    radius="xl"
                    fullWidth
                    onClick={() => {
                      setSigning2(true);
                      router.push('/signup');
                    }}
                    styles={{
                      root: {
                        maxWidth: '200px',
                        margin: 'auto',
                        marginLeft: '5px',
                      },
                      label: { color: 'white' },
                      filled: {
                        background: '#82B1CF',
                        '&:hover': {
                          background: '#82B1CF',
                        },
                      },
                    }}
                  >
                    {t['sign-up']}
                  </Button>
                </div>
              )}
            </Group>
          </Card>
        </Container>

        <Container sx={{}} px={'6vw'}>
          <Stack>
            <Space mt="-50px" />
            {isAuthenticated && (
              <Card p="xl" radius={12} sx={{ background: '#F7F6F5' }}>
                <Stack spacing="md">
                  {userSettings1.map((item, i) => (
                    <Fragment key={i}>
                      {i === userSettings1.length - 1 && (
                        <ReferalLink
                          title={t.referral}
                          share={t.share}
                          headerTitle={t['share-link-to-get-credit-point']}
                          link={user?.referral_link}
                        />
                      )}
                      <Link href={item.url} passHref>
                        <Anchor underline={false} color="gray">
                          <Group align="center" position="left" sx={{ width: '100%' }} noWrap>
                            <Box
                              sx={(theme) => ({
                                background: '#FFDD83',
                                width: 40,
                                height: 40,
                                borderRadius: '100%',
                              })}
                            >
                              <Center sx={{ height: '100%' }}>
                                <item.icon />
                              </Center>
                            </Box>
                            {/* @ts-ignore */}
                            <Text color={'#000000'}>{t[item.id]}</Text>
                          </Group>
                        </Anchor>
                      </Link>
                    </Fragment>
                  ))}
                </Stack>
              </Card>
            )}
            <Card p="xl" radius={12} sx={{ background: '#F7F6F5' }}>
              <Stack spacing="md">
                {isAuthenticated && (
                  <Group position="apart" align="center">
                    <Group>
                      <Box
                        sx={(theme) => ({
                          background: '#FFDD83',
                          width: 40,
                          height: 40,
                          borderRadius: '100%',
                        })}
                      >
                        <Center sx={{ height: '100%' }}>
                          <NotificationIcon />
                        </Center>
                      </Box>
                      <Text color={'#000000'}>{t.notifications}</Text>
                    </Group>
                    <Switch
                      id="swt-notification"
                      checked={notifications_On_Off}
                      onChange={notificationsHandle}
                      color={'red'}
                      styles={{
                        input: {
                          width: 'auto',
                        },
                      }}
                    />
                  </Group>
                )}
                <Group position="apart" align="center">
                  <Group>
                    <Box
                      sx={(theme) => ({
                        background: '#FFDD83',
                        width: 40,
                        height: 40,
                        borderRadius: '100%',
                      })}
                    >
                      <Center sx={{ height: '100%' }}>
                        <Darkmode />
                      </Center>
                    </Box>
                    <Text color={'#000000'}>{t['dark-mode']}</Text>
                  </Group>
                  <Switch
                    id="swt-mode"
                    checked={colorScheme === 'dark'}
                    onChange={() => {
                      toggleColorScheme();
                    }}
                    color="red"
                    size="sm"
                  />
                </Group>
                <UnstyledButton id="btn-languageChange" onClick={() => setOpenLangDrawer(true)}>
                  <Group position="apart" align="center">
                    <Group>
                      <Box
                        sx={(theme) => ({
                          background: '#FFDD83',
                          width: 40,
                          height: 40,
                          borderRadius: '100%',
                        })}
                      >
                        <Center sx={{ height: '100%' }}>
                          <LangIcon />
                        </Center>
                      </Box>
                      <Text color={'#000000'}>{t.language}</Text>
                    </Group>
                    <Group spacing={0} align="center">
                      <Text size="xs" color="#298EAE">
                        {lang}
                      </Text>
                      <ChevronRightIcon className="rtl" width={18} height={18} />
                    </Group>
                  </Group>
                </UnstyledButton>

                {isAuthenticated ? (
                  <UnstyledButton
                    id="btn-profileResetPassword"
                    onClick={() => {
                      setOpenResetPasswordDrawer(true);
                      form.values.password = '';
                      form.values.old_password = '';
                    }}
                  >
                    <Group position="apart" align="center">
                      <Group>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <LockIcon />
                          </Center>
                        </Box>
                        <Text color={'#000000'}>{t['reset-password']}</Text>
                      </Group>
                      <ChevronRightIcon className="rtl" width={18} height={18} />
                    </Group>
                  </UnstyledButton>
                ) : null}
              </Stack>
            </Card>
            <Card p="xl" radius={12} sx={{ background: '#F7F6F5' }}>
              <Stack spacing="md">
                {userSettings2.map((item, i) =>
                  item.id === 'customer-service' ? (
                    user?.customer_support != null &&
                    user?.customer_support != undefined &&
                    user?.customer_support != '' ? (
                      <Box
                        key={i}
                        id="btn-customerService"
                        onClick={() => {
                          //ZK: Share code triggering native view in mobile app
                          const whatsappURL = `https://wa.me/${user?.customer_support}?text=Hi`;
                          // @ts-ignore
                          if (window?.ReactNativeWebView === undefined) {
                            //This means we are not in ReactNative webView so open in new link as target blanks
                            window.open(whatsappURL, '_blank');
                          } else {
                            const shareableObject = {
                              event: 'urlOpen',
                              url: whatsappURL,
                            };

                            const objStringfy = JSON.stringify(shareableObject);
                            // @ts-ignore
                            window.ReactNativeWebView.postMessage(objStringfy);
                          }
                        }}
                      >
                        <Anchor underline={false} color="gray">
                          <Group align="center" position="left" sx={{ width: '100%' }} noWrap>
                            <Box
                              sx={(theme) => ({
                                background: '#FFDD83',
                                width: 40,
                                height: 40,
                                borderRadius: '100%',
                              })}
                            >
                              <Center sx={{ height: '100%' }}>
                                <item.icon />
                              </Center>
                            </Box>
                            {/* @ts-ignore */}
                            <Text color={'#000000'}>{t[item.id]}</Text>
                          </Group>
                        </Anchor>
                      </Box>
                    ) : null
                  ) : (
                    <Link key={item.id} href={item.url} passHref>
                      <Anchor underline={false} color="gray">
                        <Group align="center" position="left" sx={{ width: '100%' }} noWrap>
                          <Box
                            sx={(theme) => ({
                              background: '#FFDD83',
                              width: 40,
                              height: 40,
                              borderRadius: '100%',
                            })}
                          >
                            <Center sx={{ height: '100%' }}>
                              <item.icon />
                            </Center>
                          </Box>
                          {/* @ts-ignore */}
                          <Text color={'#000000'}>{t[item.id]}</Text>
                        </Group>
                      </Anchor>
                    </Link>
                  )
                )}
                <ShareLink title={t['share-app']} copy={t.copy} />
                {isAuthenticated && (
                  <Link href={'/delete-account'} passHref>
                    <Anchor underline={false} color="gray">
                      <Group align="center" position="left" sx={{ width: '100%' }} noWrap>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <DeleteIcon />
                          </Center>
                        </Box>
                        {/* @ts-ignore */}
                        <Text color={'#000000'}>{t.delete_account}</Text>
                      </Group>
                    </Anchor>
                  </Link>
                )}
              </Stack>
            </Card>
            {isTestUser ? (
              <Card p="xl" radius={12} sx={{ background: '#F7F6F5' }}>
                <Stack spacing="md">
                  {/* {isAuthenticated && (
                    <Group position="apart" align="center">
                      <Group>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <NotificationIcon />
                          </Center>
                        </Box>
                        <Text color={'#000000'}>Test {t.notifications}</Text>
                      </Group>
                      <Switch
                        checked={notifications_On_Off}
                        onChange={notificationsHandle}
                        color={'red'}
                        styles={{
                          input: {
                            width: 'auto',
                          },
                        }}
                      />
                    </Group>
                  )}
                  <Group position="apart" align="center">
                    <Group>
                      <Box
                        sx={(theme) => ({
                          background: '#FFDD83',
                          width: 40,
                          height: 40,
                          borderRadius: '100%',
                        })}
                      >
                        <Center sx={{ height: '100%' }}>
                          <Darkmode />
                        </Center>
                      </Box>
                      <Text color={'#000000'}>Test {t['dark-mode']}</Text>
                    </Group>
                    <Switch
                      checked={colorScheme === 'dark'}
                      onChange={() => {
                        toggleColorScheme();
                      }}
                      color="red"
                      size="sm"
                    />
                  </Group>
                  <UnstyledButton onClick={() => setOpenLangDrawer(true)}>
                    <Group position="apart" align="center">
                      <Group>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <LangIcon />
                          </Center>
                        </Box>
                        <Text color={'#000000'}>Test {t.language}</Text>
                      </Group>
                      <Group spacing={0} align="center">
                        <Text size="xs" color="#298EAE">
                          {lang}
                        </Text>
                        <ChevronRightIcon className="rtl" width={18} height={18} />
                      </Group>
                    </Group>
                  </UnstyledButton> */}
                  {/* <UnstyledButton
                    onClick={() => {
                      router.push('/testing/device');
                    }}
                  >
                    <Group position="apart" align="center">
                      <Group>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <LockIcon />
                          </Center>
                        </Box>
                        <Text color={'#000000'}>Test Device</Text>
                      </Group>
                    </Group>
                  </UnstyledButton> */}

                  <UnstyledButton
                    onClick={() => {
                      router.push('/testing/pdf');
                    }}
                  >
                    <Group position="apart" align="center">
                      <Group>
                        <Box
                          sx={(theme) => ({
                            background: '#FFDD83',
                            width: 40,
                            height: 40,
                            borderRadius: '100%',
                          })}
                        >
                          <Center sx={{ height: '100%' }}>
                            <LockIcon />
                          </Center>
                        </Box>
                        <Text color={'#000000'}>[NEW] Test PDF</Text>
                      </Group>
                      {/* <ChevronRightIcon className="rtl" width={18} height={18} /> */}
                    </Group>
                  </UnstyledButton>
                </Stack>
              </Card>
            ) : null}
            <Space h={10} />

            {isAuthenticated ? (
              <Button
                id="btn-signOut"
                sx={{
                  background: 'red',
                  '&:hover': {
                    background: 'red',
                  },
                }}
                size="md"
                radius={8}
                onClick={() => setOpenConfirmSignoutModal(true)}
              >
                <Group
                  align="center"
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box mt={4}>
                    <Logout />
                  </Box>
                  <Text sx={{ color: 'white' }}>{t['sign-out']}</Text>
                </Group>
              </Button>
            ) : null}
          </Stack>
          <Space h={100} />
        </Container>
      </Container>
    </>
  );
};

// @ts-ignore
SettingsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let isAuthenticated = true;
  const data = await axiosServer
    .post('show/profile?secret=11f24438-b63a-4de2-ae92-e1a1048706f5', undefined, {
      headers: {
        Authorization: `Bearer ${ctx.req.cookies.access_token}`,
        'Accept-Language': 'ar',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      if (error.message == 'Unauthenticated.') {
        isAuthenticated = false;
      } else if (error.response.statusText === 'Unauthorized') {
        isAuthenticated = false;
      }
    });

  return {
    props: {
      user: data || {},
      isAuthenticated,
    },
  };
};

export default SettingsPage;
