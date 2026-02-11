export type QuestionType =
  | 'mcq'
  | 'fill-in-blanks'
  | 'true-false'
  | 'matching'
  | 'short-question'
  | 'explain'
  | 'creative'
  | 'problem-solving'
  | 'conversion'
  | 'pattern'
  | 'diagram'
  | 'construction'
  | 'table-based'
  | 'graph-based'
  | 'proof';

export type BlockType =
  | 'text'
  | 'formula'
  | 'image'
  | 'table'
  | 'diagram'
  | 'graph'
  | 'blank'
  | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

export interface SubQuestion {
  id: string;
  label: string; // ক, খ, গ, ঘ
  blocks: Block[];
  marks: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  number: number;
  blocks: Block[];
  marks: number;
  optional: boolean;
  subQuestions?: SubQuestion[]; // For creative questions
  options?: string[]; // For MCQ
  correctAnswer?: string | number; // For MCQ, matching, etc.
}

export type ExamType = 'class-test' | 'half-yearly' | 'annual' | 'model-test';
export type LayoutType = '1' | '2' | '3'; // Column layout: 1, 2, or 3 columns

export interface PaperSetup {
  class: number; // 6-10
  subject: string;
  examType: ExamType;
  timeMinutes: number;
  totalMarks: number;
  layout: LayoutType;
  schoolName?: string;
  schoolLogo?: string;
  date?: string;
  instructions?: string;
}

export interface QuestionPaper {
  id: string;
  setup: PaperSetup;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}