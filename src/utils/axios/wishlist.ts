import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';

type AddtowishlistProps = {
  id: string;
  cb: (value: boolean) => void;
  toggleicon: (value: boolean) => void;
};

export const addToWishList = async ({ id, cb, toggleicon }: AddtowishlistProps) => {
  console.log('addtowishlist', { id });
  const isUser = getCookie('access_token');
  if (isUser != undefined) {
    toggleicon(true);
    const data = {
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      course_id: id,
    };
    const res = await axios.post('addtowishlist', data);

    if (res.statusText !== 'ok') {
      console.log(res.data.response.message);
    }

    if (res.status !== 200) {
      toggleicon(false);
      showNotification({
        message: 'Could not add course from wishlist',
        color: 'red',
      });
    }
  } else {
    toggleicon(false);
    cb(true);
  }
};

type RemoveFromWishListProps = {
  id: string;
};

export const removeFromWishList = async ({ id }: RemoveFromWishListProps) => {
  const data = {
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    course_id: id,
  };
  console.log({ id });

  const res = await axios.post('remove/wishlist', data);

  if (res.status !== 200) {
    showNotification({
      message: 'Could not remove course from wishlist',
      color: 'red',
    });
  }
};
