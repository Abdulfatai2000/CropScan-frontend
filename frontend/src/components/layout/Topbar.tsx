'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { LanguageSelect } from '@/components/common/LanguageSelect';
import { useLanguage } from '@/context/LanguageContext';

const ROUTE_TITLES: Record<string, { en: string; yo: string }> = {
  '/dashboard': { en: 'Overview', yo: 'Àkópọ̀' },
  '/scan': { en: 'New Assessment', yo: 'Ṣàyẹ̀wò Tuntun' },
  '/history': { en: 'Assessment History', yo: 'Ìtàn Àyẹ̀wò' },
  '/guide': { en: 'Crop Guide', yo: 'Ìwé Ohun Ọ̀gbìn' },
  '/settings': { en: 'Settings', yo: 'Ètò' },
  '/help': { en: 'Help & FAQ', yo: 'Ìrànlọ́wọ́' },
};

export function Topbar() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const titleEntry = ROUTE_TITLES[pathname] || { en: 'Workspace', yo: 'Ibi Iṣẹ́' };
  const currentTitle = language === 'Yoruba' ? titleEntry.yo : titleEntry.en;

  return (
    <header className="app-topbar">
      <div className="mobile-logo">
        <Logo href="/dashboard" />
      </div>

      <div className="topbar-title">
        <span>CropScan AI</span>
        <strong>{currentTitle}</strong>
      </div>

      <div className="topbar-actions">
        <LanguageSelect />
        <div className="avatar" aria-label="Farmer profile avatar">
          FA
        </div>
      </div>
    </header>
  );
}
