'use client';

import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Icon } from './Icon';

interface LanguageSelectProps {
  dark?: boolean;
  className?: string;
}

export function LanguageSelect({ dark = false, className = '' }: LanguageSelectProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <label className={`language-select ${dark ? 'language-dark' : ''} ${className}`}>
      <Icon name="globe" size={17} />
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label="Select language"
      >
        <option value="English">English</option>
        <option value="Yoruba">Yorùbá</option>
      </select>
      <Icon name="chevron" size={14} />
    </label>
  );
}
