import { Grade, SubjectId, SubjectInfo } from '../types';

export const ALL_GRADES: Grade[] = [5, 6, 7, 8, 9, 10, 11];

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'math',
    nameUz: 'Matematika',
    nameRu: 'Математика',
    icon: 'Calculator',
    descriptionUz: 'Natural sonlar, kasrlar, foizlar va boshlang\'ich hisoblashlar',
    descriptionRu: 'Натуральные числа, дроби, проценты и базовые вычисления',
    availableGrades: [5, 6],
  },
  {
    id: 'algebra',
    nameUz: 'Algebra',
    nameRu: 'Алгебра',
    icon: 'Binary',
    descriptionUz: 'Tenglamalar, funksiyalar, ko\'phadlar va tengsizliklar',
    descriptionRu: 'Уравнения, функции, многочлены и неравенства',
    availableGrades: [7, 8, 9, 10, 11],
  },
  {
    id: 'geometry',
    nameUz: 'Geometriya',
    nameRu: 'Геометрия',
    icon: 'Compass',
    descriptionUz: 'Planimetriya, stereometriya, shakllar va fazoviy hisoblar',
    descriptionRu: 'Планиметрия, стереометрия, геометрические фигуры и векторы',
    availableGrades: [7, 8, 9, 10, 11],
  },
  {
    id: 'uzbek',
    nameUz: 'O\'zbek tili va adabiyoti',
    nameRu: 'Узбекский язык и литература',
    icon: 'BookOpen',
    descriptionUz: 'Grammatika, imlo qoidalari, matn tahlili va milliy adabiyot durdonalari',
    descriptionRu: 'Грамматика, орфография, анализ текста и узбекская литература',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'russian',
    nameUz: 'Rus tili va adabiyoti',
    nameRu: 'Русский язык и литература',
    icon: 'BookMarked',
    descriptionUz: 'Sintaksis, leksikologiya, nutq madaniyati va jahon adabiyoti',
    descriptionRu: 'Синтаксис, лексикология, культура речи и классическая литература',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'english',
    nameUz: 'Ingliz tili',
    nameRu: 'Английский язык',
    icon: 'Globe',
    descriptionUz: 'Grammar, Reading comprehension, Vocabulary & Writing competencies',
    descriptionRu: 'Грамматика, чтение, лексика и понимание иноязычной речи',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'history',
    nameUz: 'Tarix (O\'zbekiston va Jahon)',
    nameRu: 'История (Узбекистана и всемирная)',
    icon: 'Landmark',
    descriptionUz: 'Vatanimiz tarixi, qadimgi sivilizatsiyalar va yangi davr voqealari',
    descriptionRu: 'История Родины, древние цивилизации и события нового времени',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'biology',
    nameUz: 'Biologiya / Tabiiy fanlar',
    nameRu: 'Биология / Естествознание',
    icon: 'Dna',
    descriptionUz: 'O\'simliklar, hayvonot olami, inson anatomiyasi va umumiy biologiya',
    descriptionRu: 'Ботаника, зоология, анатомия человека и общая биология',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'physics',
    nameUz: 'Fizika',
    nameRu: 'Физика',
    icon: 'Zap',
    descriptionUz: 'Mexanika, issiqlik hodisalari, elektromagnetizm va optika',
    descriptionRu: 'Механика, тепловые явления, электромагнетизм и оптика',
    availableGrades: [6, 7, 8, 9, 10, 11],
  },
  {
    id: 'chemistry',
    nameUz: 'Kimyo',
    nameRu: 'Химия',
    icon: 'FlaskConical',
    descriptionUz: 'Moddalar tuzilishi, davriy qonun, noorganik va organik kimyo',
    descriptionRu: 'Строение веществ, периодический закон, неорганическая и органическая химия',
    availableGrades: [7, 8, 9, 10, 11],
  },
  {
    id: 'geography',
    nameUz: 'Geografiya',
    nameRu: 'География',
    icon: 'MapPin',
    descriptionUz: 'Materiklar, O\'zbekiston tabiiy va iqtisodiy geografiyasi',
    descriptionRu: 'Материки, физическая и экономическая география Узбекистана',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'informatics',
    nameUz: 'Informatika va axborot texnologiyalari',
    nameRu: 'Информатика и ИТ',
    icon: 'Laptop',
    descriptionUz: 'Algoritm asoslari, Python dasturlash, kompyuter savodxonligi va tarmoqlar',
    descriptionRu: 'Основы алгоритмов, программирование на Python, компьютерная грамотность',
    availableGrades: [5, 6, 7, 8, 9, 10, 11],
  },
];

export const ACADEMIC_YEARS = ['2024-2025', '2023-2024'];
export const QUARTERS = [1, 2, 3, 4] as const;

export function getSubjectsForGrade(grade: Grade): SubjectInfo[] {
  return SUBJECTS.filter((s) => s.availableGrades.includes(grade));
}

export function isSubjectAvailableForGrade(subjectId: SubjectId, grade: Grade): boolean {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  return subject ? subject.availableGrades.includes(grade) : false;
}

export function getSubjectName(subjectId: SubjectId, lang: 'uz' | 'ru'): string {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return subjectId;
  return lang === 'uz' ? subject.nameUz : subject.nameRu;
}
