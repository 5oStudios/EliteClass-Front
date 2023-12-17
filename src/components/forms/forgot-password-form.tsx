import {
  Box,
  Button,
  Center,
  Container,
  InputWrapper,
  Space,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { MessageIcon } from '@/src/constants/icons';
import { validateEmail } from '@/src/utils/check-email-validation';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import NextImage from 'next/image';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import { Forgot } from '@/src/constants/icons/forgot';
import { ForgotWhite } from '@/src/constants/icons/forgot-white';

type Props = {
  nextStep: () => void;
  setForgotData: (data: any) => any;
};

export const ForgotPasswordForm = ({ nextStep, setForgotData }: Props) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  //language
  // const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: validateEmail,
    },
  });

  const handleSubmit = (data: { email: string }) => {
    console.log(data);
    setSubmitting(true);
    // call nextStep only if email is valid
    axios
      .post('forgotpassword', data)
      .then((response) => {
        if (response.status === 200) {
          setForgotData({ email: data?.email, otpCode: '' });
          nextStep();
        }
      })
      .catch((error) => {
        setSubmitting(false);
        // if account does not exist, show error message
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          //@ts-ignore
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
          console.log(error);
        }
      });
  };

  return (
    <>
      <Container fluid my={30}>
        <Box pt={30}>
          <Center sx={{ height: 200 }}>
            {/* <NextImage src="/assets/images/forgot-password.svg" width={270} height={250} priority /> */}
            {colorScheme == 'dark' ? <ForgotWhite /> : <Forgot />}
          </Center>
        </Box>
        <Space h="xl" />
        <Text component="h2" className="forgotpassword" size="xl" weight={600}>
          {t.forgot_password}?
        </Text>
        <Space mt={-10} />
        <Text component="p" size="xs" className="Sub_forgotpassword" sx={{ color: '#298EAE' }}>
          {t.Just_fill_the_email}
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing={50}>
            <InputWrapper
              label={t.email}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
            >
              <TextInput
                icon={<MessageIcon />}
                id="inp-verificationEmail"
                variant="filled"
                placeholder={t.email}
                aria-label="Your email"
                type="email"
                error={form.errors.email}
                {...form.getInputProps('email')}
                size="md"
                radius={20}
                styles={(theme) => ({
                  input: {
                    backgroundColor: '#F7F6F5',
                    color: '#298EAE',
                  },
                })}
              />
            </InputWrapper>
            {/* {!isValidEmail && (
              <Text component="span" size="sm" color="red">
                Account with this email doesn&apos;t exits
              </Text>
            )} */}
            <Button
              id="btn-sendVerificationCode"
              loading={submitting}
              type="submit"
              size="md"
              radius={20}
            >
              {t.Send_Verification_Code}
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};
