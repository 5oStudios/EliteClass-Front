import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Card,
  Container,
  Group,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Tabs,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeftIcon, ChevronRightIcon } from '@modulz/radix-icons';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Seo } from '@/components/seo';
import { Users } from '@/src/constants/icons/users';
import { CoursesIcon, SocialShare } from '@/src/constants/icons';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { useQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { CoursesCarousal } from '@/components/screens/home/carousals/courses-carousal';
import Link from 'next/link';
import Image from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { shimmer, toBase64 } from '@/utils/utils';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import defultImage from '@/public/assets/images/placeholders/defaultpicture.svg';
import { SocialShareWhite } from '@/src/constants/icons/social-share-white';
import { CoursesIconInst } from '@/src/constants/icons/coursesIconInst';
import { TabsHeader } from '@/components/tabs/TabsHeader';
import { SavedCourses } from '@/components/saved-cards/saved-courses';
import { SavedPackages } from '@/components/saved-cards/saved-packages';
import { SavedLiveSessions } from '@/components/saved-cards/saved-sessions';
import { InstructorCourses } from '@/components/instuctor-profile/courses';
import { InstructorStudents } from '@/components/instuctor-profile/students';
import { InstructorCost } from '@/components/instuctor-profile/cost';

const getInstructor = async (slug: string) => {
  const { data } = await axios.post('instructor/profile', {
    instructor_id: slug,
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
  });
  return data;
};

const InstructorProfile = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  //const { slug } = router.query;
  const slug = '624';
  const { colorScheme } = useMantineColorScheme();
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [courseDetail, setCourseDetail] = useState<any>([]);
  const [insturctorDetail, setInsturctorDetail] = useState<any>([]);
  const [defaultImage, setDefaultImage] = useState(false);

  const { data, isLoading, isError, error, isRefetching } = useQuery<any, any>(
    ['instructor', slug],
    () => getInstructor(slug as string)
  );

  useEffect(() => {
    setCourseDetail(data?.courses);
    setInsturctorDetail(data?.user);
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
      <Seo title="Instructors" description="Best Lms" path="Courses" />
      <Box>
        <Container px={0}>
          <Card
            sx={(theme) => ({
              boxShadow: theme.shadows.xs,
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: '20px',
              backgroundColor: colorScheme == 'dark' ? '#ffffff13' : '#F7F6F5',
              //height: '30vh',
            })}
          >
            <Space h="md" />
            <SimpleGrid
              sx={{
                gridTemplateColumns: 'max-content 1fr max-content',
                justifyItems: 'center',
                //backgroundColor: 'red',
                height: '100%',
              }}
            >
              <ActionIcon title="Go Back" onClick={() => router.back()} variant="hover">
                <ArrowLeftIcon className="rtl" width={100} height={100} />
              </ActionIcon>

              <Stack
                spacing={6}
                mt={'3vh'}
                align="center"
                sx={{ justifyContent: 'flex-end', paddingBottom: '2vh' }}
              >
                <Avatar sx={{ borderRadius: '100%', width: '107px', height: '107px' }}>
                  {/* '/assets/images/placeholders/instructor.png' */}
                  {insturctorDetail?.image && (
                    <Image
                      src={
                        !defaultImage
                          ? insturctorDetail?.image || '/assets/images/placeholders/instructor.png'
                          : '/assets/images/placeholders/instructor.png'
                      }
                      layout="fill"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      onError={(e) => {
                        setDefaultImage(true);
                      }}
                    />
                  )}
                </Avatar>
                <Text style={{ color: '#FFDD83', fontSize: '24px' }} weight={500}>
                  {insturctorDetail?.fname || ''}{' '}
                  <EllipsisText text={insturctorDetail?.lname || ''} length={8} />
                </Text>
                <Text
                  weight={400}
                  align="center"
                  sx={{ color: colorScheme == 'dark' ? '#298EAE' : '#298EAE', fontSize: '12px' }}
                >
                  {insturctorDetail?.short_info || ''}
                </Text>
              </Stack>
              <ActionIcon
                onClick={() => {
                  //ZK: Share code triggering native view in mobile app
                  // @ts-ignore
                  if (window?.ReactNativeWebView === undefined) {
                    //This means we are not in ReactNative webView so open in new link as target blanks
                    window.open(`/instructors/${slug}`, '_blank');
                  } else {
                    const url = `${process.env.NEXT_PUBLIC_FE_URL}instructors/${slug}`;

                    const shareableObject = {
                      event: 'share',
                      url,
                    };
                    const objStringfy = JSON.stringify(shareableObject);
                    // @ts-ignore
                    window.ReactNativeWebView.postMessage(objStringfy);
                  }
                }}
              >
                {colorScheme == 'dark' ? <SocialShareWhite color={'#EDD491'} /> : <SocialShare color={'#000'} />}
              </ActionIcon>
            </SimpleGrid>
          </Card>

          <Container mt={20}>
            <TabsHeader>
              <Tabs.Tab label={t.courses} tabKey="Courses">
                <InstructorCourses />
              </Tabs.Tab>
              <Tabs.Tab label={t.students} tabKey="Packages">
                <InstructorStudents />
              </Tabs.Tab>
              <Tabs.Tab label={t.cost}>
                <InstructorCost />
              </Tabs.Tab>
            </TabsHeader>
          </Container>
        </Container>
        <Space my={50} />
      </Box>
    </>
  );
};

export default InstructorProfile;
