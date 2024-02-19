import { Seo } from '@/components/seo';
import { Box, Button, Container, Space, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import VerificationInput from 'react-verification-input';
import styles from '@/src/styles/verfication-input.module.css';
import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';

import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import ResentEmailCode from '@/components/ui/ResentEmailCode';
import { GoBack } from '@/components/ui/GoBack';
//import useVisitorData from '@fingerprintjs/fingerprintjs';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { sendPlayerIDTowardBackend } from '@/utils/utils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const VerifyPage = () => {
  const [code, setCode] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disableLink, setDisableLink] = useState(false);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [fp, setfp] = useState('');

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log('Fingerprint:', result.visitorId);
      setfp(result.visitorId || '');
    };
    getFingerprint();
  }, []);
  const verifyCode = async () => {
    const email = localStorage.getItem('user_email');
    if (code.length === 4) {
      setIsLoading(true);
      setDisableLink(true);
      await axios
        .post('email/verify/otp', {
          email,
          code,
        })
        .then((res) => {
          setIsLoading(false);
          // setDisableLink(false);
          if (res.status === 200) {
            setCookie('access_token', res?.data?.access_token, {
              maxAge: 24 * 60 * 60 * 30,
            });

            //ZK: Send the cookies to RN
            // @ts-ignore
            // if (window.ReactNativeWebView) {
            //   const obj = {
            //     event: 'setCookie',
            //     cookies: {
            //       access_token: res?.data?.access_token,
            //     },
            //   };
            //   const objStringfy = JSON.stringify(obj);
            //   // @ts-ignore
            //   window.ReactNativeWebView.postMessage(objStringfy);
            // }

            //ZK: Send the cookies to RN
            // @ts-ignore
            if (window.ReactNativeWebView) {
              const obj = {
                event: 'setCookie',
                cookies: {
                  access_token: res?.data?.access_token,
                },
              };
              const objStringfy = JSON.stringify(obj);
              // @ts-ignore
              window.ReactNativeWebView.postMessage(objStringfy);

              //Now I am going to trigger tell RN to trigger the OneSignal Event

              const objTwo = {
                event: 'sendOneSignalPlayerIdToBE',
                accessToken: res?.data?.access_token,
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

            showNotification({
              message: 'Email verified',
              color: 'teal',
            });
            router.replace('/');
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setDisableLink(false);
          setCode('');
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
        message: 'Please enter verification code.',
        color: 'red',
      });
    }
  };

  return (
    <div>
      <Seo title="verify email" description="Verify your email to get started" path="/verify" />
      <Container fluid my={30}>
        <GoBack />
        <Box pt={30}>
          <Image
            src="/assets/images/two-factor-authentication.svg"
            width={300}
            height={270}
            priority
          />
        </Box>
        <Text component="h2" size="xl" weight={500} align="center">
          {t.Enter_the_verification_code}
        </Text>
        <Text component="p" size="xs" align="center">
          {t.Enter_the_one_time_password}
        </Text>

        <Stack mt={30}>
          <Box dir="ltr">
            <VerificationInput
              removeDefaultStyles
              value={code}
              placeholder=""
              inputProps={{ inputMode: 'numeric' }}
              onChange={(value) => setCode(value)}
              autoFocus
              validChars="0-9"
              length={4}
              // inputProps={{ type: 'number' }}
              classNames={{
                container: styles.container,
                character: styles.character,
                characterInactive: styles.characterInactive,
                characterSelected: styles.characterSelected,
              }}
            />
          </Box>

          <Space />
          <Button
            id="btn-emailVerify"
            onClick={verifyCode}
            loading={isLoading}
            type="submit"
            size="md"
            radius={8}
          >
            {t.Verify_email}
          </Button>
        </Stack>
        <Space h={30} />
        <Stack align="center" spacing={0}>
          <ResentEmailCode disableLink={disableLink} setCode={setCode} />
        </Stack>
      </Container>
    </div>
  );
};

export default VerifyPage;
