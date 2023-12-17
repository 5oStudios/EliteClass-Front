import { useRouter } from 'next/router';
import axios from '@/components/axios/axios';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Affix, Button } from '@mantine/core';
import { markComplete } from '@/utils/axios/markLessonComplete';
import { useQueryClient } from 'react-query';
import NextImage from 'next/image';
import { getCookie } from 'cookies-next';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { shimmer, toBase64 } from '@/utils/utils';
import { CartLoadingScreen } from '@/components/ui/cart-loader-screen';
import MuPdfViewer from '@/components/screens/muPdf/pdf';
import authMiddleware from '@/src/authMiddleware';

const DynamicComponentWithNoSSR = dynamic(() => import('../../../../components/ui/PdfViewer'), {
  ssr: false,
});

const token = getCookie('access_token');
console.log(token);
const PdfReader = () => {
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<any>({} as object);
  const [title, setTitle] = useState('');
  const [fileType, setFileTitle] = useState('');
  const [screenLoader, setScreenLoader] = useState(false);
  const [pdfLoader, setpdfLoader] = useState(false);
  const [rendering, setRendering] = useState(true);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [isPrintable, setIsPrintable] = useState(false);
  const [downloadURL, setDownloadURL] = useState('');
  const [directLink, setdirectURL] = useState('');
  const componentRef = useRef(null);
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //languagePDF
  const { id, status } = router.query;
  useEffect(() => {
    const getPdf = async () => {
      const res = await axios.get(`course/lesson-content?class_id=${id}`);
      let fullURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${res.data.content}`;
      let downloadURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${res.data.download_link}`;
      let directURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${res.data.direct_link}`;
      setDownloadURL(downloadURL);
      setdirectURL(directURL);

      let fileOBJ = {
        url: fullURL,
        httpHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/pdf',
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      };
      console.log(fileOBJ);

      setUrl(fileOBJ as object);
      setTitle(res.data.title);
      setFileTitle(res.data?.type);
      setRendering(false);
      setIsDownloadable(!!res?.data?.is_downloadable ?? false);
      setIsPrintable(!!res?.data?.is_printable ?? false);
    };

    if (id) {
      getPdf();
    }
  }, [id]);
  const cache = useQueryClient();

  useEffect(() => {
    if (!rendering) {
      handleComplete();
    }
  }, [rendering]);

  useEffect(() => {
    setScreenLoader(true);
    setTimeout(() => {
      setScreenLoader(false);
    }, 1500);
  }, []);
  useEffect(() => {
    setpdfLoader(true);
    setTimeout(() => {
      setpdfLoader(false);
    }, 3000);
  }, []);

  const handelDownloadClick = async () => {
    const res = await axios.get(downloadURL, {
      headers: {
        Accept: 'application/pdf',
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
    });
    if (res && res.data) {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'mypdf.pdf';
      link.click();
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    markComplete({ class_id: id as string })
      .then(() => {
        setComplete(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    cache.invalidateQueries([`courses/lessons`, id]);
  };

  return (
    <>
      <CartLoadingScreen isLoading={screenLoader} color={'#FFDD83'} indicatorColor={'#FFFF'} />{' '}
      {!rendering &&
        (fileType === 'pdf' ? (
          // 'helo it is pdf data by the'<>
          <>
            {/* {alert(url)} */}
            {console.log('line 141 ', url)}
            {url ? (
              <>
                <CartLoadingScreen
                  isLoading={pdfLoader}
                  color={'#FFDD83'}
                  indicatorColor={'#FFFF'}
                />
                <MuPdfViewer
                  src={url}
                  title={`${title.slice(0, 15)}...`}
                  id={id as string}
                  showPrintButton={!!(complete && !rendering && isPrintable)}
                  showDownloadButton={!!(complete && !rendering && isDownloadable)}
                  fileType={fileType}
                />
              </>
            ) : (
              <CartLoadingScreen isLoading={pdfLoader} color={'#FFDD83'} indicatorColor={'#FFFF'} />
            )}
          </>
        ) : (
          <DynamicComponentWithNoSSR
            id={id as string}
            src={url}
            title={`${title.slice(0, 15)}...`}
            showPrintButton={!!(complete && !rendering && isPrintable)}
            showDownloadButton={!!(complete && !rendering && isDownloadable)}
            fileType={fileType}
          />
        ))}
      {/* {!complete && status === 'in_complete' && !rendering && (
        <Affix
          position={{ bottom: 15 }}
          sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Button
            size="md"
            radius={8}
            onClick={handleComplete}
            loading={isLoading}
            sx={{
              width: '100%',
              maxWidth: '300px',
            }}
          >
            {t['mark-complete']}
          </Button>
        </Affix>
      )} */}
    </>
  );
};

export default authMiddleware(PdfReader);
