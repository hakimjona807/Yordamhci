import React, { useState, useMemo } from 'react';
import { Material, AssessmentType, Grade, SubjectId, Quarter, VerificationStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { FilterBar, FilterState } from '../components/FilterBar';
import { MaterialCard } from '../components/MaterialCard';
import { FileQuestion, SlidersHorizontal } from 'lucide-react';

interface MaterialsPageProps {
  initialType?: AssessmentType | 'all';
  initialGrade?: Grade | 'all';
  initialSubjectId?: SubjectId | 'all';
  initialSearch?: string;
  initialVerificationStatus?: VerificationStatus | 'all';
  materials: Material[];
  onViewMaterial: (id: string) => void;
  onStartPractice: (id: string) => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
  initialType = 'all',
  initialGrade = 'all',
  initialSubjectId = 'all',
  initialSearch = '',
  initialVerificationStatus = 'all',
  materials,
  onViewMaterial,
  onStartPractice,
}) => {
  const { language, t } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearch,
    grade: initialGrade,
    subjectId: initialSubjectId,
    type: initialType,
    quarter: 'all',
    academicYear: 'all',
    verificationStatus: initialVerificationStatus,
    languageFilter: 'all',
  });

  const [sortBy, setSortBy] = useState<'newest' | 'grade_asc' | 'grade_desc'>('newest');

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const inTitleUz = m.titleUz.toLowerCase().includes(q);
        const inTitleRu = m.titleRu.toLowerCase().includes(q);
        const inDescUz = m.descriptionUz.toLowerCase().includes(q);
        const inDescRu = m.descriptionRu.toLowerCase().includes(q);
        const inQuestions = m.questions.some(
          (qu) =>
            qu.textUz.toLowerCase().includes(q) || qu.textRu.toLowerCase().includes(q)
        );
        if (!inTitleUz && !inTitleRu && !inDescUz && !inDescRu && !inQuestions) {
          return false;
        }
      }

      // Grade
      if (filters.grade !== 'all' && m.grade !== filters.grade) {
        return false;
      }

      // Subject
      if (filters.subjectId !== 'all' && m.subjectId !== filters.subjectId) {
        return false;
      }

      // Assessment Type
      if (filters.type !== 'all' && m.type !== filters.type) {
        return false;
      }

      // Quarter
      if (filters.quarter !== 'all' && m.quarter !== filters.quarter) {
        return false;
      }

      // Academic Year
      if (filters.academicYear !== 'all' && m.academicYear !== filters.academicYear) {
        return false;
      }

      // Verification Status
      if (
        filters.verificationStatus !== 'all' &&
        m.verificationStatus !== filters.verificationStatus
      ) {
        return false;
      }

      // Language
      if (filters.languageFilter !== 'all') {
        if (m.language !== 'both' && m.language !== filters.languageFilter) {
          return false;
        }
      }

      return true;
    });
  }, [materials, filters]);

  const sortedMaterials = useMemo(() => {
    return [...filteredMaterials].sort((a, b) => {
      if (sortBy === 'grade_asc') return a.grade - b.grade;
      if (sortBy === 'grade_desc') return b.grade - a.grade;
      // Default: newest by publication date or id
      return (b.publicationDate || '').localeCompare(a.publicationDate || '');
    });
  }, [filteredMaterials, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      grade: 'all',
      subjectId: 'all',
      type: 'all',
      quarter: 'all',
      academicYear: 'all',
      verificationStatus: 'all',
      languageFilter: 'all',
    });
  };

  const getPageTitle = () => {
    if (filters.type === 'BSB') return t('navBsb');
    if (filters.type === 'CHSB') return t('navChsb');
    return language === 'uz' ? 'Baholash materiallari katalogi' : 'Каталог материалов оценивания';
  };

  const getPageSubtitle = () => {
    if (filters.type === 'BSB') {
      return language === 'uz'
        ? 'Bo\'lim yuzasidan summativ baholash (BSB) topshiriqlari va yechimlari.'
        : 'Задания и решения суммативного оценивания за раздел (СОР).';
    }
    if (filters.type === 'CHSB') {
      return language === 'uz'
        ? 'Choraklik summativ baholash (CHSB) nazoratlari va tayyorgarlik testlari.'
        : 'Итоговые контрольные работы суммативного оценивания за четверть (СОЧ).';
    }
    return language === 'uz'
      ? 'O\'zbekiston maktablarining 5-11 sinflari uchun barcha rasmiy va namunaviy materiallar.'
      : 'Все официальные и тренировочные материалы для 5-11 классов школ Узбекистана.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getPageSubtitle()}
          </p>
        </div>

        {/* Sorting control */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">
            {language === 'uz' ? 'Saralash:' : 'Сортировка:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">
              {language === 'uz' ? 'Eng yangi qo\'shilganlar' : 'Сначала новые'}
            </option>
            <option value="grade_asc">
              {language === 'uz' ? 'Sinf bo\'yicha (5 -> 11)' : 'По классу (5 -> 11)'}
            </option>
            <option value="grade_desc">
              {language === 'uz' ? 'Sinf bo\'yicha (11 -> 5)' : 'По классу (11 -> 5)'}
            </option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={sortedMaterials.length}
      />

      {/* Results Grid */}
      {sortedMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t('noMaterialsFound')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {t('tryAdjustingFilters')}
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onViewDetails={onViewMaterial}
              onStartPractice={onStartPractice}
            />
          ))}
        </div>
      )}
    </div>
  );
};
