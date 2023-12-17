import { Container, Space, TypographyStylesProvider } from '@mantine/core';
import React from 'react';
import { GetStaticProps } from 'next';
import { PageHeader } from '@/components/ui/pageHeader';
import { axiosServer } from '@/components/axios/axios-server';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

const AboutusPage = ({ data }: { data: any }) => {

    //language
    const router = useRouter();
    const t = router.locale === 'en-us' ? en : ar;
    //language

  return (
    <div>
      <PageHeader title={t.terms_and_conditions} />
      <Container>
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: data?.terms }} />
        </TypographyStylesProvider>
        <Space h={50} />
      </Container>
    </div>
  );
};
export default AboutusPage;

export const getStaticProps: GetStaticProps = async (e: any) => {
  const { data } = await axiosServer.get('terms?secret=11f24438-b63a-4de2-ae92-e1a1048706f5', {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': e?.locale?.split('-')[0],
    },
  });

  return {
    props: {
      data,
    },
    revalidate: 10,
  };
};
