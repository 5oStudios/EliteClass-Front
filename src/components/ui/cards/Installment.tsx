import React, { useEffect, useState } from 'react';
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
import instance from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import { CartLoadingScreen } from '../cart-loader-screen';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { getCookie } from 'cookies-next';
import axios from '@/components/axios/axios.js';
import { NoRecordFound } from '../no-record-found';
export const Seperator = () => (
  <Box sx={{ position: 'relative' }}>
    <Box
      sx={{
        width: '20px',
        height: '20px',
        borderradius: '50%',
        background: '#FF9FE',
        borderRadius: '100%',
        position: 'absolute',
        //zIndex: 30,
        left: '-10px',
        top: '50%',
        transform: 'translateY(-50%)',
        border: '1px solid #D8DFE9',
      }}
    />
    <Divider
      variant="dotted"
      size="sm"
      // my={2}
      sx={{
        borderColor: '#D8DFE9',
      }}
    />
    <Box
      sx={{
        width: '20px',
        height: '20px',
        borderradius: '50%',
        background: '#F4F9FE',
        borderRadius: '100%',
        position: 'absolute',
        //zIndex: 30,
        right: '-10px',
        top: '50%',
        transform: 'translateY(-50%)',
        border: '1px solid #D8DFE9',
      }}
    />
  </Box>
);

export default function Installment(props: any) {
  const [appling, setAppling] = React.useState(false);
  const [isOpened, setIsOpen] = useState(false);
  const [coupon, setCoupon] = React.useState(props.propAllInstallemnt || '');
  const [couponData, setCouponData] = useState<any>({});
  const [screenLoader, setScreenLoader] = React.useState(false);
  const [removeCouponDisbaled, setremoveCouponDisabled] = useState(false);
  const [applyCouponDisbaled, setApplyCouponDisbaled] = useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const [instalcoupon, setInstalCoupon] = React.useState('');
  const token = getCookie('access_token');
  const [isAppliedTrue, setIsAppliedTrue] = useState([]);
  const [selectedcouponInstallment, setselectedcouponInstallment] = useState<CouponInstallment>({
    type: '',
    type_id: 0,
    instalment_id: 0,
    payment_plan_id: '',
    bundle_id: '',
  });
  type CouponInstallment = {
    type: string;
    type_id: number;
    instalment_id: number;
    payment_plan_id: string;
    bundle_id: string;
  };
  const router = useRouter();
  const [booking, setBooking] = useState(false);
  const t = router.locale === 'en-us' ? en : ar;
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const [propData, setPropData] = useState(null);
  console.log('props installment ', props.propAllInstallemnt);
  const applyCoupon = (
    obj: Object,
    type: string,
    course_id: number,
    instalment_id?: number,
    payment_plan_id?: string,
    bundle_id?: string
  ) => {
    let config: any;

    if (type === 'course') {
      if (instalment_id === undefined) {
        config = {
          method: 'post',
          url: 'pending-installment/coupon',
          data: {
            ...obj,
          },
        };
      } else {
        config = {
          method: 'post',

          url: 'pending-installment/coupon',
          data: {
            course_id,
            installment_id: instalment_id,
            payment_plan_id,
            ...obj,
          },
        };
      }
    } else if (type == 'package') {
      if (instalment_id === undefined) {
        config = {
          method: 'post',

          url: 'pending-installment/coupon',
          data: {
            ...obj,
          },
        };
      } else {
        config = {
          method: 'post',

          url: 'pending-installment/coupon',
          data: {
            bundle_id,
            installment_id: instalment_id,
            payment_plan_id,
            ...obj,
          },
        };
      }
    }
    setAppling(true);
    setScreenLoader(true);
    axios(config)
      .then((res) => {
        setIsOpen(false);
        console.log('the response data of the coupon is', res?.data?.msg);
        props.updatedUi();
        setApplyCouponDisbaled(true);
        setTimeout(() => {
          setApplyCouponDisbaled(false);
        }, 2000);
        showNotification({
          message: res?.data?.msg,
          color: 'green',
        });
        setIsAppliedTrue(res?.data?.installments);
        setScreenLoader(false);
        props?.refetchInstallments();
        setAppling(false);

        if (!res?.data?.is_applied) {
          setCoupon('');
          setIsOpen(false);
        }
      })
      .catch((error) => {
        setAppling(false);
        setScreenLoader(false);
        setIsOpen(false);
        setCoupon('');
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
  const handlePendingInstallment = (
    selectedInstallment: any,
    id: any,
    paymentId: any,
    isSelected: any
  ) => {
    if (isSelected === false) {
      const body_incaseOfTrue = {
        payment_plan_id: paymentId,
      };
      try {
        setScreenLoader(true);
        instance.post('/pending/instalments', body_incaseOfTrue).then((response) => {
          props.setPendingData(response?.data);

          setScreenLoader(false);
        });
      } catch (error) {
        showNotification({
          message: 'Network Error',
          color: 'red',
        });
      }
    } else {
      try {
        const body_inCaseOfFalse = {
          remove_payment_plan_id: paymentId,
        };

        setScreenLoader(true);
        instance.post('/pending/instalments', body_inCaseOfFalse).then((response) => {
          props?.setPendingData(response?.data);

          setScreenLoader(false);
        });
      } catch (error) {
        showNotification({
          message: 'Network Error',
          color: 'red',
        });
      }
    }
  };
  function installmentRenderApplyCouponRow() {
    return (
      <>
        <Box sx={{ width: '100%' }}>
          <TextInput
            id="inp-pendingInstallments"
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
          id="btn-pendingApplyRemove"
          onClick={() => {
            if (instalcoupon.trim() === '') {
              showNotification({
                message: 'Enter coupon code first.',
                color: 'red',
              });
            } else {
              couponData?.coupon
                ? ''
                : applyCoupon(
                    { coupon: instalcoupon },
                    selectedcouponInstallment?.type,
                    selectedcouponInstallment?.type_id,
                    selectedcouponInstallment?.instalment_id,
                    selectedcouponInstallment?.payment_plan_id,
                    selectedcouponInstallment?.bundle_id
                  );
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
            <Text sx={{ color: 'white', fontSize: '14px' }} onClick={() => setIsOpen(false)}>
              {couponData?.coupon ? t.remove : t.apply}
            </Text>
          )}
        </Button>
      </>
    );
  }

  const deleteMyCoupon = async (coupon: any) => {
    try {
      setScreenLoader(true);
      const body = {
        cart_coupon_id: coupon,
      };
      const api = await instance.post('/pending-installment/coupon', body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        api?.data?.installments.length &&
        api?.data?.installments.some((e: any) =>
          e?.installments.some((s: any) => s?.cart_coupon_id === null)
        )
      ) {
        props.updatedUi();
        setremoveCouponDisabled(true);
      }
      setScreenLoader(false);

      showNotification({
        message: 'Coupon is removed',
        color: 'red',
      });
    } catch (error) {
      showNotification({
        message: 'Network error',
        color: 'red',
      });
    } finally {
      setTimeout(() => {
        setremoveCouponDisabled(false);
      }, 4000);
    }
  };
  useEffect(() => {
    props.updatedUi();
  }, []);
  useEffect(() => {
    setPropData(props?.paymentData?.installments);
  }, [props.paymentData?.installments, propData]);
  useEffect(() => {
    setBooking(false);
  }, [router]);
  return (
    <div>
      <Modal opened={isOpened} onClose={() => setIsOpen(false)} title={t?.apply_coupon} centered>
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
      <div
        style={{
          //   border: '1px solid red',
          overflow: 'visible',
        }}
      >
        {props?.propAllInstallemnt?.length && props?.propAllInstallemnt?.length > 0 ? (
          props?.propAllInstallemnt?.map((item: any) => (
            <Box>
              {/* <LoadingScreen isLoading={screenLoader} /> */}
              <CartLoadingScreen isLoading={screenLoader} color={''} indicatorColor={'#298EAE'} />
              <Card
                p={0}
                sx={{
                  border: '1px solid #D8DFE9',
                  //   border: '1px solid red',
                  marginTop: '0.7rem',
                }}
                radius={8}
              >
                <Stack p={16}>
                  <Group noWrap position="apart">
                    <Text
                      size="xs"
                      style={{
                        fontWeight: 600,
                        fontSize: '1.2rem',
                      }}
                    >
                      {item?.title}
                    </Text>
                  </Group>
                </Stack>
                <Seperator />
                <Stack p={16} spacing={0}>
                  <Group position="apart">
                    <Text
                      size="xs"
                      sx={{
                        fontSize: '1.2rem',
                      }}
                    >
                      {t.invoice?.listOfAllInstallment}
                    </Text>
                    {/* <Text sx={{ color: '#939393' }} size="xs">
                        {props?.paymentData?.order_id}
                    </Text> */}
                  </Group>
                  <Card sx={{ width: '100%' }} p={3}>
                    {item?.installments &&
                      item?.installments?.map((e: any) => (
                        <Card
                          p={9}
                          sx={{
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            marginTop: '2rem',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                              }}
                            >
                              <Checkbox
                                id={`chk-installment-${e?.instalment_id}`}
                                color="cyan"
                                onChange={() =>
                                  handlePendingInstallment(
                                    e,
                                    e?.instalment_id,
                                    e?.payment_plan_id,
                                    e?.is_selected
                                  )
                                }
                                checked={e?.is_selected}
                                sx={{
                                  paddingRight: '0.5rem',
                                }}
                                size={isSmallScreen ? 'xs' : 'md'}
                              />

                              <Box>
                                <Text size={isSmallScreen ? 'xs' : 'md'} className="amountText">
                                  {t.amount}
                                </Text>

                                <Text size={isSmallScreen ? 'xs' : 'md'} className="amountText">
                                  {t.Due_date}{' '}
                                </Text>
                              </Box>
                            </Box>
                            <Box>
                              <Text
                                sx={{
                                  color: '#939393',
                                  whiteSpace: 'nowrap',
                                  paddingTop: '0.1rem',
                                }}
                                size={isSmallScreen ? 'xs' : 'md'}
                              >
                                {e?.amount + ' KWD'}
                              </Text>

                              <Text
                                sx={{ color: '#939393', whiteSpace: 'nowrap' }}
                                size={isSmallScreen ? 'xs' : 'md'}
                              >
                                {e?.due_date}
                              </Text>
                            </Box>
                          </Box>

                          {e?.cart_coupon_id === null && e?.is_selected ? (
                            <Button
                              id="btn-pendingApplyCoupon"
                              className="btnapplyCoupon"
                              onClick={() => {
                                setCouponData(e);
                                setIsOpen(true);
                                setselectedcouponInstallment(e);
                              }}
                              disabled={applyCouponDisbaled}
                            >
                              {t.apply_coupon}
                            </Button>
                          ) : (
                            <>{''}</>
                          )}
                          {e?.cart_coupon_id !== null && e?.is_selected ? (
                            <Button
                              // className="btnapplyCoupon"
                              id="btn-pendingRemoveCoupon"
                              onClick={() => deleteMyCoupon(e?.cart_coupon_id)}
                              disabled={removeCouponDisbaled}
                              sx={{
                                color: 'red',
                              }}
                              className="removeCouponBtn"
                            >
                              {t.removecoupon}
                            </Button>
                          ) : (
                            ''
                          )}
                        </Card>
                      ))}

                    {/* <Stack
                    sx={{
                        flexDirection: 'row',
                        //backgroundColor: 'blue',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    my={15}
                ></Stack> */}
                  </Card>
                </Stack>
              </Card>
            </Box>
          ))
        ) : (
          <NoRecordFound />
        )}
      </div>
    </div>
  );
}
