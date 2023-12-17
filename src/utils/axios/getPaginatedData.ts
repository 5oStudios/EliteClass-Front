import axios from '@/components/axios/axios';

type Props = {
  page?: number;
  endpoint: string;
};

export const getPaginatedData = async ({ endpoint, page = 1 }: Props) => {
  const dataFromServer = await axios.get(`${endpoint}page=${page}`);

  if (dataFromServer.status !== 200) {
    throw new Error('Something went wrong');
  }
  const data: any = {
    results: dataFromServer.data.data,
    next: dataFromServer.data.next_page_url === null ? undefined : page + 1,
  };
  return data;
};
