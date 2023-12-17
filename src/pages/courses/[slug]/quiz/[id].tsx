import React from 'react';
import { useRouter } from 'next/router';
import { QuizReport } from '@/components/ui/QuizReport';
import { CourseQuiz } from '@/components/ui/CourseQuiz';
import authMiddleware from '@/src/authMiddleware';

const QuizPage = () => {
  const router = useRouter();
  const { status } = router.query;

  return (
    <div>
      {(status === 'initial_report' || status === 'final_report') && <QuizReport />}
      {status === 'start' && <CourseQuiz />}
    </div>
  );
};
export default authMiddleware(QuizPage);
