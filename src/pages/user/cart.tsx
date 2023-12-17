import {
  ActionIcon,
  Affix,
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
  Input,
  Loader,
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
  TextInput,
  useMantineColorScheme,
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
import { packagesData } from '@/src/constants/data/carousal-data';
import { Sailboat } from 'tabler-icons-react';
import CartItem from '@/components/ui/CartItem';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { CartLoadingScreen } from '@/components/ui/cart-loader-screen';
import authMiddleware from '@/src/authMiddleware';

export const Cart = () => {
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  const isKeyboardOpen = useDetectKeyboardOpen();

  //language
  const { card, success, id, message } = router.query;
  const { colorScheme } = useMantineColorScheme();
  const [paymentMethod, setPaymentMethod] = React.useState<string>('full');
  const [paymentCard, setPaymentCard] = React.useState<string>('KNET');

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
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<any>();

  const [payInstallment, setPayInstallment] = useState<string[]>([]);

  const [submintLoader, setSubmitLoader] = useState(false);

  const [cart, setCart] = useState<any>({});
  const [term, setTerm] = useState(false);
  const [refetchCart, setFetchCart] = useState(false);
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const isInitiallyVisible = false;
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(isInitiallyVisible);

  // console.log("KeyBoard:", isKeyboardOpen )
  // const obj = {
  //   event: 'debugLog',
  //   isKeyboardOpen
  // };
  // //@ts-ignore
  // window.ReactNativeWebView.postMessage(JSON.stringify(obj));

  useEffect(() => {
    setKeyboardIsOpen(isKeyboardOpen);
  }, [isKeyboardOpen]);

  // React.useEffect(() => {
  //   // toggle isKeyboardVisible on event listener triggered
  //   //@ts-ignore
  //   window.visualViewport.addEventListener('resize', () => {
  //     setKeyboardVisible(!isKeyboardVisible);
  //   });
  //   console.log("KEYBOARD:", isKeyboardVisible)
  // }, [isKeyboardVisible]);

  useEffect(() => {
    if (success !== undefined && success !== null && success !== '') {
      setSuccessModel(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get('show/cart')
      .then((res: any) => {
        setCart(res.data);
        //const msg = !res?.data?.message ? false : true;
        setShowMsg(res?.data?.show_message);
        setOrignalPrice(res?.data?.price_total);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
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
  }, [refetchCart]);

  useEffect(() => {
    setTimeout(() => {
      setWalletBalance({
        corrent_balance: '0.000',
        currency: 'KWD',
        currency_icon: 'دينار',
      });
    }, 250);
  }, []);

  // useEffect(() => {
  //   axios
  //     .get('wallet/balance')
  //     .then((res) => {
  //       setWalletBalance(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error?.message === 'Network Error') {
  //         showNotification({
  //           message: 'Network error',
  //           color: 'red',
  //         });
  //       } else {
  //         let err = error?.response?.data?.errors;
  //         if (err) {
  //           Object.keys(err).map((i) => {
  //             err[i].map((item: any) => {
  //               showNotification({
  //                 message: item,
  //                 color: 'red',
  //               });
  //             });
  //           });
  //         }
  //       }
  //     });
  // }, []);

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

  const onPurchase = () => {
    let obj = {
      payment_method: paymentCard,
    };
    setSubmitLoader(true);
    const config = {
      method: 'post',
      url: paymentCard !== 'wallet' ? 'cart/upayment/order' : 'cart/order',
      data: paymentCard === 'wallet' ? {} : obj,
    };
    axios(config)
      .then((response) => {
        console.log(response);
        //setSubmitLoader(false);
        if (paymentCard !== 'wallet') {
          const invoiceURL = response?.data?.Data?.invoiceURL;
          if (invoiceURL === null || invoiceURL === '' || invoiceURL === undefined) {
            if (response?.data?.Data.isExpiredItem === true) {
              showNotification({
                message: response?.data?.Message,
                color: 'red',
              });
              setFetchCart(!refetchCart);
            } else {
              if (response?.data?.Data.isDirectEnroll === true) {
                //This means that the invoice value got zeroed due to Coupons and we cannot move towards Payment Gateway, because there is no payment gateway that will process a transaction for ZERO amount.
                router.replace('/user/success');
              }
            }
            throw new Error('Payment Gateway URL is empty, cannot process this transaction');
          } else {
            setFetchCart(!refetchCart);
            console.log('Supposed to be redirect to pay invoice on :: ', invoiceURL);
            router.replace(invoiceURL);
          }
        } else if (paymentCard === 'wallet') {
          router.replace('/user/success');
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

  useEffect(() => {
    setSubmitLoader(false);
  }, [router]);

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
                id="btn-cartBalanceModalCancel"
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
                id="btn-cartBalanceModalRefill"
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
              id="btn-cartSuccessModalClose"
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
                  setOpenConfirmModal(false);
                  onPurchase();
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
      <Modal opened={showMsg} onClose={() => setShowMsg(false)} withCloseButton={false} centered>
        <Card>
          <Stack>
            <Text align="center">{cart?.message}</Text>
            <Button
              id="btn-cartMessageModalClose"
              style={{
                width: '50%',
                alignSelf: 'center',
              }}
              variant="filled"
              onClick={() => {
                setShowMsg(false);
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
                  <ActionIcon variant="transparent" onClick={() => setOpenCouponeDrawer(false)}>
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

      <Seo title="Cart" description="Best LMS" path={`user/cart`} />
      <CartLoadingScreen isLoading={submintLoader} color={'#FFFFFF50'} indicatorColor={'#298EAE'} />
      <ScrollArea sx={{ height: '100vh' }} scrollbarSize={10}>
        <PageHeader
          rightSection={
            // <Box px={20}>
            <Button
              id="btn-addMoreItems"
              mx={20}
              onClick={() => router.replace('/')}
              sx={{ backgroundColor: '#298EAE', borderRadius: '20px' }}
            >
              <Text color={'#fff'} sx={{ fontSize: '12px' }}>
                {t.add_more}
              </Text>
            </Button>
          }
          title={t.mycart}
        />

        <form
        //onSubmit={handleFormSubmit}
        >
          <Container sx={{}}>
            <ScrollArea sx={{ height: '100vh' }}>
              {isLoading ? (
                <Stack spacing={10}>
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                  <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                </Stack>
              ) : cart?.cart?.length > 0 ? (
                <Stack pb={'450px'}>
                  {cart?.cart?.map((item: any, index: any) => (
                    <CartItem
                      key={item.id} //Fixed the blunder which wasted our 9+ hours
                      item={item}
                      index={index}
                      card={card}
                      payInstallment={payInstallment}
                      detailsBooking={detailsBooking}
                      processing={(res: any) => setSubmitLoader(res)}
                      updatedCart={(data: any) => {
                        //const updatedCart = cart?.cart?.filter((el: any) => el?.id !== id);
                        setCart(data);
                        setOrignalPrice(data?.price_total);
                      }}
                      propCartAllData={item}
                      setPayInstallment={(val: any) => setPayInstallment(val)}
                    />
                  ))}
                </Stack>
              ) : (
                <NoRecordFound />
              )}
            </ScrollArea>

            {cart?.cart?.length > 0 && !isKeyboardOpen && (
              <Affix
                position={{ bottom: 0 }}
                sx={{
                  width: '100%',
                  //display: 'flex',
                  //justifyContent: 'space-between',
                  flexDirection: 'row',
                  padding: '12px',
                  background: colorScheme == 'dark' ? '#333333' : '#fff',
                }}
                zIndex={10}
              >
                <Stack spacing={0} sx={{}}>
                  <Space h="md" />
                  <Stack spacing={5}>
                    <Text>{t.booking['payment-method']}</Text>
                    {isLoading ? (
                      <Skeleton height={100} width="100%" sx={{ opacity: 0.5 }} radius={8} />
                    ) : (
                      <Card radius={8} sx={{ backgroundColor: '#F7F6F5', width: '100%' }}>
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
                            {/* {cart?.after_discount != 0 ? (
                              <Radio value="KNET" label={t.booking.card} />
                            ) : null} */}
                            <Radio id="rdb-paymentKnet" value="KNET" label={'KNET'} />
                            <Radio id="rdb-paymentVisaMaster" value="VISA/MASTER" label={'VISA/MASTER'} />
                            {/* <Radio value="wallet" label={t.booking['by-wallet']} /> */}
                            {/* 👆 Wallet has been removed from the app */}
                          </RadioGroup>
                          {/* {paymentCard === 'wallet' && (
                            <Text
                              sx={{
                                alignSelf: 'end',
                                position: 'absolute',
                                right: 5,
                                bottom: cart?.price_total != 0 ? -3 : 0,
                                color: '#298EAE',
                              }}
                              size="xs"
                            >
                              {parseInt(walletBalance?.corrent_balance || 0)}{' '}
                              {walletBalance?.currency}
                            </Text>
                          )} */}
                        </Group>
                      </Card>
                    )}
                  </Stack>
                  <Space />
                  <Space h="md" />
                  <Stack spacing={5}>
                    <Text>{t.summary}</Text>
                    <Card radius={8} sx={{ backgroundColor: '#F7F6F5' }}>
                      <Group position="apart">
                        <Text size="xs" sx={{ color: '#298EAE' }}>
                          {t['original-price']}
                        </Text>
                        <Group spacing={3}>
                          <Text size="xs" sx={{ color: '#298EAE' }}>
                            {`${parseInt(cart?.price_total || 0)}`}
                          </Text>
                          <Text size="xs" sx={{ color: '#298EAE' }}>
                            {`KWD`}
                          </Text>
                        </Group>
                        {/* <Text size="xs" sx={{ color: '#298EAE' }}>
                          {`${cart?.price_total}KWD`}
                        </Text> */}
                      </Group>

                      <Group position="apart">
                        <Text size="xs" sx={{ color: '#298EAE' }}>
                          {t['coupon-discounts']}
                        </Text>
                        <Group spacing={3}>
                          <Text size="xs" sx={{ color: '#298EAE' }}>
                            {parseInt(cart?.cpn_discount || 0)}
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
                            {paymentCard == 'KNET'
                              ? cart?.knet || 0
                              : paymentCard == 'VISA/MASTER'
                              ? cart?.visa_master || 0
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
                            {paymentCard === 'KNET'
                              ? cart?.knet_total || 0
                              : paymentCard == 'VISA/MASTER'
                              ? cart?.visa_master_total || 0
                              : parseInt(cart?.after_discount || 0)}
                            {/* {`${ parseInt(cart?.after_discount || 0)}`} */}
                          </Text>
                          <Text size="xs" sx={{ color: '#000000' }} weight={500}>
                            {`KWD`}
                          </Text>
                        </Group>
                        {/* <Text size="xs" sx={{ color: '#000000' }} weight={500}>
                          {`${cart?.after_discount}KWD`}
                        </Text> */}
                      </Group>
                    </Card>
                  </Stack>

                  {!isLoading && (
                    <Stack spacing={5}>
                      <Space h="md" />
                      <Button
                        id="btn-cartCompletePurchase"
                        onClick={() => setOpenConfirmModal(true)}
                        size="md"
                        sx={{ backgroundColor: '#298EAE', borderRadius: '20px' }}
                        radius={8}
                      >
                        {/* {submintLoader ? (
                          <Loader size="sm" color="white" />
                        ) : ( */}
                        <Text sx={{ color: '#fff' }}>{t.complete_purchase}</Text>
                        {/* )} */}
                        {/* {t.continue} */}
                      </Button>
                      {/* <Button id="continue" hidden type="submit" size="md" radius={8} /> */}
                      {/* <Radio
                      value="term"
                      checked={term}
                      onClick={() => setTerm(!term)}
                      color={colorScheme == 'dark' ? '#298EAE' : 'dark'}
                      label={
                        <Group spacing={5}>
                          <Text
                            sx={{ fontSize: 12, color: colorScheme == 'dark' ? '#298EAE' : '#000' }}
                          >
                            {'Accept elite class'}
                          </Text>
                          <Text sx={{ fontSize: 14 }} weight={500} color={'#298EAE'}>
                            {'Terms of condition'}
                          </Text>
                        </Group>
                      }
                    /> */}
                    </Stack>
                  )}
                  <Space h="xl" />
                </Stack>
              </Affix>
            )}
          </Container>
        </form>
      </ScrollArea>
    </Box>
  );
};

export default authMiddleware(Cart);
