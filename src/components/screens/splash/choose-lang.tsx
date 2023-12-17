import { Box, Center, Container, SimpleGrid, Stack, Text } from '@mantine/core';

import React from 'react';
import { SplashLogo } from '@/src/constants/icons';
import useNextBlurhash from 'use-next-blurhash';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ArabicButton } from '@/src/constants/ArabicBtn';
import { EnglishButton } from '@/src/constants/EnglishButton';
// type Props = {
//   setLang: (value: string) => void;
//   userAgent: (value: any) => any;
// };

export const ChooseLangSplashScreen = ({ setLang, userAgent }: any) => {
  // language

  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;

  // language

  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  return (
    <SimpleGrid
      sx={{
        //gridTemplateRows: 'max-content 1fr max-content',
        justifyItems: 'center',
        // paddingTop:0,
        //backgroundColor: 'white',
        width: '100vw',
        // paddingBottom : '5vh',
        height: '100vh',
        '@media (orientation: landscape)': {
          height: '100%',
          width: '100%',
          minHeight: '100vh',
        },
      }}
      //py="lg"
    >
      <Stack
        className={`${
          userAgent?.includes('ipad')
            ? 'splashHeight'
            : userAgent?.includes('mobile')
            ? 'splashHeight'
            : 'splashtextAndLogo'
        }`}
        sx={{ width: '100vw', height: '65vh', marginTop: '-10vh' }}
      >
        <Image
          src="/assets/images/splash_bg1.png"
          layout="fill"
          priority={true}
          quality={80}
          alt="Elite class LMS - Splash screen image"
        />
      </Stack>
      {/* <ImageWithFallback src="/assets/images/splash_bg1.png" layout = 'fill'/> */}
      {/* </BackgroundImage> */}
      <Stack
        className={`${
          userAgent.includes('ipad') ? '' : userAgent.includes('mobile') ? '' : 'splashText'
        }`}
        sx={{ alignItems: 'center', height: '35vh', marginBottom: '5vh' }}
      >
        <Center
          sx={{
            width: userAgent.includes('ipad')
              ? '30vw'
              : userAgent.includes('mobile')
              ? '30vw'
              : '100vw',
            height: '30vh',
            position: 'relative',
            paddingBottom: userAgent.includes('ipad')
              ? ''
              : userAgent.includes('mobile')
              ? ''
              : '9rem',
          }}
        >
          <SplashLogo />
        </Center>
        <Container px={40}>
          <Text
            sx={{
              fontSize: userAgent.includes('ipad')
                ? '3vw'
                : userAgent.includes('mobile')
                ? '3vw'
                : '2rem',
            }}
            className={`${
              userAgent.includes('ipad') ? '' : userAgent.includes('mobile') ? '' : 'splashInfo'
            }`}
            color="#298EAE"
            align="center"
          >
            Enter your study information so that we can provide you with customized courses and
            materials
          </Text>
          <Stack
            sx={{
              flexDirection: 'row',
              marginTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: 'red',
            }}
          >
            <Box id="btn-english" aria-label="English" onClick={() => setLang('en-us')}>
              {/* <EnglishButton /> */}
              {/* <Image
                layout="fixed"
                height={65}
                width={123}
                src="/assets/english-button.svg"
                alt="Click here to select english language"
              /> */}
              <div
                style={{
                  height: '65px',
                  width: '123px',
                }}
              >
                <EnglishButton />
              </div>
            </Box>
            <Box id="btn-arabic" aria-label="Arabic" onClick={() => setLang('ar-kw')}>
              {/* <ArabicButton/> */}

              {/* <Image
                layout="fixed"
                height={65}
                width={123}
                src="/assets/arabic-button.svg"
                alt="Click here to select arabic language"
              /> */}
              <div
                style={{
                  height: '65px',
                  width: '123px',
                }}
              >
                <ArabicButton />
              </div>
            </Box>
          </Stack>
        </Container>
      </Stack>
    </SimpleGrid>
  );
};
