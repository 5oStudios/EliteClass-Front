import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { BaseModalWrapper } from '@/components/modals/base-modal';
import BackToSchoolSVG from '@/public/assets/update-app-back-to-school';
import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';

export const UpdateAppModal = () => {
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [open, setOpen] = useState(true);
  return (
    <BaseModalWrapper
      open={open}
      content={
        <Stack>
          <BackToSchoolSVG />
          <Text align={'center'} size={'lg'}>
            {t['update-app-modal'].title}
          </Text>
          <Text align={'center'} size={'xs'} color={'gray'}>
            {t['update-app-modal'].description}
          </Text>
        </Stack>
      }
      footer={
        <Button variant={'filled'} fullWidth>
          {t['update-app-modal'].update}
        </Button>
      }
    />
  );
};
