import React from 'react';
import { Material } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBookmarks } from '../context/BookmarksContext';
import { getSubjectName } from '../data/curriculum';
import { StatusBadge } from './StatusBadge';
import { Bookmark, Clock, ArrowRight, Play, ExternalLink } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onViewDetails: (id: string) => void;
  onStartPractice: (id: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onViewDetails,
  onStartPractice,
}) => {
  const { language, t } = useLanguage();
  const { isSaved, toggleSaved } = useBookmarks();

  const title = language === 'uz' ? material.titleUz : material.titleRu;
  const description = language === 'uz' ? material.descriptionUz : material.descriptionRu;
  const subjectName = getSubjectName(material.subjectId, language);
  const saved = isSaved(material.id);

  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/60 transition-all flex flex-col justify-between">
      <div>
        {/* Typographic metadata kicker with clean separators */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {material.grade}-{t('grade')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {subjectName}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {material.quarter}-{t('quarter')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{material.academicYear}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(material.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              saved
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={saved ? t('removeFromBookmarks') : t('saveToBookmarks')}
            title={saved ? t('removeFromBookmarks') : t('saveToBookmarks')}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(material.id)}
          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
        >
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Verification Status */}
        <div className="mb-4">
          <StatusBadge status={material.verificationStatus} />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* Source attribution & questions count */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-[200px]" title={material.sourceTitle}>
            {material.sourceTitle}
          </span>
          <span className="shrink-0 flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{material.questions.length} {t('questionsCount')}</span>
          </span>
        </div>

        {/* Functional Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(material.id)}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {material.questions.length > 0 && (
            <button
              onClick={() => onStartPractice(material.id)}
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('startPractice')}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
