import React, { useState } from 'react';
import { SubjectId, Material } from '../types';
import { SUBJECTS } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  Binary,
  Compass,
  BookOpen,
  BookMarked,
  Globe,
  Landmark,
  Dna,
  Zap,
  FlaskConical,
  MapPin,
  Laptop,
  ArrowRight,
  Search,
} from 'lucide-react';

interface SubjectsPageProps {
  materials: Material[];
  onSelectSubject: (subjectId: SubjectId) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({
  materials,
  onSelectSubject,
}) => {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');

  const iconMap: Record<string, React.ReactNode> = {
    Calculator: <Calculator className="w-6 h-6" />,
    Binary: <Binary className="w-6 h-6" />,
    Compass: <Compass className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    BookMarked: <BookMarked className="w-6 h-6" />,
    Globe: <Globe className="w-6 h-6" />,
    Landmark: <Landmark className="w-6 h-6" />,
    Dna: <Dna className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    FlaskConical: <FlaskConical className="w-6 h-6" />,
    MapPin: <MapPin className="w-6 h-6" />,
    Laptop: <Laptop className="w-6 h-6" />,
  };

  const filteredSubjects = SUBJECTS.filter((sub) => {
    const name = language === 'uz' ? sub.nameUz : sub.nameRu;
    const desc = language === 'uz' ? sub.descriptionUz : sub.descriptionRu;
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('navSubjects')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'uz'
              ? 'Davlat o\'quv dasturiga kiritilgan barcha umumta\'lim fanlari katalogi.'
              : 'Каталог всех общеобразовательных предметов государственной учебной программы.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'uz' ? 'Fanni qidiring...' : 'Поиск предмета...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => {
          const count = materials.filter((m) => m.subjectId === sub.id).length;
          const gradeRange = `${Math.min(...sub.availableGrades)}–${Math.max(...sub.availableGrades)}`;

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[sub.icon] || <BookOpen className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {gradeRange} {t('grade')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {language === 'uz' ? sub.nameUz : sub.nameRu}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {language === 'uz' ? sub.descriptionUz : sub.descriptionRu}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {count} {language === 'uz' ? 'ta baholash materiali' : 'материалов'}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'uz' ? 'Ko\'rish' : 'Смотреть'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
