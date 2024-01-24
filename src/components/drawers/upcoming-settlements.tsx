import { Button, Card, Checkbox, Group, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { useState } from 'react';
import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { DiscountBadge } from '@/components/badges/discount-badge';
import { useUpcommingSettelements } from '@/src/hooks/useUpcommingSettelements';

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
  const router = useRouter();
  const { courses } = useUpcommingSettelements();
  if (!courses || courses.length == 0) return null;
  const overdueCourses = courses.map((course) => (
    <UpcomingSettlementCourseCard key={course.id} {...course} />
  ));

  const t = router.locale === 'ar-kw' ? ar : en;
  return (
    <BaseDrawerWrapper title={t['upcoming-settlements']}>
      <Stack
        sx={{
          overflowY: 'scroll',
          maxHeight: 'calc(100vh - 200px)',
        }}
        spacing={6}
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
  const preferredColorScheme = useMantineColorScheme();
  const darkMode = preferredColorScheme.colorScheme === 'dark';

  const handleCardBorder = () => {
    if (darkMode) {
      return checked ? '1px solid gray' : '1px solid #333333';
    } else {
      // light mode
      return checked ? '1px solid #EDD491' : '1px solid #E5E5E5';
    }
  };
  return (
    <Card
      radius="md"
      withBorder
      sx={{
        border: handleCardBorder(),
        overflow: 'hidden',
        minHeight: '100px',
      }}
      color={checked ? 'gray' : 'blue'}
      onClick={() => setChecked((c) => !c)}
    >
      <Stack spacing={5}>
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
            color={darkMode ? 'gray' : ''}
            sx={{
              border: darkMode ? '1px solid gray' : '',
              borderRadius: '5px',
            }}
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            wrapperProps={{
              onClick: () => setChecked((c) => !c),
            }}
          />
        </Group>
        <DiscountBadge value={`${price} KB`} dir={'right'} />
      </Stack>
    </Card>
  );
}
