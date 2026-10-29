'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';
import { PREVIEW_STATES, PreviewTabId, PreviewStateConfig } from './previewData';
import { ResultConfident } from './ResultConfident';
import { ResultMismatch } from './ResultMismatch';
import { ResultInconclusive } from './ResultInconclusive';
import { ResultQualityIssue } from './ResultQualityIssue';
import { ResultUnsupportedCrop } from './ResultUnsupportedCrop';
import { ResultNotALeaf } from './ResultNotALeaf';
import { ResultRequestError } from './ResultRequestError';

interface UIPreviewToolProps {
  initialTab?: PreviewTabId;
  onSwitchToLive?: () => void;
}

export function UIPreviewTool({
  initialTab = 'confident',
  onSwitchToLive,
}: UIPreviewToolProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  // Confident View is strictly the default active state
  const [activeTab, setActiveTab] = useState<PreviewTabId>(initialTab);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Active configuration item
  const currentConfig: PreviewStateConfig =
    PREVIEW_STATES.find((item) => item.id === activeTab) || PREVIEW_STATES[0];

  // Keyboard navigation for accessible tablist (Left / Right arrow keys)
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % PREVIEW_STATES.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + PREVIEW_STATES.length) % PREVIEW_STATES.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = PREVIEW_STATES.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = PREVIEW_STATES[nextIndex];
    setActiveTab(nextTab.id);

    // Shift focus to the new tab button
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  // Scroll active tab into view horizontally on mobile
  useEffect(() => {
    const activeBtn = tabListRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (activeBtn && tabListRef.current) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const handleScanAnother = () => {
    if (onSwitchToLive) {
      onSwitchToLive();
    } else {
      router.push('/scan?mode=live');
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="preview-tool-root" style={{ width: '100%', marginBottom: 32 }}>
      {/* Design Showcase Explanatory Header Banner */}
      <div
        className="preview-showcase-banner"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '14px 20px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--mint-light), #ffffff)',
          border: '1px solid var(--border)',
          marginBottom: 18,
          boxShadow: 'var(--shadow-sm)',
        }}
        role="region"
        aria-label="UI Preview Tool Overview"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--mint)',
              color: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="spark" size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: 14, color: 'var(--text)' }}>
                {isYo ? 'Ètò Àṣàyẹ̀wò UI (Àbájáde 8)' : 'UI Preview Tool — Design Showcase'}
              </strong>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: 'var(--mint)',
                  color: 'var(--green)',
                  border: '1px solid var(--border)',
                }}
              >
                {isYo ? 'Àfihàn Àwòrán' : 'Design Only'}
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
              {isYo
                ? 'Wo gbogbo àwọn ipò àbájáde mẹ́jọ (8) pẹ̀lú àwòrán àpẹẹrẹ. Àwòṣe kò tíì gbé àwòrán gidi jáde níbí.'
                : 'Explore all eight CropScan AI assessment states with realistic agricultural sample data.'}
            </p>
          </div>
        </div>

        {onSwitchToLive && (
          <button
            type="button"
            onClick={onSwitchToLive}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid var(--green)',
              background: 'var(--green)',
              color: 'var(--white)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            <Icon name="camera" size={15} />
            {isYo ? 'Bẹ̀rẹ̀ Àyẹ̀wò Gidi Lórí Oko' : 'Start Live Assessment Wizard'}
          </button>
        )}
      </div>

      {/* Sticky Horizontal Segmented Tab Bar */}
      <div
        className="preview-sticky-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 25,
          background: 'rgba(250, 251, 249, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 0 14px',
          marginBottom: 24,
        }}
      >
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Assessment result state switcher"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            padding: '2px 2px',
          }}
        >
          {PREVIEW_STATES.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                id={`preview-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`preview-panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--green)' : '1px solid var(--border)',
                  background: isActive ? 'var(--green)' : 'var(--white)',
                  color: isActive ? 'var(--white)' : 'var(--text)',
                  boxShadow: isActive ? '0 3px 10px rgba(20, 99, 61, 0.18)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isActive ? 'var(--white)' : 'var(--muted)',
                  }}
                  aria-hidden="true"
                >
                  <Icon name={item.icon} size={15} />
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--leaf)',
                      display: 'inline-block',
                      marginLeft: 2,
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* State description banner under the active tab */}
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 12,
            color: 'var(--muted)',
            padding: '0 4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>
              {currentConfig.label}:
            </span>
            <span>{currentConfig.description}</span>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              background: 'var(--mint)',
              color: 'var(--green)',
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {currentConfig.badgeText}
          </span>
        </div>
      </div>

      {/* Rendered Preview Screen Panels */}
      <div
        id={`preview-panel-${currentConfig.id}`}
        role="tabpanel"
        aria-labelledby={`preview-tab-${currentConfig.id}`}
        tabIndex={0}
      >
        {activeTab === 'confident' && (
          <ResultConfident
            result={currentConfig.result}
            previewUrl={currentConfig.previewUrl}
            crop={currentConfig.result.selectedCrop}
            isSample={true}
            onScanAnother={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'healthy' && (
          <ResultConfident
            result={currentConfig.result}
            previewUrl={currentConfig.previewUrl}
            crop={currentConfig.result.selectedCrop}
            isSample={true}
            onScanAnother={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'crop_mismatch' && (
          <ResultMismatch
            previewUrl={currentConfig.previewUrl}
            selectedCrop={currentConfig.result.selectedCrop}
            detectedCrop={currentConfig.result.detectedCrop}
            mismatchReason={currentConfig.result.mismatchReason}
            onChooseCorrectCrop={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'inconclusive_low_confidence' && (
          <ResultInconclusive
            previewUrl={currentConfig.previewUrl}
            selectedCrop={currentConfig.result.selectedCrop}
            description={currentConfig.result.guidance?.description || currentConfig.result.disclaimer}
            onTryAnotherPhoto={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'unreliable_image_quality' && (
          <ResultQualityIssue
            previewUrl={currentConfig.previewUrl}
            selectedCrop={currentConfig.result.selectedCrop}
            qualityWarning={currentConfig.result.qualityWarning}
            onUploadAnother={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'unsupported_crop' && (
          <ResultUnsupportedCrop
            previewUrl={currentConfig.previewUrl}
            selectedCrop="Cassava"
            unsupportedReason={currentConfig.result.disclaimer}
            onChooseSupportedCrop={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'not_a_leaf' && (
          <ResultNotALeaf
            previewUrl={currentConfig.previewUrl}
            selectedCrop={currentConfig.result.selectedCrop}
            rejectionMessage={currentConfig.result.qualityWarning}
            onUploadAnother={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}

        {activeTab === 'request_error' && (
          <ResultRequestError
            previewUrl={currentConfig.previewUrl}
            selectedCrop={currentConfig.result.selectedCrop}
            errorMessage={currentConfig.errorMessage}
            onRetry={handleScanAnother}
            onDashboard={handleDashboard}
          />
        )}
      </div>
    </div>
  );
}

