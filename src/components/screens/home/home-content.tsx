import { Anchor, Box, Container, Group, Space, Text } from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BannerCarousal } from './carousals/banner-carousal';
import { CoursesCarousal } from './carousals/courses-carousal';
import { InstructorsCarousal } from './carousals/instructors-carousal';
import { LiveSessionCarousal } from './carousals/live-session-carousal';
import { PackagesCarousal } from './carousals/packages-carousal';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { getCookie } from 'cookies-next';
// import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const HomeContent = (props: any) => {
  const [fp, setfp] = useState('');

  // console.log('FP:', fp);

  const router = useRouter();
  // language
  const t = router.locale === 'ar-kw' ? ar : en;

  useEffect(() => {
    // if ('userPlayerId' in localStorage) {
    //   console.log('PlayerId Already Exit');
    // } else {
    const token = getCookie('access_token');
    // @ts-ignore
    if (window.ReactNativeWebView) {
      console.log('PlayerId Updating...');
      //Now I am going to trigger tell RN to trigger the OneSignal Event
      const objTwo = {
        event: 'sendOneSignalPlayerIdToBE',
        accessToken: token,
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}playerdeviceid`,
      };
      const objTwoStringfy = JSON.stringify(objTwo);
      //@ts-ignore
      window.ReactNativeWebView.postMessage(objTwoStringfy);
      //@ts-ignore
      localStorage.setItem('userPlayerId', 'true');
      const getFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        console.log('Fingerprint:', result.visitorId);
        setfp(result.visitorId || '');
      };
      getFingerprint();
    }
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

  //console.log("MEETING:", props?.homeData?.meetings?.data)
  // language
  return (
    <Container p={0} fluid sx={{ maxWidth: '100vw' }}>
      <Container>
        <BannerCarousal bCarousal={props?.homeData?.slider} />
      </Container>
      {/* {props?.homeData?.instructors?.data != '' ?
        <Container my={30} p={0}>
          <Group px={8} position="apart" align="center">
            <Text
              sx={{
                fontSize: '16px',
                '@media screen and (min-width : 740px)': {
                  fontSize: 24,
                },
              }}
              weight={500}
            >
              {t.instructors}
            </Text>
            <Box
              style={
                props?.homeData?.instructors?.data == ''
                  ? { pointerEvents: 'none' }
                  : { pointerEvents: 'auto' }
              }
            >
              <Link href="/instructors" passHref>
                <Anchor
                  sx={(theme) => ({
                    color:
                      props?.homeData?.instructors?.data == ''
                        ? '#ced4da'
                        : theme.other.placeholderColor,
                    '@media screen and (min-width : 740px)': {
                      fontSize: 16,
                    },
                  })}
                  size="xs"
                >
                  <span>{t['see-all']}</span>
                  <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
                </Anchor>
              </Link>
            </Box>
          </Group>
          <Space h="xs" />
          <InstructorsCarousal ICarousal={props?.homeData?.instructors?.data} />
        </Container> : null} */}
      {props?.homeData?.packages?.data != '' ? (
        <Container my={30} p="xs">
          <Group position="apart" align="center">
            <Text
              transform="capitalize"
              sx={{
                fontSize: '16px',
                '@media screen and (min-width : 740px)': {
                  fontSize: 24,
                },
              }}
              weight={500}
            >
              {t.packages}
            </Text>
            <Box
              style={
                props?.homeData?.packages?.data == ''
                  ? { pointerEvents: 'none' }
                  : { pointerEvents: 'auto' }
              }
            >
              <Link href="/packages" passHref>
                <Anchor
                  sx={(theme) => ({
                    color: theme.other.liyaToprimay,
                    '@media screen and (min-width : 740px)': {
                      fontSize: 16,
                    },
                  })}
                  size="xs"
                >
                  <span>{t['see-all']}</span>
                  <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
                </Anchor>
              </Link>
            </Box>
          </Group>
          <Space h="xs" />
          <PackagesCarousal PCarousal={props?.homeData?.packages?.data} />
        </Container>
      ) : null}
      {props?.homeData?.courses?.data != '' ? (
        <Container my={30} p="xs">
          <Group position="apart" align="center">
            <Text
              transform="capitalize"
              sx={{
                fontSize: '16px',
                '@media screen and (min-width : 740px)': {
                  fontSize: 24,
                },
              }}
              weight={500}
            >
              {t.courses}
            </Text>
            <Box
              style={
                props?.homeData?.courses?.data == ''
                  ? { pointerEvents: 'none' }
                  : { pointerEvents: 'auto' }
              }
            >
              <Link href="/courses" passHref>
                <Anchor
                  sx={(theme) => ({
                    color: theme.other.liyaToprimay,
                    '@media screen and (min-width : 740px)': {
                      fontSize: 16,
                    },
                  })}
                  size="xs"
                >
                  <span>{t['see-all']}</span>
                  <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
                </Anchor>
              </Link>
            </Box>
          </Group>
          <Space h="xs" />
          <CoursesCarousal CCarousal={props?.homeData?.courses?.data} isBundled={'false'} />
        </Container>
      ) : null}
      {props?.homeData?.meetings?.data != '' ? (
        <Container my={30} p="xs">
          <Group position="apart" align="center">
            <Text
              sx={{
                fontSize: '16px',
                '@media screen and (min-width : 740px)': {
                  fontSize: 24,
                },
              }}
              weight={500}
            >
              {t['live-sessions']}
            </Text>
            <Box
              style={
                props?.homeData?.meetings?.data == ''
                  ? { pointerEvents: 'none' }
                  : { pointerEvents: 'auto' }
              }
            >
              <Link href="/live-sessions" passHref>
                <Anchor
                  sx={(theme) => ({
                    color: theme.other.liyaToprimay,
                    '@media screen and (min-width : 740px)': {
                      fontSize: 16,
                    },
                  })}
                  size="xs"
                >
                  <span>{t['see-all']}</span>
                  <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
                </Anchor>
              </Link>
            </Box>
          </Group>
          <Space h="xs" />
          <LiveSessionCarousal LCarousal={props?.homeData?.meetings?.data} type={'live'} />
        </Container>
      ) : null}
      {props?.homeData?.sessions?.data != '' ? (
        <Container my={30} p="xs">
          <Group position="apart" align="center">
            <Text
              sx={{
                fontSize: '16px',
                '@media screen and (min-width : 740px)': {
                  fontSize: 24,
                },
              }}
              weight={500}
            >
              {t['in-person-sessions']}
            </Text>
            <Box
              style={
                props?.homeData?.sessions?.data == ''
                  ? { pointerEvents: 'none' }
                  : { pointerEvents: 'auto' }
              }
            >
              <Link href="/in-person-sessions" passHref>
                <Anchor
                  sx={(theme) => ({
                    color: theme.other.liyaToprimay,
                    '@media screen and (min-width : 740px)': {
                      fontSize: 16,
                    },
                  })}
                  size="xs"
                >
                  <span>{t['see-all']}</span>
                  <ChevronRightIcon className="rtl" style={{ position: 'relative', top: 3 }} />
                </Anchor>
              </Link>
            </Box>
          </Group>
          <Space h="xs" />
          <LiveSessionCarousal LCarousal={props?.homeData?.sessions?.data} type={'in-person'} />
        </Container>
      ) : null}
      <Space h={100} />
    </Container>
  );
};
