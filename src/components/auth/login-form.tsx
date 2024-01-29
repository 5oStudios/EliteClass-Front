import { LockIcon, MessageIcon } from '@/src/constants/icons';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { validateEmail } from '@/src/utils/check-email-validation';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Group,
  Input,
  InputWrapper,
  PasswordInput,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { getCookie, deleteCookie, setCookie, hasCookie } from 'cookies-next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import axios from '../axios/axios.js';
import { CountrySelect } from '../ui/country-select';
import AppContext from '@/context/context';
import { sendPlayerIDTowardBackend } from '@/utils/utils';

export const LoginForm = (
  { type, onchange }: any,
  {
    initial_country,
    initial_type,
    initial_stage,
    initial_major,
    isSkipTutorial,
  }: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // const {data} = useSession();
  const fp: any = useVisitorData();
  const router = useRouter();
  // console.log('FINGER_PRINT', fp);
  // const obj = {
  //   event: 'debugLog',
  //   fp
  // };
  // //@ts-ignore
  // window.ReactNativeWebView.postMessage(JSON.stringify(obj));
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  // language
  const langRouter = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const t = langRouter.locale === 'ar-kw' ? ar : en;
  const token = getCookie('access_token');
  const initials_major = getCookie('initial_major') as string;
  const initials_type = getCookie('initial_type') as string;
  const initials_country = getCookie('initial_country') as string;
  const initials_stage = getCookie('initial_stage') as string;
  // language
  const contextData: any = useContext(AppContext);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
      client_id: '2',
      grant_type: 'password',
      client_secret: 'RTjITsRWgZ6aX1Euv3TV8CAEs8lFuvuFQLzSEmoe',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    validate: {
      email: (value) => {
        if (!value && activeTab == 0) {
          return 'Required';
        }
        if (!value && activeTab == 1) {
          return 'Required';
        }
        if (value[0] === '+') {
          if (!value) {
            return 'Required';
          }
          if (!isValidPhoneNumber(value)) {
            return 'Invalid Phone number';
          }
        } else {
          validateEmail(value);
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
    },
  });

  type FormValues = typeof form.values;

  // get previous url from browser history

  useEffect(() => {
    const data = hasCookie('access_token');
    //console.log({ data });
    const previousUrl = getCookie('prevPath');
    //console.log(previousUrl);

    // if (data === 'true') {
    //   Router.push('/');
    // }
  }, []);

  const parseJwtToken = (token: string) => {
    if (!token) {
      return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  useEffect(() => {
    form.setFieldValue('email', '');
    form.setFieldValue('password', '');
    form.clearFieldError('email');
    form.clearFieldError('password');

    // (async()=>{
    //   //@ts-ignore
    //   const oneSignalId=await window.OneSignal.getUserId();
    //   console.log("oneSignalId:: ",oneSignalId)
    // })()
  }, [activeTab]);

  // useEffect(() => {
  //   // signOut()

  // }, [])

  const handleSubmit = (values: FormValues) => {
    // return  signIn();
    if (!submitting) {
      setSubmitting(true);
      axios
        .post('login', {
          username: values.email,
          ...values,
          fpjsid: fp?.data?.visitorId || '',
        })
        .then((response) => {
          //setCookie('user_id', parseJwtToken(response?.data?.access_token).sub);
          localStorage.setItem('user_id', parseJwtToken(response?.data?.access_token).sub);

          // console.log(contextData.setTracker(true));

          if (values.rememberMe) {
            setCookie('access_token', response?.data?.access_token, {
              maxAge: 24 * 60 * 60 * 30,
            });
            setCookie('refresh_token', response?.data?.refresh_token, {
              maxAge: 24 * 60 * 60 * 30,
            });
          } else {
            setCookie('access_token', response?.data?.access_token);
            setCookie('refresh_token', response?.data?.refresh_token);
          }

          //ZK: Send the cookies to RN
          // @ts-ignore
          if (window.ReactNativeWebView) {
            const obj = {
              event: 'setCookie',
              cookies: {
                access_token: response?.data?.access_token,
                refresh_token: response?.data?.refresh_token,
              },
            };
            const objStringfy = JSON.stringify(obj);
            // @ts-ignore
            window.ReactNativeWebView.postMessage(objStringfy);

            //Now I am going to trigger tell RN to trigger the OneSignal Event

            const objTwo = {
              event: 'sendOneSignalPlayerIdToBE',
              accessToken: response?.data?.access_token,
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}playerdeviceid`,
            };

            const objTwoStringfy = JSON.stringify(objTwo);
            //@ts-ignore
            window.ReactNativeWebView.postMessage(objTwoStringfy);
          } else {
            //@ts-ignore
            if (window.OneSignal === undefined || window.OneSignal === null) {
              throw new Error('One Signal is not present, and we are in webView right now');
            } else {
              //This means that we are curently in Web Browser not in ReactNative wrapper
              //@ts-ignore
              const player_id: string = window.OneSignal.getUserId() || '';
              var oneSignalId = JSON.stringify({
                //@ts-ignore
                player_device_id: player_id || '',
                fpjsid: fp?.data?.visitorId || '',
              });
              sendPlayerIDTowardBackend(oneSignalId);
            }
          }
          setSubmitting(false);
          getCookie('skipHome') !== true ? Router.back() : Router.replace('/');
          deleteCookie('skipHome');
        })
        .catch((error) => {
          if (error?.message === 'Network Error') {
            setSubmitting(false);
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          } else if (error?.response?.status == 403) {
            // sign up k bad wali otp screen
            const { email } = values;
            // axios
            //   .post('email/resend/otp', {
            //     email,
            //   })
            //   .then((res) => {
            setSubmitting(false);
            // if (res.status === 200) {
            showNotification({
              message: 'Please verify your email to get Login',
              color: 'teal',
            });
            localStorage.setItem('user_email', email);
            //Router.push('/verify-email');
            // }
            // })
            // .catch((error) => {
            //   setSubmitting(false);
            //   if (error?.message === 'Network Error') {
            //     showNotification({
            //       message: 'Network error',
            //       color: 'red',
            //     });
            //   } else {
            //     const err = error?.response?.data?.errors;
            //     if (err) {
            //       Object.keys(err).forEach((i) => {
            //         err[i].forEach((item: any) => {
            //           showNotification({
            //             message: item,
            //             color: 'red',
            //           });
            //         });
            //       });
            //     }
            //   }
            // });
          } else {
            setSubmitting(false);
            const err = error?.response?.data?.errors;
            if (err && error?.response?.status !== 406) {
              Object.keys(err).forEach((i) => {
                err[i].forEach((item: any) => {
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
  };
  const getAllCategories = async () => {
    if (!initials_major || !initials_type || !initials_country || !initials_stage) {
      const resp = await axios.get('my/categories');
      setCookie('initial_country', resp?.data?.initial_country, {
        maxAge: 24 * 60 * 60 * 30,
      });
      setCookie('initial_major', resp?.data?.initial_major?.name, {
        maxAge: 24 * 60 * 60 * 30,
      });
      setCookie('initial_type', resp?.data?.initial_type?.name, {
        maxAge: 24 * 60 * 60 * 30,
      });
      setCookie('initial_stage', resp?.data?.initial_stage?.name, {
        maxAge: 24 * 60 * 60 * 30,
      });
      // const initial_country = getCookie('initial_country') as string;
      // const initial_major = getCookie('initial_major') as string;
      // const initial_type = getCookie('initial_type') as string;
      // const initial_stage = getCookie('initial_stage') as string;
    } else {
      // ,
      // initial_stage,
      // ,
      // isSkipTutorial,
      setCookie('initial_country', initial_country, {
        maxAge: 24 * 60 * 60 * 30,
      });
      setCookie('initial_major', initial_major, {
        maxAge: 24 * 60 * 60 * 30,
      });
      setCookie('initial_type', initial_type, {
        maxAge: 24 * 60 * 60 * 30,
      });

      setCookie('initial_stage', initial_stage, {
        maxAge: 24 * 60 * 60 * 30,
      });
    }
  };
  // useEffect(() => {
  //   if (token) {
  //     // debugger;
  //      getAllCategories();
  //   }
  // }, [token]);

  // Refresh Token
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  function checkTokenExpire() {
    const accessToken = `${getCookie('access_token')}`;
    const decodedJwt = parseJwt(accessToken);
    if (decodedJwt.exp * 1000 < Date.now()) {
      alert('Expire');
    } else {
      alert('Expire');
    }
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="on">
        <Stack sx={{ width: '100%' }}>
          {type.login_with_email && type.login_with_mobile ? (
            <Tabs
              tabPadding="xs"
              variant="unstyled"
              active={activeTab}
              onTabChange={(tab) => {
                onchange(tab);
                setActiveTab(tab);
              }}
              styles={(theme) => ({
                tabControl: {
                  backgroundColor: '#F7F6F5',
                  color: 'black',
                  fontSize: theme.fontSizes.sm,
                  flexGrow: 1,
                  height: 40,
                  overflow: 'hidden',
                  '@media (min-width: 800px)': {
                    height: 50,
                  },
                },
                tabsList: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(50px,1fr))',
                  width: '100%',
                  backgroundColor: '#F7F6F5',
                  borderRadius: 20,
                  overflow: 'hidden',
                },
                tabActive: {
                  backgroundColor: '#EDD491',
                  borderRadius: 20,
                  color: colorScheme == 'dark' ? 'black' : 'white',
                },
              })}
            >
              <Tabs.Tab id="tab-phoneNumber" label={t.phone_number} tabIndex={1}>
                <Box>
                  <InputWrapper
                    label={t.phone_number}
                    labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                    className="phoneNumberWrapper"
                  >
                    <PhoneInput
                      id="inp-phoneNumber"
                      defaultCountry="KW"
                      // className={langRouter.locale === 'ar-kw' ? 'phoneNumberRTL' : ''}
                      inputComponent={TextInput}
                      countrySelectComponent={CountrySelect}
                      variant="filled"
                      size="md"
                      radius={20}
                      placeholder={t.enter_phone_number}
                      aria-label="Phone number"
                      error={form.errors.email}
                      {...form.getInputProps('email')}
                      onChange={(number) => {
                        form.setValues((state) => ({ ...state, email: number as string }));
                        form.clearFieldError('email');
                      }}
                      textInputProps={{ placeholderTextColor: 'red' }}
                      sx={{
                        direction: router.locale === 'ar-kw' ? 'rtl' : 'ltr',
                      }}
                      styles={(theme: any) => ({
                        input: {
                          backgroundColor: '#F7F6F5',
                          color: '#298EAE',
                          //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                          '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 100px #F7F6F5 inset',
                            backgroundClip: 'text',
                          },
                        },
                      })}
                      type="tel"
                      autoComplete="number"
                    />
                  </InputWrapper>
                  {/* {form.errors && <Text color="red">{form.errors.email}</Text>} */}
                </Box>
              </Tabs.Tab>
              <Tabs.Tab id="tab-email" label={t.email} tabIndex={2}>
                <InputWrapper
                  label={t.email}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                >
                  <TextInput
                    id="inp-signinEmail"
                    icon={<MessageIcon />}
                    variant="filled"
                    placeholder={t.email}
                    aria-label="Your email"
                    autoComplete="email"
                    type="email"
                    error={form.errors.email}
                    {...form.getInputProps('email')}
                    size="md"
                    radius={20}
                    styles={(theme) => ({
                      input: {
                        backgroundColor: '#F7F6F5',
                        color: '#298EAE',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                        '&:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #F7F6F5 inset',
                          backgroundClip: 'text',
                        },
                      },
                    })}
                  />
                </InputWrapper>
              </Tabs.Tab>
            </Tabs>
          ) : !type.login_with_mobile ? (
            <InputWrapper
              label={t.email}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <TextInput
                id="inp-signinEmail"
                icon={<MessageIcon />}
                variant="filled"
                placeholder={t.email}
                aria-label="Your email"
                autoComplete="email"
                type="email"
                error={form.errors.email}
                {...form.getInputProps('email')}
                size="md"
                radius={20}
                styles={(theme) => ({
                  root: {
                    width: '100%',
                  },
                  input: {
                    backgroundColor: '#F7F6F5',
                    color: '#298EAE', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px #F7F6F5 inset',
                      backgroundClip: 'text',
                    },
                  },
                })}
              />
            </InputWrapper>
          ) : (
            <Box>
              <InputWrapper
                label={t.phone_number}
                className="handlePhone"
                labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              >
                {
                  //@ts-ignore
                  <PhoneInput
                    defaultCountry="KW"
                    inputComponent={TextInput}
                    countrySelectComponent={CountrySelect}
                    variant="filled"
                    size="md"
                    id="inp-phoneNumber2"
                    radius={8}
                    placeholder={t.enter_phone_number}
                    aria-label="Phone number"
                    error={form.errors.email}
                    {...form.getInputProps('email')}
                    onChange={(number) => {
                      form.setValues((state) => ({ ...state, email: number as string }));
                      form.clearFieldError('email');
                    }}
                    styles={(theme: any) => ({
                      input: {
                        backgroundColor: '#F7F6F5',
                        color: '#298EAE',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                        '&:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          backgroundClip: 'text',
                        },
                      },
                    })}
                    type="tel"
                    autoComplete="number"
                  />
                }
              </InputWrapper>
            </Box>
          )}
          <InputWrapper
            label={t.password}
            labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
          >
            <PasswordInput
              id="inp-signinPassword"
              icon={<LockIcon />}
              variant="filled"
              placeholder={t.password}
              aria-label="Your password"
              // type="password"  If you apply this property than password hide show functionality not work
              autoComplete="password"
              size="md"
              radius={20}
              {...form.getInputProps('password')}
              styles={(theme) => ({
                visibilityToggle: {
                  color: '#298EAE', //theme.colors.gray[6],
                  marginRight: '20px',
                },
                innerInput: {
                  color: '#298EAE',
                },
                input: {
                  backgroundColor: '#F7F6F5', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px #F7F6F5 inset',
                    backgroundClip: 'text',
                  },
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
          <Group position="apart">
            <Checkbox
              id="chk-rememberMe"
              radius={100}
              color={'green'}
              label={t.remember_me}
              styles={(theme) => ({
                label: {
                  fontSize: theme.fontSizes.sm,
                  color: colorScheme == 'dark' ? '#EDD491' : '#000000',
                },
              })}
              {...form.getInputProps('rememberMe')}
            />

            <Link href="/user/password-reset" passHref>
              <Anchor size="sm" sx={{ color: 'red' }}>
                {t.forgot_password}?
              </Anchor>
            </Link>
          </Group>

          <Space />
          <Button
            // @ts-ignore
            // onClick={getAllCategories}
            loading={submitting}
            id="btn-SignIn"
            type="submit"
            size="md"
            radius={20}
            variant="filled"
            styles={{
              label: { textAlign: 'center' },
              filled: {
                '@media (min-width: 800px)': {
                  height: 50,
                },
              },
            }}
          >
            {t['sign-in']}
          </Button>

          <Text
            sx={{
              fontSize: '4vw',
              color: '#298EAE',
              marginTop: '2vh',
              marginBottom: '5vh',

              '@media only screen and (min-width: 580px) and (max-width: 1025px)': {
                fontSize: 'clamp(1.2rem, 2.5vw, 3.8rem)',
              },
            }}
            align="center"
          >
            {t.already_account}{' '}
            <Link href="/signup" passHref prefetch>
              <Anchor
                sx={{
                  fontSize: '4vw',
                  color: '#298EAE',

                  '@media only screen and (min-width: 580px) and (max-width: 1025px)': {
                    fontSize: 'clamp(1.2rem, 2.5vw, 3.8rem)',
                  },
                }}
                weight={500}
              >
                {t['sign-up']}
              </Anchor>
            </Link>{' '}
          </Text>
        </Stack>
      </form>
      {keyboardIsOpen && <Space h={250} />}
    </div>
  );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const { guest_lang, access_token } = ctx.req.cookies;
//   const { initial_country, initial_type, initial_stage, initial_major, isSkipTutorial } =
//     ctx.req.cookies;
//   return {
//     props: {
//       initial_country,
//       initial_type,
//       initial_stage,
//       initial_major,
//       access_token,
//     },
//   };
// };
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { guest_lang, access_token } = ctx.req.cookies;
  const { initial_country, initial_type, initial_stage, initial_major, isSkipTutorial } =
    ctx.req.cookies;

  return {
    props: {
      initial_country,
      initial_type,
      initial_stage,
      initial_major,
      isSkipTutorial,
    },
  };
};
