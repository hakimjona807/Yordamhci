import React, { useState } from 'react';
import { Material } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  material: Material;
  preselectedQuestionNumber?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  material,
  preselectedQuestionNumber,
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [issueType, setIssueType] = useState<'wrong_answer' | 'typo' | 'bad_source' | 'other'>(
    'wrong_answer'
  );
  const [questionNumber, setQuestionNumber] = useState<string>(
    preselectedQuestionNumber ? String(preselectedQuestionNumber) : ''
  );
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (details.trim().length < 5) {
      setErrorMsg(
        language === 'uz'
          ? 'Iltimos, xatolik haqida kamida 5 ta belgidan iborat tavsif yozing.'
          : 'Пожалуйста, укажите описание ошибки (минимум 5 символов).'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitReport({
        materialId: material.id,
        questionNumber: questionNumber ? Number(questionNumber) : undefined,
        issueType,
        details: details.trim(),
        submittedEmail: email.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch {
      setErrorMsg(
        language === 'uz'
          ? 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.'
          : 'Произошла ошибка при отправке. Пожалуйста, попробуйте снова.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setEmail('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative transition-all">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('reportSuccessTitle')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {t('reportSuccessDesc')}
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('reportModalTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('reportModalDesc')}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-0.5">
              <p className="text-slate-500 dark:text-slate-400">
                {language === 'uz' ? 'Tegishli material:' : 'Материал:'}
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {language === 'uz' ? material.titleUz : material.titleRu}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Issue Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('issueType')} *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="wrong_answer">{t('issueWrongAnswer')}</option>
                <option value="typo">{t('issueTypo')}</option>
                <option value="bad_source">{t('issueBadSource')}</option>
                <option value="other">{t('issueOther')}</option>
              </select>
            </div>

            {/* Optional question number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('questionNumberOptional')}
              </label>
              <input
                type="number"
                min="1"
                max={material.questions.length || 50}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(e.target.value)}
                placeholder="1, 2, 3..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Details Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'uz' ? 'Xatolik tavsifi' : 'Описание ошибки'} *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('reportDetailsPlaceholder')}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Optional Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('yourEmailOptional')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="misol@gmail.com"
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-2 px-4 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {isSubmitting ? t('loading') : t('sendReport')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
