import { DefaultSeo } from '@/components/seo';
import { GlobalStyles } from '@/src/styles/global-styles';
import { getLayoutDirection } from '@/utils/get-layout-direction';
import { queryClient } from '@/utils/queryClient';
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import rtlPlugin from 'stylis-plugin-rtl';
import axios from '@/components/axios/axios';

// import OpenReplay from '@openreplay/tracker';

import '../styles/accessdenied.css';
import AppContext from '../../context/context';
import { UpcomingSettlements } from '@/components/drawers/upcoming-settlements';

interface AccordionLabelProps {
  id: string;
  typeId: string;
  type: string;
  title: string;
  due_date: string;
  price: number;
}

export const App = (props: AppProps & { colorScheme: ColorScheme; locale: string }) => {
  const { Component, pageProps, locale } = props;
  const router = useRouter();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const token: any = getCookie('access_token');
  // const [tracker, setTracker] = useState(false);
  const [trackerCheck, setTrackerCheck] = useState(false);

  const [upcoming, setupcoming] = useState<AccordionLabelProps[]>([]);
  const [upcomingDrawer, setupcomingDrawer] = useState(false);

  function setUserTracker(value: any) {
    setTrackerCheck(value);
  }
  // const chkUserStatus = async () => {
  //   if (token) {      ===>// this code is commented because we are trying to solve the some scenerio related to block user so that why we write this but now we do not think that it is worth it so that  we are commenting it
  //     const resp: any = await axios.get('/check-user');
  //     if (resp?.data?.blocked === true) {
  //       localStorage.removeItem('user_id');
  //       deleteCookie('access_token');
  //       deleteCookie('refresh_token');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   chkUserStatus();
  // }, [router?.asPath]);
  // useEffect(() => {
  //   try {
  //     let protocol: any = window.location.protocol || null;
  //     if (protocol !== null && protocol !== undefined && protocol === 'https:' && protocol !== '') {
  //       if (tracker === false) {
  //         const url = window.location.hostname;
  //         openReply.setMetadata('hostname', url);
  //         openReply.start();
  //         setTracker(true);
  //       }
  //       let userId: any = localStorage.getItem('user_id') || null;
  //       if (userId !== null) {
  //         openReply.setUserID(userId);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Issue in tracker', error);
  //   }
  // }, [trackerCheck]);

  const upcomingInstallments = (userId: string | null) => {
    console.log('im here');

    axios.get(`/overdue/${userId}`).then((response: any) => {
      console.log(response);

      setupcoming(
        response.data.map((data: any) => {
          return {
            id: data.installmentId,
            typeId: data.typeId,
            type: data.type,
            image: data.image,
            title: data.name,
            due_date: data.dueDate,
            price: data.amount,
          };
        })
      );
      if (response.data.length > 0) {
        setupcomingDrawer(true);
      }
    });
  };

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    //ZK: Send the cookies to RN
    // @ts-ignore
    if (window.ReactNativeWebView) {
      const obj = {
        event: 'setCookie',
        cookies: {
          'mantine-color-scheme': nextColorScheme,
        },
      };
      const objStringfy = JSON.stringify(obj);
      // @ts-ignore
      window.ReactNativeWebView.postMessage(objStringfy);
    }
  };

  let layoutDirection = getLayoutDirection(router.locale);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      upcomingInstallments(userId);
    }
    document.documentElement.dir = layoutDirection;
  }, [layoutDirection]);
  const [history, setHistory] = useState([]);

  // console.log("ROUTER HISTORY :: ", history);
  // useEffect(() => {

  //   const { asPath } = router;

  //   // lets add initial route to `history`
  //   //@ts-ignore
  //   setHistory((history) => [...history, asPath])
  // }, [])

  useEffect(() => {
    const { asPath } = router;

    // if current route (`asPath`) does not equal
    // the latest item in the history,
    // it is changed so lets save it
    if (history[history.length - 1] !== asPath) {
      //@ts-ignore
      setHistory((history) => [...history, asPath]);
    }
  }, [router]);

  useEffect(() => {
    let protocol: any = window.location.protocol || null;
    let { hostname } = window.location;
    if (
      protocol !== null &&
      protocol !== undefined &&
      protocol === 'https:' &&
      protocol !== '' &&
      hostname === process.env.NEXT_PUBLIC_PRODUCTION_HOSTNAME
    ) {
      //@ts-ignore
      window.OneSignal = window.OneSignal || []; //@ts-ignore
      OneSignal.push(() => {
        //@ts-ignore
        OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APPID,
          safari_web_id: 'web.onesignal.auto.32f1a686-ea76-4ac6-93be-f9d8958aaa5a',
          notifyButton: {
            enable: true,
          },
        });
      });
    }
  }, []);

  // useEffect(() => storePathValues, [router.asPath]);

  // function storePathValues() {
  //   const storage = globalThis?.sessionStorage;
  //   if (!storage) return;
  //   // Set the previous path as the value of the current path.
  //   const prevPath = storage.getItem('currentPath');
  //   // @ts-ignore
  //   storage.setItem('prevPath', prevPath);
  //   // Set the current path value by looking at the browser's location object.
  //   storage.setItem('currentPath', globalThis.location.pathname);
  // }

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <FpjsProvider
        loadOptions={{
          apiKey: process.env.NEXT_PUBLIC_FPJSID || '',
        }}
      >
        <QueryClientProvider client={queryClient}>
          {/* <SessionProvider session={session}> */}
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
              styles={{
                Button: () => ({
                  label: {
                    fontWeight: 400,
                    color: 'black',
                  },
                }),
                TextInput: (theme) => ({
                  // filledVariant: {
                  //   '@media (min-width: 800px)': {
                  //     height: '60px !important',
                  //   },
                  // },
                  input: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                    'input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px white inset',
                      backgroundClip: 'text',
                    },
                  },
                }),
                // Card: (theme) = ({
                //   filledVariant : {
                //     backgroundColor : 'red'
                //   }
                // }),
                PasswordInput: (theme) => ({
                  filledVariant: {
                    // '@media (min-width: 800px)': {
                    //   height: '60px !important',
                    // },
                    input: {
                      height: '100%',
                    },

                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                    'input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px white inset',
                      backgroundClip: 'text',
                    },
                  },
                }),
              }}
              theme={{
                colorScheme,
                colors: {
                  primary: [
                    '#FDFAF2',
                    '#FBF7E9',
                    '#F8EED3',
                    '#F4E6BD',
                    '#F1DDA7',
                    '#EDD491',
                    '#E2BB50',
                    '#C59920',
                    '#846615',
                    '#42330B',
                  ],
                },
                dir: locale === 'ar-kw' ? 'rtl' : 'ltr',
                focusRing: 'never',
                shadows: {
                  shadow1: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                },
                primaryColor: 'primary',
                primaryShade: 5,
                fontFamily: "'Poppins', sans-serif",
                other: {
                  placeholderColor: '#ACB7CA',
                  headingColor: colorScheme === 'light' ? '#000000' : '#EDD491',
                  liyaToprimay: colorScheme === 'light' ? '#ACB7CA' : '#EDD491',
                  blueToPrimary: colorScheme === 'light' ? '#298EAE' : '#EDD491',
                  primaryToblack: colorScheme === 'light' ? '#000000' : '#EDD491',
                  activeLinkColor: '#EDD491',
                  secondaryWriteColor: '#666666',
                },
              }}
              withGlobalStyles
              withNormalizeCSS
              emotionOptions={
                locale === 'ar-kw'
                  ? { key: 'mantine-rtl', stylisPlugins: [rtlPlugin] }
                  : { key: 'mantine' }
              }
            >
              <DefaultSeo />
              <GlobalStyles />
              <NotificationsProvider position="top-right">
                <NextNProgress color="#E2BB50" options={{ showSpinner: false }} />
                {
                  //@ts-ignore
                  getLayout(
                    <AppContext.Provider
                    // value={{
                    //   tracker,
                    //   setTracker: setUserTracker,
                    // }}
                    >
                      <Component {...pageProps} />
                    </AppContext.Provider>
                  )
                }
              </NotificationsProvider>
              {upcomingDrawer && <UpcomingSettlements upcomingInstallments={upcoming} />}{' '}
            </MantineProvider>
          </ColorSchemeProvider>
          <ReactQueryDevtools />
          {/* </SessionProvider> */}
        </QueryClientProvider>
      </FpjsProvider>
    </>
  );
};

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
  locale: ctx.locale,
});

export default App;
