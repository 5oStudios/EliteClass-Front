import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
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
import { Seo } from '@/components/seo';
import { CheckboxLabel } from '@/components/ui/checkbox-label';
import { PackagesCard } from '@/components/ui/cards/packages-card';
import { CoursesCard } from '@/components/ui/cards/courses-card';
import axios from '@/components/axios/axios.js';
import { CouponIcon } from '@/src/constants/icons';
import { CouponCard } from '@/components/ui/cards/coupon-card';
import { showNotification } from '@mantine/notifications';
import { NoRecordFound } from '@/components/ui/no-record-found';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/pageHeader';
import momentWithTimeZone from 'moment-timezone';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';

export const CheckoutPage = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { card, success, id, message } = router.query;

  const [paymentMethod, setPaymentMethod] = React.useState<string>('full');
  const [paymentCard, setPaymentCard] = React.useState<string>('card');

  // -------------coupon--------

  const [isCouponAllow, setIsCouponAllow] = React.useState<boolean>(false);
  const [openCouponeDrawer, setOpenCouponeDrawer] = React.useState<boolean>(false);
  const [couponresponse, setCouponResponse] = React.useState<any | null>({
    discount_amount: '0',
    coupon_id: '',
    pay_amount: '',
    total_amount: '',
  });
  const [couponData, setCouponData] = useState<any | null>();
  const [couponCode, setCouponCode] = React.useState<string>('');
  const [couponButton, setCouponButton] = React.useState<boolean>(false);

  // -------------coupon--------

  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [orignalPrice, setOrignalPrice] = React.useState<number>(0);
  const [detailsBooking, setBookingDetails] = React.useState<any>([]);

  // set courses card data
  const [coursesCardData, setCoursesCardData] = React.useState<any>(null);
  // set packages card data
  const [packagesCardData, setPackagesCardData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secondInstallment, setSecondInstallment] = useState<any>();
  const [counter, setCounter] = useState<any>();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const [successModal, setSuccessModel] = useState(false);

  const [walletBalance, setWalletBalance] = useState<any>();

  const [payInstallment, setPayInstallment] = useState<string[]>([]);

  const [submintLoader, setSubmitLoader] = useState(false);

  useEffect(() => {
    if (card === 'packages') {
      const config = {
        method: 'get',
        url: `bundle/detail/${id}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`,
      };

      axios(config)
        .then((response) => {
          console.log('package checkout', response);
          setPackagesCardData({
            id: response?.data?.id,
            title: response?.data?.title,
            image: response?.data?.image,
            in_wishlist: response?.data?.in_wishlist,
            total_courses: response?.data?.total_courses,
            price: response?.data?.price,
            discount_price: response?.data?.discount_price,
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

          setBookingDetails(response?.data);
          setSecondInstallment(response?.data?.instalments?.[1]?.id + '');
          setPayInstallment([response?.data?.instalments?.[0]?.id + '']);
          setCounter(response?.data?.instalments);

          let priceLocalNow =
            parseInt(response?.data?.discount_price) >= 0
              ? response?.data?.discount_price
              : response?.data?.price;

          //ZK: Compareing directly because react is defering the setOrignalPrice() for later...
          //Already wasted alot of time on this...
          //This check was supposed to be implemented by Mudassar Ali, yet here I am doin it now, this runied my weekend! 😭

          if (priceLocalNow === 0 || priceLocalNow === '0') {
            setPaymentCard('wallet');
            console.log('FIEJFJ');
          }

          setIsLoading(false);
        })
        .then((error) => {
          console.log('package checkout', error);
        });

      const couponcofig = {
        method: 'get',
        url: `coupons?bundle_id=${id}`,
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
    if (card === 'courses') {
      const obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        course_id: id,
      };

      const config = {
        method: 'post',
        url: 'course/detail/',
        data: obj,
      };
      axios(config)
        .then((response) => {
          console.log('courses checkout', response);
          setCoursesCardData({
            id: response?.data?.course?.id,
            title: response?.data?.course?.title,
            image: response?.data?.course?.image,
            in_wishlist: response?.data?.course?.in_wishlist,
            instructor: response?.data?.instructor?.name,
            rating: response?.data?.total_rating,
            reviews_by: response?.data?.avg_rating,
            lessons: response?.data?.course?.lessons,
          });
          setOrignalPrice(
            parseInt(response?.data?.course?.discount_price) >= 0
              ? response?.data?.course?.discount_price
              : response?.data?.course?.price
          );
          setTotalPrice(
            parseInt(response?.data?.course?.discount_price) >= 0
              ? response?.data?.course?.discount_price
              : response?.data?.course?.price
          );
          setBookingDetails(response?.data);
          setSecondInstallment(response?.data?.course?.instalments?.[1]?.id + '');
          setPayInstallment([response?.data?.course?.instalments?.[0]?.id + '']);
          setCounter(response?.data?.course?.instalments);

          let priceLocalNow =
            parseInt(response?.data?.course?.discount_price) >= 0
              ? response?.data?.course?.discount_price
              : response?.data?.course?.price;

          //ZK: Compareing directly because react is defering the setOrignalPrice() for later...
          //Already wasted alot of time on this...
          //This check was supposed to be implemented by Mudassar Ali, yet here I am doin it now, this runied my weekend! 😭

          if (priceLocalNow === 0 || priceLocalNow === '0') {
            setPaymentCard('wallet');
          }

          setIsLoading(false);
        })
        .then((error) => {
          console.log('courses checkout', error);
        });

      const couponcofig = {
        method: 'get',
        url: `coupons?course_id=${id}`,
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
    if (paymentMethod === 'full') {
      setTotalPrice(orignalPrice);
      setCouponButton(true);
      if (couponresponse?.coupon_id != '') {
        setIsCouponAllow(true);
      }
    } else {
      setCouponButton(false);
      setIsCouponAllow(false);
      if (card === 'courses') {
        setTotalPrice(parseInt(detailsBooking?.course?.instalments?.[0]?.amount));
      } else {
        setTotalPrice(parseInt(detailsBooking?.instalments?.[0]?.amount));
      }
    }
  }, [paymentMethod]);

  // for coupon
  useEffect(() => {
    setOrignalPrice(couponresponse?.total_amount);
    setTotalPrice(couponresponse?.pay_amount);
    if (couponresponse?.coupon_id != '') {
      setIsCouponAllow(true);
    }
  }, [couponresponse]);

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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let obj;
    setSubmitLoader(true);
    if (card === 'packages') {
      obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        txn_id: 'ds43wehg789h8y8b987y',
        payment_method: paymentCard,
        payment_type: paymentMethod,
        ...(paymentMethod === 'instalment' && { instalments: payInstallment }),
        bundle_id: id,
        ...(isCouponAllow && { coupon: couponCode }),
      };
    }
    if (card === 'courses') {
      obj = {
        secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
        txn_id: 'ds43wehg789h8y8b987y',
        payment_method: paymentCard,
        payment_type: paymentMethod,
        ...(paymentMethod === 'instalment' && { instalments: payInstallment }),
        course_id: id,
        ...(isCouponAllow && { coupon: couponCode }),
      };
    }
    const config = {
      method: 'post',
      url: paymentCard === 'card' ? 'order2' : 'order',
      data: obj,
    };

    axios(config)
      .then((response) => {
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
            pathname: '/[card]/[id]/success',
            query: {
              card,
              id,
            },
          });
        } else {
          throw new Error(
            'We only have 2 method of payment, Right now the program has reached third condition.'
          );
        }
      })
      .catch((error) => {
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
      });

    console.log({ paymentCard, paymentMethod });
  };

  console.log('DATAAAA:', coursesCardData);
  useEffect(() => {
    if (counter != undefined) {
      let count = 0;
      payInstallment.map((item: any) => {
        for (let index = 0; index < counter.length; index++) {
          const element = counter[index];
          if (element.id == item) {
            count += parseInt(element.amount);
          }
        }
      });
      setTotalPrice(count);
    }
  }, [payInstallment]);

  function setChanges(params: any) {
    if (!params.includes(secondInstallment) && params.length == 2 && payInstallment.length != 3) {
      showNotification({
        message: 'You have to select previous instalment in order to select this one',
        color: 'red',
      });
    }
    if (params.includes(secondInstallment) && params.length <= 3) {
      setPayInstallment(params);
    } else if (params.length == 1 && !params.includes(secondInstallment)) {
      setPayInstallment(params);
    } else if (params.length == 2 && !params.includes(secondInstallment)) {
      setPayInstallment([params[0]]);
    }
  }

  return (
    <Box>
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
                id="btn-InsufficientModalCancel"
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
                id="btn-InsufficientModalRefill"
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
              id="btn-bookingSuccessModalClose"
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

      <Seo title="Checkout" description="Best LMS" path={`${card}/${id}/booking`} />
      <ScrollArea sx={{ height: '100vh' }} scrollbarSize={10}>
        <PageHeader title={t.checkout} />
        <Space h="xl" />
        <Container>
          <Stack>
            {isLoading ? (
              <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
            ) : (
              <Box sx={{ cursor: 'pointer' }}>
                {card === 'packages' && (
                  <PackagesCard
                    id={id as string}
                    layoutGrid={false}
                    href={`/${card}/${id}`}
                    // in_wishlist={packagesCardData?.in_wishlist}
                    image={packagesCardData?.image}
                    title={packagesCardData?.title}
                    price={packagesCardData?.price}
                    total_courses={packagesCardData?.total_courses}
                    discount_price={packagesCardData?.discount_price}
                  />
                )}
                {card === 'courses' && (
                  <CoursesCard
                    id={id as string}
                    layoutGrid={false}
                    href={`/${card}/${id}`}
                    // in_wishlist={coursesCardData?.in_wishlist}
                    image={coursesCardData?.image}
                    title={coursesCardData?.title}
                    rating={coursesCardData?.rating}
                    lessons={coursesCardData?.lessons}
                    instructor={coursesCardData?.instructor}
                    reviews_by={coursesCardData?.reviews_by}
                  />
                )}
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
                  <Card radius={8} sx={{ backgroundColor: '#F7F6F5' }}>
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
                          color: '#000000',
                        },
                      }}
                    >
                      <Radio id="rdb-fullPayment" value="full" label={t.booking['full-payment']} />

                      {detailsBooking?.course?.instalments?.length > 0 ||
                      detailsBooking?.instalments?.length > 0 ? (
                        <Radio
                          id="rdb-installment"
                          value="instalment"
                          label={t.Pay_in_installments_3}
                        />
                      ) : null}
                    </RadioGroup>
                    {card === 'courses' ? (
                      <Box sx={{ display: paymentMethod === 'instalment' ? 'block' : 'none' }}>
                        <Stack ml={25} mt={15} spacing={5}>
                          <CheckboxGroup
                            value={payInstallment}
                            onChange={(e) => setChanges(e)}
                            required
                            orientation="vertical"
                            spacing="sm"
                            size="xs"
                            styles={{
                              icon: {
                                '& path': {
                                  fill: 'black',
                                },
                              },
                              input: {
                                background: 'transparent',
                                '&:checked': {
                                  background: 'transparent',
                                },
                              },
                            }}
                          >
                            <Checkbox
                              value={detailsBooking?.course?.instalments?.[0]?.id + ''}
                              disabled
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The first installment',
                                    `${detailsBooking?.course?.instalments?.[0]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.course?.instalments?.[0]?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                            <Checkbox
                              value={detailsBooking?.course?.instalments?.[1]?.id + ''}
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The second installment',
                                    `${detailsBooking?.course?.instalments?.[1]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.course?.instalments?.[1]?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                            <Checkbox
                              value={detailsBooking?.course?.instalments?.[2]?.id + ''}
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The third installment',
                                    `${detailsBooking?.course?.instalments?.[2]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.course?.instalments?.[2]?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                          </CheckboxGroup>
                        </Stack>
                      </Box>
                    ) : (
                      <Box sx={{ display: paymentMethod === 'instalment' ? 'block' : 'none' }}>
                        <Stack ml={25} mt={15} spacing={5}>
                          <CheckboxGroup
                            value={payInstallment}
                            onChange={(e) => setChanges(e)}
                            required
                            orientation="vertical"
                            spacing="sm"
                            size="xs"
                            styles={{
                              icon: {
                                '& path': {
                                  fill: 'black',
                                },
                              },
                              input: {
                                background: 'transparent',
                                '&:checked': {
                                  background: 'transparent',
                                },
                              },
                            }}
                          >
                            <Checkbox
                              value={detailsBooking?.instalments?.[0]?.id + ''}
                              disabled
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The first installment',
                                    `${detailsBooking?.instalments?.[0]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.instalments?.[0]?.amount?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                            <Checkbox
                              value={detailsBooking?.instalments?.[1]?.id + ''}
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The second installment',
                                    `${detailsBooking?.instalments?.[1]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.instalments?.[1]?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                            <Checkbox
                              value={detailsBooking?.instalments?.[2]?.id + ''}
                              label={
                                <CheckboxLabel
                                  label={[
                                    'The third installment',
                                    `${detailsBooking?.instalments?.[2]?.amount}KWD.`,
                                    'Due Date',
                                    momentWithTimeZone
                                      .utc(detailsBooking?.instalments?.[2]?.due_date)
                                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                      .format('YYYY-MM-DD'),
                                  ]}
                                />
                              }
                            />
                          </CheckboxGroup>
                        </Stack>
                      </Box>
                    )}
                  </Card>
                )}
              </Stack>
              <Stack spacing={5}>
                <Text>{t.booking['payment-method']}</Text>
                {isLoading ? (
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                ) : (
                  <Card radius={8} sx={{ backgroundColor: '#F7F6F5' }}>
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
                            color: '#000000',
                          },
                        }}
                      >
                        {orignalPrice != 0 ? (
                          <Radio id="rdb-Card" value="card" label={t.booking.card} />
                        ) : null}
                        <Radio id="rdb-Wallet" value="wallet" label={t.booking['by-wallet']} />
                      </RadioGroup>
                      {paymentCard === 'wallet' && (
                        <Text
                          sx={{
                            alignSelf: 'end',
                            position: 'absolute',
                            right: 5,
                            bottom: orignalPrice != 0 ? -3 : 0,
                            color: '#298EAE',
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
              <Space />
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
                      <Stack justify="end" sx={{ height: '100%' }}>
                        <Group>
                          <ActionIcon
                            variant="transparent"
                            onClick={() => setOpenCouponeDrawer(false)}
                          >
                            <ArrowLeftIcon className="rtl" width={40} height={40} />
                          </ActionIcon>
                          <Text>{t.coupon_code}</Text>
                        </Group>
                      </Stack>
                    </Card>
                  </Container>
                  <Container sx={{ maxHeight: '90vh', overflow: 'scroll' }}>
                    <Space h={20} />
                    <Stack sx={{ height: '100%' }}>
                      {couponData != '' ? (
                        couponData?.map((couponItem: any, index: number) => (
                          <CouponCard
                            couponData={couponItem}
                            order_id={id}
                            order={card === 'courses' ? 'course' : 'bundle'}
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
              {!totalPrice ? (
                <Skeleton height={45} width="100%" sx={{ opacity: 0.5 }} radius={8} />
              ) : totalPrice > 0 && couponButton && couponData != '' ? (
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
            <Space h="lg" />
            <Stack spacing={5}>
              <Text>{t.summary}</Text>
              <Card radius={8} sx={{ backgroundColor: '#F7F6F5' }}>
                <Group position="apart">
                  <Text size="xs" sx={{ color: '#298EAE' }}>
                    {t['original-price']}
                  </Text>
                  <Text size="xs" sx={{ color: '#298EAE' }}>
                    {/* {orignalPrice} */}
                    {!orignalPrice ? (
                      <Skeleton width={50} height={20} radius={8} mt={2} />
                    ) : orignalPrice == 0 ? (
                      'FREE'
                    ) : (
                      `${orignalPrice}KWD`
                    )}
                  </Text>
                </Group>

                {totalPrice > 0 && couponButton && couponresponse?.coupon_id != '' ? (
                  <Group position="apart">
                    <Text size="xs" sx={{ color: '#298EAE' }}>
                      {t['coupon-discounts']}
                    </Text>
                    <Text size="xs" sx={{ color: '#298EAE' }}>
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
                  <Text size="xs" sx={{ color: '#000000' }}>
                    {t.total}
                  </Text>
                  <Text size="xs" sx={{ color: '#000000' }} weight={500}>
                    {!orignalPrice ? (
                      <Skeleton width={50} height={20} radius={8} mt={2} />
                    ) : orignalPrice == 0 ? (
                      'FREE'
                    ) : (
                      `${totalPrice}KWD`
                    )}
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
                      id="btn-termModalNo"
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
                      id="btn-termModalYes"
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
            <Space h="xl" />
          </Container>
        </form>
      </ScrollArea>
    </Box>
  );
};

export default CheckoutPage;
