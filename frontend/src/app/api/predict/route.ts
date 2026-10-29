import { NextRequest, NextResponse } from 'next/server';
import { Crop } from '@/types/crops';
import { AssessmentResult, ResultOutcome } from '@/types/assessment';

// Mapping from user-facing frontend crop values to Flask backend snake_case identifiers
const CROP_MAP: Record<string, string> = {
  tomato: 'tomato',
  maize: 'maize',
  'bell pepper': 'bell_pepper',
  bell_pepper: 'bell_pepper',
  citrus: 'citrus',
  potato: 'potato',
};

// Reverse mapping for display names
const REVERSE_CROP_MAP: Record<string, Crop> = {
  tomato: 'Tomato',
  maize: 'Maize',
  bell_pepper: 'Bell pepper',
  citrus: 'Citrus',
  potato: 'Potato',
};

// Yoruba crop display names
const YORUBA_CROP_MAP: Record<string, string> = {
  tomato: 'Tòmátò',
  maize: 'Àgbàdo',
  bell_pepper: 'Ata tàbí Tatasé',
  citrus: 'Ọsàn',
  potato: 'Pọtétò tàbí Kànàmọ́',
  cassava: 'Gbágùúdá (Cassava)',
  yam: 'Iṣu (Yam)',
  cocoa: 'Kòkó (Cocoa)',
  plantain: 'Ọ̀gẹ̀dẹ̀ (Plantain)',
  apple: 'Àpù',
  strawberry: 'Èso Strọ́bẹ́rì',
  grape: 'Èso Àjàrà',
  cherry: 'Èso Ṣẹ́rì',
  peach: 'Èso Píìṣì',
  blueberry: 'Èso Blúubẹ́rì',
  raspberry: 'Èso Rásbẹ́rì',
  soybean: 'Ẹ̀wà Sóyà',
  squash: 'Eléwé Kùkùté (Squash)',
};

// Mapping from frontend language labels to backend language codes
const LANG_MAP: Record<string, 'en' | 'yo'> = {
  english: 'en',
  en: 'en',
  yoruba: 'yo',
  yorùbá: 'yo',
  yo: 'yo',
};

// Request timeout for Flask backend call (60 seconds to allow for lazy model initialization)
const BACKEND_TIMEOUT_MS = 60000;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const rawCrop = formData.get('crop');
    const rawLang = formData.get('lang');

    // 1. Validate Image presence
    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        {
          error: 'missing_image',
          message: 'An image file is required in field "image".',
        },
        { status: 400 }
      );
    }

    // 2. Validate and map Crop selection
    if (!rawCrop || typeof rawCrop !== 'string') {
      return NextResponse.json(
        {
          error: 'missing_crop',
          message: "Field 'crop' is required. Supported crops: 'Tomato', 'Maize', 'Bell pepper', 'Citrus', 'Potato'.",
        },
        { status: 400 }
      );
    }

    const normalizedCropKey = rawCrop.trim().toLowerCase();
    const backendCrop = CROP_MAP[normalizedCropKey] || normalizedCropKey.replace(/\s+/g, '_');

    // 3. Map Language selection
    const normalizedLangKey = (typeof rawLang === 'string' ? rawLang : 'en').trim().toLowerCase();
    const backendLang = LANG_MAP[normalizedLangKey] || 'en';

    // 4. Resolve Backend URL
    const backendBaseUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:5000';
    const targetUrl = `${backendBaseUrl.replace(/\/+$/, '')}/api/predict`;

    // 5. Build outgoing FormData for Flask backend
    const backendFormData = new FormData();
    // Forward the file with its original name and MIME type; runtime handles boundary
    backendFormData.append('image', imageFile, imageFile.name || 'leaf_photo.jpg');
    backendFormData.append('crop', backendCrop);
    backendFormData.append('lang', backendLang);

    // 6. Execute forward request with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

    let backendResponse: Response;
    try {
      backendResponse = await fetch(targetUrl, {
        method: 'POST',
        body: backendFormData,
        signal: controller.signal,
      });
    } catch (networkError: unknown) {
      const err = networkError as Error;
      if (err.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'backend_timeout',
            message: 'The model analysis timed out while processing. Please try again.',
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          error: 'backend_unavailable',
          message: 'Unable to connect to the CropScan AI prediction service. Please ensure the backend server is running.',
        },
        { status: 503 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // 7. Handle non-200 responses from backend
    if (!backendResponse.ok) {
      let errorBody: { error?: string; message?: string } = {};
      try {
        errorBody = await backendResponse.json();
      } catch {
        // Fallback if backend returned non-JSON error
      }

      const clientMessage =
        errorBody.message ||
        (backendResponse.status === 413
          ? 'Uploaded image exceeds the maximum permitted size of 10 MB.'
          : 'The backend service encountered an error processing your request.');

      // Provide structured outcome for unsupported_crop responses
      if (errorBody.error === 'unsupported_crop') {
        const selectedKey = normalizedCropKey;
        const selectedCropDisplay: Crop = REVERSE_CROP_MAP[selectedKey] || (rawCrop as Crop);
        const selectedCropYoruba = YORUBA_CROP_MAP[selectedKey] || selectedCropDisplay;

        return NextResponse.json(
          {
            error: 'unsupported_crop',
            message: clientMessage,
            result: {
              outcome: 'unsupported_crop',
              selectedCrop: selectedCropDisplay,
              selectedCropYoruba,
              confidenceScore: 0,
              disclaimer: clientMessage,
              guidance: {
                description: clientMessage,
                symptoms: [],
                treatment: [],
                prevention: [],
                recommendations: [],
                language: backendLang,
              },
              language: backendLang,
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: errorBody.error || 'backend_error',
          message: clientMessage,
        },
        { status: backendResponse.status }
      );
    }

    // 8. Parse successful response
    const data = await backendResponse.json();
    const prediction = data.prediction || {};
    const guidance = prediction.guidance || {};
    const guidanceData = guidance.data || null;

    // 9. Map backend assessment_status to frontend ResultOutcome
    let mappedOutcome: ResultOutcome;
    switch (prediction.assessment_status) {
      case 'confident':
        mappedOutcome = 'confident';
        break;
      case 'healthy':
        mappedOutcome = 'healthy';
        break;
      case 'crop_mismatch':
        mappedOutcome = 'crop_mismatch';
        break;
      case 'inconclusive_low_confidence':
        mappedOutcome = 'inconclusive_low_confidence';
        break;
      case 'unreliable_image_quality':
        mappedOutcome = 'unreliable_image_quality';
        break;
      case 'unsupported_crop':
        mappedOutcome = 'unsupported_crop';
        break;
      case 'not_a_leaf':
        mappedOutcome = 'not_a_leaf';
        break;
      case 'invalid_model_output':
      default:
        mappedOutcome = 'inconclusive_low_confidence';
        break;
    }

    // 10. Map confidence score (scale 0..1 to 0..100 percentage for UI)
    const rawConfidence: number | null =
      typeof prediction.confidence === 'number' && !Number.isNaN(prediction.confidence)
        ? prediction.confidence
        : null;

    const confidenceScore =
      rawConfidence !== null
        ? Math.min(100, Math.max(0, Math.round(rawConfidence * 1000) / 10))
        : 0;

    // 11. Format predicted condition name
    let predictedCondition: string;
    if (guidanceData?.display_name) {
      predictedCondition = guidanceData.scientific_name
        ? `${guidanceData.display_name} (${guidanceData.scientific_name})`
        : guidanceData.display_name;
    } else if (prediction.class_label) {
      predictedCondition = prediction.class_label
        .replace(/___/g, ': ')
        .replace(/_/g, ' ');
    } else {
      predictedCondition = 'Condition Identified';
    }

    // 12. Map selected and detected crops
    const selectedKey = String(prediction.selected_crop || backendCrop).toLowerCase();
    const selectedCropDisplay: Crop = REVERSE_CROP_MAP[selectedKey] || (rawCrop as Crop);
    const selectedCropYoruba = YORUBA_CROP_MAP[selectedKey] || selectedCropDisplay;

    const detectedKey = prediction.predicted_crop ? String(prediction.predicted_crop).toLowerCase() : undefined;
    const detectedCropDisplay: string | undefined = detectedKey
      ? REVERSE_CROP_MAP[detectedKey] || detectedKey.replace(/_/g, ' ')
      : undefined;
    const detectedCropYoruba: string | undefined = detectedKey
      ? YORUBA_CROP_MAP[detectedKey] || detectedCropDisplay
      : undefined;

    // 13. Map guidance details
    const isYoruba = backendLang === 'yo';
    const mappedGuidance = guidanceData
      ? {
          description: guidanceData.description || '',
          symptoms: Array.isArray(guidanceData.symptoms) ? guidanceData.symptoms : [],
          treatment: Array.isArray(guidanceData.treatment) ? guidanceData.treatment : [],
          prevention: Array.isArray(guidanceData.prevention) ? guidanceData.prevention : [],
          recommendations: Array.isArray(guidanceData.treatment) ? guidanceData.treatment : [],
          display_name: guidanceData.display_name,
          scientific_name: guidanceData.scientific_name,
          severity: guidanceData.severity,
          is_healthy: prediction.assessment_status === 'healthy' || (guidance.is_healthy ?? (guidanceData.status === 'healthy')),
          language: guidance.language || backendLang,
        }
      : {
          description:
            (isYoruba ? guidance.message : undefined) ||
            prediction.disclaimer ||
            guidance.message ||
            (isYoruba
              ? 'Kò sí ìtọ́sọ́nà ìtọ́jú kankan lórí oko fún àbájáde àyẹ̀wò yìí.'
              : 'No additional agronomic treatment guidance is available for this screening result.'),
          symptoms: [],
          treatment: [],
          prevention: [],
          recommendations: [],
          is_healthy: null,
          language: backendLang,
        };

    const mappedResult: AssessmentResult = {
      outcome: mappedOutcome,
      selectedCrop: selectedCropDisplay,
      selectedCropYoruba,
      detectedCrop: isYoruba ? (detectedCropYoruba || detectedCropDisplay) : detectedCropDisplay,
      detectedCropYoruba,
      predictedCondition,
      confidenceScore,
      rawConfidence,
      qualityWarning:
        (isYoruba && guidance.message ? guidance.message : undefined) ||
        prediction.screening_details?.message ||
        prediction.disclaimer ||
        undefined,
      mismatchReason:
        (isYoruba && guidance.message ? guidance.message : undefined) ||
        prediction.disclaimer ||
        guidance.message ||
        undefined,
      guidance: mappedGuidance,
      disclaimer: prediction.disclaimer,
      language: backendLang,
    };

    return NextResponse.json({
      success: true,
      result: mappedResult,
      raw: {
        status: data.status,
        selected_crop: data.selected_crop,
        language: data.language,
        image_metadata: data.image_metadata,
        prediction: {
          assessment_status: prediction.assessment_status,
          class_index: prediction.class_index,
          class_label: prediction.class_label,
          confidence: prediction.confidence,
          crop_match: prediction.crop_match,
          model_name: prediction.model_name,
        },
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        error: 'internal_error',
        message: 'An unexpected error occurred while preparing your request.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

