import React, { useEffect, useState } from 'react';
import { Box, Loader, useMantineColorScheme } from '@mantine/core';
import printJS from 'print-js-updated';
import axios from '@/components/axios/axios.js';
import { PrintBtn } from '@/src/constants/Print';
import { CartLoadingScreen } from '@/components/ui/cart-loader-screen';
import { LoadingDots } from '../ui/loading-dots';
import Image from 'next/image';
// import { DoubleCircle } from '@/src/constants/DoubleCircle';
// import { PrintIcon } from '@/src/constants/PrintIcon';
const PrintComponent = ({ id, setLoading, loading }: any) => {
  const [disablePrint, setDisabledPrint] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  useEffect(() => {
    setDisabledPrint(true);
    setTimeout(() => {
      setDisabledPrint(false);
    }, 4000);
  }, []);
  const handleFilePrint = async () => {
    try {
      if (disablePrint) {
        return;
      }
      setLoading(true);
      const type = 'print';
      const { data } = await axios.post(`courseclass/file/permission`, {
        type,
        class_id: id,
      });
      await axios.get(data.URL);
      console.log('link to print:' + data.URL);

      printJS(data.URL);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  return (
    <button
      type="submit"
      onClick={handleFilePrint}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
      disabled={loading}
    >
      <>
        {disablePrint ? (
          <Image src="/assets/print_Disabled.svg" alt="print Avatar" width={'20'} height={'20'} />
        ) : loading ? (
          <Loader size={'xs'} color={'#EDD491'} />
        ) : colorScheme === 'light' ? (
          <PrintBtn />
        ) : (
          <Image src="/assets/print_light.svg" alt="print Avatar" width={'20'} height={'20'} />
        )}
      </>
    </button>
  );
};

export default PrintComponent;
