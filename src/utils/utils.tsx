import { showNotification } from '@mantine/notifications';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useQueryClient } from 'react-query';
import jwt from 'jsonwebtoken';
import axios from '@/components/axios/axios';

export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secs = seconds - hours * 3600 - minutes * 60;
  const minutesPrefix = minutes < 10 ? '0' : '';
  const hoursPrefix = hours < 10 ? '0' : '';
  const secsPrefix = secs < 10 ? '0' : '';
  if (hours > 0) {
    return `${hoursPrefix}${hours}:${minutesPrefix}${minutes}:${secsPrefix}${secs.toFixed(0)}`;
  }
  return `${minutesPrefix}${minutes}:${secsPrefix}${secs.toFixed(0)}`;
};

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#909296" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#909296" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#909296" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const removeAllUserData = () => {
  try {
    // const client = useQueryClient();
    // client.clear();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('login', 'false');
    }
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    localStorage.removeItem('user_id');
  } catch (err) {
    console.log('err', err);
  }
};
export const blockedUserMessage = (error: any) => {
  try {
    if (error?.message === 'Network Error') {
      showNotification({
        message: 'Network error',
        color: 'red',
      });
    } else {
      let err = error?.response?.data?.errors;

      if (err) {
        Object.keys(err).map((i) => {
          err[i].map((item: any) => {
            showNotification({
              message: item,
              color: 'red',
            });
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
// export const refreshToken = async () => {
//   const getUserId = localStorage.getItem('user_id');
//   if (getUserId) {
//     try {
//       const obj = {
//         refresh_token: getCookie('refresh_token'),
//       };

//       const resp = await axios.post('/refresh-token', obj);
//       deleteCookie('access_token');
//       deleteCookie('refresh_token');
//       setCookie('access_token', resp?.data?.access_token);
//       setCookie('refresh_token', resp?.data?.refresh_token);
//     } catch (error) {
//       showNotification({
//         message: 'Token is Invalid',
//         color: 'red',
//       });
//     }
//   }
// };
export const isTokenValid = async (token: any) => {
  try {
    const verifyToken: any = jwt.verify(token, String(process.env.NEXT_PUBLIC_JWT_SECERT), {
      algorithms: ['RS256'],
    });
    console.log(verifyToken);

    const obj = {
      refresh_token: getCookie('refresh_token'),
    };

    const expiryDate = new Date(verifyToken?.exp * 1000);
    const tenDaysRemaintoExpire: number = 10 * 24 * 60 * 60 * 1000;
    const expiryTokenDate = new Date(expiryDate.getTime() - tenDaysRemaintoExpire);
    const currentDateTime = new Date(new Date().toUTCString());
    if (expiryTokenDate < currentDateTime) {
      const resp = await axios.post('/refresh-token', obj);
      setCookie('access_token', resp?.data?.access_token);
      setCookie('refresh_token', resp?.data?.refresh_token);
      // debugger;
    }
    // else {
    //   showNotification({
    //     message: 'SomeThing bad happen with token',
    //     color: 'red',
    //   });
    // }
  } catch (error) {
    console.log(error);
  }
};

export const sendPlayerIDTowardBackend = (oneSignalId: string) => {
  try {
    //This means that we are curently in Web Browser not in ReactNative wrapper
    // console.log("ONESIGNALDATA:", oneSignalId)
    var config = {
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}playerdeviceid`,
      headers: {
        Accept: 'application/json',
        //M-A: token already exist in axios request
        // Authorization: 'Bearer {{token}}',
        'Content-Type': 'application/json',
      },
      data: oneSignalId,
    };
    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {}
};

export const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
