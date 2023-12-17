import { Box, Center, Container, Text } from '@mantine/core';
import React from 'react';
import { Polygon } from '@/src/constants/icons';
import Image from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';


export const SplashScreen1 = () => {
  // language

  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;

  // language

  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  return (
    <Container>
      {/* <Box sx={{ position: 'absolute', right: 100 }}>
        <Polygon />
      </Box>
      <Center>
        <Box
          sx={{
            width: 300,
            height: 300,
          }}
          pt={40}
        >
          <Center>
            <Image
              src="/assets/images/splash1.svg"
              width={280}
              height={280}
              priority
              // style={{ margin: 'auto' }}
            />
          </Center>
        </Box>
      </Center> */}
      <Text color="black" align="center" sx={{ fontSize: 32 }} weight={600}>
        {t.Welcome_to_EliteClass}
      </Text>
      <Text color="#298EAE" align="center">
        {t.One_of_the_best_online_learning_platform}
      </Text>
    </Container>
  )
}
