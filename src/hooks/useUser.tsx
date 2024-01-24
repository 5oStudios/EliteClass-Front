import axios from '@/components/axios/axios';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';

interface IUser {
  id: number;
  fname: string;
  lname: string;
  image: any;
  email: string;
  institute: string;
  major: string;
  main_category: number;
  scnd_category_id: number;
  sub_category: number;
  ch_sub_category: number;
  referral_link: string;
  notifications: number;
  notifications_on: boolean;
  mobile: string;
  dob: any;
  courses: number;
  hours: number;
  code: string;
  customer_support: string;
  is_testUser: boolean;
}
export const useUser = () => {
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    user: IUser | null;
  }>({
    loading: false,
    error: false,
    user: null,
  });
  useEffect(() => {
    const config = {
      method: 'post',
      url: 'show/profile?secret=11f24438-b63a-4de2-ae92-e1a1048706f5',
    };
    axios(config)
      .then((response) => {
        setState({
          loading: false,
          error: false,
          user: response.data,
        });
      })
      .catch((error) => {
        setState({
          loading: false,
          error: true,
          user: null,
        });
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
          let err = error?.response?.data?.errors;
          if (err) {
            Object.keys(err).forEach((i) => {
              err[i].forEach((item: any) => {
                showNotification({
                  message: item,
                  color: 'red',
                });
              });
            });
          }
        }
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    user: state.user,
  };
};
