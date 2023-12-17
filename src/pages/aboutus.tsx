import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
const DynamicComponentWithNoSSR = dynamic(() => import('../components/ui/AboutUs'), { ssr: false });

const Aboutus = () => {
  return (
    <div>
      <DynamicComponentWithNoSSR />
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10,
  };
}
export default Aboutus;
