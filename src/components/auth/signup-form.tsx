import {
  Anchor,
  Box,
  Button,
  Card,
  InputWrapper,
  Modal,
  PasswordInput,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
  Group,
  Avatar,
  Select,
} from '@mantine/core';
import { GetStaticProps } from 'next';
import { useForm } from '@mantine/form';
import React, { useState, useEffect, useContext } from 'react';
import PhoneInput, { formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '@/src/utils/check-email-validation';
import { LockIcon, MessageIcon, UserIcon } from '@/src/constants/icons';
import 'react-phone-number-input/style.css';
import { CountrySelect } from '../ui/country-select';
import axios from '../axios/axios.js';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { setCookie } from 'cookies-next';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { axiosServer } from '../axios/axios-server';
//import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import AppContext from '@/context/context';
import { sendPlayerIDTowardBackend } from '@/utils/utils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const SignUpForm = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;

  const { colorScheme } = useMantineColorScheme();
  // language

  type typeCategoryApi = {
    title: string;
  };
  type majorCategoryApi = {
    title: string;
  };

  const { referral } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [signing, setSigning] = useState<boolean>(false);
  const [majorVal, setMajor] = useState<string>('');
  const [majorValue, setMajorValue] = useState<number>();
  const [InstitudeValue, setInstitudeValue] = useState<number>();
  const [fp, setfp] = useState('');

  const [typeOfInstitude, setTypeOfInstitude] = useState<string>('');
  const [typeCategoryApi, setTypeCategoryApi] = useState([]);
  const [instituteEror, setInstituteError] = useState<boolean>(false);
  const [majorCategoryApi, setMajorCategoryApi] = useState([]);
  const contextData: any = useContext(AppContext);
  const handleMajor = (e: any) => {
    setMajor(e);
    const getId: any = majorCategoryApi.find((a: any) => a?.value === e);
    setMajor(e);
    setMajorValue(getId?.value);
    form.setValues((state) => ({ ...state, major: getId?.value }));
    form.clearFieldError('major');
  };
  const handleInstitute = (e: any) => {
    setTypeOfInstitude(e);
    const getId: any = typeCategoryApi.find((a: any) => a?.value === e);
    setInstitudeValue(getId?.value);
    form.setValues((state) => ({ ...state, institute: getId?.value }));
    form.clearFieldError('institute');
  };
  const handleInstituteApi = async () => {
    const respInstitute = await axios.get('/institute/categories');
    setTypeCategoryApi(respInstitute?.data);
  };
  const handlemajorApi = async () => {
    const respInstitute = await axios.get('/major/categories');
    setMajorCategoryApi(respInstitute?.data);
  };

  useEffect(() => {
    if (typeCategoryApi.length <= 0 || majorCategoryApi.length <= 0) {
      handleInstituteApi();
      handlemajorApi();
    }
  }, [typeCategoryApi, majorCategoryApi]);
  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log('Fingerprint:', result.visitorId);
      setfp(result.visitorId || '');
    };
    getFingerprint();
  }, []);
  const form = useForm({
    initialValues: {
      email: '',
      fname: '',
      lname: '',
      password: '',
      mobile: '',
      country_code: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referral: '',
      client_id: '2',
      grant_type: 'password',
      client_secret: 'RTjITsRWgZ6aX1Euv3TV8CAEs8lFuvuFQLzSEmoe',
      institute: typeOfInstitude,
      major: majorVal,
    },
    validate: {
      email: validateEmail,
      password: (value) => {
        if (!value) {
          return 'Required';
        }
        if (value) {
          var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
          if (!strongRegex.test(value)) {
            return 'Password must include at least one capital letter,one small letter and one number.';
          }
        }
        // return value.length < 8 && value.length > 15 ? 'Password must be at least 8 characters' : null;
      },
      mobile: (value) => {
        if (!value) {
          return 'Required';
        }
        if (!isValidPhoneNumber(value)) {
          return 'Invalid Phone number';
        }
        return null;
      },
      fname: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
      lname: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
      institute: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
      major: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
    },
  });
  type FormValues = typeof form.values;

  const createUser = (values: FormValues) => {
    setIsLoading(true);
    let greeting = formatPhoneNumberIntl(values.mobile).split(' ')[0];
    values.country_code = greeting;
    if (referral !== undefined && referral !== null && referral !== '') {
      values.referral = referral + '';
    }
    mutation.mutate(values);
  };
  const mutation = useMutation(
    (values: FormValues) =>
      axios.post('register', {
        ...values,
        institute: InstitudeValue,
        major: majorValue,
        fpjsid: fp || '',
      }),
    {
      onSuccess: (data) => {
        if (data.status === 200) {
          const parseJwtToken = (token: string) => {
            if (!token) {
              return;
            }
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
          };
          localStorage.setItem('user_id', parseJwtToken(data.data.access_token).sub);
          contextData.setTracker(true);
          setCookie('access_token', data?.data?.access_token, {
            maxAge: 24 * 60 * 60 * 30,
          });
          setCookie('refresh_token', data?.data?.refresh_token, {
            maxAge: 24 * 60 * 60 * 30,
          });
          //ZK: Send the cookies to RN
          // @ts-ignore
          if (window.ReactNativeWebView) {
            const obj = {
              event: 'setCookie',
              cookies: {
                access_token: data?.data?.access_token,
                refresh_token: data?.data?.refresh_token,
              },
            };
            const objStringfy = JSON.stringify(obj);
            // @ts-ignore
            window.ReactNativeWebView.postMessage(objStringfy);

            //Now I am going to trigger tell RN to trigger the OneSignal Event

            const objTwo = {
              event: 'sendOneSignalPlayerIdToBE',
              accessToken: data?.data?.access_token,
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
                fpjsid: fp || '',
              });
              sendPlayerIDTowardBackend(oneSignalId);
            }
          }
          router.push('/user/onboarding');
        }
        setIsLoading(false);
      },
      onError: (error: any) => {
        setIsLoading(false);
        if (error?.response?.status == 403) {
          localStorage.setItem('user_email', form.values.email);
          // showNotification({
          //   message: 'Verification email has been sent! Please check your email for verification',
          //   color: 'teal',
          // });
          setOpenConfirmModal(true);
          // router.replace('/verify-email');
          //router.replace('/signin');
        } else {
          const err = error?.response?.data?.errors;
          if (err) {
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

        // const errorMessage = Object.keys(error.response.data.errors).map(
        //   (key) => error.response.data.errors[key]
        // );
        // if (errorMessage.length > 0) {
        //   showNotification({
        //     message: errorMessage[0],
        //     color: 'red',
        //   });
        // } else {
        //   showNotification({
        //     message: 'Something went wrong',
        //     color: 'red',
        //   });
        // }
      },
      retry: 0,
    }
  );

  return (
    <>
      <form onSubmit={form.onSubmit(createUser)} autoComplete="on">
        <Modal
          opened={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          withCloseButton={false}
          centered
        >
          <Card>
            <Stack>
              <Text align="center">Please check your email for verification</Text>
              <Stack sx={{ alignItems: 'center' }}>
                {/* <Button
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
                </Button> */}
                <Button
                  id="btn-verificationModalSignIn"
                  variant="filled"
                  onClick={() => {
                    setSigning(true);
                    router.replace('/signin');
                  }}
                  loading={signing}
                  radius={20}
                  sx={{ width: '50%' }}
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
              </Stack>
            </Stack>
          </Card>
        </Modal>
        <Stack>
          <SimpleGrid sx={{ gridTemplateColumns: '1fr 1fr' }}>
            <InputWrapper
              label={t.first_name}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <TextInput
                id="inp-signupFirstName"
                icon={<UserIcon />}
                variant="filled"
                placeholder={t.first_name}
                aria-label="Your first name"
                type="text"
                autoComplete="firstName"
                error={form.errors.fname}
                {...form.getInputProps('fname')}
                size="md"
                onChange={(e) => {
                  form.setValues((state) => ({ ...state, fname: e.target.value }));
                  form.clearFieldError('fname');
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
                radius={20}
              />
            </InputWrapper>
            <InputWrapper
              label={t.last_name}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <TextInput
                id="inp-signupLastName"
                variant="filled"
                placeholder={t.last_name}
                aria-label="Your Last name"
                autoComplete="lastName"
                type="text"
                error={form.errors.lname}
                {...form.getInputProps('lname')}
                onChange={(e) => {
                  form.setValues((state) => ({ ...state, lname: e.target.value }));
                  form.clearFieldError('lname');
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
                size="md"
                radius={20}
              />
            </InputWrapper>
          </SimpleGrid>
          <InputWrapper
            label={t.email}
            labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
          >
            <TextInput
              id="inp-signupEmail"
              icon={<MessageIcon />}
              variant="filled"
              //aria-placeholder = {t.email}
              placeholder={t.email}
              aria-label="Your email"
              type="email"
              autoComplete="email"
              error={form.errors.email}
              {...form.getInputProps('email')}
              onChange={(e) => {
                form.setValues((state) => ({ ...state, email: e.target.value }));
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
              size="md"
              radius={20}
            />
          </InputWrapper>
          <Box>
            <InputWrapper
              label={t.phone_number}
              className="handlePhone"
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              {
                //@ts-ignore
                <PhoneInput
                  id="inp_phoneNumber3"
                  defaultCountry="KW"
                  inputComponent={TextInput}
                  countrySelectComponent={CountrySelect}
                  variant="filled"
                  size="md"
                  type="tel"
                  autoComplete="number"
                  radius={20}
                  sx={{
                    direction: router.locale === 'ar-kw' ? 'rtl' : 'ltr',
                    error: { position: 'relative', top: '15px' },
                    root: { position: 'relative', top: '15px' },
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
                  placeholder={t.enter_phone_number}
                  aria-label="Phone number"
                  {...form.getInputProps('mobile')}
                  error={form.errors.mobile}
                  onChange={(number) => {
                    form.setValues((state) => ({ ...state, mobile: number as string }));
                    form.clearFieldError('mobile');
                  }}
                />
              }
            </InputWrapper>
            {/* {form.errors && <Text color="red">{form.errors.mobile}</Text>} */}
          </Box>
          <InputWrapper
            label={t?.selectInstitude}
            className="handlePhone"
            labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
          >
            <Select
              id="slt-signupInstitude"
              placeholder={t?.selectInstitude}
              searchable
              data={typeCategoryApi}
              className="loading selectSignUp"
              onChange={handleInstitute}
              // {...form.getInputProps('typeOfInstitude')}
              error={form.errors.institute}
              value={typeOfInstitude}
            />
          </InputWrapper>
          {instituteEror ? <h1>Required</h1> : ''}

          <InputWrapper
            label={t?.selectMajor}
            className="handlePhone"
            labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
          >
            <Select
              id="slt-signupMajor"
              className="loading selectSignUp"
              searchable
              error={form.errors.major}
              placeholder={t?.selectMajor}
              data={majorCategoryApi}
              onChange={handleMajor}
              value={majorVal}
            />
          </InputWrapper>
          <InputWrapper
            label={t.password}
            labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
          >
            <PasswordInput
              id="inp-signupPassword"
              icon={<LockIcon />}
              variant="filled"
              placeholder={t.password}
              autoComplete="new-password"
              aria-label="Your password"
              // type="password"  If you apply this property than password hide show functionality not work
              size="md"
              radius={20}
              minLength={8}
              maxLength={255}
              error={form.errors.password}
              {...form.getInputProps('password')}
              onChange={(e) => {
                form.setValues((state) => ({ ...state, password: e.target.value }));
                form.clearFieldError('password');
              }}
              styles={(theme: any) => ({
                visibilityToggle: {
                  color: theme.colors.gray[6],
                },
                innerInput: {
                  color: '#298EAE',
                },
                input: {
                  backgroundColor: '#F7F6F5',
                  color: '#000000',
                  //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px white inset',
                    backgroundClip: 'text',
                  },
                },
              })}
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? (
                  <EyeCheck size={size} color={'#298EAE'} />
                ) : (
                  <EyeOff size={size} color={'#298EAE'} />
                )
              }
            />
          </InputWrapper>

          <Text size="xs" sx={{ maxWidth: '90%' }}>
            {t.signup_massage}{' '}
            <Link href="/terms-and-conditions" passHref>
              <Anchor color="blue" size="xs">
                {t['terms-&-conditions']}{' '}
              </Anchor>
            </Link>
            <Link href="/privacy-policy" passHref>
              <Anchor color="blue" size="xs">
                {t.privacy_policy}
              </Anchor>
            </Link>
            .
          </Text>
          <Space />
          <Button
            id="btn-signup"
            loading={isLoading}
            type="submit"
            size="md"
            radius={20}
            styles={{ label: { textAlign: 'center' } }}
          >
            {t['sign-up']}
          </Button>
        </Stack>
      </form>
    </>
  );
};
