import { Seo } from '@/components/seo';
import GiftIcon from '@/src/constants/icons/gift';
import {
  ActionIcon,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import authMiddleware from '@/src/authMiddleware';

export const CreditPoints = () => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  return (
    <div>
      <Seo
        title="Credit points"
        path="/user/credit-points"
        description="How to earn money in eliteclass"
      />
      <Container p={0}>
        <Card
          radius={0}
          sx={{
            height: 90,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
            paddingLeft: 10,
          }}
        >
          <Stack justify="end" sx={{ height: '100%' }}>
            <Group>
              <ActionIcon variant="transparent" onClick={() => router.back()} sx={{}}>
                <ArrowLeftIcon className="rtl" width={40} height={40} />
              </ActionIcon>
              <Text component="p">{t.Credit_points}</Text>
            </Group>
          </Stack>
        </Card>

        <Paper
          sx={{
            minHeight: 160,
            background:
              'linear-gradient(183.85deg, rgba(245, 181, 44, 0.8) -10.08%, rgba(245, 181, 44, 0) 90.85%)',
          }}
        >
          <Stack align="center" spacing={3} pt={10}>
            <Text sx={{ color: '#82B1CF' }} size="xl" weight={600}>
              500
            </Text>
            <Text
              transform="uppercase"
              sx={{
                color: '#82B1CF',
              }}
              size="sm"
              weight={600}
            >
              {t.Credits}
            </Text>
            <Divider
              sx={{ width: 220, maxWidth: '100%' }}
              mx="auto"
              label={<GiftIcon />}
              labelPosition="center"
            />
            <Text sx={{ color: '#82b1cf' }} size="sm">
              5KWD
            </Text>
          </Stack>
        </Paper>
        <Space h={30} />
        <Container>
          <SimpleGrid sx={{ gridTemplateColumns: '1fr 1fr' }}>
            <Card sx={{ gridColumn: 'span 2', cursor: 'pointer' }}>
              <Link href="/user/how-to-earn" passHref>
                <Text component="a">
                  <Stack align="center">
                    <Image src="/assets/images/learning 1.png" width={65} height={65} priority />
                    <Text>{t.Learn_how_to_earn}</Text>
                  </Stack>
                </Text>
              </Link>
            </Card>
            <Card>
              <Link href="/user/your-activity" passHref>
                <Text component="a" sx={{ cursor: 'pointer' }}>
                  <Stack align="center">
                    <Image src="/assets/images/activities 1.png" width={65} height={65} priority />
                    <Text>{t.your_activity}</Text>
                  </Stack>
                </Text>
              </Link>
            </Card>
            <Card>
              <Link href="/user/use-credits" passHref>
                <Text component="a" sx={{ cursor: 'pointer' }}>
                  <Stack align="center">
                    <Image src="/assets/images/finance 1.png" width={65} height={65} priority />
                    <Text>{t.use_Credits}</Text>
                  </Stack>
                </Text>
              </Link>
            </Card>
          </SimpleGrid>
        </Container>
        <Space h={70} />
      </Container>
    </div>
  );
};

export default authMiddleware(CreditPoints);
