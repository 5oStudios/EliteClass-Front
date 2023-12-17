import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LessonsTab } from '@/components/screens/course-overview/tabs/lesson';
import { OverviewTab } from '@/components/screens/course-overview/tabs/overview';
import { Seo } from '@/components/seo';
import { CourseStats } from '@/components/ui/course-stats';
import { BookmarkIcon, SocialShare } from '@/src/constants/icons';
import axios from '@/components/axios/axios.js';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { DiscussionsTab } from '@/components/screens/course-overview/tabs/discussions';
import { useQuery, useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { UnbookmarkIcon } from '@/src/constants/icons/unbookmark';
import { getCookie } from 'cookies-next';
import { PageHeader } from '@/components/ui/pageHeader';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { WhatsAppIcon } from '@/src/constants/icons/whastsApp';
import { ChapterTab } from '@/components/screens/course-overview/tabs/chapter';

const getCourseDetails = async (slug: string) =>
  axios
    .post('course/detail', {
      course_id: slug,
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    })
    .then((res) => res.data);

const CourseDetails: NextPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { slug, chapter_name } = router.query;

  const [activeTab, setActiveTab] = useState(0);

  const [coursedetails, setCourseDetails] = useState<any>(Object);
  const [instructordetails, setInstructorDetails] = useState<any>(Object);

  const [discussionData, setDiscussionData] = useState<any>(null);

  const [alreadyPurchased, setAlreadyPurchased] = React.useState<Boolean | null>();
  const [bookmarked, setBookmarked] = React.useState<Boolean>(false);
  const [bookmarkeddisable, setBookMarkedDisable] = React.useState<boolean>(false);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [signing, setSigning] = useState<boolean>(false);
  const isUser = getCookie('access_token');

  useEffect(() => {
    setSigning(false);
  }, [router]);

  return (
    <>
      <Modal
        opened={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center">{t['login-popup']}</Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-chapterModalCancel"
                variant="filled"
                onClick={() => {
                  setOpenConfirmModal(false);
                }}
                radius={20}
                styles={{
                  filled: {
                    background: '#EDF2F7',
                    '&:hover': {
                      background: '#EDF2F7',
                    },
                  },
                  label: {
                    color: 'black',
                  },
                }}
              >
                {t.Cancel}
              </Button>
              <Button
                id="btn-chapterModalSignIn"
                variant="filled"
                onClick={() => {
                  setSigning(true);
                  router.push('/signin');
                }}
                loading={signing}
                radius={20}
                styles={{
                  filled: {
                    background: '#FF3030',
                    '&:hover': {
                      background: '#FF3030',
                    },
                  },
                  label: {
                    color: 'white',
                  },
                }}
              >
                {t['sign-in']}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <Seo title="course details" description="Best LMS" path="" />
      <main>
        <PageHeader title={chapter_name} />
        <ChapterTab slug={slug} chapter_name={chapter_name} />
      </main>
    </>
  );
};

export default CourseDetails;
