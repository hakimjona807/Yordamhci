export type Grade = 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type SubjectId =
  | 'math'
  | 'algebra'
  | 'geometry'
  | 'uzbek'
  | 'russian'
  | 'english'
  | 'history'
  | 'biology'
  | 'physics'
  | 'chemistry'
  | 'geography'
  | 'informatics';

export type AssessmentType = 'BSB' | 'CHSB';

export type Quarter = 1 | 2 | 3 | 4;

export type VerificationStatus =
  | 'verified'                 // Verified against a reliable answer key
  | 'official_unverified_key'  // Official source, answer key not independently verified
  | 'community_review'         // Community submitted, awaiting review
  | 'practice_generated';      // Practice material generated for learning

export interface QuestionOption {
  id: string; // 'a', 'b', 'c', 'd'
  textUz: string;
  textRu: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  textUz: string;
  textRu: string;
  options: QuestionOption[];
  correctOptionId: string | null; // null if not verified yet
  explanationUz?: string;
  explanationRu?: string;
  points: number;
  isVerified: boolean;
}

export interface Material {
  id: string;
  titleUz: string;
  titleRu: string;
  grade: Grade;
  subjectId: SubjectId;
  academicYear: string;
  quarter: Quarter;
  type: AssessmentType;
  bsbNumber?: number; // e.g. BSB-1, BSB-2
  language: 'uz' | 'ru' | 'both';
  verificationStatus: VerificationStatus;
  sourceTitle: string;
  sourceUrl: string;
  publicationDate?: string;
  lastReviewedDate?: string;
  descriptionUz: string;
  descriptionRu: string;
  curriculumContext: string;
  questions: Question[];
  variant?: string;
  practiceDurationMinutes?: number;
}

export interface SubjectInfo {
  id: SubjectId;
  nameUz: string;
  nameRu: string;
  icon: string;
  descriptionUz: string;
  descriptionRu: string;
  availableGrades: Grade[];
}

export interface MaterialReport {
  id: string;
  materialId: string;
  questionNumber?: number;
  issueType: 'wrong_answer' | 'typo' | 'bad_source' | 'other';
  details: string;
  submittedEmail?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'rejected';
  adminNotes?: string;
}

export interface PracticeAttempt {
  id: string;
  materialId: string;
  materialTitleUz: string;
  materialTitleRu: string;
  grade: Grade;
  subjectId: SubjectId;
  type: AssessmentType;
  quarter: Quarter;
  userAnswers: Record<string, string>; // questionId -> optionId
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeSpentSeconds: number;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'other';
  subject: string;
  message: string;
  createdAt: string;
}
