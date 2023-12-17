import {
  ActionIcon,
  BackgroundImage,
  Box,
  Center,
  Container,
  SimpleGrid,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Dots, SplashLogo } from '@/src/constants/icons';
import { useRouter } from 'next/router';
import { SplashScreen1 } from '@/components/screens/splash/SplashScreen1';
import { setCookie } from 'cookies-next';
import { EnglishButton } from '@/src/constants/icons/eng-btn';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { NewButton } from '@/src/constants/icons/new-button';
import { Button } from '@/components/ui/Button';
import { GetStaticProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import Image from 'next/image';

const GetStarterStep = ({
  isMobile,
  userAgent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleSkip = () => {
    setCookie('skipHome', true);
    router.push('/signin');
  };

  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;

  useEffect(() => {
    router.prefetch('/user/onboarding');
  }, []);

  return (
    <SimpleGrid
      sx={{
        //gridTemplateRows: 'max-content 1fr max-content',
        //justifyItems: 'center',
        // paddingTop:0,
        //backgroundColor: colorScheme == 'dark' ? '#333333' : 'white',
        width: '100vw',
        position: 'relative',
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
      {/* <BackgroundImage
        src="/assets/images/splash_bg1.png"
        sx={{
          width: '100vw',
          height: '65vh',

          '@media only screen and (min-width: 580px)': {
            height: '60vh',
          },
        }}
      > */}
      {/* <ImageWithFallback src="/assets/images/splash_bg1.png" layout = 'fill'/> */}
      {/* </BackgroundImage> */}

      <Stack
        sx={{
          width: '100vw',
          height: '65vh',

          '@media only screen and (min-width: 580px)': {
            height: '60vh',
          },
        }}
        className={`${
          userAgent.includes('ipad')
            ? 'splashHeight'
            : userAgent.includes('mobile')
            ? 'splashHeight'
            : 'nextStepNext'
        }`}
      >
        <Image
          src={'/assets/images/splash_bg1.png'}
          layout="fill"
          priority={true}
          quality={80}
          alt="Elite class LMS - Splash screen image"
        />
      </Stack>

      <ActionIcon
        id="btn-skip"
        onClick={handleSkip}
        variant="transparent"
        sx={{ position: 'absolute', top: 30, right: 30, zIndex: 2 }}
      >
        <Text color="white" weight={500} onClick={handleSkip}>
          {t.skip}
        </Text>
      </ActionIcon>
      <Stack
        className={`${
          userAgent.includes('ipad') ? '' : userAgent.includes('mobile') ? '' : 'PageInfo'
        }`}
      >
        <Stack>
          <Text
            color="black"
            align="center"
            sx={{ fontSize: '6vw', color: colorScheme == 'dark' ? '#EDD491' : '#000000' }}
            weight={600}
          >
            {t.Welcome_to_EliteClass}
          </Text>
          <Text
            color="#298EAE"
            align="center"
            sx={{
              fontSize: '3vw',
              color: userAgent.includes('ipad')
                ? '#298EAE'
                : userAgent.includes('mobile')
                ? '#298EAE'
                : '#faf089',
            }}
            weight={500}
          >
            {t.One_of_the_best_online_learning_platform}
          </Text>
        </Stack>

        <Button
          btnId="btn-getStarted"
          onClick={() => {
            setCookie('isSkipTutorial', true, {
              maxAge: 24 * 60 * 60 * 30,
            });

            //ZK: Send the cookies to RN
            // @ts-ignore
            if (window.ReactNativeWebView) {
              const obj = {
                event: 'setCookie',
                cookies: {
                  isSkipTutorial: true,
                },
              };
              const objStringfy = JSON.stringify(obj);
              // @ts-ignore
              window.ReactNativeWebView.postMessage(objStringfy);
            }
            router.push('/user/onboarding');
            setIsLoading(true);
          }}
          loading={isLoading}
          userAgent={userAgent}
        />
      </Stack>
      {/* <Center sx={{ width: '157px', height: '157px' }}>
      <SplashLogo />
    </Center> */}
      {/* <Container sx={{}}>
      <Text sx={{}} color="#298EAE" align="center">
        Enter your study information so that we can provide you with customized courses and
        materials
      </Text>
      <Stack
        sx={{
          flexDirection: 'row',
          marginTop: '2vh',
          justifyContent: 'center',
          alignItems: 'center',
          //backgroundColor: 'red',
        }}
      >
        <Box 
        ///onClick={() => setLang('en-us')}
        >
          <EnglishButton />
        </Box>
        <Box 
        //onClick={() => setLang('ar-kw')}
        >
          <ImageWithFallback src="/assets/images/ar_btn.png" height={90} width={196} />
        </Box>
      </Stack>
    </Container> */}
    </SimpleGrid>
    // <Container sx={{ background: '#EDD491', position: 'relative', minHeight: '100vh' }}>
    //   <ActionIcon
    //     onClick={handleSkip}
    //     variant="transparent"
    //     sx={{ position: 'absolute', top: 30, right: 30, zIndex: 2 }}
    //   >
    //     <Text color="white" weight={500} onClick={handleSkip}>
    //       Skip
    //     </Text>
    //   </ActionIcon>
    //   <Box sx={{ position: 'absolute', left: 0, top: 90 }}>
    //     <Dots />
    //   </Box>
    //   <SimpleGrid
    //     sx={{
    //       height: '100vh',
    //       gridTemplateRows: '1fr max-content',
    //       gap: 20,
    //     }}
    //   >
    //     <Box sx={{ alignSelf: 'center', marginTop: '50px' }}>
    //       <SplashScreen1 />
    //     </Box>
    //     <Button
    //       color="blue"
    //       variant="filled"
    //       size="md"
    //       mb={30}
    //       radius="xl"
    //       fullWidth
    //       onClick={() => {

    //         setCookie('isSkipTutorial', true, {
    //           maxAge: 24 * 60 * 60 * 30,
    //         });

    //         //ZK: Send the cookies to RN
    //         // @ts-ignore
    //         if (window.ReactNativeWebView) {
    //           const obj = {
    //             event: 'setCookie',
    //             cookies: {
    //               isSkipTutorial: true,
    //             },
    //           };
    //           const objStringfy = JSON.stringify(obj);
    //           // @ts-ignore
    //           window.ReactNativeWebView.postMessage(objStringfy);
    //         }
    //         router.push('/user/onboarding');
    //         setIsLoading(true);
    //       }}
    //       loading={isLoading}
    //       styles={{
    //         root: {
    //           alignSelf: 'end',
    //           maxWidth: '200px',
    //           margin: 'auto',
    //         },
    //         label: { color: 'white' },
    //         filled: {
    //           background: '#82B1CF',
    //           '&:hover': {
    //             background: '#82B1CF',
    //           },
    //         },
    //       }}
    //     >
    //       Get Started
    //     </Button>
    //   </SimpleGrid>
    // </Container>
  );
};
export default GetStarterStep;

// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: {},
//   };
// };

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const userAgent: any =
    typeof window === 'undefined'
      ? ctx.req.headers['user-agent']?.toLowerCase()
      : navigator.userAgent.toLowerCase();
  const isMobile: any = /iphone|ipod|ipad|android|blackberry|windows phone/gi?.test(userAgent);
  console.log(userAgent);
  console.log(isMobile ? 'Mobile' : 'Website');
  return {
    props: {
      isMobile,
      userAgent,
    },
  };
};
