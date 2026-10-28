import { Crop } from './crops';

export type AssessmentStep = 'upload' | 'crop' | 'review' | 'processing' | 'result';

export type ResultOutcome =
  | 'confident'
  | 'crop_mismatch'
  | 'inconclusive_low_confidence'
  | 'unreliable_image_quality'
  | 'request_error';

export interface UploadedPhoto {
  file: File;
  previewUrl: string;
  name: string;
  sizeBytes: number;
}

export interface DiseaseGuidance {
  description: string;
  symptoms?: string[];
  treatment?: string[];
  prevention?: string[];
  recommendations?: string[];
}

export interface AssessmentResult {
  outcome: ResultOutcome;
  selectedCrop: Crop;
  detectedCrop?: string;
  predictedCondition?: string;
  confidenceScore: number;
  qualityWarning?: string;
  mismatchReason?: string;
  guidance?: DiseaseGuidance;
}
