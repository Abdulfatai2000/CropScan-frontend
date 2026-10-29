import { Crop } from './crops';

export type AssessmentStep = 'upload' | 'crop' | 'review' | 'processing' | 'result';

export type ResultOutcome =
  | 'confident'
  | 'healthy'
  | 'crop_mismatch'
  | 'inconclusive_low_confidence'
  | 'unreliable_image_quality'
  | 'unsupported_crop'
  | 'not_a_leaf'
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
  display_name?: string;
  scientific_name?: string;
  severity?: string;
  is_healthy?: boolean | null;
  language?: string;
}

export interface AssessmentResult {
  outcome: ResultOutcome;
  selectedCrop: Crop;
  selectedCropYoruba?: string;
  detectedCrop?: string;
  detectedCropYoruba?: string;
  predictedCondition?: string;
  confidenceScore: number;
  qualityWarning?: string;
  mismatchReason?: string;
  guidance?: DiseaseGuidance;
  rawConfidence?: number | null;
  disclaimer?: string;
  language?: string;
}
