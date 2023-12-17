import React from 'react';
import { QuestionOrAnswerDeleted } from '@/components/ui/question-answer-deleted';
import authMiddleware from '@/src/authMiddleware';

export const QADeleted = () => {
  return (
    <div>
      <QuestionOrAnswerDeleted />
    </div>
  );
};

export default authMiddleware(QADeleted);
