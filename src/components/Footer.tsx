import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_GRADES } from '../data/curriculum';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Bilim Hub</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'uz'
                ? 'O\'zbekiston umumta\'lim maktablarining 5-11 sinf o\'quvchilari uchun BSB va CHSB baholashlariga qulay, ishonchli va tizimli tayyorgarlik platformasi.'
                : 'Платформа для системной подготовки учащихся 5-11 классов школ Узбекистана к суммативным оцениваниям СОР (BSB) и СОЧ (CHSB).'}
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{language === 'uz' ? 'Huquqiy eslatma' : 'Правовое примечание'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                {t('officialDisclaimerShort')}
              </p>
            </div>
          </div>

          {/* Grades Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('grades')} (5–11)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {ALL_GRADES.map((grade) => (
                <button
                  key={grade}
                  onClick={() => onNavigate('grades', { grade })}
                  className="text-left text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>
                    {grade}-{t('grade')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'uz' ? 'Bo\'limlar' : 'Разделы'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('bsb')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navBsb')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chsb')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navChsb')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navPractice')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subjects')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navSubjects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Resources & Sources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'uz' ? 'Rasmiy manbalar' : 'Официальные ресурсы'}
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {language === 'uz'
                ? 'Namunaviy o\'quv dasturlari va darsliklar bilan tanishish uchun tavsiya etiladigan rasmiy portallar:'
                : 'Рекомендуемые официальные порталы для ознакомления с учебными программами и учебниками:'}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://rtm.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Respublika ta'lim markazi (RTM)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://eduportal.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>EduPortal axborot ta'lim portali</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ziyonet.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>ZiyoNET axborot-ta'lim tarmog'i</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Bilim Hub. {t('tagline')}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors"
            >
              {language === 'uz' ? 'Tekshiruv mezonlari' : 'Критерии верификации'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors"
            >
              {language === 'uz' ? 'Xatoni bildirish' : 'Сообщить об ошибке'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
