import { useEffect, useState } from 'react';
import axios from '@/components/axios/axios';
import { Button, Pagination, Stack, Text } from '@mantine/core';
import { useQuery } from 'react-query';

const Test = () => {
  const [activePage, setPage] = useState<any>(1);
  const fetchPosts = async ({ pageParam = 1 }) => {
    console.log(pageParam);
    let dataFromServer: any;
    dataFromServer = await axios.get(
      `course/question/answer?question_id=85&page=${pageParam}`
    );
    if (dataFromServer.status !== 200) {
      throw new Error('Something went wrong');
    }
    return dataFromServer?.data;
  };

  const { data: isData, error, isError, isLoading } = useQuery(['Answer', activePage], () => fetchPosts({ pageParam: activePage }), {
    keepPreviousData: false,
  });
  // first argument is a string to cache and track the query result
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    // return <div>Error! {error?.message}</div>
    console.log(error);
  }


  console.log(isData);



  return (
    <>
      <Stack>
        {isData?.data?.map((item: any, index: any) => {
          return (
            <Text>{item?.answer_id}</Text>
          );
        })}
      </Stack>

      <Pagination page={activePage} onChange={setPage} total={isData?.last_page} position="right" />
    </>
  );
};

export default Test;
