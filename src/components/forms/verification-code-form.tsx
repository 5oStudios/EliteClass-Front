import {
  Box,
  Button,
  Center,
  Container,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import React, { useState } from 'react';
import VerificationInput from 'react-verification-input';
import styles from '@/src/styles/verfication-input.module.css';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import ResentCode from '../ui/ResentCode';
import NextImage from 'next/image';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { CodeWhite } from '@/src/constants/icons/code-white';
import { Code } from '@/src/constants/icons/code';

type Props = {
  nextStep: () => void;
  verifydata: any;
  setAllResetData: any;
};

export const ConfirmationCodeForm = ({ nextStep, verifydata, setAllResetData }: Props) => {
  // language

  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language

  const [code, setCode] = React.useState('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableLink, setDisableLink] = useState(false);

  const verifyCode = async () => {
    // call nextStep only if code is valid
    if (code) {
      const data = { email: verifydata.email, code };
      setSubmitting(true);
      setDisableLink(true);
      await axios
        .post('verifycode', data)
        .then((response) => {
          if (response.status === 200) {
            setSubmitting(false);
            setDisableLink(false);
            setAllResetData({ email: verifydata.email, otp: code });
            nextStep();
          }
        })
        .catch((error) => {
          setSubmitting(false);
          setDisableLink(false);
          setCode('');
          //@ts-ignore
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
    } else {
      showNotification({
        message: 'Please enter verification code.',
        color: 'red',
      });
    }
  };

  return (
    <>
      <Container fluid my={30}>
        <Center>
          {/* <NextImage src="/assets/images/two-factor-authentication.svg" width={300} height={270} priority /> */}
          {colorScheme == 'dark' ? <CodeWhite /> : <Code />}
        </Center>
        <Text component="h2" size="xl" className="forgotpassword" weight={500}>
          {t.Enter_the_verification_code}
        </Text>
        <Text component="p" size="xs" color={'#298EAE'} className="Sub_forgotpassword">
          {
            t.Check_your_email_address_and_copy_the_one_time_password_sent_to_you_in_your_email_and_paste_it_here
          }
        </Text>

        <Stack mt={30} dir="ltr">
          <VerificationInput
            removeDefaultStyles
            value={code}
            placeholder=""
            onChange={(value) => setCode(value)}
            autoFocus
            inputProps={{ inputMode: 'numeric' }}
            validChars="0-9"
            // inputProps={{
            //   type: 'number',
            // }}
            length={4}
            classNames={{
              container: styles.container,
              character: styles.character,
              characterInactive: styles.characterInactive,
              characterSelected: styles.characterSelected,
            }}
          />

          <Space />
          <Button
            id="btn-verify"
            loading={submitting}
            onClick={() => {
              verifyCode();
            }}
            type="submit"
            size="md"
            radius={20}
          >
            {t.verify}
          </Button>
        </Stack>

        <Space h={30} />

        <Stack align="center" spacing={0} sx={{ width: '100%', marginTop: '10vh' }}>
          <ResentCode verifydata={verifydata} disableLink={disableLink} setCode={setCode} />
        </Stack>
      </Container>
    </>
  );
};

// register  => verfiy email (404) => OTP => login => Home
