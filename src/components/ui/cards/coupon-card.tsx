import { ActionIcon, Box, Card, Group, Stack, Text } from '@mantine/core';
import axios from '@/components/axios/axios.js';
import React from 'react';
import { showNotification } from '@mantine/notifications';
import moment from 'moment-timezone';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';

export const CouponCard = (props: any) => {
  //language

const router = useRouter();
const t = router.locale === 'en-us' ? en : ar;

//language
  function applyCoupon(couponCode: string) {
    const obj = {
      secret: 'e01f5695-8777-4bc4-beb4-e910942fbee3',
      coupon: couponCode,
      order_id: props?.order_id,
      order: props?.order,
    };
    const config = {
      method: 'post',
      url: 'apply/coupon/order',
      data: obj,
    };
    axios(config)
      .then((response) => {
        showNotification({ message: 'Sucessfuly coupon applied.', color: 'green' });
        console.log('apply coupon', response);
        props?.setCouponResponse(response?.data);
        props?.setCouponCode(couponCode);
        props?.setOpenCouponeDrawer(false);
      })
      .catch((error) => {
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          let err = error?.response?.data?.errors;
          if (err) {
            Object.keys(err).map((i) => {
              err[i].map((item: any) => {
                showNotification({
                  message: item,
                  color: 'red',
                });
              });
            });
          }
        }
        props?.setOpenCouponeDrawer(false);
      });
  }

  return (
    <Box sx={{ overflow: 'hidden' }} onClick={() => applyCoupon(props?.couponData?.code)}>
      <Card
        sx={{
          border: '1px solid #D8DFE9',
          overflow: 'visible',
        }}
        radius={8}
      >
        <Box
          sx={{
            width: '20px',
            height: '20px',
            borderradius: '50%',
            background: '#F4F9FE',
            borderRadius: '100%',
            position: 'absolute',
            zIndex: 30,
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: '1px solid #D8DFE9',
          }}
        />
        <Stack>
          <Group noWrap position="apart">
            <Text size="xs">
              {props?.couponData?.type === 'fix'
                ? 'Coupon discount amount:'
                : 'Coupon discount percentage:'}{' '}
            </Text>
            <Text size="xs" weight={500}>
              {props?.couponData?.type === 'fix'
                ? `${props?.couponData?.amount} ${t.amount}`
                : `${props?.couponData?.amount}% ${t.discount}`}
            </Text>
          </Group>
          <Group position="apart">
            <Group spacing={4}>
              <Text sx={{ fontSize: 9 }}>
                {t.valid_until}
              </Text>
              <Text sx={{ color: '#939393', fontSize: 9 }}>
                {moment.utc(props?.couponData?.expirydate).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('D/MM/YYYY')}
              </Text>
            </Group>
            <Text sx={{ fontSize: 9 }}>{props?.couponData?.code}</Text>
            <ActionIcon variant="transparent" mr={10} sx={{ color: '#82B1CF' }}>
              {t.apply}
            </ActionIcon>
          </Group>
        </Stack>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            borderradius: '50%',
            background: '#F4F9FE',
            borderRadius: '100%',
            position: 'absolute',
            zIndex: 30,
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: '1px solid #D8DFE9',
          }}
        />
      </Card>
    </Box>
  );
};
