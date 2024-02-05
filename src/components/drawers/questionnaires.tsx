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

export const Questionnaires = () => {};
