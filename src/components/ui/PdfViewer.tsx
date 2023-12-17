import React, { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Skeleton,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import Print from '../../../public/assets/images/print.svg';
import { SizeMe } from 'react-sizeme';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { markComplete } from '@/utils/axios/markLessonComplete';
import { useId } from '@mantine/hooks';
import { getCookie } from 'cookies-next';
import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';
import NextImage from 'next/image';
import { shimmer, toBase64 } from '@/utils/utils';
import { DynamicFileViewer } from './DynamicFileViewer';
import { CartLoadingScreen } from './cart-loader-screen';
import { PrintBtn } from '@/src/constants/Print';
const PdfViewer = ({
  src,
  title,
  id,
  fileType,
  showPrintButton = true,
  showDownloadButton = true,
}: {
  src: any;
  title: any;
  id: string;
  fileType: string;
  showDownloadButton?: boolean;
  showPrintButton?: boolean;
}) => {
  console.log('Src and File Type', src, fileType);
  const stableid = useId();
  const [numPages, setNumPages] = useState(1);
  const router = useRouter();
  const [showLoader, setshowLoader] = useState(false);
  const [printUrl, setPrintUrl] = useState(null);
  const [screenLoader, setScreenLoader] = React.useState(false);
  const { slug } = router.query;
  const componentRef = useRef();
  const { colorScheme } = useMantineColorScheme();

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const cache = useQueryClient();
  const handleDownload = async () => {
    const type = 'download';
    console.log(id, type);
    try {
      const { data } = await axios.post(`courseclass/file/permission`, {
        type,
        class_id: id,
      });
      setshowLoader(false);
      return data;
    } catch (error: any) {
      setshowLoader(false);
      const err = error?.response?.data?.errors;
      if (err && error?.response?.status !== 406) {
        Object.keys(err).forEach((i) => {
          err[i].forEach((item: any) => {
            showNotification({
              message: item,
              color: 'red',
            });
          });
        });
      }
    }

    return {
      id,
      type,
    };
  };

  const handleComplete = () => {
    // markComplete({ class_id: id as string });
    // cache.invalidateQueries([`courses/lessons`, slug]);
    router.back();
  };

  const token = getCookie('access_token');

  useEffect(() => {}, [src, src?.url]);

  const handleFilePrint = async () => {
    try {
      const type = 'print';
      console.log(id, type);
      const { data } = await axios.post(`courseclass/file/permission`, {
        type,
        class_id: id,
      });
      console.log(data);
      const resp = await axios.get(data.URL);
      console.log('Print URl', resp.data);
      setPrintUrl(resp && resp.data);
      // handlePrint();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <LoadingOverlay visible={showLoader} />

      <Card
        radius={0}
        p={0}
        sx={{
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
        }}
      >
        <Stack justify="center" sx={{ minHeight: 70, paddingLeft: 10 }}>
          <Group noWrap position="apart">
            <Group noWrap>
              <ActionIcon
                id="btn-lessonsBack"
                styles={{
                  root: {
                    zIndex: 1000,
                  },
                }}
                variant="transparent"
                onClick={
                  typeof window !== 'undefined' && window.history.state.idx === 0
                    ? () => router.replace('/')
                    : () => router.back()
                }
              >
                <ArrowLeftIcon className="rtl" width={40} height={40} />
              </ActionIcon>
              {title ? (
                <Text sx={(theme) => ({ color: theme.colorScheme === 'dark' ? '#EDD491' : '' })}>
                  {title}
                </Text>
              ) : (
                <Skeleton height={25} width={150} />
              )}
            </Group>
          </Group>
        </Stack>
      </Card>
      <Box
        style={{ overflow: 'scroll' }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '92.5vh',
          // maxWidth: 800,
        }}
        // mt={10}
        m="auto"
      >
        <Affix
          position={{ top: 20, right: 13 }}
          sx={{ width: '100%', display: 'flex', justifyContent: 'end', gap: 15 }}
        >
          {
            // @ts-ignore
            !window.ReactNativeWebView ? (
              <>
                {showPrintButton && (
                  <Button
                    style={{
                      background: 'none',
                    }}
                    // onClick={handleFilePrint}
                  >
                    <PrintBtn color={colorScheme === 'light' ? '#200E32' : '#EDD491'} />
                  </Button>
                )}{' '}
                {showDownloadButton && (
                  <NextImage
                    width={30}
                    height={30}
                    src={
                      colorScheme === 'light' ? '/assets/download.svg' : '/assets/download copy.svg'
                    }
                    onClick={async () => {
                      setshowLoader(true);
                      const res = await handleDownload();

                      //@ts-ignore
                      window.open(res.URL, '_blank').focus();
                    }}
                    // layout="fill"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    priority
                    style={{ borderRadius: 8 }}
                  />
                )}
              </>
            ) : (
              <>
                {showDownloadButton && (
                  <NextImage
                    width={30}
                    height={30}
                    src={'/assets/download.svg'}
                    onClick={async () => {
                      setshowLoader(true);
                      const res = await handleDownload();
                      const shareableObject = {
                        event: 'urlOpen',
                        url: res.URL,
                        Authorization: ``,
                      };

                      const objStringfy = JSON.stringify(shareableObject);
                      // @ts-ignore
                      window.ReactNativeWebView.postMessage(objStringfy);
                    }}
                    // layout="fill"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    priority
                    style={{ borderRadius: 8 }}
                  />
                )}
              </>
            )
          }
        </Affix>
        <CartLoadingScreen isLoading={screenLoader} color={'#FFFFFF50'} indicatorColor={'#FFFFF'} />
        <DynamicFileViewer fileType={fileType} fileName="sample.pdf" url={src && src?.url} />
      </Box>
    </Box>
  );
};

export default React.memo(PdfViewer, (prev, next) => {
  return prev.src !== next.src && prev.id !== next.id;
});
