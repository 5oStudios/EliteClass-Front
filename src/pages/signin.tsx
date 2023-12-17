import {
  Center,
  Container,
  Text,
  MediaQuery,
  Box,
  Stack,
  SimpleGrid,
  useMantineColorScheme,
} from '@mantine/core';
import { LoginForm } from '@/components/auth';
import { Seo } from '@/components/seo';
import { GoBack } from '@/components/ui/GoBack';
import { GetServerSideProps } from 'next';
import { axiosServer } from '@/components/axios/axios-server';
import Image from 'next/image';
import { ImageContainer } from '@/components/ui/ImageContianer';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import { SignInWhite } from '../constants/icons/sign-in-white';
import { useState } from 'react';
import { SignInEmailWhite } from '../constants/icons/sign-in-email-white';
import { SignInEmail } from '../constants/icons/sign-in-email';
import { SignIn } from '../constants/icons/sign-in';

const SigninPage = ({ data }: any) => {
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme } = useMantineColorScheme();
  const [tab, setTab] = useState(0);
  return (
    <>
      <Seo title="Sign In" description="Best LMS" path="signin" />
      <Container
        fluid
        //my={30}
        sx={{
          maxWidth: 1200,
          //backgroundColor : 'white',
          '@media (min-width: 1025px)': {
            marginTop: '50px',
          },
        }}
      >
        <MediaQuery query="(min-width: 1025px)" styles={{ display: 'none' }}>
          <Box>
            <GoBack />
          </Box>
        </MediaQuery>
        <Stack align="center" sx={{ minHeight: '100vh', width: '100%' }} justify="center">
          <SimpleGrid
            sx={{
              gridTemplateColumns: '1fr',
              justifyContent: 'stretch',
              width: '100%',
              '@media screen and (min-width: 1025px)': {
                gridTemplateColumns: '1fr 2fr',
                alignItems: 'center',
              },
            }}
          >
            <Stack
              sx={{
                position: 'relative',
                top: 30,

                '@media only screen and (min-width: 580px) and (max-width: 1025px)': {
                  top: 20,
                },
              }}
            >
              <MediaQuery query="(max-width: 1025px)" styles={{ display: 'none' }}>
                <Text
                  sx={{
                    fontSize: '3rem',
                  }}
                >
                  {t.Hi_Welcome_Back}
                </Text>
              </MediaQuery>
              <Center my={20} sx={{ height: 200 }}>
                {!tab ? (
                  colorScheme == 'dark' ? (
                    <SignInWhite />
                  ) : (
                    <SignIn />
                  )
                ) : colorScheme == 'dark' ? (
                  <SignInEmailWhite />
                ) : (
                  <SignInEmail />
                )}
                {/* <Image src="/assets/images/signin.svg" width={150} height={150} priority /> */}
              </Center>
              <MediaQuery query="(min-width: 1025px)" styles={{ display: 'none' }}>
                <Text
                  component="h1"
                  weight={500}
                  sx={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 3.8rem)',
                    alignSelf: 'center',
                    //marginLeft: 26,
                  }}
                >
                  {t.welcome_back_sign_in_Please}
                </Text>
              </MediaQuery>
            </Stack>
            <Stack align="center" sx={{ width: '100%' }}>
              <MediaQuery query="(max-width: 1025px)" styles={{ display: 'none' }}>
                <Stack spacing={0} align="center">
                  <Text sx={{ fontSize: 32 }} weight={500}>
                    Sign in
                  </Text>
                  <Text sx={{ color: '#939393' }} mt={-5}>
                    {t.Welcome_back}
                  </Text>
                </Stack>
              </MediaQuery>
              <Box
                sx={{
                  alignSelf: 'end',
                  width: '100%',

                  '@media only screen and (min-width: 580px) and (max-width: 1025px)': {
                    width: '90%',
                    margin: 'auto',
                  },
                }}
                mt={10}
              >
                <LoginForm type={data.setting} onchange={(t: any) => setTab(t)} />
              </Box>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await axiosServer.get('settings');

  return {
    props: {
      data,
    },
  };
};

export default SigninPage;
