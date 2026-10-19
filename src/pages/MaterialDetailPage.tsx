import React, { useState } from 'react';
import { Material } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBookmarks } from '../context/BookmarksContext';
import { getSubjectName } from '../data/curriculum';
import { StatusBadge } from '../components/StatusBadge';
import { ReportModal } from '../components/ReportModal';
import {
  ArrowLeft,
  Bookmark,
  Printer,
  Flag,
  Play,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  Clock,
} from 'lucide-react';

interface MaterialDetailPageProps {
  material: Material;
  onBack: () => void;
  onStartPractice: (id: string) => void;
}

export const MaterialDetailPage: React.FC<MaterialDetailPageProps> = ({
  material,
  onBack,
  onStartPractice,
}) => {
  const { language, t } = useLanguage();
  const { isSaved, toggleSaved } = useBookmarks();

  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingQuestionNumber, setReportingQuestionNumber] = useState<number | undefined>(
    undefined
  );

  const title = language === 'uz' ? material.titleUz : material.titleRu;
  const description = language === 'uz' ? material.descriptionUz : material.descriptionRu;
  const subjectName = getSubjectName(material.subjectId, language);
  const saved = isSaved(material.id);

  const handlePrint = () => {
    window.print();
  };

  const handleReportQuestion = (questionNum: number) => {
    setReportingQuestionNumber(questionNum);
    setReportModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button and quick actions */}
      <div className="no-print flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'uz' ? 'Orqaga qaytish' : 'Назад к списку'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            onClick={() => toggleSaved(material.id)}
            className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              saved
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? t('removeFromBookmarks') : t('saveToBookmarks')}</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t('printMaterial')}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printMaterial')}</span>
          </button>

          {/* Report */}
          <button
            onClick={() => {
              setReportingQuestionNumber(undefined);
              setReportModalOpen(true);
            }}
            className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('reportError')}</span>
          </button>
        </div>
      </div>

      {/* Material Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs print-page">
        {/* Header Kicker */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {material.grade}-{t('grade')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {subjectName}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {material.quarter}-{t('quarter')}
          </span>
          <span aria-hidden="true">·</span>
          <span>{material.academicYear}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {material.type === 'BSB' ? t('bsbShort') : t('chsbShort')}
            {material.bsbNumber ? `-${material.bsbNumber}` : ''}
          </span>
          {material.variant && (
            <>
              <span aria-hidden="true">·</span>
              <span>{material.variant}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
          {title}
        </h1>

        {/* Verification Status */}
        <div className="mb-6">
          <StatusBadge status={material.verificationStatus} size="md" />
        </div>

        {/* Description & Curriculum Context */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        {/* Source Attribution Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 mb-8 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === 'uz' ? 'Asl manba va tekshiruv qaydlari:' : 'Первоисточник и верификация:'}
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {material.sourceTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('curriculumContext')}: {material.curriculumContext}
              </p>
            </div>

            {material.sourceUrl && (
              <a
                href={material.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="no-print shrink-0 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
              >
                <span>{t('sourceLink')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex-wrap">
            {material.publicationDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>
                  {language === 'uz' ? 'Chop etilgan sana:' : 'Дата публикации:'}{' '}
                  {material.publicationDate}
                </span>
              </span>
            )}
            {material.lastReviewedDate && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>
                  {t('reviewDate')}: {material.lastReviewedDate}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Practice Test Banner (No-print) */}
        {material.questions.length > 0 && (
          <div className="no-print bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Play className="w-4 h-4 fill-current text-blue-600 dark:text-blue-400" />
                <span>
                  {language === 'uz'
                    ? 'Ushbu materialni test rejimida mustaqil topshiring'
                    : 'Пройдите этот материал в режиме тренировочного теста'}
                </span>
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {material.questions.length} {t('questionsCount')} · ~
                {material.practiceDurationMinutes || 30} {t('minutes')}
              </p>
            </div>
            <button
              onClick={() => onStartPractice(material.id)}
              className="py-2.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('startPractice')}</span>
            </button>
          </div>
        )}

        {/* Questions Header with Show/Hide Answers Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Nazorat savollari va topshiriqlari' : 'Контрольные вопросы и задания'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {material.questions.length}
            </span>
          </div>

          <button
            onClick={() => setShowAllAnswers(!showAllAnswers)}
            className="no-print py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {showAllAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAllAnswers ? t('hideAnswers') : t('showAnswers')}</span>
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {material.questions.map((question, idx) => {
            const qText = language === 'uz' ? question.textUz : question.textRu;
            const explanation =
              language === 'uz' ? question.explanationUz : question.explanationRu;
            const hasVerifiedAnswer = question.correctOptionId !== null;

            return (
              <div
                key={question.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 print-break-inside-avoid space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                      {question.questionNumber || idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {qText}
                    </h3>
                  </div>

                  <div className="no-print flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {question.points} {language === 'uz' ? 'ball' : 'б.'}
                    </span>
                    <button
                      onClick={() => handleReportQuestion(question.questionNumber || idx + 1)}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                      title={t('reportError')}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                  {question.options.map((option) => {
                    const optText = language === 'uz' ? option.textUz : option.textRu;
                    const isCorrect = showAllAnswers && option.id === question.correctOptionId;

                    return (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-colors ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold uppercase shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="leading-snug">{optText}</span>
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-auto shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Answer and Step-by-Step Explanation block (when answers shown) */}
                {showAllAnswers && (
                  <div className="pl-10 pt-2 space-y-2">
                    {hasVerifiedAnswer ? (
                      <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            {t('verifiedAnswer')}: Variant{' '}
                            <span className="uppercase font-extrabold">
                              {question.correctOptionId}
                            </span>
                          </span>
                        </div>
                        {explanation && (
                          <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                            <span className="font-semibold">{t('stepByStepExplanation')}:</span>{' '}
                            {explanation}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Display requirement: "If a question has no verified answer, display 'Answer not verified yet' in English internally and its correct localized equivalent in the UI" */
                      <div
                        data-answer-status="Answer not verified yet"
                        className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{t('unverifiedAnswerNotice')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Disclaimer on Material Page */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {language === 'uz' ? 'Eslatma:' : 'Примечание:'}
          </p>
          <p>{t('officialDisclaimerDetail')}</p>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        material={material}
        preselectedQuestionNumber={reportingQuestionNumber}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
