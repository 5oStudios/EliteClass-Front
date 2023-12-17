import {
  Box,
  Button,
  Container,
  InputWrapper,
  PasswordInput,
  Space,
  Stack,
  Text,
  Center,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { LockIcon } from '@/src/constants/icons';
import axios from '@/components/axios/axios.js';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import NextImage from 'next/image';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import { ResetWhite } from '@/src/constants/icons/reset-white';
import { Reset } from '@/src/constants/icons/reset';

export const ResetPasswordForm = (props: any) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  //language
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => {
        if (!value) {
          return 'Required';
        }
        return value.length < 8 ? 'Password must be at least 8 characters' : null;
      },
    },
  });

  const handleSubmit = (data: { password: string }) => {
    setSubmitting(true);
    const obj = {
      email: props?.reset?.email,
      code: props?.reset?.otp,
      password: data?.password,
    };
    axios
      .post('resetpassword', obj)
      .then((response) => {
        router.replace('/signin');
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
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

  return (
    <>
      <Container fluid my={30}>
        <Center>
          {/* <NextImage src="/assets/images/reset-password.svg" width={300} height={270} priority /> */}
          {colorScheme == 'dark' ? <ResetWhite /> : <Reset />}
        </Center>
        <Space h="xl" />
        <Text component="h2" className="forgotpassword" size="xl" weight={500}>
          {t['reset-password']}
        </Text>
        <Space mt={-10} />
        <Text component="p" size="xs" className="Sub_forgotpassword" sx={{ color: '#298EAE' }}>
          {t.Enter_a_new_password}
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing={50}>
            <InputWrapper
              label={t.password}
              labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              className="resetInput"
            >
              <PasswordInput
                id="inp-passwordReset"
                icon={<LockIcon />}
                variant="filled"
                placeholder={t.password}
                autoComplete="new-password"
                aria-label="Your password"
                size="md"
                radius={20}
                error={form.errors.password}
                {...form.getInputProps('password')}
                visibilityToggleIcon={({ reveal, size }) =>
                  reveal ? (
                    <EyeCheck size={size} color="#298EAE" />
                  ) : (
                    <EyeOff size={size} color="#298EAE" />
                  )
                }
                styles={(theme) => ({
                  input: {
                    color: 'red',
                    backgroundColor: '#F7F6F5',
                  },
                })}
              />
            </InputWrapper>
            <Button id="btn-passwordReset" loading={submitting} type="submit" size="md" radius={20}>
              {t.reset}
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};
