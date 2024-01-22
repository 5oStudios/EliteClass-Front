import { Box, Container, SimpleGrid, Space } from '@mantine/core';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useEffect, useState } from 'react';
import { HomeContent } from '@/components/screens/home/home-content';
import { HomeHeader } from '@/components/screens/home/home-header';
import { Seo } from '@/components/seo';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { MainLayout } from '@/components/layouts/MainLayout';
import { getHomeContent } from '@/utils/axios/getHomeContent';
import { SearchResults } from '@/components/ui/search-results';
import { useRouter } from 'next/router';
import { UpcomingSettlements } from '@/components/drawers/upcoming-settlements';

export const HomePage = ({
  initialData,
  isSearchPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultsLoading, setResultLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(isSearchPage);
  const [params] = useState(router.asPath.split('?search=')[1] || '');

  useEffect(() => {
    if (params) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [params]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo
        title="Home"
        description="We believe that learning is an essential part of growth, so Never Stop Learning!"
        path="home"
      />
      <main>
        <Container p={0} fluid>
          <SimpleGrid spacing={0} sx={{ gridTemplateRows: 'max-content 1fr', height: '100vh' }}>
            <HomeHeader
              setIsLoading={setIsLoading}
              setResultLoading={setResultLoading}
              setData={setData}
              setShowSearchResults={setShowSearchResults}
              showSearchResults={showSearchResults}
              setSearchData={setSearchData}
              initialData={initialData}
            />
            <Box sx={{ height: 'calc(100vh - 145px)' }} pb={70}>
              <Space h={25} />
              {showSearchResults ? (
                <SearchResults searchData={searchData} resultsLoading={resultsLoading} />
              ) : (
                <HomeContent homeData={data} />
              )}
            </Box>
          </SimpleGrid>
        </Container>
        <UpcomingSettlements />
      </main>
    </>
  );
};

// @ts-ignore
HomePage.getLayout = (page) => (
  <>
    <MainLayout>{page}</MainLayout>
  </>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { guest_lang, access_token } = ctx.req.cookies;
  const { initial_country, initial_type, initial_stage, initial_major, isSkipTutorial } =
    ctx.req.cookies;
  const { search } = ctx.query;
  const lang: string = ctx?.locale?.split('-')[0].toString() || 'en';
  // router.push('/splash/next-step', '/splash/next-step', { locale: value });

  if (access_token === undefined) {
    if (guest_lang === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: '/splash',
        },
        props: {},
      };
    } else if (isSkipTutorial === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: '/splash/next-step',
        },
        props: {},
      };
    } else if (
      initial_country === undefined ||
      initial_type === undefined ||
      initial_stage === undefined ||
      initial_major === undefined
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/user/onboarding',
        },
        props: {},
      };
    }
  }

  try {
    const initialData = await getHomeContent({
      appSelectedLanguage: lang,
      cost: [0, 10000],
      rating: 'null',
      duration: [0, 500],
      search: search as string,
      auth: access_token,
      //@ts-ignore
      ...(access_token === undefined && {
        category_id: JSON.parse(initial_country).id,
      }),
      //@ts-ignore
      ...(access_token === undefined && {
        scnd_category_id: JSON.parse(initial_type).id,
      }),
      //@ts-ignore
      ...(access_token === undefined && {
        sub_category: JSON.parse(initial_stage).id,
      }),
      //@ts-ignore
      ...(access_token === undefined && {
        ch_sub_category: JSON.parse(initial_major).id,
      }),
    });

    return {
      props: {
        initialData,
        isSearchPage: !!search,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/user/onboarding',
      },
      props: {},
    };
  }
};

export default HomePage;
