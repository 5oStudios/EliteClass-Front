import { Box, Container, Space, Stack } from '@mantine/core';
import React from 'react';
import { PageHeader } from '@/components/ui/pageHeader';
import { GetStaticProps } from 'next';
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
      <PageHeader title={t.privacy_policy} />
      <Container>
        <Stack mt={15} spacing={0}>
          <Box mt={-10} sx={(theme) => (theme.colorScheme === 'dark' ? { color: '#fff' } : { })} dangerouslySetInnerHTML={{ __html: data?.policy }} />
        </Stack>
        <Space h={50} />
      </Container>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (e: any) => {
  const { data } = await axiosServer.get('policy?secret=11f24438-b63a-4de2-ae92-e1a1048706f5', {
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

export default AboutusPage;
