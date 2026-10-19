import React, { useState } from 'react';
import { Grade, SubjectId, AssessmentType, Quarter, VerificationStatus } from '../types';
import { ALL_GRADES, SUBJECTS, getSubjectsForGrade, ACADEMIC_YEARS } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, X, ChevronDown, RotateCcw } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  grade: Grade | 'all';
  subjectId: SubjectId | 'all';
  type: AssessmentType | 'all';
  quarter: Quarter | 'all';
  academicYear: string | 'all';
  verificationStatus: VerificationStatus | 'all';
  languageFilter: 'all' | 'uz' | 'ru';
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const { language, t } = useLanguage();
  const [expandedMobile, setExpandedMobile] = useState(false);

  // Available subjects depend on selected grade
  const availableSubjects =
    filters.grade !== 'all' ? getSubjectsForGrade(filters.grade) : SUBJECTS;

  const handleFieldChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    // If changing grade, check if the currently selected subject is still available
    if (key === 'grade' && value !== 'all') {
      const allowed = getSubjectsForGrade(value as Grade).map((s) => s.id);
      if (filters.subjectId !== 'all' && !allowed.includes(filters.subjectId)) {
        onChange({ ...filters, grade: value as Grade, subjectId: 'all' });
        return;
      }
    }
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.grade !== 'all' ||
    filters.subjectId !== 'all' ||
    filters.type !== 'all' ||
    filters.quarter !== 'all' ||
    filters.academicYear !== 'all' ||
    filters.verificationStatus !== 'all' ||
    filters.languageFilter !== 'all';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs mb-6 transition-colors">
      {/* Top row: Search input + mobile filter toggle + quick type toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFieldChange('searchQuery', e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFieldChange('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Qidiruvni tozalash"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Assessment Type Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleFieldChange('type', 'all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filters.type === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'uz' ? 'Barchasi' : 'Все'}
          </button>
          <button
            onClick={() => handleFieldChange('type', 'BSB')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filters.type === 'BSB'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            BSB (СОР)
          </button>
          <button
            onClick={() => handleFieldChange('type', 'CHSB')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filters.type === 'CHSB'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CHSB (СОЧ)
          </button>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setExpandedMobile(!expandedMobile)}
          className="md:hidden flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{t('filter')}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${expandedMobile ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Select Filters Grid: Always visible on desktop, toggleable on mobile */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 ${
          expandedMobile ? 'block' : 'hidden md:grid'
        }`}
      >
        {/* Grade Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('grade')}
          </label>
          <select
            value={filters.grade}
            onChange={(e) =>
              handleFieldChange('grade', e.target.value === 'all' ? 'all' : (Number(e.target.value) as Grade))
            }
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{t('allGrades')}</option>
            {ALL_GRADES.map((g) => (
              <option key={g} value={g}>
                {g}-{t('grade')}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('subject')}
          </label>
          <select
            value={filters.subjectId}
            onChange={(e) =>
              handleFieldChange('subjectId', e.target.value as SubjectId | 'all')
            }
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="all">{t('allSubjects')}</option>
            {availableSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'uz' ? s.nameUz : s.nameRu}
              </option>
            ))}
          </select>
        </div>

        {/* Quarter Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('quarter')}
          </label>
          <select
            value={filters.quarter}
            onChange={(e) =>
              handleFieldChange('quarter', e.target.value === 'all' ? 'all' : (Number(e.target.value) as Quarter))
            }
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{t('allQuarters')}</option>
            <option value="1">1-{t('quarter')}</option>
            <option value="2">2-{t('quarter')}</option>
            <option value="3">3-{t('quarter')}</option>
            <option value="4">4-{t('quarter')}</option>
          </select>
        </div>

        {/* Academic Year Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('academicYear')}
          </label>
          <select
            value={filters.academicYear}
            onChange={(e) => handleFieldChange('academicYear', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{t('allYears')}</option>
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {language === 'uz' ? 'Tekshiruv holati' : 'Статус проверки'}
          </label>
          <select
            value={filters.verificationStatus}
            onChange={(e) =>
              handleFieldChange('verificationStatus', e.target.value as VerificationStatus | 'all')
            }
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="all">{language === 'uz' ? 'Barcha holatlar' : 'Все статусы'}</option>
            <option value="verified">{t('status_short_verified')}</option>
            <option value="official_unverified_key">{t('status_short_official_unverified_key')}</option>
            <option value="community_review">{t('status_short_community_review')}</option>
            <option value="practice_generated">{t('status_short_practice_generated')}</option>
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {language === 'uz' ? 'Material tili' : 'Язык материала'}
          </label>
          <select
            value={filters.languageFilter}
            onChange={(e) =>
              handleFieldChange('languageFilter', e.target.value as 'all' | 'uz' | 'ru')
            }
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{language === 'uz' ? 'Har ikkala til' : 'Все языки'}</option>
            <option value="uz">O'zbekcha (UZ)</option>
            <option value="ru">Русский (RU)</option>
          </select>
        </div>
      </div>

      {/* Results summary bar with clear button */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span>
          {language === 'uz'
            ? `Topilgan materiallar: ${totalResults} ta`
            : `Найдено материалов: ${totalResults}`}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('clearFilters')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
