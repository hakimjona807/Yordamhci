import React from 'react';
import { VerificationStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, HelpCircle, Clock, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
  size = 'md',
}) => {
  const { t } = useLanguage();

  const configs: Record<
    VerificationStatus,
    {
      labelKey: keyof typeof import('../i18n/translations').translations.uz;
      dotColor: string;
      textColor: string;
      bgColor: string;
      borderColor: string;
      icon: React.ReactNode;
    }
  > = {
    verified: {
      labelKey: 'status_verified',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-800 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    },
    official_unverified_key: {
      labelKey: 'status_official_unverified_key',
      dotColor: 'bg-sky-500',
      textColor: 'text-sky-800 dark:text-sky-300',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-200 dark:border-sky-800/60',
      icon: <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />,
    },
    community_review: {
      labelKey: 'status_community_review',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-800 dark:text-amber-300',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-800/60',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />,
    },
    practice_generated: {
      labelKey: 'status_practice_generated',
      dotColor: 'bg-indigo-500',
      textColor: 'text-indigo-800 dark:text-indigo-300',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-800/60',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />,
    },
  };

  const current = configs[status] || configs.practice_generated;
  const label = t(current.labelKey);

  const textSize = size === 'sm' ? 'text-xs py-0.5 px-2' : 'text-xs py-1 px-2.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md transition-colors ${current.bgColor} ${current.borderColor} ${current.textColor} ${textSize} ${className}`}
      title={label}
    >
      {showIcon ? current.icon : <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      <span className="truncate">{label}</span>
    </span>
  );
};
