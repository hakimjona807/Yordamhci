import React, { useState } from 'react';
import { Grade, Material, SubjectId } from '../types';
import { ALL_GRADES, getSubjectsForGrade, getSubjectName } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import { MaterialCard } from '../components/MaterialCard';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Award,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface GradesPageProps {
  initialGrade?: Grade;
  materials: Material[];
  onViewMaterial: (id: string) => void;
  onStartPractice: (id: string) => void;
  onNavigateToSubject: (subjectId: SubjectId) => void;
}

export const GradesPage: React.FC<GradesPageProps> = ({
  initialGrade = 5,
  materials,
  onViewMaterial,
  onStartPractice,
  onNavigateToSubject,
}) => {
  const { language, t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(initialGrade);
  const [selectedType, setSelectedType] = useState<'all' | 'BSB' | 'CHSB'>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<number | 'all'>('all');

  const gradeSubjects = getSubjectsForGrade(selectedGrade);

  // Filter materials strictly for the selected grade
  const filteredMaterials = materials.filter((m) => {
    if (m.grade !== selectedGrade) return false;
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    if (selectedQuarter !== 'all' && m.quarter !== selectedQuarter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('navGrades')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'uz'
            ? '5-sinfdan 11-sinfgacha bo\'lgan davlat ta\'lim standarti o\'quv rejasidagi barcha fanlar va baholashlar.'
            : 'Все предметы и проверочные материалы учебного плана государственных стандартов для 5–11 классов.'}
        </p>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ALL_GRADES.map((grade) => {
          const isActive = grade === selectedGrade;
          return (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`py-2.5 px-5 rounded-xl font-bold text-sm shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>
                {grade}-{t('grade')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Curriculum breakdown for selected grade */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>
                {selectedGrade}-{t('grade')}{' '}
                {language === 'uz' ? 'o\'quv rejasidagi fanlar' : 'предметы учебного плана'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'uz'
                ? `Ushbu sinf o\'quv dasturiga jami ${gradeSubjects.length} ta asosiy fan kiritilgan:`
                : `В учебную программу этого класса входят ${gradeSubjects.length} основных предметов:`}
            </p>
          </div>
        </div>

        {/* Subjects list tags */}
        <div className="flex flex-wrap gap-2">
          {gradeSubjects.map((sub) => {
            const matCount = materials.filter(
              (m) => m.grade === selectedGrade && m.subjectId === sub.id
            ).length;

            return (
              <button
                key={sub.id}
                onClick={() => onNavigateToSubject(sub.id)}
                className="py-1.5 px-3 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{language === 'uz' ? sub.nameUz : sub.nameRu}</span>
                {matCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] flex items-center justify-center font-bold">
                    {matCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-filters: Type (BSB / CHSB) and Quarter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedType === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'uz' ? 'Barcha turlar' : 'Все типы'}
          </button>
          <button
            onClick={() => setSelectedType('BSB')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedType === 'BSB'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            BSB (СОР)
          </button>
          <button
            onClick={() => setSelectedType('CHSB')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedType === 'CHSB'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CHSB (СОЧ)
          </button>
        </div>

        {/* Quarters selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('quarter')}:</span>
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(selectedQuarter === q ? 'all' : q)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                selectedQuarter === q
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {q}-{t('quarter')}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div>
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t('noMaterialsFound')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {t('tryAdjustingFilters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((mat) => (
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
    </div>
  );
};
