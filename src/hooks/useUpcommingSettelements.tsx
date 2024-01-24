import axios from '@/components/axios/axios';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useUser } from '@/src/hooks/useUser';
import { AxiosRequestConfig } from 'axios';

export const useUpcommingSettelements = () => {
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    courses: any[] | null;
  }>({
    loading: false,
    error: false,
    courses: null,
  });
  const { user, loading: userLoading, error: userError } = useUser();
  useEffect(() => {
    if (userLoading) return setState((prev) => ({ ...prev, loading: true }));
    if (userError) return setState((prev) => ({ ...prev, error: true }));

    return setState((prev) => ({ ...prev, courses: null }));
  }, [userLoading, userError, user]);

  useEffect(() => {
    if (!user) return;
    const config: AxiosRequestConfig = {
      method: 'get',
      url: 'overdue/' + user.id,
    };
    axios(config)
      .then((response) => {
        setState({
          loading: false,
          error: false,
          courses: response.data,
        });
      })
      .catch((error) => {
        setState({
          loading: false,
          error: true,
          courses: null,
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
  }, [user]);
  return {
    loading: state.loading,
    error: state.error,
    courses: state.courses,
  };
};
