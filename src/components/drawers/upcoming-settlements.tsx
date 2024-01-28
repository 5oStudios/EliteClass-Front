import { useState } from 'react';
import { Button, Card, Checkbox, Group, Stack, Text } from '@mantine/core';
import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { DiscountBadge } from '@/components/badges/discount-badge';

interface AccordionLabelProps {
  id: string;
  title: string;
  due_date: string;
  price: number;
}

export const UpcomingSettlements = (props: { upcomingInstallments: AccordionLabelProps[] }) => {
  const { upcomingInstallments } = props;
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCardCheck = (id: string) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]
    );
  };

  const handlePayNow = () => {
    // Use the selectedIds array to send data to the API
    console.log('Selected IDs:', selectedIds);
    // Add your API call logic here
  };

  const overdueCourses = upcomingInstallments.map((course) => (
    <UpcomingSettlementCourseCard
      key={course.id}
      {...course}
      onCardCheck={() => handleCardCheck(course.id)}
    />
  ));

  return (
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
        <Button size={'md'} fullWidth variant="filled" loading={false} onClick={handlePayNow}>
          {t.invoice['pay-now']}
        </Button>
      </Group>
    </BaseDrawerWrapper>
  );
};

interface UpcomingSettlementCourseCardProps extends AccordionLabelProps {
  onCardCheck: () => void;
}

function UpcomingSettlementCourseCard({
  id,
  title,
  due_date,
  price,
  onCardCheck,
}: UpcomingSettlementCourseCardProps) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    onCardCheck();
  };

  return (
    <Card
      radius="md"
      withBorder
      sx={{
        border: checked ? '1px solid #EDD491' : '1px solid #EDEDED',
        overflow: 'hidden',
        minHeight: '100px',
      }}
      color={checked ? 'gray' : 'blue'}
      onClick={() => handleCheckboxChange()}
    >
      <Stack spacing={3}>
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
            onChange={handleCheckboxChange}
            wrapperProps={{
              onClick: () => handleCheckboxChange(),
            }}
          />
        </Group>
        <DiscountBadge value={`${price} KB`} dir={'right'} />
      </Stack>
    </Card>
  );
}
