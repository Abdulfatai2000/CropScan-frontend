'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { LanguageSelect } from '@/components/common/LanguageSelect';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();

  const scanLabel = language === 'Yoruba' ? 'Ṣàyẹ̀wò Ohun Ọ̀gbìn' : 'Scan a Plant';

  return (
    <header className="public-header">
      <div className="public-nav wrap">
        <Logo />

        <nav
          className={menuOpen ? 'public-links open' : 'public-links'}
          aria-label="Main public navigation"
        >
          <Link href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="#how" onClick={() => setMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="#crops" onClick={() => setMenuOpen(false)}>
            Supported Crops
          </Link>
          <Link href="#responsible" onClick={() => setMenuOpen(false)}>
            Responsible AI
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            Workspace
          </Link>
          {menuOpen && (
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <LanguageSelect />
              <Button href="/scan" full>
                {scanLabel}
              </Button>
            </div>
          )}
        </nav>

        <div className="public-actions">
          <LanguageSelect />
          <Button href="/scan">
            {scanLabel}
          </Button>
        </div>

        <button
          type="button"
          className="icon-button menu-button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}
