import {
  Box,
  Center,
  Container,
  MediaQuery,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { SignUpForm } from '@/components/auth';
import { Seo } from '@/components/seo';
import { GoBack } from '@/components/ui/GoBack';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { SignUp } from '../constants/icons/sign-up';
import { SignUpWhite } from '../constants/icons/sign-up-white';
import { GetStaticProps } from 'next';
const SigninPage = () => {
  // language
  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;
  const { colorScheme } = useMantineColorScheme();
  // language
  return (
    <>
      <Seo title="Sign Up" description="LMS " path="signin" />
      <Container fluid my={30}>
        <main>
          <GoBack />
          <Center pt={50} sx={{ height: 200 }}>
            {/* <NextImage src="/assets/images/signup.svg" width={200} height={100} priority /> */}
            {colorScheme == 'dark' ? <SignUpWhite /> : <SignUp />}
          </Center>
          <Stack sx={{ alignItems: 'center' }}>
            <Text
              component="h1"
              size="xl"
              weight={500}
              sx={{
                fontSize: 'clamp(1.2rem, 2.5vw, 3.8rem)',
              }}
            >
              {t.Fill_this_form_to_sign_up_Please}
            </Text>
          </Stack>
          <SignUpForm />
        </main>
        <Space h="xl" />
      </Container>
    </>
  );
};

export default SigninPage;
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
