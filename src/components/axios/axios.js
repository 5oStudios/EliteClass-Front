import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { blockedUserMessage, removeAllUserData } from '@/utils/utils';
import Router from 'next/router';
import { showNotification } from '@mantine/notifications';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// set access token
instance.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = getSelectedLang();
    if (!config.headers.Authorization) {
      const token = getCookie('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      removeAllUserData();

      Router.push('/signin');
    }
    if (error?.response?.status === 403) {
      setCookie('urlBeforeAccessDenied', Router.asPath);
      Router.push('/accessdenied');
    }

    if (error?.response?.status === 404) {
      Router.push('/404');
    }
    if (error?.response?.status === 406) {
      blockedUserMessage(error);
    }
    return Promise.reject(error);
  }
);

// set language in header
function getSelectedLang() {
  const langFromCookie = getCookie('NEXT_LOCALE');
  let lang = 'en-us';
  if (langFromCookie) {
    lang = langFromCookie;
  }
  return lang.split('-')[0];
}

const refreshAuthLogic = (failedRequest) =>
  axios.post('https://www.example.com/auth/token/refresh').then((tokenRefreshResponse) => {
    localStorage.setItem('token', tokenRefreshResponse.data.token);
    failedRequest.response.config.headers['Authorization'] =
      'Bearer ' + tokenRefreshResponse.data.token;
    return Promise.resolve();
  });

instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
instance.defaults.headers.post['Accept'] = 'application/json';
export default instance;
