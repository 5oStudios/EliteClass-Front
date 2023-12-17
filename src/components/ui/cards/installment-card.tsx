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
import axios from '@/components/axios/axios.js';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import process from 'process';
import React, { useEffect, useState } from 'react';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { showNotification } from '@mantine/notifications';
import { CartLoadingScreen } from '../cart-loader-screen';
import Link from 'next/link';
import { Skeletons } from '@/components/saved-cards/Skeletons';
import { useMediaQuery } from '@mantine/hooks';
import instance from '@/components/axios/axios';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { LoadingScreen } from '../loader-screen';
import Installment from './Installment';
import PaymentSummary from './PaymentSummary';
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

export const PaymentCard = (props: any) => {
  console.log('props of Payment Data', props?.paymentData);
  //language
  const [booking, setBooking] = useState(false);
  const [submintLoader, setSubmitLoader] = useState(false);
  const [isOpened, setIsOpen] = useState(false);
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [coupon, setCoupon] = React.useState(props?.paymentData?.coupon || '');
  const [appling, setAppling] = React.useState(false);
  const [screenLoader, setScreenLoader] = React.useState(false);
  const [checked, setChecked] = useState(false);
  const [couponData, setCouponData] = useState<any>({});
  const [instalcoupon, setInstalCoupon] = React.useState('');
  const [refetchCart, setFetchCart] = useState(false);
  const [removeCouponDisbaled, setremoveCouponDisabled] = useState(false);
  const [openTopUpConfirmModal, setOpenTopUpConfirmModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  type CouponInstallment = {
    type: string;
    type_id: number;
    instalment_id: number;
    payment_plan_id: string;
    bundle_id: string;
  };
  const [selectedcouponInstallment, setselectedcouponInstallment] = useState<CouponInstallment>({
    type: '',
    type_id: 0,
    instalment_id: 0,
    payment_plan_id: '',
    bundle_id: '',
  });
  const [isAppliedTrue, setIsAppliedTrue] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('KNET');
  const [propData, setPropData] = useState(null);
  // const [getPendingData, setGetPendingData] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const token = getCookie('access_token');
  useEffect(() => {
    setPropData(props?.paymentData?.installments);
  }, [props.paymentData?.installments, propData]);
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
  useEffect(() => {
    props.updatedUi();
  }, []);

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
        props.updatedUi();
        setIsAppliedTrue(res?.data?.installments);
        setScreenLoader(false);
        props?.refetchInstallments();
        setAppling(false);
        showNotification({
          message: res?.data?.msg,
          color: 'green',
        });
        if (!res?.data?.is_applied) {
          setCoupon('');
        }
      })
      .catch((error) => {
        setAppling(false);
        setScreenLoader(false);
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
              },
            }}
          />
        </Box>
        <Button
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
        setScreenLoader(false);
        setremoveCouponDisabled(true);
      }
      showNotification({
        message: 'Coupon is removed',
        color: 'red',
      });

      props.updatedUi();
    } catch (error) {
      showNotification({
        message: 'Network error',
        color: 'red',
      });
    } finally {
      setTimeout(() => {
        setremoveCouponDisabled(false);
      }, 2000);
    }
  };

  useEffect(() => {
    setBooking(false);
  }, [router]);
  //language
  return (
    <>
      {props.isFetching && props.isLoading ? (
        <Skeletons />
      ) : (
        <>
          <div
            style={{
              height: '47vh',
              overflow: 'scroll',
              // boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
            }}
          >
            <Installment
              propAllInstallemnt={props?.paymentData?.installments}
              setPendingData={props.setPendingData}
              updatedUi={props.updatedUi}
            />
          </div>

          <div
            style={{
              // background: 'white',
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.35) 10px 15px 15px',
              height: '36vh',
              display: 'flex',
              // justifyContent:"end"
              alignItems: 'end',
            }}
          >
            {props?.paymentData?.installments.length > 0 ? (
              <PaymentSummary paymentData={props?.paymentData} />
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  );
};
