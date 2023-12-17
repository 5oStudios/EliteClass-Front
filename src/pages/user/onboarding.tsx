import { StudyInformation } from '@/components/screens/onboarding-flow/study-information';
import { ScrollArea } from '@mantine/core';
// import axios from 'axios';
import axios from '@/components/axios/axios.js';

import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export const OnBoardingPage = ({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <ScrollArea sx={{ height: '100vh' }} scrollbarSize={10}>
      <StudyInformation data={data} />
    </ScrollArea>
  </>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const initial_major = getCookie('initial_major', { req: ctx.req }) as string;
  const initial_type = getCookie('initial_type', { req: ctx.req }) as string;
  const initial_country = getCookie('initial_country', { req: ctx.req }) as string;
  const initial_stage = getCookie('initial_stage', { req: ctx.req }) as string;
  try {
    const { access_token } = ctx.req.cookies;

    const response = await axios.get(`my/categories`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return {
      props: {
        data: response?.data
      },
    };

  } catch (error: any) {

    if (initial_type && initial_major && initial_country && initial_stage) {
      const data = {
        initial_country: JSON.parse(initial_country),
        initial_stage: JSON.parse(initial_stage),
        initial_major: JSON.parse(initial_major),
        initial_type: JSON.parse(initial_type),
      };

      return {
        props: {
          data,
        },
      };
    }
    return {
      props: {
        data: {}
      },
    };
  }
};

export default OnBoardingPage;
