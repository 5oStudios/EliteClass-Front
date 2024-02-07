import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useState } from 'react';
import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
// @ts-ignore
import ReactStars from 'react-rating-stars-component';
import { useQuery } from 'react-query';
import axios from '@/components/axios/axios';

const _mockGetQuestionnaires = async () => {
  return await new Promise<IQuestionnaireBackendResponse>((resolve) => {
    setTimeout(() => {
      resolve(mockQuestionnaires);
    }, 3000);
  });
};
interface IQuestionnaireBackendResponse {
  message: string;
  questionnaires: IQuestionnaire[];
}

interface IQuestionnaire {
  id: number;
  course_title: string;
  course_id: number;
  questionnaire_title: string;
  questionnaire_appointment: string;
  questions: IQuestion[];
}

interface IQuestion {
  id: number;
  title: string;
}

const mockQuestionnaires: IQuestionnaireBackendResponse = {
  message: 'Required questionnaires',
  questionnaires: [
    {
      id: 2,
      course_id: 1119,
      course_title: 'this is course title',
      questionnaire_title: 'this is questionnaire title2',
      questionnaire_appointment: '2024-02-07',
      questions: [
        {
          id: 4,
          title: 'q1 title 2',
        },
        {
          id: 5,
          title: 'q2 title 2',
        },
        {
          id: 6,
          title: 'q3 title 2',
        },
      ],
    },
  ],
};

const CoursesFeedback = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;

  const [currentQuestionnaireCounter, setCurrentQuestionnaireCounter] = useState<number>(0);
  const getQuestionnaires = async () => {
    const response = await axios.get('/questionnaires/user/all');
    return response.data;
  };

  const {
    data: questionnaireBackendResponse,
    isLoading,
    isError,
  } = useQuery<IQuestionnaireBackendResponse>('questionnaires', _mockGetQuestionnaires);

  const questionnaires = questionnaireBackendResponse?.questionnaires;

  if (!questionnaires) return null;

  const thisQuestionnaire = questionnaires[currentQuestionnaireCounter];

  return (
    <BaseDrawerWrapper
      title={'Courses Feedback'}
      onCloseHandler={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <Text size="xl" weight={700}>
        {questionnaires[currentQuestionnaireCounter].course_title}
      </Text>
      <Stack
        sx={{
          overflowY: 'scroll',
          maxHeight: 'calc(100vh - 200px)',
          paddingBottom: 20,
          paddingTop: 20,
        }}
        spacing={6}
      >
        <Stack spacing={20}>
          {thisQuestionnaire.questions.map((question, questionNumber) => (
            <>
              <Questionnaire key={question.id} question={question} />
              {questionNumber !== thisQuestionnaire.questions.length - 1 && <Divider />}
            </>
          ))}
        </Stack>
      </Stack>
      <Group spacing={12} position="right" mt={12}>
        <Button
          size={'md'}
          fullWidth
          variant="filled"
          loading={false}
          onClick={() => setIsOpen(false)}
        >
          {t.submit}
        </Button>
      </Group>
    </BaseDrawerWrapper>
  );
};

const Questionnaire = ({ question }: { question: IQuestion }) => {
  const form = useForm({
    initialValues: {
      id: 0,
      rating: 0,
      comment: '',
    },
  });
  const [addComment, setAddComment] = useState<boolean>(false);
  return (
    <Stack sx={{}} spacing={8}>
      <Text size={'md'}>{question.title}</Text>
      <ReactStars
        count={5}
        onChange={(newRating: any) => form.setFieldValue('rating', newRating)}
        size={34}
        a11y={true}
        isHalf={true}
        activeColor="#ffd700"
      />
      {addComment ? (
        <TextInput
          key={question.id}
          placeholder="Enter your answer"
          {...form.getInputProps('comment')}
        />
      ) : (
        <Button onClick={() => setAddComment(true)} variant={'outline'}>
          Add Comment
        </Button>
      )}
    </Stack>
  );
};

export default CoursesFeedback;
