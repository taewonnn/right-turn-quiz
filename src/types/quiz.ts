export type QuestionType = 'ox' | 'multiple';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: readonly string[];
  answer: string | number;
  explanation: string;
}

export interface ResultParams {
  score: number;
}
