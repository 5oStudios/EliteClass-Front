import { axiosServer } from '@/components/axios/axios-server';
import { getCookie } from 'cookies-next';

type Props = {
  cost: [number, number];
  rating?: any;
  duration: [number, number];
  search?: string;
  category_id?: string;
  scnd_category_id?: string;
  sub_category?: string;
  ch_sub_category?: string;
  auth?: string;
  appSelectedLanguage: string;
};

export const getHomeContent = async ({
  cost,
  rating,
  duration,
  search,
  category_id,
  scnd_category_id,
  sub_category,
  ch_sub_category,
  auth,
  appSelectedLanguage = 'en',
}: Props) => {
  const obj = {
    secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
    min_price: cost[0],
    max_price: cost[1],
    min_time: duration[0],
    max_time: duration[1],
    ...(search && { search_text: search }),
    ...(rating != 'null' && { rating: parseFloat(rating) }),
    //@ts-ignore
    ...(category_id && { category_id: category_id }),
    //@ts-ignore
    ...(scnd_category_id && { scnd_category_id: scnd_category_id }),
    //@ts-ignore
    ...(sub_category && { sub_category: sub_category }),
    //@ts-ignore
    ...(ch_sub_category && { ch_sub_category: ch_sub_category }),
  };
  const response = await axiosServer.post(
    'home',
    {
      ...obj,
    },
    {
      headers: {
        Authorization: `Bearer ${auth}`,
        'Accept-Language': appSelectedLanguage,
      },
    }
  );
  //hereeee
  response.data.packages.data.forEach((el: any) => {
    if (el.discount_type !== null && el.discount_price !== 0) {
      el.haveOffer = true;
      if (el.discount_type === 'fixed') {
        el.discountAmount = `${Number(el.discount_price).toFixed(2)} `;

        el.discount_price = el.price - el.discount_price;
      } else {
        el.discountAmount = `${Number(el.discount_price).toFixed(2)} %`;
        console.log(el.discountAmount, el.price);

        el.discount_price = ((100 - el.discount_price) / 100) * el.price;
      }
    }
  });
  response.data.courses.data.forEach((el: any) => {
    if (el.discount_type !== null && el.discount_price !== 0) {
      el.haveOffer = true;
      if (el.discount_type === 'fixed') {
        el.discountAmount = `${el.price} `;
        el.discount_price = el.price - el.discount_price;
      } else {
        el.discountAmount = `${el.price} %`;
        el.discount_price = ((100 - el.discount_price) / 100) * el.price;
      }
    }
  });
  response.data.meetings.data.forEach((el: any) => {
    if (el.discount_type !== null && el.discount_price !== 0) {
      el.haveOffer = true;
      if (el.discount_type === 'fixed') {
        el.discountAmount = `${el.price} `;
        el.discount_price = el.price - el.discount_price;
      } else {
        el.discountAmount = `${el.price} %`;
        el.discount_price = ((100 - el.discount_price) / 100) * el.price;
      }
    }
  });
  console.log(response.data);

  return response.data;
};
