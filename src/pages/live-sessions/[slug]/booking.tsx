import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Group,
  Modal,
  Portal,
  Radio,
  RadioGroup,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import { liveCarousalData } from '@/src/constants/data/carousal-data';
import { Seo } from '@/components/seo';
import { LiveSessionCard } from '@/components/ui/cards/live-session-card';
import axios from '@/components/axios/axios.js';
import { CouponCard } from '@/components/ui/cards/coupon-card';
import { CouponIcon } from '@/src/constants/icons';
import { NoRecordFound } from '@/components/ui/no-record-found';
import Link from 'next/link';
import { showNotification } from '@mantine/notifications';
import { PageHeader } from '@/components/ui/pageHeader';
import { useQuery, useQueryClient } from 'react-query';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import authMiddleware from '@/src/authMiddleware';

export const CheckoutPage = () => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language

  const { slug, success, message, type } = router.query;
  const [walletBalance, setWalletBalance] = useState<any>();
  const [paymentMethod, setPaymentMethod] = React.useState<string>('full');
  const [paymentCard, setPaymentCard] = React.useState<string>('card');
  const [coupon, setCoupon] = React.useState<string>('');
  const [couponData, setCouponData] = useState<any | null>();
  const [couponresponse, setCouponResponse] = React.useState<any | null>({
    discount_amount: '0',
    coupon_id: '',
    pay_amount: '',
    total_amount: '',
  });

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const [successModal, setSuccessModel] = useState(false);
  const [submintLoader, setSubmitLoader] = useState(false);

  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [orignalPrice, setOrignalPrice] = React.useState<number>(0);
  const [sessiondetailonbooking, setSessionDetailOnBooking] = React.useState<any>([]);
  const [liveCarousalData, setLiveCarousalData] = React.useState<any>();
  const [openCouponeDrawer, setOpenCouponeDrawer] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCouponAllow, setIsCouponAllow] = React.useState<boolean>(false);
  const [couponCode, setCouponCode] = React.useState<string>('');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitLoader(true);
    console.log({ paymentCard, paymentMethod, coupon });
    console.log('Pay Via::', paymentCard);
    // throw new Error("Pay Via::");
    const obj = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      txn_id: 'ds43wehg789h8y8b987y',
      payment_method: paymentCard,
      payment_type: paymentMethod,
      meeting_id: slug,
      ...(isCouponAllow && { coupon: couponCode }),
    };

    const config = {
      method: 'post',
      url: paymentCard === 'card' ? 'order2' : 'order',
      data: obj,
    };

    try {
      const response = await axios(config);
      console.log(response);
      setSubmitLoader(false);
      if (paymentCard === 'card') {
        const invoiceURL = response?.data?.Data?.invoiceURL;
        console.log('Supposed to be redirect to pay invoice on :: ', invoiceURL);
        //throw new Error('Handel payment via card please');
        if (invoiceURL === '' || invoiceURL === undefined || invoiceURL === null) {
          throw new Error('My footora return empty url');
        } else {
          router.replace(invoiceURL);
        }
      } else if (paymentCard === 'wallet') {
        router.replace({
          pathname: '/live-sessions/[slug]/success',
          query: router.query,
        });
      } else {
        throw new Error(
          'We only have 2 method of payment, Right now the program has reached third condition.'
        );
      }
    } catch (error: any) {
      console.log(error);
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
    }
  };

  useEffect(() => {
    //console.log("SLUG_TYPE:", type)
    if (slug) {
      axios
        .get(`meeting/detail/${slug}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`)
        .then((response) => {
          console.log('sessions-details', response);
          setSessionDetailOnBooking(response?.data);
          setLiveCarousalData({
            id: response?.data?.id,
            meeting_title: response?.data?.meeting_title,
            image: response?.data?.image,
            instructor: response?.data?.instructor?.name,
            date_time: response?.data?.date_time,
            price: response?.data?.price,
          });
          setOrignalPrice(
            parseInt(response?.data?.discount_price) >= 0
              ? response?.data?.discount_price
              : response?.data?.price
          );
          setTotalPrice(
            parseInt(response?.data?.discount_price) >= 0
              ? response?.data?.discount_price
              : response?.data?.price
          );

          let priceLocalNow =
            parseInt(response?.data?.discount_price) >= 0
              ? response?.data?.discount_price
              : response?.data?.price;

          //Compareing directly because react is defering the setOrignalPrice() for later...
          //Already wasted alot of time on this...
          //This check was supposed to be implemented by Mudassar Ali, yet here I am doin it now, this runied my weekend! 😭

          if (priceLocalNow === 0 || priceLocalNow === '0') {
            setPaymentCard('wallet');
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.log('sessions-details', error);
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
        });

      const couponcofig = {
        method: 'get',
        url: `coupons?meeting_id=${slug}`,
      };
      axios(couponcofig)
        .then((response) => {
          console.log('coupon data', response);
          // setCouponData(response?.data?.data);
          setCouponData(response?.data);
        })
        .catch((error) => {
          console.log('coupon data', error);
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
        });
    }
    if (success !== undefined && success !== null && success !== '' && success == '0') {
      setSuccessModel(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get('wallet/balance')
      .then((res) => {
        setWalletBalance(res.data);
      })
      .catch((error) => {
        console.log(error);
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
      });
  }, []);

  useEffect(() => {
    setOrignalPrice(couponresponse?.total_amount);
    setTotalPrice(couponresponse?.pay_amount);
    if (couponresponse?.coupon_id != '') {
      setIsCouponAllow(true);
    }
  }, [couponresponse]);

  return (
    <>
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
                id="btn-bookingliveModalCancel"
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
                id="btn-bookingliveModalRefill"
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
              id="btn-bookingliveSuccessModalClose"
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

      <Seo title="Checkout" description="Best LMS" path="checkout" />
      <PageHeader title="Checkout" />
      <Space h="xl" />
      <ScrollArea scrollbarSize={10} sx={{ height: '100vh' }}>
        <Container>
          <Stack>
            {isLoading ? (
              <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
            ) : (
              <Box sx={{ cursor: 'pointer' }}>
                <LiveSessionCard
                  id={slug}
                  href={`live-sessions/${slug}`}
                  show_price={false}
                  layoutGrid={false}
                  {...liveCarousalData}
                />
              </Box>
            )}
          </Stack>
        </Container>
        <Space h="xl" />
        <form onSubmit={handleFormSubmit}>
          <Container>
            <Stack>
              <Stack spacing={5}>
                <Text>{t.booking['payment-type']}</Text>
                {isLoading ? (
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                ) : (
                  <Card radius={8}>
                    <RadioGroup
                      size="sm"
                      required
                      orientation="vertical"
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      name="payment_method"
                      styles={{
                        label: {
                          fontSize: 12,
                        },
                      }}
                    >
                      <Radio
                        id="rdb-bookingFullPayment"
                        value="full"
                        label={t.booking['full-payment']}
                      />
                    </RadioGroup>
                  </Card>
                )}
              </Stack>
              <Stack spacing={5}>
                <Text>{t.booking['payment-method']}</Text>
                {isLoading ? (
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                ) : (
                  <Card radius={8}>
                    <Group noWrap position="apart" sx={{ position: 'relative' }}>
                      <RadioGroup
                        size="sm"
                        orientation="vertical"
                        value={paymentCard}
                        required
                        onChange={setPaymentCard}
                        styles={{
                          label: {
                            fontSize: 12,
                          },
                        }}
                      >
                        {orignalPrice != 0 ? (
                          <Radio id="rdb-byCard" value="card" label={t.booking.card} />
                        ) : null}
                        <Radio id="rdb-byWallet" value="wallet" label={t.booking['by-wallet']} />
                      </RadioGroup>
                      {paymentCard === 'wallet' && (
                        <Text
                          sx={{
                            alignSelf: 'end',
                            position: 'absolute',
                            right: 5,
                            bottom: orignalPrice != 0 ? -3 : 0,
                          }}
                          size="xs"
                        >
                          {walletBalance?.corrent_balance} {walletBalance?.currency}
                        </Text>
                      )}
                    </Group>
                  </Card>
                )}
              </Stack>

              <Portal>
                <Drawer
                  position="right"
                  opened={openCouponeDrawer}
                  onClose={() => setOpenCouponeDrawer(false)}
                  size="100%"
                  withCloseButton={false}
                  styles={{
                    drawer: {
                      background: '#F4F9FE',
                    },
                  }}
                >
                  <Container p={0}>
                    <Card
                      radius={0}
                      sx={{
                        minHeight: 70,
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
                        paddingLeft: 10,
                      }}
                    >
                      <Group mt={5}>
                        <ActionIcon
                          variant="transparent"
                          onClick={() => setOpenCouponeDrawer(false)}
                        >
                          <ArrowLeftIcon className="rtl" width={40} height={40} />
                        </ActionIcon>
                        <Text>{t.coupon_code}</Text>
                      </Group>
                    </Card>
                  </Container>
                  <Container sx={{ maxHeight: '90vh', overflow: 'scroll' }}>
                    <Space h={20} />
                    <Stack sx={{ height: '100%' }}>
                      {couponData != '' ? (
                        couponData?.map((couponItem: any, index: number) => (
                          <CouponCard
                            couponData={couponItem}
                            order_id={slug}
                            order="meeting"
                            setCouponResponse={setCouponResponse}
                            setCouponCode={setCouponCode}
                            setOpenCouponeDrawer={setOpenCouponeDrawer}
                          />
                        ))
                      ) : (
                        <NoRecordFound />
                      )}
                    </Stack>
                  </Container>
                </Drawer>
              </Portal>
              {!orignalPrice ? (
                <Skeleton height={45} width="100%" sx={{ opacity: 0.5 }} radius={8} />
              ) : orignalPrice > 0 && couponData != '' ? (
                <Button
                  variant="outline"
                  size="md"
                  radius={8}
                  sx={{
                    width: '100%',
                    maxWidth: '300px',
                    margin: 'auto',
                    border: '2px dashed #ACB7CA',
                  }}
                  styles={{
                    label: {
                      color: '#ACB7CA',
                    },
                  }}
                  onClick={() => setOpenCouponeDrawer(true)}
                >
                  <CouponIcon />
                  <Text ml={20}>{t.booking['apply-coupon']}</Text>
                </Button>
              ) : null}
            </Stack>
            <Space h="md" />
            <Stack spacing={5}>
              <Text>{t.summary}</Text>
              <Card radius={8}>
                <Group position="apart">
                  <Text size="xs" sx={{ color: '#666666' }}>
                    {t['original-price']}
                  </Text>
                  <Text size="xs" sx={{ color: '#666666' }}>
                    {!orignalPrice && <Skeleton width={50} height={20} radius={8} />}
                    {orignalPrice && (orignalPrice == 0 ? 'FREE' : `${orignalPrice}KWD`)}
                  </Text>
                </Group>

                {orignalPrice > 0 && isCouponAllow ? (
                  <Group position="apart">
                    <Text size="xs" sx={{ color: '#666666' }}>
                      {t['coupon-discounts']}
                    </Text>
                    <Text size="xs" sx={{ color: '#666666' }}>
                      {/* coupon  */}
                      {parseInt(couponresponse?.discount_amount) > 0
                        ? couponresponse?.discount_amount
                        : 0}
                      KWD
                    </Text>
                  </Group>
                ) : null}

                <Space h="md" />
                <Divider />

                <Group position="apart">
                  <Text size="xs" sx={{ color: '#666666' }}>
                    {t.total}
                  </Text>
                  <Text size="xs" sx={{ color: '#666666' }}>
                    {/* orignal - coupon */}
                    {!orignalPrice && <Skeleton width={50} height={20} radius={8} mt={2} />}
                    {orignalPrice && (orignalPrice == 0 ? 'FREE' : `${totalPrice}KWD`)}
                  </Text>
                </Group>
              </Card>
            </Stack>
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
                      id="btn-bookingliveTermModalNo"
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
                      id="btn-bookingliveTermModalYes"
                      variant="filled"
                      loading={submintLoader}
                      onClick={() => {
                        const link = document.getElementById('continue');
                        //@ts-ignore
                        link.click();
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
            {!isLoading && (
              <Stack spacing={5}>
                <Space h="md" />
                <Button onClick={() => setOpenConfirmModal(true)} size="md" radius={8}>
                  {t.continue}
                </Button>
                <Button id="continue" hidden type="submit" size="md" radius={8} />
              </Stack>
            )}
            <Space h="md" />
          </Container>
        </form>
      </ScrollArea>
    </>
  );
};

export default authMiddleware(CheckoutPage);
