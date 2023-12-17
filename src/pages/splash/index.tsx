import React from 'react';
import { ChooseLangSplashScreen } from '@/components/screens/splash/choose-lang';
import { Seo } from '@/components/seo';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';

const SplashPage = ({
  userAgent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const setLang = (value: string) => {
    setCookie('guest_lang', value, {
      maxAge: 24 * 60 * 60 * 30,
    });
    setCookie('NEXT_LOCALE', value, {
      maxAge: 24 * 60 * 60 * 30,
    });
    //ZK: Send the cookies to RN
    // @ts-ignore
    if (window.ReactNativeWebView) {
      const obj = {
        event: 'setCookie',
        cookies: {
          guest_lang: value,
          NEXT_LOCALE: value,
        },
      };
      const objStringfy = JSON.stringify(obj);
      // @ts-ignore
      window.ReactNativeWebView.postMessage(objStringfy);
    }

    if (value !== 'en-us') {
      router.push('/splash/next-step', '/splash/next-step', { locale: value });
    } else {
      router.push('/splash/next-step');
    }
  };

  return (
    <>
      <Seo
        title="Welcome to Elite Class | Online Learning"
        description="An online platform that provides you with learning facility form the comfort of your own space. Learning is an essential part of growth, so Never Stop Learning!"
        path="splash"
      />
      <main>
        <ChooseLangSplashScreen setLang={setLang} userAgent={userAgent} />
      </main>
    </>
  );
};

export default SplashPage;

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
