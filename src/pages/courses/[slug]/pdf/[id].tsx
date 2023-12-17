import { useRouter } from 'next/router';
import axios from '@/components/axios/axios';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Affix, Button } from '@mantine/core';
import { markComplete } from '@/utils/axios/markLessonComplete';
import { useQueryClient } from 'react-query';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import authMiddleware from '@/src/authMiddleware';

const DynamicComponentWithNoSSR = dynamic(() => import('../../../../components/ui/PdfViewer'), {
  ssr: false,
});

const PdfReader = () => {
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('');
  //language

  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;

  //language
  const { id, status } = router.query;
  useEffect(() => {
    const getPdf = async () => {
      const res = await axios.get(`course/lesson-content?class_id=${id}`);

      setUrl(res.data.content);
      setTitle(res.data.title);
      setFileType(res.data.type);
    };

    if (id) {
      getPdf();
    }
  }, [id]);
  const cache = useQueryClient();

  useEffect(() => {
    if (!complete && status === 'in_complete') {
      handleComplete();
    }
  }, [complete, status]);

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
      <DynamicComponentWithNoSSR id={id as string} src={url} title={title} fileType={fileType} />
      {/* {!complete && status === 'in_complete' && (
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
            {t["mark-complete"]}
          </Button>
        </Affix>
      )} */}
    </>
  );
};

export default authMiddleware(PdfReader);
