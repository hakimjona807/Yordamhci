import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Bilim Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('aboutTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t('aboutSubtitle')}
        </p>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{language === 'uz' ? 'Huquqiy va mustaqil maqom eslatmasi' : 'Правовой статус платформы'}</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          {language === 'uz'
            ? 'Bilim Hub — nodavlat, mustaqil ta\'limiy-metodik platforma. Ushbu loyiha O\'zbekiston Respublikasi Maktabgacha va maktab ta\'limi vazirligi yoki uning quyi tuzilmalari bilan rasmiy aloqadorlikka ega emas. Saytdagi barcha materiallar ommaviy ta\'limiy resurslardan o\'quvchilar va ustozlarga qulaylik yaratish, bilimni mustaqil baholash va takrorlash uchun jamlangan.'
            : 'Bilim Hub является независимой негосударственной образовательной платформой. Проект не имеет официальной аффилиации с Министерством дошкольного и школьного образования Республики Узбекистан. Все материалы собраны из открытых источников исключительно в ознакомительных и тренировочных целях.'}
        </p>
      </div>

      {/* BSB and CHSB Detailed Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('whatIsBsb')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('whatIsBsbDesc')}
          </p>
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            {language === 'uz'
              ? 'Har bir chorak davomida fan turiga qarab 1 dan 3 tagacha BSB o\'tkazilishi mumkin.'
              : 'В зависимости от предмета за одну четверть может проводиться от 1 до 3 проверочных работ СОР.'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Award className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('whatIsChsb')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('whatIsChsbDesc')}
          </p>
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            {language === 'uz'
              ? 'CHSB natijasi o\'quvchining choraklik yakuniy bahosida eng katta salmoqqa ega hisoblanadi.'
              : 'Балл за СОЧ имеет решающий удельный вес при выставлении четвертной оценки.'}
          </div>
        </div>
      </div>

      {/* Verification Standards & Integrity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>{t('verificationPhilosophyTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'uz'
              ? 'O\'quvchilarga noto\'g\'ri yo\'nalish bermaslik uchun platformada har bir material aniq toifalarga ajratiladi:'
              : 'Чтобы не вводить школьников в заблуждение, каждый опубликованный материал относится к одной из 4 четких категорий верификации:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Verified */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>{t('status_verified')}</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'uz'
                ? 'Javoblari va yechimlari tajribali mutaxassislar tomonidan tekshirilgan va tasdiqlangan rasmiy kalitga mos keladi.'
                : 'Ответы и решения проверены преподавателями и полностью соответствуют проверенному ключу.'}
            </p>
          </div>

          {/* 2. Official unverified key */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/30 dark:bg-sky-950/20 space-y-2">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>{t('status_official_unverified_key')}</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'uz'
                ? 'Topshiriq rasmiy metodik manbadan olingan, biroq to\'liq javob kaliti mustaqil ekspert tekshiruvidan o\'tmagan.'
                : 'Задания взяты из официальных источников, но ключ ответов еще не прошел независимую экспертизу.'}
            </p>
          </div>

          {/* 3. Community review */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('status_community_review')}</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'uz'
                ? 'O\'qituvchi yoki o\'quvchilar tomonidan yuklangan, moderatorlar tekshiruvi jarayonida bo\'lgan material.'
                : 'Материал предложен сообществом учителей или учеников и находится на стадии модерации.'}
            </p>
          </div>

          {/* 4. Practice generated */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{t('status_practice_generated')}</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'uz'
                ? 'O\'quvchilar o\'z bilimini mustahkamlashi uchun yaratilgan amaliy mashq savollari (rasmiy imtihon bileti emas).'
                : 'Учебные задания, созданные специально для тренировки и закрепления материала (не официальный бланк).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
