export type Subject = 'Matematika' | 'IPA' | 'Bahasa Indonesia' | 'IPS';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  answers: number[];
  selectedSubject: Subject | null;
}
