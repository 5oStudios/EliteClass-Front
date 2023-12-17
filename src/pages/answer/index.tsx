import axios from '@/components/axios/axios.js';
import { DiscussionsTab } from '@/components/screens/course-overview/tabs/discussions';
import { Seo } from '@/components/seo';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { PageHeader } from '@/components/ui/pageHeader';
import authMiddleware from '@/src/authMiddleware';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { Container, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const getCourseDetails = async (slug: string) =>
  axios
    .post('course/detail', {
      course_id: slug,
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    })
    .then((res) => res.data);

const AnswerDetails: NextPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { slug } = router.query;

  const [activeTab, setActiveTab] = useState(0);

  const [coursedetails, setCourseDetails] = useState<any>(Object);

  const [discussionData, setDiscussionData] = useState<any>(null);

  const isUser = getCookie('access_token');

  useEffect(() => {
    setActiveTab(parseInt(localStorage.getItem('courses_active_tab') || '0'));
  }, []);

  useEffect(() => {
    localStorage.setItem('courses_active_tab', activeTab.toString());
  }, [activeTab]);

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery<any, any>(
    ['course', slug],
    () => getCourseDetails(slug as string)
  );

  useEffect(() => {
    setCourseDetails(data?.course);
    // setWhatlearns(data?.whatlearns);
  }, [data]);

  if (isError) {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network Error',
        color: 'red',
      });
    } else {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
    }
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Answer" description="Best LMS" path="" />
      <main>
        <PageHeader title={'Notification Details'} />
        <Space h="md" />
        <Container mb={30} p={0}>
          <DiscussionsTab showEditText={false} discussiontabData={discussionData} slug={slug} />
        </Container>
      </main>
    </>
  );
};

export default authMiddleware(AnswerDetails);
