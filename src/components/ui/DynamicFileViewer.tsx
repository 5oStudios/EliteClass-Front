import React, { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import axios from '@/components/axios/axios';
import { getCookie } from 'cookies-next';
import ZipAndRar from '../../../public/assets/images/ZipAndRar.svg';
import Image from 'next/image';
import { CartLoadingScreen } from './cart-loader-screen';
import { DoubleCircle } from '@/src/constants/DoubleCircle';
export const DynamicFileViewer = ({
  fileType,
  fileName,
  url,
}: {
  fileType: string;
  fileName: string;
  url: string;
}) => {
  console.log('From Dynamic File Viewer type', url, fileType);
  const [viewFile, setViewFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenLoader, setScreenLoader] = React.useState(false);
  // useEffect(() => {
  //   setScreenLoader(true);
  //   setTimeout(() => {
  //     setScreenLoader(false);
  //   }, 2000);
  // }, []);

  useEffect(() => {
    setScreenLoader(true);
  }, []);
  const token = getCookie('access_token');

  const test = async () => {
    setLoading(true);
    const resp = await axios.get(url);

    console.log(resp);
    setViewFile(resp.data);
    setLoading(false);
  };
  useEffect(() => {
    test();
  }, []);
  console.log('viewFile', viewFile);

  const documents = [
    {
      uri: viewFile,
      fileType,
      fileName: 'demo.pdf',
    },
  ];

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return (
    <>
      {fileType == 'zip' || fileType == 'rar' ? (
        <>
          <Image src={ZipAndRar} alt="My SVG File" width={100} height={100} />
          <Text className="zipAndRarText">You can only Download this File</Text>
        </>
      ) : loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <DoubleCircle />
        </div>
      ) : (
        <DocViewer
          prefetchMethod="GET"
          documents={documents}
          pluginRenderers={DocViewerRenderers}
          style={{
            height: '100vh',
          }}
          config={{
            header: { disableHeader: true },

            pdfVerticalScrollByDefault: true,
          }}
          requestHeaders={headers}
        />
      )}
    </>
  );
};
