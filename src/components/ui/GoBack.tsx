import { ActionIcon } from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React from 'react';

export const GoBack = () => {
  const router = useRouter();

  function handleBack() {
    if (getCookie('skipHome')) {
      setCookie('isSkipTutorial', true, {
        maxAge: 24 * 60 * 60 * 30,
      });
      router.replace('/user/onboarding');
    } else if (typeof window !== 'undefined' && window.history.state.idx === 0) {
      router.replace('/');
    } else {
      router.back();
    }
  }
  return (
    <>
      <ActionIcon
        id="btn-back"
        title="Go Back"
        onClick={handleBack}
        variant="hover"
        sx={{ position: 'absolute', top: 40, zIndex: 2 }}
      >
        <ArrowLeftIcon className="rtl" width={100} height={100} />
      </ActionIcon>
    </>
  );
};
