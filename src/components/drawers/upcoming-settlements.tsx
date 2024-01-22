import { Button, Card, Checkbox, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { DiscountBadge } from '@/components/badges/discount-badge';

const overdueCoursesMock = [
  {
    id: '1',
    // image: 'http://dash.staging.elite-class.com/images/course/duplicate1696136176.jpg',
    title: 'Ch01 Engineers: Professionals for the Human Good',
    due_date: '2023-11-20',
    price: 10,
  },
  {
    id: '2',
    // image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    title: 'Ch01 Engineers: Professionals for the Human Good',
    due_date: '2023-11-20',
    price: 15,
  },
  {
    id: '3',
    // image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    title: 'Ch01 Engineers: Professionals for the Human Good',
    due_date: '2023-11-20',
    price: 43,
  },
];

interface AccordionLabelProps {
  id: string;
  title: string;
  // image: string;
  due_date: string;
  price: number;
}

export const UpcomingSettlements = () => {
  const overdueCourses = overdueCoursesMock.map((course) => (
    <UpcomingSettlementCourseCard key={course.id} {...course} />
  ));
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  return (
    // <BaseModalWrapper
    //   title={'Payment Overdue'}
    //   open={true}
    //   content={<Stack spacing={5}>{overdueCourses}</Stack>}
    //   footer={
    //     <Group spacing={12} position="right">
    //       <Button variant="light" loading={false}>
    //         Skip
    //       </Button>
    //       <Button variant="filled" loading={false}>
    //         Pay Now
    //       </Button>
    //     </Group>
    //   }
    // />

    <BaseDrawerWrapper title={t['upcoming-settlements']}>
      <Stack
        sx={{
          overflowY: 'scroll',
          maxHeight: 'calc(100vh - 200px)',
        }}
        spacing={5}
      >
        {overdueCourses}
      </Stack>
      <Group spacing={12} position="right" mt={12}>
        <Button
          size={'md'}
          fullWidth
          variant="filled"
          loading={false}
          onClick={() => router.push('/')}
        >
          {t.invoice['pay-now']}
        </Button>
      </Group>
    </BaseDrawerWrapper>
  );
};

function UpcomingSettlementCourseCard({
  id,
  title,
  due_date,
  price,
}: Readonly<AccordionLabelProps>) {
  const [checked, setChecked] = useState(false);
  return (
    <Card
      radius="md"
      withBorder
      sx={{
        border: checked ? '1px solid #EDD491' : '1px solid #EDEDED', // TODO: use theme colors
        overflow: 'hidden',
        minHeight: '100px',
      }}
      color={checked ? 'gray' : 'blue'}
      onClick={() => setChecked((c) => !c)}
    >
      <Stack spacing={3}>
        {/*<Avatar src={image} size="lg" />*/}
        <Text size={'sm'}>{title}</Text>
        <Group
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
          position="right"
        >
          <Text color={'gray'} size={'xs'}>
            {due_date}
          </Text>
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            wrapperProps={{
              onClick: () => setChecked((c) => !c),
            }}
          />
        </Group>
        <DiscountBadge price={`${price} KB`} dir={'right'} />
      </Stack>
    </Card>
  );
}
