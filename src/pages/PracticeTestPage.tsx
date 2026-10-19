import React, { useState, useEffect } from 'react';
import { Material, PracticeAttempt } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Award,
  Timer,
  Check,
} from 'lucide-react';

interface PracticeTestPageProps {
  material: Material;
  onBack: () => void;
  onFinish?: () => void;
}

export const PracticeTestPage: React.FC<PracticeTestPageProps> = ({
  material,
  onBack,
}) => {
  const { language, t } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [testResult, setTestResult] = useState<PracticeAttempt | null>(null);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const questions = material.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleSubmitTest = async () => {
    setShowConfirmModal(false);

    // Calculate score
    let score = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      const pts = q.points || 1;
      maxScore += pts;
      const userChoice = userAnswers[q.id];
      if (q.correctOptionId && userChoice === q.correctOptionId) {
        score += pts;
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const attempt = await api.savePracticeAttempt({
      materialId: material.id,
      materialTitleUz: material.titleUz,
      materialTitleRu: material.titleRu,
      grade: material.grade,
      subjectId: material.subjectId,
      type: material.type,
      quarter: material.quarter,
      userAnswers,
      score,
      maxScore,
      percentage,
      timeSpentSeconds: elapsedSeconds,
    });

    setTestResult(attempt);
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setTestResult(null);
  };

  // --- RESULTS VIEW ---
  if (isSubmitted && testResult) {
    const isExcellent = testResult.percentage >= 85;
    const isGood = testResult.percentage >= 60 && testResult.percentage < 85;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Top Disclaimer */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t('testDisclaimer')}</span>
        </div>

        {/* Score Summary Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t('testResults')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'uz' ? material.titleUz : material.titleRu}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {testResult.score} / {testResult.maxScore}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('yourScore')}</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {testResult.percentage}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('percentageScore')}</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">
                {formatTime(testResult.timeSpentSeconds)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'uz' ? 'Sarflangan vaqt' : 'Время'}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">
            {isExcellent ? t('excellent') : isGood ? t('good') : t('needsPractice')}
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="py-2.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('retakeTest')}</span>
            </button>
            <button
              onClick={onBack}
              className="py-2.5 px-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('backToMaterial')}
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t('detailedReview')}</span>
          </h3>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userChoice = userAnswers[q.id];
              const isCorrect = q.correctOptionId && userChoice === q.correctOptionId;
              const hasVerifiedAnswer = q.correctOptionId !== null;
              const qText = language === 'uz' ? q.textUz : q.textRu;
              const explanation = language === 'uz' ? q.explanationUz : q.explanationRu;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border ${
                    !userChoice
                      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {qText}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {!userChoice ? (
                        <span className="text-xs font-medium text-slate-500">
                          {t('unanswered')}
                        </span>
                      ) : isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>+{q.points} ball</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span>0 ball</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 mb-3">
                    {q.options.map((opt) => {
                      const isUser = userChoice === opt.id;
                      const isRight = q.correctOptionId === opt.id;
                      const optText = language === 'uz' ? opt.textUz : opt.textRu;

                      let optStyles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                      if (isRight) {
                        optStyles = 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-900 dark:text-emerald-100 font-semibold';
                      } else if (isUser && !isRight) {
                        optStyles = 'bg-red-100 dark:bg-red-900/60 border-red-400 text-red-900 dark:text-red-100';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${optStyles}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <span className="truncate">{optText}</span>
                          </div>
                          {isUser && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0">
                              {t('yourChoice')}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="pl-8 pt-2">
                    {hasVerifiedAnswer && explanation ? (
                      <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {t('stepByStepExplanation')}:
                        </span>{' '}
                        {explanation}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600 dark:text-amber-400">
                        {t('unverifiedAnswerNotice')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE TEST RUNNER VIEW ---
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Timer Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'uz' ? 'Chiqish' : 'Выйти из теста'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 py-1 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Timer className="w-4 h-4" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="py-1.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t('finishTest')}
          </button>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <span>{t('testDisclaimer')}</span>
      </div>

      {/* Progress Bar & Question Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>
            {t('questionNumber')} {currentIndex + 1} {t('of')} {totalQuestions}
          </span>
          <span>
            {answeredCount} / {totalQuestions} {language === 'uz' ? 'yechildi' : 'отвечено'} ({progressPercent}%)
          </span>
        </div>

        {/* Linear progress */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Selector Numbers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = Boolean(userAnswers[q.id]);
            const isFlagged = Boolean(flaggedQuestions[q.id]);

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center justify-center relative cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : isAnswered
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Card */}
      {currentQuestion && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {t('questionNumber')} {currentIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {language === 'uz' ? currentQuestion.textUz : currentQuestion.textRu}
              </h2>
            </div>

            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shrink-0 ${
                flaggedQuestions[currentQuestion.id]
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Flag className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">
                {flaggedQuestions[currentQuestion.id] ? t('unflag') : t('flagForReview')}
              </span>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = userAnswers[currentQuestion.id] === option.id;
              const optText = language === 'uz' ? option.textUz : option.textRu;

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 shadow-2xs'
                      : 'bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold uppercase transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="leading-snug">{optText}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('previousQuestion')}</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{t('nextQuestion')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="py-2.5 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {t('finishTest')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('confirmSubmitTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('confirmSubmitMsg')}
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'uz' ? 'Javob berildi:' : 'Отвечено:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'uz' ? 'Javob berilmagan:' : 'Пропущено:'}</span>
                <span className="font-bold text-amber-600">
                  {totalQuestions - answeredCount}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-4 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmitTest}
                className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {t('confirmSubmitBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
