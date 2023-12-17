import React, { useState } from 'react';
import {
  Space,
  Grid,
  Box,
  Radio,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Loader,
  RadioGroup,
  Modal,
  Anchor,
  SimpleGrid,
  Switch,
  Checkbox,
} from '@mantine/core';
import Link from 'next/link';
import axios from '@/components/axios/axios.js';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';

export default function PaymentSummary(props: any) {
  const router = useRouter();
  const [refetchCart, setFetchCart] = useState(false);
  const t = router.locale === 'en-us' ? en : ar;
  const [paymentMethod, setPaymentMethod] = useState('KNET');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [submintLoader, setSubmitLoader] = useState(false);
  const [screenLoader, setScreenLoader] = React.useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const onPurchase = () => {
    let obj = {
      payment_method: paymentMethod,
    };
    setScreenLoader(true);
    setSubmitLoader(true);
    const config = {
      method: 'post',
      url: 'payinstallment/upayment',
      data: obj,
    };
    axios(config)
      .then((response) => {
        setTimeout(() => {
          setScreenLoader(false);
        }, 10000);
        //setSubmitLoader(false);
        if (paymentMethod === 'KNET' || paymentMethod === 'VISA/MASTER') {
          setFetchCart(!refetchCart);
          const invoiceURL = response?.data?.Data?.invoiceURL;
          if (invoiceURL === null || invoiceURL === '' || invoiceURL === undefined) {
            if (response?.data?.Data.isDirectEnroll === true) {
              //This means that the invoice value got zeroed due to Coupons and we cannot move towards Payment Gateway, because there is no payment gateway that will process a transaction for ZERO amount.
              router.replace('/user/success');
            }
            throw new Error('Payment Gateway URL is empty, cannot process this transaction');
          } else {
            router.replace(invoiceURL);
          }
        } else {
          throw new Error(
            'We only have 2 method of payment, Right now the program has reached third condition.'
          );
        }
      })
      .catch((error) => {
        setScreenLoader(false);
        setSubmitLoader(false);
        setOpenConfirmModal(false);
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else if (error?.response?.status == 402) {
          showNotification({ message: 'Low balance.', color: 'red' });
          setOpenTopUpConfirmModal(true);
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
      });
  };

  return (
    <>
      <Group className="paymentAndSummary">
        <Text
          sx={{
            padding: '0.3rem',
            fontSize: '1.5rem',
          }}
        >
          {t.invoice['payment-method']}
        </Text>
        <Card radius={8} sx={{ backgroundColor: '#F7F6F5', width: '100%' }}>
          <Group noWrap position="apart" className="paymentMethod">
            <Button
              id="btn-paymentVisaMaster"
              onClick={() => setPaymentMethod('VISA/MASTER')}
              className={paymentMethod == 'VISA/MASTER' ? 'togglebtn' : 'unSelect'}
            >
              VISA/MASTER
            </Button>
            <Button
              id="btn-paymentKnet"
              onClick={() => setPaymentMethod('KNET')}
              className={paymentMethod === 'KNET' ? 'togglebtn' : 'unSelect'}
            >
              KNET
            </Button>
          </Group>
        </Card>
        <Space />
        <Stack spacing={5} className="summaryMain">
          <Text
            sx={{
              padding: '0rem 0.5rem',
              fontSize: '1.5rem',
            }}
          >
            {t.summary}
          </Text>
          <Card radius={8} sx={{ backgroundColor: '#F7F6F5' }}>
            <Group position="apart">
              <Text size="xs" sx={{ color: '#298EAE' }}>
                {t['original-price']}
              </Text>
              <Group spacing={3}>
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  {/* {`${parseInt(data on the props?.price_total || 0)}`} */}
                </Text>
              </Group>
              <Text size="xs" sx={{ color: '#298EAE' }}>
                {`${props?.paymentData?.total_amount} KWD`}
              </Text>
            </Group>
            <Group position="apart">
              <Text size="xs" sx={{ color: '#298EAE' }}>
                {t['coupon-discounts']}
              </Text>
              <Group spacing={3}>
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  {parseInt(props?.paymentData?.coupon_discount || 0)}
                </Text>
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  KWD
                </Text>
              </Group>
            </Group>

            <Group position="apart">
              <Text size="xs" sx={{ color: '#298EAE' }}>
                {t['payment-charges']}
              </Text>
              <Group spacing={3}>
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  {paymentMethod == 'KNET'
                    ? props?.paymentData?.knet || 0
                    : paymentMethod == 'VISA/MASTER'
                    ? props?.paymentData?.visa_master || 0
                    : 0}
                </Text>
                <Text size="xs" sx={{ color: '#298EAE' }}>
                  KWD
                </Text>
              </Group>
            </Group>

            <Space h="md" />
            <Divider />

            <Group position="apart">
              <Text size="xs" sx={{ color: '#000000' }}>
                {t.total}
              </Text>
              <Group spacing={3}>
                <Text size="xs" sx={{ color: '#000000' }} weight={500}>
                  {paymentMethod === 'KNET'
                    ? props?.paymentData?.knet_total || 0
                    : paymentMethod == 'VISA/MASTER'
                    ? props?.paymentData?.visa_master_total || 0
                    : props?.paymentData?.knet_total || 0}
                </Text>
                <Text size="xs" sx={{ color: '#000000' }} weight={500}>
                  {`KWD`}
                </Text>
              </Group>
            </Group>
          </Card>
          <Button
            id="btn-purchaseComplete"
            onClick={() => setOpenConfirmModal(true)}
            size="md"
            mt={10}
            sx={{ backgroundColor: '#298EAE', borderRadius: '20px' }}
            radius={8}
          >
            <Text sx={{ color: '#fff' }}>{t.complete_purchase}</Text>
          </Button>
        </Stack>

        <Modal
          opened={openConfirmModal}
          onClose={() => setOpenConfirmModal(true)}
          withCloseButton={false}
          centered
        >
          <Card>
            <Stack>
              <Text align="center">
                {t.By_continuing_you_agree_to_the}
                <Link href="/terms-and-conditions">
                  <Anchor
                    color="blue"
                    size="xs"
                    style={{
                      display: 'block',
                    }}
                  >
                    {t['terms-&-conditions']}
                  </Anchor>
                </Link>
              </Text>
              <SimpleGrid cols={2}>
                <Button
                  id="btn-purchaseNo"
                  variant="filled"
                  onClick={() => {
                    setOpenConfirmModal(false);
                  }}
                  radius={20}
                  styles={{
                    filled: {
                      background: '#EDF2F7',
                      '&:hover': {
                        background: '#EDF2F7',
                      },
                    },
                    label: {
                      color: 'black',
                    },
                  }}
                >
                  {t.no}
                </Button>
                <Button
                  id="btn-purchaseYes"
                  variant="filled"
                  loading={submintLoader}
                  onClick={() => {
                    setOpenConfirmModal(true);
                    onPurchase();
                    // setPaymentModal(false);
                    // const link = document.getElementById('continue');
                    // //@ts-ignore
                    // link.click();
                  }}
                  radius={20}
                  styles={{
                    filled: {
                      background: '#FF3030',
                      '&:hover': {
                        background: '#FF3030',
                      },
                    },
                    label: {
                      color: 'white',
                    },
                  }}
                >
                  {t.yes}
                </Button>
              </SimpleGrid>
            </Stack>
          </Card>
        </Modal>
      </Group>
    </>
  );
}
