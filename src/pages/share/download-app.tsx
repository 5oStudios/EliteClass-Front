import {
  ActionIcon,
  AspectRatio,
  Box,
  Container,
  Image,
  SimpleGrid,
  Space,
  Stack,
  TypographyStylesProvider,
} from '@mantine/core';
import React from 'react';
import NextImage from 'next/image';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatappIcon,
} from '../../constants/icons/social';
import { PageHeader } from '@/components/ui/pageHeader';
import { useQuery } from 'react-query';
import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { SplashLogo } from '@/src/constants/icons';
import { AppleStore } from '@/src/constants/icons/appleStore';

const DownloadApp = ({ data }: any) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');

  // if (error) {
  //   if (error?.message === 'Network Error') {
  //     showNotification({
  //       message: 'Network Error',
  //       color: 'red',
  //     });
  //   } else {
  //     showNotification({
  //       message: error?.message,
  //       color: 'red',
  //     });
  //   }
  // }

  return (
    <div>
      {/* <LoadingScreen isLoading={isLoading} /> */}
      <Container>
        {/* <AspectRatio ratio={1 / 1} sx={{ maxWidth: 200, maxHeight: 200, margin: 'auto' }}>
          <NextImage src="/assets/images/Group-1611.png" priority layout={'fill'} />
        </AspectRatio> */}

        <Stack mt={-20} spacing={0}>
          <TypographyStylesProvider sx={{ textAlign: 'center', marginTop: 10 }}>
            <div dangerouslySetInnerHTML={{ __html: data }} />
          </TypographyStylesProvider>
          <Space h={40} />
          <SimpleGrid sx={{ gap: '40px', justifyContent: 'center', marginTop: 20 }} mx="auto">
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const url = `https://play.google.com/store/apps/details?id=com.eliteclass&hl=en&gl=US`;
                // @ts-ignore
                if (window?.ReactNativeWebView === undefined) {
                  //This means we are not in ReactNative webView so open in new link as target blanks
                  window.open(url, '_blank');
                } else {
                  const shareableObject = {
                    event: 'urlOpen',
                    url,
                  };

                  const objStringfy = JSON.stringify(shareableObject);
                  // @ts-ignore
                  window.ReactNativeWebView.postMessage(objStringfy);
                }
              }}
            >
              <Image
                radius="md"
                width={200}
                // height={80}
                src="/assets/images/google-play-en.png"
                alt="Random unsplash image"
              />
            </ActionIcon>
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const url = `https://apps.apple.com/us/app/elite-class/id1635290222?ign-itscg=30200&ign-itsct=apps_box_link`;
                // @ts-ignore
                if (window?.ReactNativeWebView === undefined) {
                  //This means we are not in ReactNative webView so open in new link as target blanks
                  window.open(url, '_blank');
                } else {
                  const shareableObject = {
                    event: 'urlOpen',
                    url,
                  };

                  const objStringfy = JSON.stringify(shareableObject);
                  // @ts-ignore
                  window.ReactNativeWebView.postMessage(objStringfy);
                }
              }}
            >
              <Image
                radius="md"
                width={200}
                //height={80}
                src="/assets/images/app-store-en.png"
                alt="Random unsplash image"
              />
            </ActionIcon>
          </SimpleGrid>
          <Space h={40} />
        </Stack>
      </Container>
    </div>
  );
};
export async function getStaticProps() {
  const resp = await axios
    .get('about-us?secret=11f24438-b63a-4de2-ae92-e1a1048706f5')
    .then((res) => res?.data);
  console.log(resp);
  return {
    props: {
      data: resp.about_us,
    },
    revalidate: 10,
  };
}
export default DownloadApp;
