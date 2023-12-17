import { Group, Loader, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

type Props = {
  disableLink: boolean;
  setCode: any;
};

const ResentEmailCode = ({ disableLink, setCode }: Props) => {
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

  const resentCode = () => {
    setCode('');
    const email = localStorage.getItem('user_email');
    setIsLoading(true);
    axios
      .post('email/resend/otp', {
        email,
      })
      .then((res) => {
        if (res.status === 200) {
          showNotification({
            message: 'Verification code sent to your email',
            color: 'teal',
          });
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
          <Text>
            {t.Resend_in} {minutes}:{seconds}
          </Text>
        ) : isLoading ? (
          <Loader variant="dots" />
        ) : (
          <UnstyledButton
            id="btn-emailresendCode"
            onClick={resentCode}
            disabled={disableLink}
            sx={(theme) => ({
              color: theme.colors.primary[5],
              textDecoration: 'underline',
            })}
          >
            {t.resend_code}
          </UnstyledButton>
        )}
      </Group>
    </div>
  );
};

export default ResentEmailCode;
