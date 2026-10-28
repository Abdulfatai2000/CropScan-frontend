'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { UploadedPhoto, AssessmentResult, ResultOutcome } from '@/types/assessment';
import { ProgressBar } from '@/components/assessment/ProgressBar';
import { StepPhotoUpload } from '@/components/assessment/StepPhotoUpload';
import { StepCropSelect } from '@/components/assessment/StepCropSelect';
import { StepReview } from '@/components/assessment/StepReview';
import { StepProcessing } from '@/components/assessment/StepProcessing';
import { ResultConfident } from '@/components/assessment/ResultConfident';
import { ResultMismatch } from '@/components/assessment/ResultMismatch';
import { ResultInconclusive } from '@/components/assessment/ResultInconclusive';
import { ResultQualityIssue } from '@/components/assessment/ResultQualityIssue';
import { ResultRequestError } from '@/components/assessment/ResultRequestError';

function ScanWizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [crop, setCrop] = useState<Crop | ''>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<ResultOutcome | null>(null);
  const [demoMode, setDemoMode] = useState<ResultOutcome>('confident');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Read initial crop query parameter if navigated from Dashboard or Guide
  useEffect(() => {
    const initialCrop = searchParams.get('crop');
    if (initialCrop) {
      const validCrops: Crop[] = ['Tomato', 'Maize', 'Bell pepper', 'Citrus', 'Potato'];
      const matched = validCrops.find((c) => c.toLowerCase() === initialCrop.toLowerCase());
      if (matched) {
        setCrop(matched);
      }
    }
  }, [searchParams]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (photo?.previewUrl) {
        URL.revokeObjectURL(photo.previewUrl);
      }
    };
  }, [photo]);

  const handlePhotoSelected = (selected: UploadedPhoto) => {
    setPhoto(selected);
  };

  const handlePhotoRemoved = () => {
    if (photo?.previewUrl) {
      URL.revokeObjectURL(photo.previewUrl);
    }
    setPhoto(null);
    setCrop('');
    setStep(1);
    setOutcome(null);
    setResult(null);
  };

  const handleStartAnalysis = () => {
    if (!photo || !crop) return;
    setStep(4);
    setIsProcessing(true);
    setOutcome(null);

    // Phase 3 simulated processing delay replicating user interaction
    setTimeout(() => {
      setIsProcessing(false);
      setOutcome(demoMode);

      if (demoMode === 'confident') {
        const mockConditions: Record<Crop, string> = {
          Tomato: 'Early Blight (Alternaria solani)',
          Maize: 'Common Rust (Puccinia sorghi)',
          'Bell pepper': 'Bacterial Spot (Xanthomonas euvesicatoria)',
          Citrus: 'Citrus Greening (Huanglongbing)',
          Potato: 'Late Blight (Phytophthora infestans)',
        };

        setResult({
          outcome: 'confident',
          selectedCrop: crop,
          predictedCondition: mockConditions[crop],
          confidenceScore: 94.6,
          guidance: {
            description:
              'Symptoms consistent with foliar pathogen. Lesions with concentric rings and marginal chlorosis.',
            symptoms: ['Dark brown concentric target spots', 'Yellow halos around expanding lesions'],
            treatment: [
              'Remove and safely dispose of infected lower leaves',
              'Avoid sprinkler irrigation directly onto foliage',
              'Verify with extension officer before applying registered preventative copper sprays',
            ],
            prevention: [
              'Rotate solanaceous crops with non-host species for 2-3 years',
              'Ensure adequate crop spacing for ventilation',
            ],
          },
        });
      } else if (demoMode === 'crop_mismatch') {
        setResult({
          outcome: 'crop_mismatch',
          selectedCrop: crop,
          detectedCrop: crop === 'Tomato' ? 'Maize' : 'Tomato',
          confidenceScore: 48.0,
          mismatchReason:
            'Leaf morphology and venation pattern did not align with the selected crop group.',
        });
      } else if (demoMode === 'inconclusive_low_confidence') {
        setResult({
          outcome: 'inconclusive_low_confidence',
          selectedCrop: crop,
          confidenceScore: 51.2,
        });
      } else if (demoMode === 'unreliable_image_quality') {
        setResult({
          outcome: 'unreliable_image_quality',
          selectedCrop: crop,
          confidenceScore: 0,
          qualityWarning:
            'The uploaded leaf photograph is too blurry, overly dark, or uniform for a reliable assessment.',
        });
      } else {
        setResult({
          outcome: 'request_error',
          selectedCrop: crop,
          confidenceScore: 0,
        });
      }
    }, 1800);
  };

  return (
    <div className="assessment-page">
      <div className="assessment-head">
        <div>
          <span className="kicker">New assessment</span>
          <h1>Check a plant leaf</h1>
          <p>Follow each guided step to prepare a clear, reliable screening request.</p>
        </div>
        <span className="secure-note">
          <Icon name="shield" size={17} /> Secure on-device workflow
        </span>
      </div>

      <ProgressBar currentStep={step} />

      {step === 1 && (
        <StepPhotoUpload
          photo={photo}
          onPhotoSelected={handlePhotoSelected}
          onPhotoRemoved={handlePhotoRemoved}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && photo && (
        <StepCropSelect
          photo={photo}
          selectedCrop={crop}
          onCropSelected={(c) => setCrop(c)}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && photo && crop && (
        <StepReview
          photo={photo}
          crop={crop}
          onEditPhoto={() => setStep(1)}
          onEditCrop={() => setStep(2)}
          onBack={() => setStep(2)}
          onSubmit={handleStartAnalysis}
        />
      )}

      {step === 4 && isProcessing && photo && crop && (
        <StepProcessing previewUrl={photo.previewUrl} crop={crop} />
      )}

      {step === 4 && !isProcessing && outcome && photo && crop && (
        <>
          {outcome === 'confident' && result && (
            <ResultConfident
              result={result}
              previewUrl={photo.previewUrl}
              crop={crop}
              onScanAnother={handlePhotoRemoved}
              onDashboard={() => router.push('/dashboard')}
            />
          )}

          {outcome === 'crop_mismatch' && (
            <ResultMismatch
              previewUrl={photo.previewUrl}
              selectedCrop={crop}
              detectedCrop={result?.detectedCrop}
              onChooseCorrectCrop={() => setStep(2)}
              onDashboard={() => router.push('/dashboard')}
            />
          )}

          {outcome === 'inconclusive_low_confidence' && (
            <ResultInconclusive
              previewUrl={photo.previewUrl}
              selectedCrop={crop}
              onTryAnotherPhoto={handlePhotoRemoved}
              onDashboard={() => router.push('/dashboard')}
            />
          )}

          {outcome === 'unreliable_image_quality' && (
            <ResultQualityIssue
              previewUrl={photo.previewUrl}
              selectedCrop={crop}
              qualityWarning={result?.qualityWarning}
              onUploadAnother={handlePhotoRemoved}
              onDashboard={() => router.push('/dashboard')}
            />
          )}

          {outcome === 'request_error' && (
            <ResultRequestError
              previewUrl={photo.previewUrl}
              selectedCrop={crop}
              onRetry={handleStartAnalysis}
              onDashboard={() => router.push('/dashboard')}
            />
          )}
        </>
      )}

      {/* Demonstration Outcome Switcher (Design Verification Toolbar) */}
      <aside
        style={{
          marginTop: 40,
          padding: '14px 18px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--white)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 11,
          color: 'var(--muted)',
        }}
        aria-label="Design outcome preview toolbar"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text)' }}>
          <Icon name="spark" size={16} /> Preview Outcome State:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { id: 'confident', label: 'Confident Result' },
            { id: 'crop_mismatch', label: 'Crop Mismatch' },
            { id: 'inconclusive_low_confidence', label: 'Low Confidence' },
            { id: 'unreliable_image_quality', label: 'Quality Rejected' },
            { id: 'request_error', label: 'Server Error' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: demoMode === item.id ? '1px solid var(--green)' : '1px solid var(--border)',
                background: demoMode === item.id ? 'var(--mint)' : 'var(--cream)',
                color: demoMode === item.id ? 'var(--green)' : 'var(--muted)',
                fontWeight: demoMode === item.id ? 700 : 500,
                fontSize: 10,
                cursor: 'pointer',
              }}
              onClick={() => {
                setDemoMode(item.id as ResultOutcome);
                if (step === 4 && outcome) {
                  setOutcome(item.id as ResultOutcome);
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          Loading assessment wizard…
        </div>
      }
    >
      <ScanWizardContent />
    </Suspense>
  );
}
