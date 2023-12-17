import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from '@/components/axios/axios.js';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { PageHeader } from '@/components/ui/pageHeader';
import { useForm } from '@mantine/form';
import useNextBlurhash from 'use-next-blurhash';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const Refill = () => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language

  const { success, message } = router.query;
  const [isdevelopment, setIsDevelopment] = useState(false);
  const [successModal, setSuccessModel] = useState(false);

  useEffect(() => {
    if (success !== undefined && success !== null && success !== '') {
      setSuccessModel(true);
    }
  }, []);

  useEffect(() => {
    if (success !== undefined && success !== null && success !== '') {
      setTimeout(() => {
        // showNotification({
        //   message: decodeURI(message as string),
        //   color: success === '0' ? 'red' : 'green',
        // });
        // alert(decodeURI(message));
      }, 750);
    }
  }, []);

  const form = useForm<{ amount: number | undefined }>({
    initialValues: {
      amount: undefined,
    },
    validate: (values) => ({
      amount:
        values.amount === undefined
          ? 'Please fill the amount'
          : values.amount > 5000
          ? 'Maximum amount allowed is 5000KWD'
          : null,
    }),
  });

  const refill = async () => {
    if (isdevelopment) {
      const obj = {
        amount: form.values.amount,
        transaction_id: 'sdkcn4n34jh3nh5b4j5',
        payment_method: 'Strip',
      };
      const config = {
        method: 'post',
        url: 'wallet/topup',
        data: obj,
      };
      const res = await axios(config).then((res) => res.data);
      return res;
    } else {
      const obj = {
        amount: form.values.amount,
      };
      const config = {
        method: 'post',
        url: 'wallet/upayment/card/topup',
        data: obj,
      };
      const res = await axios(config).then((res) => res.data);
      return res;
    }
  };

  const { mutate, isLoading } = useMutation<any, any>(refill, {
    onSuccess: (response) => {
      if (isdevelopment) {
        showNotification({
          message: response?.success,
          color: 'green',
        });
        // router.back();
      } else {
        const invoiceURL = response?.Data?.invoiceURL;
        console.log('Supposed to be redirect to pay invoice on :: ', invoiceURL);
        //throw new Error('Handel payment via card please');
        if (invoiceURL === '' || invoiceURL === undefined || invoiceURL === null) {
          throw new Error('My footora return empty url');
        } else {
          // router.replace(invoiceURL);
          window.location.replace(invoiceURL);
        }
      }
    },
    onError: (error) => {
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
    },
  });

  function handleContinue() {
    mutate();
  }

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
              id="btn-refillSuccessModalClose"
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
      <PageHeader title={t['wallet-details'].refill} />
      <Container>
        <Group align="center" position="center" sx={{ width: '100%' }}>
          <Image src="/assets/images/businessfinance 1.png" width={300} height={225} priority />
        </Group>
        <Space h={20} />
        <form onSubmit={form.onSubmit(handleContinue)}>
          <Stack>
            <Text size="xs">{t.Write_the_cost_that_you_want_to_fill_in_wallet}</Text>
            <NumberInput
              variant="filled"
              placeholder="200 KWD"
              type="number"
              size="md"
              min={1}
              maxLength={4}
              radius={8}
              hideControls
              {...form.getInputProps('amount')}
            />
            <Button loading={isLoading} type="submit" size="md" radius={8}>
              {t.continue}
            </Button>
          </Stack>
        </form>
      </Container>
    </div>
  );
};

export default Refill;
