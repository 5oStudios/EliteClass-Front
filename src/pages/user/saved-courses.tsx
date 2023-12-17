import { SavedLiveSessions } from '@/components/saved-cards/saved-sessions';
import { SavedPackages } from '@/components/saved-cards/saved-packages';
import { TabsHeader } from '@/components/tabs/TabsHeader';
import { SavedCourses } from '@/components/saved-cards/saved-courses';
import { PageHeader } from '@/components/ui/pageHeader';
import { Seo } from '@/components/seo';
import { Box, Container, Space, Tabs } from '@mantine/core';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

export const CoursesPage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  return (
    <>
      <Seo title="Courses" description="Best Lms" path="Courses" />
      <Box component="main" mb={30}>
        <PageHeader title={t.saved} />
        <Space h="xl" />
        <Container>
          <TabsHeader>
            <Tabs.Tab id="tab-saveCourses" label={t.courses} tabKey="Courses">
              <SavedCourses />
            </Tabs.Tab>
            <Tabs.Tab id="tab-savePackages" label={t.packages} tabKey="Packages">
              <SavedPackages />
            </Tabs.Tab>
            <Tabs.Tab id="tab-saveliveSessions" label={t.sessions}>
              <SavedLiveSessions />
            </Tabs.Tab>
          </TabsHeader>
        </Container>
      </Box>
    </>
  );
};

export default CoursesPage;
