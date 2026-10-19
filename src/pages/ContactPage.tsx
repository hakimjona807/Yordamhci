import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  User,
  School,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'other'>('student');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(language === 'uz' ? 'Iltimos, ismingizni kiriting.' : 'Пожалуйста, введите ваше имя.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(
        language === 'uz'
          ? 'Iltimos, to\'g\'ri elektron pochta manzilini kiriting.'
          : 'Пожалуйста, введите корректный адрес электронной почты.'
      );
      return;
    }

    if (message.trim().length < 10) {
      setErrorMsg(
        language === 'uz'
          ? 'Xabar matni kamida 10 ta belgidan iborat bo\'lishi kerak.'
          : 'Текст сообщения должен содержать минимум 10 символов.'
      );
      return;
    }

    setIsSubmitting(true);
    // Simulate real save in feedback submissions
    setTimeout(() => {
      try {
        const raw = localStorage.getItem('bilimhub_feedback_submissions') || '[]';
        const list = JSON.parse(raw);
        list.push({
          id: 'fb-' + Date.now(),
          name: name.trim(),
          email: email.trim(),
          role,
          subject: subject.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('bilimhub_feedback_submissions', JSON.stringify(list));
      } catch {
        // ignore
      }
      setIsSubmitting(false);
      setSuccess(true);
    }, 400);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSuccess(false);
    setErrorMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('contactTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {language === 'uz' ? 'Xabaringiz yuborildi!' : 'Сообщение отправлено!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {t('feedbackSuccess')}
              </p>
              <button
                onClick={handleReset}
                className="py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {language === 'uz' ? 'Yana xabar yozish' : 'Написать ещё'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('yourName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alisher Navoiy"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('yourEmail')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alisher@gmail.com"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('yourRole')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['student', 'teacher', 'parent', 'other'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                        role === r
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'student' && t('roleStudent')}
                      {r === 'teacher' && t('roleTeacher')}
                      {r === 'parent' && t('roleParent')}
                      {r === 'other' && t('roleOther')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('messageSubject')}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    language === 'uz'
                      ? 'Masalan: 8-sinf Fizika BSB savollari bo\'yicha taklif'
                      : 'Например: Предложение по материалам физики 8 класса'
                  }
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('messageText')} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'uz'
                      ? 'Fikr-mulohazangiz yoki savolingizni batafsil yozing...'
                      : 'Подробно опишите ваше предложение или вопрос...'
                  }
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t('loading') : t('sendMessage')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info & FAQ */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{language === 'uz' ? 'Aloqa ma\'lumotlari' : 'Контакты'}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'uz'
                ? 'Tahririyat guruhi yangi baholash namunalarini tekshirish va kiritishga doim tayyor.'
                : 'Редакционная команда открыта к сотрудничеству с педагогами и методистами.'}
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p>
                <strong>Email:</strong> info@bilimhub.uz
              </p>
              <p>
                <strong>Telegram:</strong> @bilimhub_uz
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>FAQ</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'uz'
                  ? 'Qanday qilib yangi BSB yuborish mumkin?'
                  : 'Как прислать новый вариант СОР?'}
              </p>
              <p className="leading-relaxed">
                {language === 'uz'
                  ? 'Ushbu forma orqali yoki admin panel orqali o\'qituvchilar yangi topshiriqlarni tekshiruvga yuborishlari mumkin.'
                  : 'Через данную форму либо через панель управления учителя могут отправить материалы на проверку.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
