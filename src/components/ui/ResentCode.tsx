import { Group, Loader, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

type Props = {
  verifydata: any;
  disableLink: boolean;
  setCode: any;
};

export const ResentCode = ({ verifydata, disableLink, setCode }: Props) => {
  // language
  const langRouter = useRouter();
  const t = langRouter.locale === 'ar-kw' ? ar : en;
  // language

  const time = new Date();
  time.setSeconds(time.getSeconds() + 59);
  const { seconds, minutes, restart, isRunning } = useTimer({
    expiryTimestamp: time,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const resentOtpCode = () => {
    // resend code
    setCode('');
    const data = { email: verifydata.email };
    setIsLoading(true);
    axios
      .post('forgotpassword', data)
      .then((response) => {
        if (response.status === 200) {
          showNotification({ message: 'Verification code sent successfully', color: 'teal' });
        }
      })
      .catch((error) => {
        // if account does not exist, show error message
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
      })
      .finally(() => {
        setIsLoading(false);
        const newTime = new Date();
        newTime.setSeconds(newTime.getSeconds() + 59);
        restart(newTime);
      });
  };

  return (
    <div>
      <Text>{t['didnt-receive-code']}</Text>
      <Group align="center" position="center">
        {isRunning ? (
          <Text weight={500}>
            {t.Resend_in} {minutes}:{seconds}
          </Text>
        ) : isLoading ? (
          <Loader variant="dots" />
        ) : (
          <UnstyledButton
            id="btn-forgotresendCode"
            disabled={disableLink}
            onClick={resentOtpCode}
            sx={(theme) => ({
              color: theme.colors.primary[5],
              textDecoration: 'underline',
              fontWeight: 500,
            })}
          >
            {t.resend_code}
          </UnstyledButton>
        )}
      </Group>
    </div>
  );
};

export default ResentCode;
// export default React.memo(ResentCode, (prev, next) => {
//   return prev.verifydata.email === next.verifydata.email  && prev.disableLink !==next. ;
// });
