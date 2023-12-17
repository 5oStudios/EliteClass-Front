import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getCookie, removeCookies, setCookies, hasCookie, deleteCookie } from 'cookies-next';
import { isTokenValid } from './utils/utils';
const authMiddleware = (WrappedComponent: any) => {
  const Auth = (props: any) => {
    const router = useRouter();
    const token: any = getCookie('access_token');
    useEffect(() => {
      if (!token) {
        router.push('/signin');
      }
    }, []);

    useEffect(() => {
      if (token) {
        isTokenValid(token);
      }
    }, []);

    return token ? <WrappedComponent {...props} /> : () => router.push('/');
  };

  return Auth;
};

export default authMiddleware;
