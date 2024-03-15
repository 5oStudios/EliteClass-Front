import { useEffect, useState } from 'react';
import {
  Button,
  Stepper,
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useRouter } from 'next/router';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { DiscountBadge } from '@/components/badges/discount-badge';
import axios from '@/components/axios/axios';
import { LoadingScreen } from '../ui/loader-screen';
interface AccordionLabelProps {
  typeId: string;
  type: string;
  title: string;
  installments: Array<installment>;
}
interface installment {
  id: string;
  due_date: string;
  amount: string;
  is_selected: boolean;
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
      key={item.typeId}
      {...item}
      onCardCheck={() => handleCardCheck(item)}
    />
  ));

  return (
    <BaseDrawerWrapper
      title={t['upcoming-settlements']}
      isOpen={isOpen}
      onCloseHandler={() => setIsOpen(false)}
    >
      <Stack
        sx={{
          overflowY: 'auto',
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
  title,
  installments,
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

  const handleCheckboxChange = (el: installment) => {
    setIsLoading(true);
    const url = '/pending/instalments';
    const object = el?.is_selected ? { remove_payment_plan_id: el.id } : { payment_plan_id: el.id };
    axios
      .post(url, object)
      .then((response) => {
        console.log(response);
        el.is_selected = !el?.is_selected;
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
        {installments.map((el) => (
          <Group
            key={el.id}
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
            position="right"
          >
            <Text color={'gray'} size={'xs'}>
              {el.due_date}
            </Text>
            <Group>
              <Text color={'gray'} size={'xs'}>
                {el.amount}
              </Text>
              <Checkbox
                color={darkMode ? 'gray' : ''}
                sx={{
                  border: darkMode ? '1px solid gray' : '',
                  borderRadius: '5px',
                }}
                defaultChecked={el?.is_selected}
                wrapperProps={{
                  onClick: () => handleCheckboxChange(el),
                }}
              />
            </Group>
          </Group>
        ))}
        {/* <DiscountBadge value={`${price} KWD`} dir={'right'} /> */}
      </Stack>
    </Card>
  );
}
