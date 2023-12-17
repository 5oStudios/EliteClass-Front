import { DrawerHeader } from '@/components/ui/DrawerHeader';
import { CompletedMarkIcon } from '@/src/constants/icons';
import { Space, Affix } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
export default function TestTheDevice(props: any) {
  const [checkMyDevice, setCheckMyDevice] = useState(false);
  const [browserAgent, setbrowserAgent] = useState('');
  const router = useRouter();
  const testTheDevice = () => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      setbrowserAgent(userAgent);
      const isMobile = /iphone|ipod|ipad|android|blackberry|windows phone/.test(userAgent);
      setCheckMyDevice(isMobile);
      if (isMobile) {
        console.log('User is using a mobile device');
      } else {
        console.log('User is using a laptop/desktop device');
      }
    }
  };
  useEffect(() => {
    testTheDevice();
  }, []);
  return (
    <>
      <></>
      <Affix position={{ top: 0, left: 0, right: 0 }} sx={{ minWidth: '100vw' }}>
        <DrawerHeader
          title={'Test Device'}
          handleClose={() => {
            router.back();
          }}
          rightSection={<CompletedMarkIcon />}
        />
      </Affix>
      <Space h={90} />
      <div
        style={{
          padding: '5rem 2rem',
        }}
      >
        {browserAgent}
        <h2>{checkMyDevice ? 'Mobile device' : 'Desktop'}</h2>
      </div>
    </>
  );
}
