import { /*getWalletBalance,*/ payInstallment } from '@/utils/axios/payment-apis';
import {
  Anchor,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const PayPendingInstallments = () => {
  const [paymentMethod, setPaymentMethod] = useState('KNET');
  const [walletBalance, setWalletBalance] = useState<any>();
  const [successModal, setSuccessModel] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const [submintLoader, setSubmitLoader] = useState(false);

  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const {
    id,
    title,
    amount,
    message,
    success,
    knet,
    knet_total,
    visa_master,
    visa_master_total,
    couponDiscount,
    total,
  } = router.query;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (success !== undefined && success !== null && success !== '') {
      setSuccessModel(true);
    }
  }, []);

  useEffect(() => {
    // getWalletBalance().then((res) => {
    //   setWalletBalance(res);
    // });
    setTimeout(() => {
      setWalletBalance({
        corrent_balance: '0.000',
        currency: 'KWD',
        currency_icon: 'دينار',
      });
    }, 1500);
  }, []);

  const mutate = useMutation(payInstallment, {
    retry: 0,
    onSuccess: (response) => {
      setSubmitLoader(false);
      if (paymentMethod !== 'wallet') {
        queryClient.removeQueries('payinstallment/upayment');
        const invoiceURL = response?.Data?.invoiceURL;
        console.log('Supposed to be redirect to pay invoice on :: ', invoiceURL);
        if (invoiceURL === null || invoiceURL === '' || invoiceURL === undefined) {
          if (response?.Data?.isDirectEnroll) {
            //this means the total pending isntallments got ZEROED so we are directly enrolling them, instead of redirecting to PG.
            showNotification({
              message: 'Installment Paid Successfully',
              color: 'teal',
            });
            queryClient.removeQueries('pending/instalments');
            router.back();
          } else {
            throw new Error('My footora return empty url');
          }
        } else {
          router.replace(invoiceURL);
        }
      } else if (paymentMethod === 'wallet') {
        showNotification({
          message: 'Installment Paid Successfully',
          color: 'teal',
        });
        queryClient.removeQueries('pending/instalments');
        router.back();
      }
    },
    onError: (error: any) => {
      setOpenConfirmModal(false);
      setSubmitLoader(false);
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
    },
  });

  const handleSubmit = () => {
    setSubmitLoader(true);
    mutate.mutate({ id: id as string, method: paymentMethod });
  };

  return (
    <div>
      <Modal
        opened={successModal}
        onClose={() => setSuccessModel(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{message}</Text>
            <Button
              id="btn-installmentClose"
              style={{
                width: '50%',
                alignSelf: 'center',
              }}
              variant="filled"
              onClick={() => {
                setSuccessModel(false);
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
              {t.close}
            </Button>
          </Stack>
        </Card>
      </Modal>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">
              {t.By_continuing_you_agree_to_the}{' '}
              <Link href="/terms-and-conditions" passHref>
                <Anchor color="blue" size="xs">
                  {t['terms-&-conditions']}
                </Anchor>
              </Link>
            </Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-agreeModalNo"
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
                id="btn-agreeModalYes"
                variant="filled"
                loading={submintLoader}
                onClick={() => {
                  handleSubmit();
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
      <Modal
        opened={openTopUpConfirmModal}
        onClose={() => setOpenTopUpConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t.Insufficient_balance}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-balanceModalCancel"
                variant="filled"
                onClick={() => {
                  setOpenTopUpConfirmModal(false);
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
                {t.Cancel}
              </Button>
              <Button
                id="btn-balanceModalRefill"
                variant="filled"
                onClick={() => {
                  router.push('/user/refill');
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
                {t['wallet-details'].refill}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Space h={30} />
      <Container>
        <Stack spacing="xl">
          <Stack spacing={5}>
            <Text>{t.title}</Text>
            <Title sx={{ fontSize: 24 }}>{title}</Title>
          </Stack>

          <Stack spacing={7}>
            <Text>{t.invoice['payment-method']}</Text>
            {!walletBalance ? (
              <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
            ) : (
              <Card radius={8}>
                <Group noWrap position="apart" sx={{ position: 'relative' }}>
                  <RadioGroup
                    size="sm"
                    orientation="vertical"
                    value={paymentMethod}
                    required
                    onChange={setPaymentMethod}
                    styles={{
                      label: {
                        fontSize: 12,
                      },
                    }}
                  >
                    <Radio id="rdb-pendingKnet" value="KNET" label={'KNET'} />
                    <Radio id="rdb-pendingVisaMaster" value="VISA/MASTER" label={'VISA/MASTER'} />
                    {/* <Radio value="wallet" label={t.booking['by-wallet']} /> */}
                    {/* 👆 Wallet has been removed from the app */}
                  </RadioGroup>
                  {/* {paymentMethod === 'wallet' && (
                    <Text
                      sx={{ alignSelf: 'end', position: 'absolute', right: 5, bottom: -7 }}
                      size="xs"
                    >
                      {parseInt(walletBalance?.corrent_balance)} {walletBalance?.currency}
                    </Text>
                  )} */}
                </Group>
              </Card>
            )}
          </Stack>

          <Stack spacing={5}>
            <Card radius={8}>
              <Group noWrap align="center" position="apart">
                <Text>{`${t['payment-charges']}:`}</Text>
                <Text>
                  {paymentMethod === 'KNET'
                    ? //@ts-ignore
                      parseFloat(knet).toFixed(3) || 0
                    : paymentMethod == 'VISA/MASTER'
                    ? //@ts-ignore
                      parseFloat(visa_master).toFixed(3) || 0
                    : 0}
                  KWD
                </Text>
              </Group>
              <Group noWrap align="center" position="apart">
                <Text>{t.amount}</Text>
                <Text>
                  {amount}
                  KWD
                </Text>
              </Group>
              <Group noWrap align="center" position="apart">
                <Text>{t['coupon-discounts']}</Text>
                <Text>
                  {couponDiscount}
                  KWD
                </Text>
              </Group>
              <Group noWrap align="center" position="apart">
                <Text>{t.Total_amount}</Text>
                <Text weight={600}>
                  {paymentMethod === 'KNET'
                    ? //@ts-ignore
                      parseFloat(knet_total).toFixed(3) || 0
                    : paymentMethod == 'VISA/MASTER'
                    ? //@ts-ignore
                      parseFloat(visa_master_total).toFixed(3) || 0
                    : //@ts-ignore
                      parseInt(total || 0)}
                  KWD
                </Text>
              </Group>
            </Card>
          </Stack>
          <Button
            size="md"
            radius={8}
            sx={{
              width: '300px',
              maxWidth: '100%',
              position: 'absolute',
              bottom: 20,
              left: 10,
              right: 10,
            }}
            mx="auto"
            // onClick={handleSubmit}
            onClick={() => setOpenConfirmModal(true)}
            loading={mutate.isLoading}
          >
            {t.continue}
          </Button>
        </Stack>
      </Container>
    </div>
  );
};
