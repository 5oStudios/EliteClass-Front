import { BaseDrawerWrapper } from '@/components/drawers/base-drawer-wrapper';
import { useState } from 'react';
import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import ar from '@/i18n/ar/common.json';
import en from '@/i18n/en/common.json';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
// @ts-ignore
import ReactStars from 'react-rating-stars-component';

interface IQuestionnaire {
  id: number;
  courseTitle: string;
  questions: IQuestion[];
}

interface IQuestion {
  id: number;
  title: string;
}

const mockQuestionnaires: IQuestionnaire[] = [
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

const CoursesFeedback = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const [questionnaires, setQuestionnaires] = useState<IQuestionnaire[] | null>(mockQuestionnaires);
  const [currentQuestionnaireCounter, setCurrentQuestionnaireCounter] = useState<number>(0);

  if (!questionnaires) return null;

  const thisQuestionnaire = questionnaires[currentQuestionnaireCounter];

  return (
    <BaseDrawerWrapper
      title={'Courses Feedback'}
      onCloseHandler={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <Text size="xl" weight={700}>
        {questionnaires[currentQuestionnaireCounter].courseTitle}
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
