import React from 'react';
import { GetStaticProps } from 'next';
import { NoPageFound } from '@/components/ui/no-page-found';
import { useRouter } from 'next/router';

export const FourOFourPage = ({ data }: { data: any }) => {
  const { asPath } = useRouter();
  console.log(`${new Date().toISOString()} - WARN - LMS-NextJS - Not Found - ${asPath}`);
  return (
    <div>
      <NoPageFound asPath={asPath} />
    </div>
  );
};

export default FourOFourPage;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      dummyKey: 'DummyValue',
    },
  };
};
