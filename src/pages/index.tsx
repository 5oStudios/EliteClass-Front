import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    redirect: {
      permanent: false,
      destination: 'https://badoo.com',
    },
    props: {},
  };
};

export default function HomePage() {
  return null;
}
