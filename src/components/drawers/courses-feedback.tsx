import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useEffect, useState } from 'react';
import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

// @ts-ignore
import ReactStars from 'react-rating-stars-component';
import { useQuery } from 'react-query';
import axios from '@/components/axios/axios';
import { showNotification } from '@mantine/notifications';
// const _mockGetQuestionnaires = async () => {
//   return await new Promise<IQuestionnaireBackendResponse>((resolve) => {
//     setTimeout(() => {
//       resolve(mockQuestionnaires);
//     }, 3000);
//   });
// };
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
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const token: any = getCookie('access_token');

  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const getQuestionnaires = async () => {
    if (token) {
      const response = await axios.get('/questionnaires/user/all');
      return response.data;
    } else {
      return '';
    }
  };

  const {
    data: questionnairesData,
    isError,
    error,
  } = useQuery<IQuestionnaireBackendResponse>('questionnaires', getQuestionnaires);

  if (isError || !questionnairesData || questionnairesData.questionnaires.length === 0) return null;

  const { questionnaires } = questionnairesData;
  const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];

  const postQuestionAnswer = async () => {
    setLoading(true);
    try {
      await axios.post(`/questionnaires/${currentQuestionnaire.id}/answer`, {
        answers,
      });
      setLoading(false);
      setAnswers([]);
      if (currentQuestionnaireIndex < questionnaires.length - 1) {
        setCurrentQuestionnaireIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsOpen(false);
      }
      showNotification({
        message: 'Your feedback has been submitted successfully',
        color: 'teal',
      });
    } catch (error) {
      setLoading(false);
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  return (
    <BaseDrawerWrapper
      title={'Course Feedback: ' + currentQuestionnaire.course_title}
      onCloseHandler={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <Text size="xl" weight={700}>
        {questionnaires[currentQuestionnaireIndex].questionnaire_title}
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
          {currentQuestionnaire.questions.map((question, questionNumber) => (
            <>
              <Questionnaire
                key={question.id}
                question={question}
                onValuesChange={(values) => {
                  const newAnswers = [...answers];
                  // @ts-ignore
                  newAnswers[questionNumber] = values;
                  setAnswers(newAnswers);
                }}
              />
              {questionNumber !== currentQuestionnaire.questions.length - 1 && <Divider />}
            </>
          ))}
        </Stack>
      </Stack>
      <Group spacing={12} position="right" mt={12}>
        <Button
          size={'md'}
          fullWidth
          variant="filled"
          loading={loading}
          onClick={postQuestionAnswer}
        >
          {t.submit}
        </Button>
      </Group>
    </BaseDrawerWrapper>
  );
};

interface IQuestionAnswer {
  question_id: number;
  rate: number;
  answer?: string;
}
const Questionnaire = ({
  question,
  onValuesChange,
}: {
  question: IQuestion;
  onValuesChange?: (values: IQuestionAnswer) => void;
}) => {
  const form = useForm<IQuestionAnswer>({
    initialValues: {
      question_id: question.id,
      rate: 0.5,
      // answer: '',
    },
  });
  useEffect(() => {
    onValuesChange?.(form.values);
  }, [form.values.answer, form.values.rate]);

  const [addComment, setAddComment] = useState<boolean>(false);

  return (
    <Stack sx={{}} spacing={8}>
      <Text size={'md'}>{question.title}</Text>
      <ReactStars
        count={5}
        onChange={(newRating: any) => form.setFieldValue('rate', newRating)}
        size={34}
        a11y={true}
        isHalf={true}
        value={form.values.rate}
        activeColor="#ffd700"
      />
      {addComment ? (
        <TextInput
          key={question.id}
          placeholder="Enter your answer"
          {...form.getInputProps('answer')}
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
