import axios from '@/components/axios/axios';

export async function getLessonData({ course_id }: { course_id: string }) {
  const config = {
    method: 'get',
    url: `course/lessons?secret=11f24438-b63a-4de2-ae92-e1a1048706f5&chapter_id=${course_id}`,
  };

  const res = await axios(config);
  return res.data;
}
export async function getChapters({ course_id, is_bundle }: { course_id: string, is_bundle:any }) {
  const config = {
    method: 'get',
    url: `course/chapterswithlessons?course_id=${course_id}&is_bundle=${JSON.parse(is_bundle)}`,
    //url: `course/chapters?course_id=${course_id}`,
  };

  const res = await axios(config);
  return res.data;
}

export const getPosts = async ({ course_id }: { course_id: string }) => {
  const config = {
    method: 'get',
    url: `course/questions?course_id=${course_id}`,
  };
  const { data } = await axios(config);
  const newData = { ...data, data: data.data.reverse() };
  return newData;
};

export const getCart = async () => {
  const config = {
    method: 'get',
    url: `show/cart`,
  };
  const { data } = await axios(config);
  // const newData = { ...data, data: data.data.reverse() };
  return data;
};


export const getQuestion = async ({ question_id }: { question_id: any }) => {
  const config = {
    method: 'get',
    url: `questions/${question_id}`,
  };
  const { data } = await axios(config);
  return data;
};



export const getAnswer = async ({ answer_id }: { answer_id: any }) => {
  const config = {
    method: 'get',
    url: `answer/${answer_id}`,
  };
  const { data } = await axios(config);
  return data;
};
