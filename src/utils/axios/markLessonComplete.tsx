import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import { CheckIcon } from '@modulz/radix-icons';
import * as Sentry from '@sentry/nextjs';

export const markComplete = async ({ class_id }: { class_id: string }) => {
try {
  const obj = {
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    class_id,
  };
  const config = {
    method: 'post',
    url: 'course/progress/update',
    data: obj,
  };
  const res: any = await axios(config);
} catch (error) {
  Sentry.captureException(error);
}


};
