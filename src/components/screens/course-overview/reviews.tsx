import { ActionIcon, Collapse, Container, Group, Space, Text } from '@mantine/core';
import { ChevronRightIcon } from '@modulz/radix-icons';
import React from 'react';
import { Ratings } from './rating';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';

export const Reviews = (props: any) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Container p={0}>
      <Group
        id="row-reviews"
        position="apart"
        //px={13}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          cursor: 'pointer',
          height: '50px',
          // '&:hover': {
          //   backgroundColor: '#f5f5f5',
          // },
        }}
      >
        <Text weight={500}>{t.reviews}</Text>
        <ActionIcon variant="transparent">
          <ChevronRightIcon width={30} height={30} className={!isExpanded ? 'rtl' : 'rotate-90'} />
        </ActionIcon>
      </Group>
      <Space h="lg" />
      <Container p={0}>
        <Collapse in={isExpanded}>
          <Ratings
            refetch={props.refetch}
            ratingsData={props?.reviewData}
            chapterPurchased={props?.chapterPurchased}
          />
        </Collapse>
      </Container>
    </Container>
  );
};
