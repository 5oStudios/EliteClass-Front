import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Container,
  Group,
  Loader,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  TextInput,
  TypographyStylesProvider,
  useMantineColorScheme,
  Grid,
  Modal,
} from '@mantine/core';
import React, { useState } from 'react';
import NextImage from 'next/image';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatappIcon,
} from '../../constants/icons/social';
import { PageHeader } from '@/components/ui/pageHeader';
import { useQuery } from 'react-query';
import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import { LoadingScreen } from './loader-screen';
import useNextBlurhash from 'use-next-blurhash';
import { useRouter } from 'next/router';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { CheckboxLabel } from './checkbox-label';
import momentWithTimeZone from 'moment-timezone';

const CartItem = ({
  card,
  detailsBooking,
  item,
  index,
  updatedCart,
  propCartAllData,
  processing,
  ...props
}: any) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme } = useMantineColorScheme();
  //language
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [paymentMethod, setPaymentMethod] = React.useState<string>(item?.payment_type);
  const [payInstallment, setPayInstallment] = React.useState<string[]>(
    item?.total_installments?.length > 0
      ? item?.total_installments?.join().split(',')
      : item?.installments?.[1]?.expire
      ? [item?.installments[0]?.id + '', item?.installments?.[1]?.id + '']
      : [item?.installments[0]?.id + '']
  );
  const [secondInstallment, setSecondInstallment] = React.useState<any>(
    item?.installments?.[1]?.id + ''
  );
  const [orignalPrice, setOrignalPrice] = React.useState<number>(0);
  const [paymentCard, setPaymentCard] = React.useState<string>('card');
  const [walletBalance, setWalletBalance] = React.useState<any>();
  const [removing, setRemoving] = React.useState(false);
  const [appling, setAppling] = React.useState(false);
  const [coupon, setCoupon] = React.useState(item.coupon !== null ? item?.coupon : '');
  const [instalcoupon, setInstalCoupon] = React.useState('');
  const [isOpened, setIsOpen] = useState(false);
  const [couponData, setCouponData] = useState<any>({});
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [Msg, setMsg] = useState<string>('');
  const { isLoading, error, data } = useQuery<any, any>('aboutus', () =>
    axios.get('about-us?secret=11f24438-b63a-4de2-ae92-e1a1048706f5').then((res) => res?.data)
  );

  if (error) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: error?.message,
        color: 'red',
      });
    }
  }
  function setChanges(params: any, id: any, index: any) {
    // debugger
    // params.includes[id] &&
    if (index === 0) {
      showNotification({
        message: 'Value cannot be changed',
        color: 'red',
      });
    } else if (!params.includes(String(item?.installments[index - 1]?.id))) {
      showNotification({
        message: 'You have to select previous instalment in order to select this one',
        color: 'red',
      });
      // updateCart({ payment_type: 'installments', installments: '' });
    } else if (
      !params.includes(String(item?.installments[index]?.id)) &&
      params.includes(String(item?.installments[index + 1]?.id))
    ) {
      showNotification({
        message: 'You have to Discard Last One First',
        color: 'red',
      });
      // updateCart({ payment_type: 'installments', installments: [] });
    } else if (params.includes(String(item?.installments[index - 1]?.id))) {
      setPayInstallment(params);
      updateCart({ payment_type: 'installments', installments: params });
    } else {
      updateCart({ payment_type: 'installments', installments: params });
    }
    // if (!params.includes(secondInstallment) && params.length == 2 && payInstallment.length != 3) {
    //   debugger
    //   showNotification({
    //     message: 'You have to select previous instalment in order to select this one',
    //     color: 'red',
    //   });
    // }
    // debugger
    // if (params.includes(secondInstallment) && params.length <= 3) {
    //   debugger
    //   setPayInstallment(params);
    // }
    // else if (params.length == 1 && !params.includes(secondInstallment)) {
    //   debugger
    //   setPayInstallment(params);
    // } else if (params.length == 2 && !params.includes(secondInstallment)) {
    //   setPayInstallment([params[0]]);
    // }
    // debugger
  }

  const onRemove = () => {
    setRemoving(true);
    processing(true);
    const config = {
      method: 'post',
      url: 'remove/cart',
      data: {
        id: item?.id,
      },
    };
    axios(config)
      .then((res) => {
        res = applyNewDiscountTeq(res);
        setRemoving(false);
        processing(false);
        updatedCart(res?.data);
        showNotification({
          message: 'Item removed',
          color: 'green',
        });
      })
      .catch((error) => {
        setRemoving(false);
        processing(false);
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
  };

  const updateCart = (obj: Object) => {
    processing(true);
    const config = {
      method: 'post',
      url: item?.type == 'course' ? 'addtocart/course' : 'addtocart/bundle',
      data:
        item?.type == 'course'
          ? {
              course_id: item?.type_id,
              ...obj,
            }
          : {
              bundle_id: item?.type_id,
              ...obj,
            },
    };
    axios(config)
      .then((res) => {
        //here handle discount
        res = applyNewDiscountTeq(res);
        // res.data.cart.forEach((el: any) => {
        //   if (el.discountType !== null && el.price !== 0) {
        //     el.haveOffer = true;
        //     if (el.discountType === 'fixed') {
        //       el.price = el.originalPrice - el.price;
        //     } else {
        //       el.price = ((100 - el.price) / 100) * el.originalPrice;
        //     }
        //   }
        // });
        processing(false);
        updatedCart(res?.data);
        setMsg(res?.data?.message);
        setShowMsg(res?.data?.show_message);
      })
      .catch((error) => {
        processing(false);
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
  };
  const applyNewDiscountTeq = (res: any) => {
    res.data.cart.forEach((el: any) => {
      if (el.discountType !== null && el.price !== 0) {
        el.haveOffer = true;
        if (el.discountType === 'fixed') {
          el.price = el.originalPrice - el.price;
        } else {
          el.price = ((100 - el.price) / 100) * el.originalPrice;
        }
      }
    });
    return res;
  };
  const applyCoupon = (
    obj: Object,
    type: string,
    paymentType: string,
    actionType: string,
    data?: any
  ) => {
    let config: any;

    if (actionType === 'remove') {
      if (paymentType === 'full') {
        config = {
          method: 'post',
          url: 'cart/coupon',
          data: {
            ...obj,
          },
        };
      } else {
        obj = { cart_coupon_id: Number(data?.cart_coupon_id) };
        config = {
          method: 'post',
          url: 'cart/coupon',
          data: {
            ...obj,
          },
        };
      }
    } else if (actionType === 'apply') {
      if (type === 'course') {
        if (paymentType === 'full') {
          config = {
            method: 'post',
            url: 'cart/coupon',
            data: {
              course_id: item?.type_id,
              ...obj,
            },
          };
        } else {
          config = {
            method: 'post',
            url: 'cart/coupon',
            data: {
              course_id: item?.type_id,
              installment_id: Number(couponData?.id),
              ...obj,
            },
          };
        }
      } else if (type == 'package') {
        if (paymentType === 'full') {
          config = {
            method: 'post',
            url: 'cart/coupon',
            data: {
              bundle_id: item?.type_id,
              ...obj,
            },
          };
        } else {
          config = {
            method: 'post',
            url: 'cart/coupon',
            data: {
              bundle_id: item?.type_id,
              installment_id: Number(couponData?.id),
              ...obj,
            },
          };
        }
      } else if (type === 'meeting') {
        config = {
          method: 'post',
          url: 'cart/coupon',
          data: {
            meeting_id: item?.type_id,
            ...obj,
          },
        };
      } else if (type === 'offline_session') {
        config = {
          method: 'post',
          url: 'cart/coupon',
          data: {
            offline_session_id: item?.type_id,
            ...obj,
          },
        };
      } else if (type === 'chapter') {
        config = {
          method: 'post',
          url: 'cart/coupon',
          data: {
            chapter_id: item?.type_id,
            ...obj,
          },
        };
      }
    }

    setAppling(true);
    processing(true);

    axios(config)
      .then((res) => {
        res = applyNewDiscountTeq(res);

        setAppling(false);
        processing(false);
        setIsOpen(false);
        showNotification({
          message: res?.data?.is_applied ? 'Coupon applied.' : 'Coupon removed.',
          color: 'green',
        });
        if (!res?.data?.is_applied && paymentType === 'full') {
          setCoupon('');
        }
        if (paymentType !== 'full') {
          setInstalCoupon('');
        }
        updatedCart(res?.data);
      })
      .catch((error) => {
        processing(false);
        setAppling(false);
        // if (item?.coupon == null) {
        //   setCoupon('');
        // }
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
  };

  function renderApplyCouponRow() {
    return (
      <>
        <Box sx={{ width: '100%' }}>
          <TextInput
            id={`inp-couponCode${index}`}
            placeholder={t.enter_coupon}
            disabled={item?.coupon}
            onChange={(event: any) => {
              setCoupon(event.currentTarget.value);
            }}
            value={coupon}
            size={'xs'}
            styles={{
              input: {
                //width : '350px',
                backgroundColor: '#F7F6F5',
                borderRadius: '20px',
              },
            }}
          />
        </Box>
        <Button
          id={`btn-couponApplyRemove${index}`}
          onClick={() => {
            if (coupon.trim() === '') {
              showNotification({
                message: 'Enter coupon code first.',
                color: 'red',
              });
            } else {
              item?.coupon
                ? applyCoupon(
                    { cart_coupon_id: item?.cart_coupon_id },
                    item?.type,
                    item?.payment_type,
                    'remove'
                  )
                : applyCoupon({ coupon }, item?.type, item?.payment_type, 'apply');
            }
          }}
          //disabled={item?.coupon}
          sx={{
            background: item?.coupon ? 'red' : '#298EAE',
            borderRadius: '20px',
            height: '27px',
          }}
        >
          {appling ? (
            <Loader size={'xs'} color={'white'} />
          ) : (
            <Text sx={{ color: 'white', fontSize: '14px' }}>
              {item?.coupon ? t.remove : t.apply}
            </Text>
          )}
        </Button>
      </>
    );
  }

  function installmentRenderApplyCouponRow() {
    return (
      <>
        <Box sx={{ width: '100%' }}>
          <TextInput
            id={`inp-installmentcouponCode${index}`}
            placeholder={t.enter_coupon}
            disabled={couponData?.coupon}
            onChange={(event: any) => {
              setInstalCoupon(event.currentTarget.value);
            }}
            value={instalcoupon}
            size={'xs'}
            styles={{
              input: {
                //width : '350px',
                backgroundColor: '#F7F6F5',
                borderRadius: '20px',
                color: 'black',
              },
            }}
          />
        </Box>
        <Button
          id={`btn-installmentApplyRemove${index}`}
          onClick={() => {
            if (instalcoupon.trim() === '') {
              showNotification({
                message: 'Enter coupon code first.',
                color: 'red',
              });
            } else {
              couponData?.coupon
                ? applyCoupon(
                    { cart_coupon_id: couponData?.cart_coupon_id },
                    item?.type,
                    item?.payment_type,
                    'remove'
                  )
                : applyCoupon({ coupon: instalcoupon }, item?.type, item?.payment_type, 'apply');
            }
          }}
          //disabled={item?.coupon}
          sx={{
            background: couponData?.coupon ? 'red' : '#298EAE',
            borderRadius: '20px',
            height: '27px',
          }}
        >
          {appling ? (
            <Loader size={'xs'} color={'white'} />
          ) : (
            <Text sx={{ color: 'white', fontSize: '14px' }}>
              {couponData?.coupon ? t.remove : t.apply}
            </Text>
          )}
        </Button>
      </>
    );
  }

  return (
    <>
      <Modal opened={isOpened} onClose={() => setIsOpen(false)} title={t.apply_coupon} centered>
        <Stack
          sx={{
            flexDirection: 'row',
            //backgroundColor: 'blue',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {installmentRenderApplyCouponRow()}
        </Stack>
      </Modal>
      <Modal opened={showMsg} onClose={() => setShowMsg(false)} withCloseButton={false} centered>
        <Card>
          <Stack>
            <Text align="center">{Msg}</Text>
            <Button
              id="btn-cartModalClose"
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
      <Stack spacing={5} sx={{ border: '1px solid #DDD7D750', padding: 5, borderRadius: '8px' }}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Group spacing={5} px={'10px'}>
            <Text sx={{ fontSize: 14, color: '#298EAE', display: 'flex' }}>
              {`${index + 1}.`}
              <Text
                sx={(theme) => ({
                  fontSize: 14,
                  marginLeft: '4px',
                  color: theme?.other?.blueToPrimary,
                })}
              >
                {item?.title}
              </Text>
            </Text>
            {/* <Text sx={{ fontSize: 14, color: colorScheme == 'dark' ? '#EDD491' : '#000' }}>
              {item?.title}
            </Text> */}
          </Group>
          {removing ? (
            <Loader size="xs" color="red" />
          ) : (
            <Stack
              id={`btn-itemRemove${index}`}
              onClick={() => {
                onRemove();
              }}
              px={8}
              sx={{
                //position: 'absolute',
                right: 25,
                height: '15px',
                //width: '53px',
                background: 'red',
                borderRadius: '20px',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3px',
              }}
            >
              <Text sx={{ color: '#fff', fontSize: router.locale == 'ar-kw' ? 12 : 10 }}>
                {t.remove}
              </Text>
            </Stack>
          )}
        </Stack>

        <Card radius={8} pt={5} sx={{ backgroundColor: '#F7F6F5' }}>
          <Text sx={{ color: '#000000' }}>{t.booking['payment-type']}</Text>
          {item?.installments?.length > 0 ? (
            // <RadioGroup
            //   size="sm"
            //   orientation="vertical"
            //   value={paymentMethod}
            //   onChange={setPaymentMethod}
            //   name="payment_method"
            //   styles={{
            //     label: {
            //       fontSize: 12,
            //       color: '#000000',
            //     },
            //   }}
            // >
            <>
              <Radio
                id="rdb-fullPayment"
                value="full"
                size="sm"
                checked={paymentMethod === 'full'}
                styles={{
                  label: {
                    fontSize: 12,
                    color: '#000000',
                  },
                }}
                onChange={(event) => {
                  setPaymentMethod('full');
                  updateCart({ payment_type: 'full' });
                  setPayInstallment(item?.total_installments?.join().split(','));
                }}
                label={
                  <Group>
                    <Text sx={{ fontSize: 12 }}>{t.booking['full-payment']}</Text>
                    {paymentMethod == 'full' && (
                      <Text sx={{ fontSize: 14 }} weight={500} color={'#298EAE'}>
                        {Number(item?.originalPrice || 0) > 0
                          ? `${Number(item?.price || 0)} KWD`
                          : t.free.toUpperCase()}
                        {item?.haveOffer && (
                          <span
                            style={{
                              color: 'red',
                              textDecoration: 'line-through',
                              marginLeft: '5px',
                            }}
                          >
                            {`  ${item?.originalPrice} KWD`}
                          </span>
                        )}
                      </Text>
                    )}
                  </Group>
                }
              />
              <Radio
                id="rdb-installments"
                mt={'4px'}
                size="sm"
                checked={paymentMethod === 'installments'}
                onChange={(event) => {
                  setPaymentMethod('installments');
                  setPayInstallment(
                    item?.total_installments?.length > 0
                      ? item?.total_installments?.join().split(',')
                      : item?.installments?.[1]?.expire
                      ? [item?.installments[0]?.id + '', item?.installments?.[1]?.id + '']
                      : [item?.installments[0]?.id + '']
                  );
                  updateCart({
                    payment_type: 'installments',
                    installments: item?.installments?.[1]?.expire
                      ? [item?.installments[0]?.id, item?.installments?.[1]?.id]
                      : [item?.installments[0]?.id],
                  });
                }}
                value="installments"
                label={`${t.Pay_in_installments_3} (${item.installments?.length} ${t.installments})
                `}
                styles={{
                  label: {
                    fontSize: 12,
                    color: '#000000',
                  },
                }}
              />
            </>
          ) : (
            <Radio
              id="rdb-fullPayment"
              value="full"
              size="sm"
              checked
              label={
                <Group>
                  <Text sx={{ fontSize: 12, color: '#000000' }}>{t.booking['full-payment']}</Text>
                  {paymentMethod == 'full' && (
                    <Text sx={{ fontSize: 14 }} weight={500} color={'#298EAE'}>
                      {Number(item?.originalPrice || 0) > 0
                        ? `${Number(item?.price || 0)} KWD`
                        : t.free.toUpperCase()}
                      {item?.haveOffer && (
                        <span
                          style={{
                            color: 'red',
                            textDecoration: 'line-through',
                            marginLeft: '5px',
                          }}
                        >
                          {`  ${item?.originalPrice} KWD`}
                        </span>
                      )}
                    </Text>
                  )}
                </Group>
              }
            />
          )}
          <Box sx={{ display: paymentMethod === 'installments' ? 'block' : 'none' }}>
            <Stack ml={25} mt={15} spacing={5}>
              {item?.installments?.length > 0
                ? item?.installments?.map((items: any, index: any) => (
                    <CheckboxGroup
                      value={payInstallment}
                      onChange={(e) => {
                        setChanges(e, items?.id, index);
                        // updateCart({ payment_type: 'installments', installments: e });
                      }}
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
                        value={items?.id + ''}
                        style={{ width: '100%' }}
                        disabled={items?.expire || index === item.installments?.length - 1}
                        className="handleCheckBoxWidth"
                        checked={items?.expire || payInstallment?.includes(items?.id)}
                        label={
                          <Grid>
                            <Grid.Col span={7}>
                              <Text sx={{ fontSize: '10px', color: '#000000' }}>
                                {index + 1 + '  '}
                                {`${t.installment}`}{' '}
                                <span
                                  style={{
                                    color: '#298EAE',
                                    fontSize: '12px',
                                    lineHeight: 1.55,
                                    fontWeight: 500,
                                  }}
                                >
                                  {`${Number(items?.amount || 0)}KWD`}.
                                </span>
                              </Text>
                              <Text sx={{ fontSize: '10px', color: '#000000' }}>
                                {`${t.Due_date}`}{' '}
                                <span
                                  style={{ color: '#666666', fontSize: '10px', lineHeight: '1.55' }}
                                >
                                  {/* {items?.due_date} */}
                                  {momentWithTimeZone
                                    .utc(items?.due_date)
                                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                    .format('YYYY-MM-DD')}
                                </span>
                              </Text>
                            </Grid.Col>
                            <Grid.Col sx={{ textAlign: 'end' }} span={5}>
                              {items?.cart_coupon_id ? (
                                <Button
                                  className="btnRemoveCoupon"
                                  onClick={() => {
                                    applyCoupon(
                                      { cart_coupon_id: items?.coupon_id },
                                      items?.type,
                                      items?.payment_type,
                                      'remove',
                                      items
                                    );
                                  }}
                                >
                                  {' '}
                                  {t.remove_coupon}
                                </Button>
                              ) : String(item?.total_installments)?.includes(String(items?.id)) &&
                                String(payInstallment)?.includes(String(items?.id)) ? (
                                <Button
                                  className="btnapplyCoupon"
                                  onClick={() => {
                                    setInstalCoupon('');
                                    setCouponData(items);
                                    setIsOpen(true);
                                  }}
                                >
                                  {t.apply_coupon}
                                </Button>
                              ) : (
                                ''
                              )}
                            </Grid.Col>
                          </Grid>
                        }
                      />
                      {/* {console.log("321",items?.id)} */}
                    </CheckboxGroup>
                  ))
                : 'loading'}

              {/* <CheckboxGroup
                value={payInstallment}
                onChange={(e) => {
                  setChanges(e);
                  updateCart({ payment_type: 'installments', installments: e });
                }}
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
                  value={item?.installments?.[0]?.id + ''}
                  style={{ width: '100%' }}
                  disabled
                  className="handleCheckBoxWidth"
                  label={
                    <Grid>
                      <Grid.Col span={7}>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t['first-installment']}`}{' '}
                          <span
                            style={{
                              color: '#298EAE',
                              fontSize: '12px',
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {`${Number(item?.installments?.[0]?.amount || 0)}KWD`}.
                          </span>
                        </Text>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t.Due_date}`}{' '}
                          <span style={{ color: '#666666', fontSize: '10px', lineHeight: '1.55' }}>
                            {momentWithTimeZone
                              .utc(item?.installments?.[0]?.due_date)
                              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                              .format('YYYY-MM-DD')}
                          </span>
                        </Text>
                      </Grid.Col>
                      <Grid.Col sx={{ textAlign: 'end' }} span={5}>
                        {item?.installments[0]?.cart_coupon_id ? (
                          <Button
                            className="btnRemoveCoupon"
                            onClick={() => {
                              applyCoupon(
                                { cart_coupon_id: item?.coupon_id },
                                item?.type,
                                item?.payment_type,
                                'remove',
                                item?.installments[0]
                              );
                            }}
                          >
                            {' '}
                            {t.remove_coupon}
                          </Button>
                        ) : (
                          <Button
                            className="btnapplyCoupon"
                            onClick={() => {
                              setInstalCoupon('');
                              setCouponData(item?.installments[0]);
                              setIsOpen(true);
                            }}
                          >
                            {t.apply_coupon}
                          </Button>
                        )}
                      </Grid.Col>
                    </Grid>
                  }
                />

                <Checkbox
                  value={item?.installments?.[1]?.id + ''}
                  disabled={item?.installments?.[1]?.expire}
                  className="handleCheckBoxWidth"
                  label={
                    <Grid>
                      <Grid.Col span={7}>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t['second-installment']}`}{' '}
                          <span
                            style={{
                              color: '#298EAE',
                              fontSize: '12px',
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {`${Number(item?.installments?.[1]?.amount || 0)}KWD`}.
                          </span>
                        </Text>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t.Due_date}`}{' '}
                          <span style={{ color: '#666666', fontSize: '10px', lineHeight: '1.55' }}>
                            {momentWithTimeZone
                              .utc(item?.installments?.[1]?.due_date)
                              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                              .format('YYYY-MM-DD')}
                          </span>
                        </Text>
                      </Grid.Col>
                      <Grid.Col sx={{ textAlign: 'end' }} span={5}>
                        {item?.total_installments.length >= 2 ? (
                          item?.installments[1]?.cart_coupon_id ? (
                            <Button
                              className="btnRemoveCoupon"
                              onClick={() => {
                                applyCoupon(
                                  { cart_coupon_id: item?.coupon_id },
                                  item?.type,
                                  item?.payment_type,
                                  'remove',
                                  item?.installments[1]
                                );
                              }}
                            >
                              {' '}
                              {t.remove_coupon}
                            </Button>
                          ) : (
                            <Button
                              className="btnapplyCoupon"
                              onClick={() => {
                                setInstalCoupon('');
                                setCouponData(item?.installments[1]);
                                setIsOpen(true);
                              }}
                            >
                              {' '}
                              {t.apply_coupon}
                            </Button>
                          )
                        ) : null}
                      </Grid.Col>
                    </Grid>
                  }
                />

                <Checkbox
                  value={item?.installments?.[2]?.id + ''}
                  disabled
                  style={{ width: '100%' }}
                  className="handleCheckBoxWidth"
                  label={
                    <Grid>
                      <Grid.Col span={7}>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t['third-installment']}`}{' '}
                          <span
                            style={{
                              color: '#298EAE',
                              fontSize: '12px',
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {`${Number(item?.installments?.[2]?.amount || 0)}KWD`}.
                          </span>
                        </Text>
                        <Text sx={{ fontSize: '10px', color: '#000000' }}>
                          {`${t.Due_date}`}{' '}
                          <span style={{ color: '#666666', fontSize: '10px', lineHeight: '1.55' }}>
                            {momentWithTimeZone
                              .utc(item?.installments?.[2]?.due_date)
                              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                              .format('YYYY-MM-DD')}
                          </span>
                        </Text>
                      </Grid.Col>
                      {/* <Grid.Col sx={{ textAlign: 'end'}} span={5}>
                        {item?.coupon_id ? (
                          <Button className='btnRemoveCoupon' onClick={removeCouponFromInstallment}> {t.remove_coupon}</Button>
                        ) : item?.total_installments.length >= 2 ? (
                          <Button className='btnapplyCoupon' onClick={handleLabelClick}> {t.apply_coupon}</Button>
                        ) : null}
                      </Grid.Col> */}
              {/* </Grid> */}
              {/* } */}
              {/* /> */}
              {/* </CheckboxGroup> */}
            </Stack>
          </Box>
        </Card>
        {/* (item?.type === 'course' || item?.type === 'package' || item?.type==='offline_session' || item?.type==='meeting') && */}
        {Number(item?.price || 0) > 0 && (
          <Stack
            sx={{
              flexDirection: 'row',
              //backgroundColor: 'blue',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {paymentMethod === 'full' && renderApplyCouponRow()}
          </Stack>
        )}
      </Stack>
    </>
  );
};
export default CartItem;
