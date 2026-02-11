import { QuestionPaper } from '../types';

export const calculateTotalMarks = (paper: QuestionPaper): number => {
  return paper.questions.reduce((total, question) => {
    if (question.type === 'creative' && question.subQuestions) {
      return total + question.subQuestions.reduce((subTotal, subQ) => subTotal + subQ.marks, 0);
    }
    return total + question.marks;
  }, 0);
};

export const getQuestionTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'mcq': '⭕',
    'creative': '📝',
    'short-question': '✍️',
    'fill-in-blanks': '📄',
    'true-false': '✓✗',
    'matching': '🔗',
    'explain': '💭',
    'problem-solving': '🔢',
    'conversion': '⇄',
    'pattern': '🔲',
    'diagram': '📐',
    'construction': '📏',
    'table-based': '📊',
    'graph-based': '📈',
    'proof': '∵',
  };
  return icons[type] || '📝';
};

export const getBanglaNumber = (num: number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => banglaDigits[parseInt(digit)] || digit).join('');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
