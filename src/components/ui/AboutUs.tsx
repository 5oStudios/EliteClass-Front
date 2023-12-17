import {
  ActionIcon,
  AspectRatio,
  Container,
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
import { LoadingScreen } from './loader-screen';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const Aboutus = () => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const { isLoading, error, data } = useQuery<any, any>('aboutus', () =>
    axios.get('about-us?secret=11f24438-b63a-4de2-ae92-e1a1048706f5').then((res) => res?.data)
  );

  if (error) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: error?.message,
        color: 'red',
      });
    }
  }

  return (
    <div>
      <LoadingScreen isLoading={isLoading} />
      <PageHeader title={t['about-us']} />
      <Container>
        {/* <AspectRatio ratio={1 / 1} sx={{ maxWidth: 200, maxHeight: 200, margin: 'auto' }}>
          <NextImage src="/assets/images/Group-1611.png" priority layout={'fill'} />
        </AspectRatio> */}
        <Stack mt={-20} spacing={0}>
          <TypographyStylesProvider sx={{ textAlign: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: data?.about_us }} />
          </TypographyStylesProvider>
          <Space h={40} />
          <SimpleGrid sx={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '40px' }} mx="auto">
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const url = `https://www.facebook.com/eliteclasskwt/`;
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
              <FacebookIcon />
            </ActionIcon>
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const url = `https://instagram.com/elite_class_kw`;
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
              <InstagramIcon />
            </ActionIcon>
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const url = `https://twitter.com/elite_class_kw/`;
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
              <TwitterIcon />
            </ActionIcon>
            <ActionIcon
              component="a"
              onClick={() => {
                //ZK: Share code triggering native view in mobile app
                const whatsappURL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}`;
                // @ts-ignore
                if (window?.ReactNativeWebView === undefined) {
                  //This means we are not in ReactNative webView so open the new link in another widows of browser
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
              <WhatappIcon />
            </ActionIcon>
          </SimpleGrid>
          <Space h={40} />
        </Stack>
      </Container>
    </div>
  );
};
export default Aboutus;
