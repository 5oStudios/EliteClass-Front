import { useState } from 'react';
import { Button, Card, Checkbox, Group, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { DiscountBadge } from '@/components/badges/discount-badge';
import axios from '@/components/axios/axios';
import { LoadingScreen } from '../ui/loader-screen';
interface AccordionLabelProps {
  id: string;
  typeId: string;
  type: string;
  title: string;
  due_date: string;
  price: number;
}
interface selectedAccordionLabelProps {
  id: string;
  typeId: string;
  type: string;
  title: string;
  due_date: string;
  price: number;
  installments: string[];
}

export const UpcomingSettlements = (props: { upcomingInstallments: AccordionLabelProps[] }) => {
  const { upcomingInstallments } = props;
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [isOpen, setIsOpen] = useState(true);

  // const [selectedItems, setSelectedItems] = useState<selectedAccordionLabelProps[]>([]);
  const handleCardCheck = (object: AccordionLabelProps) => {
    // setSelectedItems((prevItems) => {
    //   // Check if there is an object with the same typeId
    //   const existingItemIndex = prevItems.findIndex((item) => item.typeId === object.typeId);
    //   // If an object with the same typeId is found
    //   if (existingItemIndex !== -1) {
    //     // Create a copy of the selectedItems array
    //     const updatedItems = [...prevItems];
    //     // Update the installments array within the found object
    //     updatedItems[existingItemIndex] = {
    //       ...updatedItems[existingItemIndex],
    //       installments: [
    //         ...(updatedItems[existingItemIndex].installments || []), // Keep existing installments
    //         object.id, // Add the itemId to the installments array
    //       ],
    //     };
    //     return updatedItems;
    //   } else {
    //     // If no object with the same typeId is found, add the whole object to selectedItems
    //     return [...prevItems, { ...object, installments: [object.id] }];
    //   }
    // });
  };
  const handlePayNow = () => {
    // Use the selectedIds array to send data to the API
    // console.log('Selected items:', selectedItems);
    // Add your API call logic here
    router.replace('/user/invoices');
    setIsOpen(false);
  };

  const overdueCourses = upcomingInstallments.map((item) => (
    <UpcomingSettlementCourseCard
      key={item.id}
      {...item}
      onCardCheck={() => handleCardCheck(item)}
    />
  ));

  return (
    <BaseDrawerWrapper title={t['upcoming-settlements']} isOpen={isOpen} onCloseHandler={()=>setIsOpen(false)}>
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
  const preferredColorScheme = useMantineColorScheme();
  const darkMode = preferredColorScheme.colorScheme === 'dark';
  const [isLoading, setIsLoading] = useState(false);

  const handleCardBorder = () => {
    if (darkMode) {
      return checked ? '1px solid gray' : '1px solid #333333';
    } else {
      // light mode
      return checked ? '1px solid #EDD491' : '1px solid #E5E5E5';
    }
  };

  const handleCheckboxChange = () => {
    setIsLoading(true);
    const url = '/pending/instalments';
    const object = checked ? { remove_payment_plan_id: id } : { payment_plan_id: id };
    axios
      .post(url, object)
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setChecked(!checked);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // onCardCheck();
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
    >
      <LoadingScreen isLoading={isLoading} />
      <Stack spacing={5}>
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
