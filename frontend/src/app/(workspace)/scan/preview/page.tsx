'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { UIPreviewTool } from '@/components/assessment/UIPreviewTool';

function PreviewPageContent() {
  const router = useRouter();

  return (
    <div className="assessment-page">
      <UIPreviewTool onSwitchToLive={() => router.push('/scan?mode=live')} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          Loading UI Preview Tool…
        </div>
      }
    >
      <PreviewPageContent />
    </Suspense>
  );
}

