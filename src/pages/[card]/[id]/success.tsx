import { Button, Center, Container, Space, Stack, Text } from '@mantine/core';
import React from 'react';
import { Seo } from '@/components/seo';
import { useRouter } from 'next/router';
import NextImage from "next/image";
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';


const SuccessPage = () => {
  //language

const router = useRouter();
const t = router.locale === 'en-us' ? en : ar;

//language
  const { card } = router.query;
  const { id } = router.query;

  return (
    <>
      <Seo title="Checkout" description="Best LMS" path="checkout" />
      <main>
        <Space h="xl" />
        <Container>
          <Center>
            <Stack align="center" style={{ marginTop: '6rem' }}>
              <NextImage src="/assets/images/teacher-tana.svg" priority height={300} width={300} style={{ marginTop: '2rem', marginBottom: '2rem' }} />
              <Text>{t["purchase-completed"]}</Text>
              <Button
                radius={8}
                type="submit"
                size="md"
                variant="filled"
                sx={{ alignSelf: 'stretch', fontSize: '16px' }}
                onClick={() => {
                  router.replace(`/${card}/${id}`);
                }}
              >
                Enter to the {card === 'courses' ? 'course' : 'package'}
              </Button>
            </Stack>
          </Center>
        </Container>
      </main>
    </>
  );
};

export default SuccessPage;
