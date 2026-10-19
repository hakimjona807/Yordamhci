import React from 'react';
import { Material } from '../types';
import { ALL_GRADES } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import { MaterialCard } from '../components/MaterialCard';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
} from 'lucide-react';

interface HomePageProps {
  materials: Material[];
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onViewMaterial: (id: string) => void;
  onStartPractice: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  materials,
  onNavigate,
  onViewMaterial,
  onStartPractice,
}) => {
  const { language, t } = useLanguage();
  const [quickSearch, setQuickSearch] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('materials', { search: quickSearch.trim() });
    }
  };

  const verifiedMaterials = materials
    .filter((m) => m.verificationStatus === 'verified')
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-900 via-blue-800 to-indigo-950 text-white px-6 py-14 sm:py-20 sm:px-12 shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{t('tagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {language === 'uz' ? (
              <>
                5–11 sinflar uchun <span className="text-blue-300">BSB va CHSB</span> baholash materiallari
              </>
            ) : (
              <>
                Материалы <span className="text-blue-300">СОР и СОЧ</span> для 5–11 классов школ Узбекистана
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            {language === 'uz'
              ? 'Ishonchli javob kalitlari, bosqichma-bosqich yechimlar va o\'z bilimingizni mustaqil sinash uchun interaktiv amaliy mashqlar.'
              : 'Проверенные ключи ответов, пошаговые решения и интерактивные практические тесты для уверенной подготовки.'}
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-lg border border-white/20"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {t('search')}
            </button>
          </form>

          {/* Fast grade buttons */}
          <div className="pt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-blue-200 font-medium">{t('grades')}:</span>
            {ALL_GRADES.map((g) => (
              <button
                key={g}
                onClick={() => onNavigate('grades', { grade: g })}
                className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
              >
                {g}-{t('grade')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Selector Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Sinfingizni tanlang' : 'Выберите ваш класс'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'uz'
                ? 'Har bir sinf uchun moslashtirilgan fanlar va baholash materiallari'
                : 'Предметы и материалы, соответствующие учебной программе класса'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('grades')}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{language === 'uz' ? 'Barcha sinflar' : 'Все классы'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_GRADES.map((grade) => {
            const gradeMaterialsCount = materials.filter((m) => m.grade === grade).length;
            return (
              <div
                key={grade}
                onClick={() => onNavigate('grades', { grade })}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    {grade}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {grade}-{t('grade')}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {gradeMaterialsCount} {language === 'uz' ? 'material' : 'матер.'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BSB and CHSB Educational Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BSB Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
                <FileCheck2 className="w-4 h-4" />
                <span>{t('bsbShort')}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('whatIsBsb')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('whatIsBsbDesc')}
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('bsb')}
                className="py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{t('navBsb')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CHSB Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{t('chsbShort')}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('whatIsChsb')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('whatIsChsbDesc')}
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('chsb')}
                className="py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{t('navChsb')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Materials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'uz' ? 'Ishonchli va tasdiqlangan' : 'Проверенные материалы'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Tavsiya etiladigan namunalar' : 'Рекомендуемые образцы'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('materials', { verificationStatus: 'verified' })}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{language === 'uz' ? 'Barchasini ko\'rish' : 'Смотреть все'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {verifiedMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onViewDetails={onViewMaterial}
              onStartPractice={onStartPractice}
            />
          ))}
        </div>
      </section>

      {/* Trust & Transparency Policy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t('verificationPhilosophyTitle')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('verificationPhilosophyDesc')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="shrink-0 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              {language === 'uz' ? 'Batafsil ma\'lumot' : 'Подробнее о стандартах'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
