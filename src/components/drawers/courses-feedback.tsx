import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useState } from 'react';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

interface IQuestionnaire {
  id: number;
  courseTitle: string;
  questions: IQuestion[];
}

interface IQuestion {
  id: number;
  title: string;
}

const _mockQuestionnaires: IQuestionnaire[] = [
  {
    id: 1,
    courseTitle: 'Course 1',
    questions: [
      {
        id: 1,
        title: 'Question 1',
      },
      {
        id: 2,
        title: 'Question 2',
      },
    ],
  },
  {
    id: 2,
    courseTitle: 'Course 2',
    questions: [
      {
        id: 3,
        title: 'Question 3',
      },
      {
        id: 4,
        title: 'Question 4',
      },
    ],
  },
];

export const CoursesFeedback = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [questionnaires, setQuestionnaires] = useState<IQuestionnaire[] | null>(
    _mockQuestionnaires
  );
  const [currentQuestionnaireCounter, setCurrentQuestionnaireCounter] = useState<number>(0);
  //
  // useEffect(() => {
  //   // (async () => {
  //   //   axios
  //   //     .get('/questionnaires')
  //   //     .then((response) => {
  //   //       setQuestionnaires(response.data);
  //   //     })
  //   //     .catch((error) => {
  //   //       console.error('Error fetching questionnaires', error);
  //   //     });
  //   // })();
  //
  //   setQuestionnaires(_mockQuestionnaires);
  // }, []);
  //
  // useEffect(() => {
  //   setIsOpen(!!questionnaires);
  //   // questionnaires && questionnaires.length < currentQuestionnaireCounter + 1 && setIsOpen(false);
  // }, [questionnaires]);
  //
  if (!questionnaires) return null;
  return (
    <BaseDrawerWrapper
      title={'Courses Feedback'}
      onCloseHandler={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <Stack
        sx={{
          overflowY: 'scroll',
          maxHeight: 'calc(100vh - 200px)',
        }}
        spacing={6}
      >
        <Questionnaire questionnaire={questionnaires[currentQuestionnaireCounter]} />
      </Stack>
      <Group spacing={12} position="right" mt={12}>
        <Button
          size={'md'}
          fullWidth
          variant="filled"
          loading={false}
          onClick={() => setIsOpen(false)}
        >
          {t.invoice['pay-now']}
        </Button>
      </Group>
    </BaseDrawerWrapper>
  );
};

const Questionnaire = (props: { questionnaire: IQuestionnaire }) => {
  const { id, courseTitle, questions } = props.questionnaire;
  const form = useForm({
    initialValues: {
      id,
      answers: questions.map((question) => ({ questionId: question.id, answer: '', rating: 0 })),
    },
    validate: {},
  });

  return (
    <div>
      <h3>{props.questionnaire.courseTitle}</h3>
      {props.questionnaire.questions.map((question) => (
        <>
          <TextInput />
          {/*<Rating*/}
          {/*  placeholderRating={0}*/}
          {/*  emptySymbol="fa fa-star-o fa-2x"*/}
          {/*  fullSymbol="fa fa-star fa-2x"*/}
          {/*/>*/}
        </>
      ))}
    </div>
  );
};
