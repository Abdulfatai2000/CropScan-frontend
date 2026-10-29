'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { UploadedPhoto, AssessmentResult, ResultOutcome } from '@/types/assessment';
import { useLanguage } from '@/context/LanguageContext';
import { ProgressBar } from '@/components/assessment/ProgressBar';
import { StepPhotoUpload } from '@/components/assessment/StepPhotoUpload';
import { StepCropSelect } from '@/components/assessment/StepCropSelect';
import { StepReview } from '@/components/assessment/StepReview';
import { StepProcessing } from '@/components/assessment/StepProcessing';
import { ResultConfident } from '@/components/assessment/ResultConfident';
import { ResultMismatch } from '@/components/assessment/ResultMismatch';
import { ResultInconclusive } from '@/components/assessment/ResultInconclusive';
import { ResultQualityIssue } from '@/components/assessment/ResultQualityIssue';
import { ResultNotALeaf } from '@/components/assessment/ResultNotALeaf';
import { ResultUnsupportedCrop } from '@/components/assessment/ResultUnsupportedCrop';
import { ResultRequestError } from '@/components/assessment/ResultRequestError';
import { UIPreviewTool } from '@/components/assessment/UIPreviewTool';

function ScanPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  // Normal users visiting /scan land directly on the live leaf assessment wizard by default.
  // The UI Preview Tool is accessible via /scan/preview or ?mode=preview.
  const [viewMode, setViewMode] = useState<'preview' | 'live'>(() => {
    const requestedMode = searchParams.get('mode');
    if (requestedMode === 'preview') {
      return 'preview';
    }
    return 'live';
  });

  const [step, setStep] = useState<number>(1);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [crop, setCrop] = useState<Crop | ''>(() => {
    const initialCrop = searchParams.get('crop');
    if (initialCrop) {
      const validCrops: Crop[] = ['Tomato', 'Maize', 'Bell pepper', 'Citrus', 'Potato'];
      return validCrops.find((c) => c.toLowerCase() === initialCrop.toLowerCase()) || '';
    }
    return '';
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<ResultOutcome | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    setErrorMessage('');
  };

  // Genuine inference handler forwarding request to /api/predict
  const handleStartAnalysis = async () => {
    if (!photo || !crop || isProcessing) return;

    setStep(4);
    setIsProcessing(true);
    setOutcome(null);
    setResult(null);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('image', photo.file);
      formData.append('crop', crop);
      formData.append('lang', language);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // If the backend returns an explicit unsupported_crop error (e.g. HTTP 400)
        if (data.error === 'unsupported_crop' || data.result?.outcome === 'unsupported_crop') {
          const unsupportedMsg =
            data.message ||
            data.result?.disclaimer ||
            (isYo
              ? 'Ohun ọ̀gbìn tí o yàn kò tíì wà nínú àkójọ CropScan AI. Àwọn ohun ọ̀gbìn tí a tìlẹ́yìn ni: Tòmátò, Àgbàdo, Ata tàbí Tatasé, Ọsàn, àti Pọtétò.'
              : 'The selected crop is not currently supported in CropScan AI. Supported crops are: Tomato, Maize, Bell pepper, Citrus, and Potato.');

          setErrorMessage('');
          setOutcome('unsupported_crop');
          setResult(
            data.result || {
              outcome: 'unsupported_crop',
              selectedCrop: crop,
              confidenceScore: 0,
              disclaimer: unsupportedMsg,
              guidance: {
                description: unsupportedMsg,
                symptoms: [],
                treatment: [],
                prevention: [],
                recommendations: [],
                language: language === 'Yoruba' ? 'yo' : 'en',
              },
            }
          );
          return;
        }

        const errorMsg =
          data.message ||
          (response.status === 503
            ? (isYo
                ? 'Ẹ̀rọ àyẹ̀wò CropScan AI kò tíì ṣíṣẹ́ ní báyìí. Rí i dájú pé ẹ̀rọ abẹ́lé ń ṣiṣẹ́.'
                : 'CropScan AI prediction server is currently unreachable. Please make sure the backend is running.')
            : (isYo
                ? 'A kò lè pari àyẹ̀wò yìí. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.'
                : 'We could not complete the assessment. Please try again.'));

        setErrorMessage(errorMsg);
        setOutcome('request_error');
        setResult({
          outcome: 'request_error',
          selectedCrop: crop,
          confidenceScore: 0,
        });
        return;
      }

      // Populate verified backend outcome and structured guidance
      setResult(data.result);
      setOutcome(data.result.outcome);
    } catch {
      setErrorMessage(
        isYo
          ? 'Ìsopọ̀ intanẹ́ẹ̀tì kùnà. Jọ̀wọ́ ṣàyẹ̀wò intanẹ́ẹ̀tì rẹ kí o sì tún gbìyànjú.'
          : 'Network connection failed. Please check your network and try again.'
      );
      setOutcome('request_error');
      setResult({
        outcome: 'request_error',
        selectedCrop: crop,
        confidenceScore: 0,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="assessment-page">
      {/* Conditionally Render UI Preview Tool or Live Assessment Wizard */}
      {viewMode === 'preview' ? (
        <div>
          {/* Header Bar to return to Live Leaf Assessment */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 18,
              padding: '10px 16px',
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'var(--mint)',
                  color: 'var(--green)',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Design Mode
              </span>
              <strong style={{ fontSize: 13, color: 'var(--text)' }}>
                {isYo ? 'Ètò Àṣàyẹ̀wò UI (Àfihàn Àwòrán)' : 'UI Preview Tool (Representative Showcase)'}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('live')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid var(--green)',
                background: 'var(--green)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Icon name="camera" size={15} />
              <span>{isYo ? 'Padà sí Àyẹ̀wò Ewé Gidi' : 'Switch to Live Leaf Assessment'}</span>
            </button>
          </div>

          <UIPreviewTool onSwitchToLive={() => setViewMode('live')} />
        </div>
      ) : (
        <>
          {/* Live Assessment Header */}
          <div className="assessment-head">
            <div>
              <span className="kicker">{isYo ? 'Ṣàyẹ̀wò Tuntun' : 'New assessment'}</span>
              <h1>{isYo ? 'Ṣàyẹ̀wò ewé ohun ọ̀gbìn' : 'Check a plant leaf'}</h1>
              <p>
                {isYo
                  ? 'Tẹ̀lé àwọn ìgbésẹ̀ wọ̀nyí láti pèsè àyẹ̀wò tí ó péye.'
                  : 'Follow each guided step to prepare a clear, reliable screening request.'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/scan/preview"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--cream)',
                  color: 'var(--text)',
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Icon name="spark" size={14} />
                {isYo ? 'Wo Àfihàn UI (Àbájáde 8)' : 'UI Preview Tool (Design Only)'}
              </Link>
              <span className="secure-note">
                <Icon name="shield" size={17} /> {isYo ? 'Ìdánilójú ààbò lórí ẹ̀rọ rẹ' : 'Secure on-device workflow'}
              </span>
            </div>
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
              {(outcome === 'confident' || outcome === 'healthy') && result && (
                <ResultConfident
                  result={result}
                  previewUrl={photo.previewUrl}
                  crop={crop}
                  isSample={false}
                  onScanAnother={handlePhotoRemoved}
                  onDashboard={() => router.push('/dashboard')}
                />
              )}

              {outcome === 'crop_mismatch' && (
                <ResultMismatch
                  previewUrl={photo.previewUrl}
                  selectedCrop={crop}
                  detectedCrop={result?.detectedCrop}
                  mismatchReason={result?.mismatchReason}
                  onChooseCorrectCrop={() => setStep(2)}
                  onDashboard={() => router.push('/dashboard')}
                />
              )}

              {outcome === 'inconclusive_low_confidence' && (
                <ResultInconclusive
                  previewUrl={photo.previewUrl}
                  selectedCrop={crop}
                  description={result?.guidance?.description || result?.disclaimer}
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

              {outcome === 'unsupported_crop' && (
                <ResultUnsupportedCrop
                  previewUrl={photo.previewUrl}
                  selectedCrop={result?.selectedCrop || crop}
                  unsupportedReason={result?.disclaimer || result?.guidance?.description}
                  onChooseSupportedCrop={() => setStep(2)}
                  onDashboard={() => router.push('/dashboard')}
                />
              )}

              {outcome === 'not_a_leaf' && (
                <ResultNotALeaf
                  previewUrl={photo.previewUrl}
                  selectedCrop={crop}
                  rejectionMessage={result?.qualityWarning || result?.disclaimer}
                  onUploadAnother={handlePhotoRemoved}
                  onDashboard={() => router.push('/dashboard')}
                />
              )}

              {outcome === 'request_error' && (
                <ResultRequestError
                  previewUrl={photo.previewUrl}
                  selectedCrop={crop}
                  errorMessage={errorMessage}
                  onRetry={handleStartAnalysis}
                  onDashboard={() => router.push('/dashboard')}
                />
              )}
            </>
          )}
        </>
      )}
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
      <ScanPageContent />
    </Suspense>
  );
}
