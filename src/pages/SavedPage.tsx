import React from 'react';
import { Material } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBookmarks } from '../context/BookmarksContext';
import { MaterialCard } from '../components/MaterialCard';
import { Bookmark, ArrowRight } from 'lucide-react';

interface SavedPageProps {
  materials: Material[];
  onViewMaterial: (id: string) => void;
  onStartPractice: (id: string) => void;
  onBrowseMaterials: () => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  materials,
  onViewMaterial,
  onStartPractice,
  onBrowseMaterials,
}) => {
  const { t } = useLanguage();
  const { savedIds } = useBookmarks();

  const savedMaterials = materials.filter((m) => savedIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
          <Bookmark className="w-5 h-5 fill-current" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('savedTitle')}
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('savedSubtitle')}
        </p>
      </div>

      {savedMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t('noSavedMaterials')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {t('noSavedDesc')}
            </p>
          </div>
          <button
            onClick={onBrowseMaterials}
            className="py-2.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t('browseMaterials')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedMaterials.map((mat) => (
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
