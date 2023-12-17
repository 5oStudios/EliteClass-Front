import { Seo } from '@/components/seo';
import { PageHeader } from '@/components/ui/pageHeader';
import { Videoplayer } from '@/components/ui/videoplayer';
import { HeartWithHand } from '@/src/constants/icons/HeartWithHand';
import { Box, Card, Container, SimpleGrid, Space, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';

const steps = [
  {
    title: 'Get +10 points',
    description: 'get status point if you subscribed to a course',
    path: '',
  },
  {
    title: 'Get +20 points',
    description: 'get status point if you finish one course',
    path: '/assets/images/success.png',
  },
  {
    title: 'Get +25 points',
    description: 'get status point if share the app to your friend',
    path: '/assets/images/trophy.png',
  },
  {
    title: 'Get +30 points',
    description: 'get status point if you pass the Quiz',
    path: '/assets/images/winner 1.png',
  },
];

export const HowToLearn = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  return (
    <div>
      <Seo
        title="How to earn"
        path="/user/how-to-earn"
        description="How to earn money in eliteclass"
      />
      <PageHeader title={t.Earn_more} />
      <Container>
        <Box mt={20}>
          <Videoplayer src="" />
        </Box>
        <Stack>
          <Text component="h1" weight={500}>
            {t.How_to_earn_credits}
          </Text>
          {steps.map((step, index) => (
            <Card py={3} radius={8} mt={-5}>
              <SimpleGrid
                spacing={10}
                sx={{
                  gridTemplateColumns: 'max-content 1fr',
                  alignItems: 'center',
                  justifyItems: 'start',
                }}
              >
                {index === 0 ? (
                  <HeartWithHand />
                ) : (
                  <Image src={step.path!} width={35} height={35} />
                )}

                <Stack spacing={0} justify="start">
                  <Text component="h2" size="xs" weight={500}>
                    {step.title}
                  </Text>
                  <Text component="p" mt={-5} size="xs" sx={{ color: '#939393' }}>
                    {step.description}
                  </Text>
                </Stack>
              </SimpleGrid>
            </Card>
          ))}
          <Space h={20} />
        </Stack>
      </Container>
    </div>
  );
};

export default HowToLearn;
