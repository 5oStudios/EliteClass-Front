import { Box, Button, Card, Divider, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import { Seperator } from './installment-card';
import momentWithTimeZone from 'moment-timezone';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const InvoiceCard = (props: any) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Card
        p={0}
        sx={{
          border: '1px solid #D8DFE9',
          overflow: 'visible',
        }}
        radius={8}
      >
        <Stack spacing={5} p={16}>
          <Group noWrap position="apart">
            <Text
              size="xs"
              transform="uppercase"
              sx={{
                color: '#939393',
              }}
            >
              {t.invoice.items}
            </Text>
            <Text
              size="xs"
              transform="uppercase"
              sx={{
                color: '#939393',
              }}
            >
              {t.invoice.price}
            </Text>
          </Group>
          <Group noWrap position="apart" sx={{ alignItems: 'flex-start' }}>
            <Stack sx={{ width: '65%' }}>
              <Text size="xs" weight={600}>
                {`${props?.invoiceData?.title}`}
              </Text>
            </Stack>
            <Text size="xs" weight={600}>
              {parseInt(props?.invoiceData?.grand_total || 0)} {t.invoice.amount}
            </Text>
          </Group>
          <Divider my={10} sx={{ borderColor: '#D8DFE9' }} />
          <Group position="apart">
            <Text sx={{ color: '#939393' }} size="xs">
              {t.invoice['user-name']}:
            </Text>
            <Text sx={{ color: '#939393' }} size="xs">
              {props?.invoiceData?.user_name}
            </Text>
          </Group>
          <Group position="apart">
            <Text sx={{ color: '#939393' }} size="xs">
              {t.invoice['order-id']}:
            </Text>
            <Text sx={{ color: '#939393' }} size="xs">
              {props?.invoiceData?.order_id}
            </Text>
          </Group>
          <Group position="apart">
            <Text sx={{ color: '#939393' }} size="xs">
              {t.invoice['transaction-id']}:
            </Text>
            <Text sx={{ color: '#939393' }} size="xs">
              {props?.invoiceData?.transaction_id}
            </Text>
          </Group>
          <Group position="apart">
            <Text sx={{ color: '#939393' }} size="xs">
              {t.invoice.created_at}
            </Text>
            <Text sx={{ color: '#939393' }} size="xs">
              {/* {props?.invoiceData?.created_at} */}
              {momentWithTimeZone
                .utc(props?.invoiceData?.created_at)
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format('D/MM/YYYY')}
            </Text>
          </Group>
        </Stack>
        <Seperator />
        <Stack spacing={5} p={16}>
          <Group position="apart">
            <Text sx={{ color: '#939393' }} size="xs">
              {t.invoice['payment-method']}
            </Text>
            <Text sx={{ color: '#939393' }} size="xs">
              {props?.invoiceData?.payment_method}
            </Text>
          </Group>

          {props?.invoiceData?.coupon != null ? (
            <Group position="apart">
              <Text sx={{ color: '#939393' }} size="xs">
                {t.invoice['coupon-discount']}
              </Text>
              <Text sx={{ color: '#939393' }} size="xs">
                -{parseInt(props?.invoiceData?.discount || 0)} {t.invoice.amount}
              </Text>
            </Group>
          ) : null}
          {props?.invoiceData?.coupon !== null ? (
            <Group position="apart">
              <Text sx={{ color: '#939393' }} size="xs">
                {t.invoice['coupon-id']}:
              </Text>
              <Text sx={{ color: '#939393' }} size="xs">
                {props?.invoiceData?.coupon}
              </Text>
            </Group>
          ) : null}

          <Divider my={10} sx={{ borderColor: '#D8DFE9' }} />
          <Group position="apart">
            <Text weight={500} size="xs">
              {t.invoice['total-amount']}:
            </Text>
            <Text weight={600} size="xs">
              {parseInt(props?.invoiceData?.amount || 0)} {t.invoice.amount}
            </Text>
          </Group>
        </Stack>
      </Card>
    </Box>
  );
};
