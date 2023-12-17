import { Seo } from '@/components/seo';
import { PageHeader } from '@/components/ui/pageHeader';
import { DiscountIcon } from '@/src/constants/icons/discount';
import { MoneyIcon } from '@/src/constants/icons/Money';
import { Card, Container, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';

export const UseCredits = () => (
  <div>
    <Seo title="Use credits" description="use credits" path="/user/use-credits" />
    <PageHeader title="Use credits" />
    <Container mt={30}>
      <Stack>
        <Card py={3} radius={8} mt={-5}>
          <SimpleGrid
            spacing={10}
            sx={{
              gridTemplateColumns: 'max-content 1fr',
              alignItems: 'center',
              justifyItems: 'start',
            }}
          >
            <DiscountIcon />
            <Stack spacing={0} justify="start">
              <Text component="h2" size="xs" weight={500}>
                Get 10% discount By 60 points
              </Text>
              <Text component="p" mt={-5} size="xs" sx={{ color: '#939393' }}>
                discount cuppon by number of point
              </Text>
            </Stack>
          </SimpleGrid>
        </Card>
        <Card py={3} radius={8} mt={-5}>
          <SimpleGrid
            spacing={10}
            sx={{
              gridTemplateColumns: 'max-content 1fr',
              alignItems: 'center',
              justifyItems: 'start',
            }}
          >
            <MoneyIcon />
            <Stack spacing={0} justify="start">
              <Text component="h2" size="xs" weight={500}>
                500 points Equal 10KWD
              </Text>
              <Text component="p" mt={-5} size="xs" sx={{ color: '#939393' }}>
                Buy full course by credits point
              </Text>
            </Stack>
          </SimpleGrid>
        </Card>
      </Stack>
    </Container>
  </div>
);

export default UseCredits;
