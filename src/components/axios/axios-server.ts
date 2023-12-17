import { blockedUserMessage, removeAllUserData } from '@/utils/utils';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosServer.interceptors.request.use(
  (config) => {
    //@ts-ignore
    // config.headers['Accept-Language'] = getSelectedLang();
    return config;
  },
  (error) => Promise.reject(error)
);

axiosServer.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error?.response?.status === 401) {
    removeAllUserData();
  }
  if (error?.response?.status === 406) {
    blockedUserMessage(error)
  }
  return Promise.reject(error)
})

// set language in header
function getSelectedLang() {
  const langFromCookie = getCookie('NEXT_LOCALE');
  let lang = 'en-us';
  if (langFromCookie) {
    // @ts-ignore
    lang = langFromCookie;
  }
  return lang.split('-')[0];
}

axiosServer.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axiosServer.defaults.headers.post.Accept = 'application/json';
export { axiosServer };
