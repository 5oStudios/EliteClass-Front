import axios from '@/components/axios/axios.js';
import { showNotification } from '@mantine/notifications';

export const getWalletBalance = async () => {
  return axios
    .get('wallet/balance')
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
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
    });
};

type PayInstallmentProps = {
  method: string;
  id: string;
};

export const payInstallment = async ({ id, method }: PayInstallmentProps) => {

  if (method !== 'wallet') {
    const res = await axios.post('payinstallment/upayment', {
      payment_method: method,
      instalment_id: id,
    });
    return res.data;
  } else if (method === 'wallet') {
    const res = await axios.post('pay/installment', {
      payment_method: method,
      instalment_id: id,
    });
    return res.data;
  } else {
    throw new Error('We only have 2 method of payment, Right now the program has reached third condition.');
  }
};
