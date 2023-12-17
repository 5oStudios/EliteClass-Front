import React from 'react';

import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, useMantineColorScheme } from '@mantine/core';
import { Button } from '@/components/ui/Button';
import { AccessDeniedSvg } from '../constants/accessDeniedSvg';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
export default function accessdenied() {
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const getCurrentUrl = getCookie('urlBeforeAccessDenied');

  const backToHome = () => {
    router.replace('/');
    deleteCookie('urlBeforeAccessDenied');
  };
  return (
    <Container className="resoucePageContainer">
      <AccessDeniedSvg />

      <p
        className="resourceNotFoundtitle"
        style={{
          color: colorScheme == 'dark' ? '#E2BB50' : '#000000',
        }}
      >
        {t?.AccessDeniedTitle}
      </p>
      <p className="resourceNotFoundsubtitle">{t?.accessDeniedSubTitle}</p>

      <p
        style={{
          color: '#E2BB50',
        }}
      >
        {getCurrentUrl}
      </p>
      <Button title="Return-Home" onClick={backToHome} />
    </Container>
  );
}
