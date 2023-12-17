import { Box, Container, Image, Text } from '@mantine/core';
import React from 'react';
import { Polygon } from '@/src/constants/icons';

export const SplashScreen3 = () => (
  <Container>
    <Box sx={{ position: 'absolute', right: 100 }}>
      <Polygon />
    </Box>
    <Image src="/assets/images/splash1.png" />
    <Text color="white" align="center" sx={{ fontSize: 32 }} weight={600}>
      dolor Lorem ipsum
    </Text>
    <Text color="white" align="center">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac aenean enim lectus
    </Text>
  </Container>
);
