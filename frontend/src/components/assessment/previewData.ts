import { AssessmentResult } from '@/types/assessment';

export type PreviewTabId =
  | 'confident'
  | 'healthy'
  | 'crop_mismatch'
  | 'inconclusive_low_confidence'
  | 'unreliable_image_quality'
  | 'unsupported_crop'
  | 'not_a_leaf'
  | 'request_error';

export interface PreviewStateConfig {
  id: PreviewTabId;
  label: string;
  shortLabel: string;
  badgeText: string;
  icon: 'check' | 'leaf' | 'alert' | 'help' | 'camera' | 'book' | 'image' | 'refresh';
  description: string;
  previewUrl: string;
  result: AssessmentResult;
  errorMessage?: string;
}

export const PREVIEW_STATES: PreviewStateConfig[] = [
  {
    id: 'confident',
    label: 'Confident View',
    shortLabel: 'Confident',
    badgeText: 'Folio-Pathogen Detected',
    icon: 'check',
    description: 'Successful identification of Early Blight on Tomato foliage with actionable agronomic guidance.',
    previewUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'confident',
      selectedCrop: 'Tomato',
      predictedCondition: 'Early Blight (Alternaria solani)',
      confidenceScore: 94.6,
      rawConfidence: 0.946,
      guidance: {
        display_name: 'Early Blight',
        scientific_name: 'Alternaria solani',
        description:
          'Characteristic foliar blight caused by Alternaria solani. Symptoms initiate on older canopy leaves as dark brown concentric rings with surrounding yellow chlorotic halos, progressing upward during warm, humid periods.',
        symptoms: [
          'Concentric, dark-brown target-board lesions primarily on mature lower leaves',
          'Yellow chlorotic halos surrounding expanding necrotic lesions',
          'Premature drying, blighting, and leaf drop reducing fruit canopy cover',
        ],
        treatment: [
          'Prune and destroy severely infected lower leaves; safely bury or bag debris away from plots',
          'Cease overhead sprinkler irrigation; irrigate strictly at the base or drip line in the morning',
          'Consult local agricultural extension officers before applying registered preventative copper sprays',
        ],
        prevention: [
          'Rotate solanaceous crops with non-host species (maize, sorghum, cowpea) for at least 2–3 seasons',
          'Maintain 60 cm x 75 cm planting distances to facilitate rapid canopy drying and air circulation',
          'Apply clean straw mulch to the soil surface to suppress splash-borne fungal spore transmission',
        ],
        recommendations: [
          'Prune and destroy severely infected lower leaves; safely bury or bag debris away from plots',
          'Cease overhead sprinkler irrigation; irrigate strictly at the base or drip line in the morning',
          'Consult local agricultural extension officers before applying registered preventative copper sprays',
        ],
      },
      disclaimer:
        'Screening advisory aid only; not a certified laboratory diagnosis. Verify symptoms with your zonal extension officer before purchasing or applying crop protection chemicals.',
    },
  },
  {
    id: 'healthy',
    label: 'Healthy View',
    shortLabel: 'Healthy',
    badgeText: 'Healthy Foliage',
    icon: 'leaf',
    description: 'Verified healthy foliage with no visible target pathogen symptoms and general cultural care advice.',
    previewUrl: 'https://images.unsplash.com/photo-1530541835461-dedaf9cf368a?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'healthy',
      selectedCrop: 'Tomato',
      predictedCondition: 'Healthy Tomato Plant (Solanum lycopersicum)',
      confidenceScore: 96.2,
      rawConfidence: 0.962,
      guidance: {
        display_name: 'Healthy Foliage',
        scientific_name: 'Solanum lycopersicum',
        is_healthy: true,
        description:
          'Computer vision analysis indicates healthy, vigorous foliage with no visible signs of targeted foliar pathogens or nutrient chlorosis.',
        symptoms: [
          'Uniform green leaf pigmentation without interveinal yellowing or spots',
          'Intact leaf margins free of necrotic lesions, pustules, or powdery coatings',
          'Normal turgor, vigorous leaf texture, and healthy vascular structure',
        ],
        treatment: [
          'No chemical, therapeutic, or curative crop treatments are required or recommended',
          'Maintain balanced organic nutrition (N-P-K) suited for active vegetative growth',
          'Conduct weekly field scouting, inspecting lower leaf surfaces for early pest presence',
        ],
        prevention: [
          'Maintain clean weeding within 1 meter of crop rows to suppress weed-borne insect reservoirs',
          'Ensure consistent soil moisture via drip irrigation to avoid moisture stress or waterlogging',
        ],
        recommendations: [
          'No chemical, therapeutic, or curative crop treatments are required or recommended',
          'Maintain balanced organic nutrition (N-P-K) suited for active vegetative growth',
          'Conduct weekly field scouting, inspecting lower leaf surfaces for early pest presence',
        ],
      },
      disclaimer:
        'Screening reflects visual leaf traits at the time of photography. Continue regular field scouting throughout the flowering and fruiting cycles.',
    },
  },
  {
    id: 'crop_mismatch',
    label: 'Mismatch View',
    shortLabel: 'Mismatch',
    badgeText: 'Crop Mismatch',
    icon: 'alert',
    description: 'Safety guardrail triggered when detected leaf features differ from the selected crop category.',
    previewUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'crop_mismatch',
      selectedCrop: 'Tomato',
      detectedCrop: 'Strawberry',
      confidenceScore: 61.0,
      rawConfidence: 0.61,
      mismatchReason:
        'The leaf’s predicted plant category (resembling Strawberry with Leaf Scorch) does not match your selected crop (Tomato). Disease-specific treatment guidance is withheld to avoid harmful cross-species chemical recommendations.',
      guidance: {
        description:
          'Crop mismatch detected between user crop selection and computer vision features. Disease-specific guidance withheld for agricultural safety.',
      },
      disclaimer:
        'User crop selection does not prove the botanical identity of the plant. Always choose the exact crop variety matching your field specimen.',
    },
  },
  {
    id: 'inconclusive_low_confidence',
    label: 'Low Confidence View',
    shortLabel: 'Uncertain',
    badgeText: 'Low Confidence',
    icon: 'help',
    description: 'Inconclusive screening when statistical similarity falls below the 40% operational threshold.',
    previewUrl: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'inconclusive_low_confidence',
      selectedCrop: 'Maize',
      predictedCondition: 'Uncertain Foliar Symptoms',
      confidenceScore: 28.4,
      rawConfidence: 0.284,
      guidance: {
        description:
          'The vision model did not produce a sufficiently confident prediction for this leaf (28.4% is below our 40.0% threshold). This does not mean your crop is healthy, but actionable chemical guidance has been withheld for safety.',
      },
      disclaimer:
        'Low-confidence outputs must never be treated as confirmation of plant health. Re-capture the image in even natural daylight or consult an agricultural extension officer.',
    },
  },
  {
    id: 'unreliable_image_quality',
    label: 'Quality Rejected View',
    shortLabel: 'Blurry / Dark',
    badgeText: 'Quality Rejected',
    icon: 'camera',
    description: 'Pre-inference rejection triggered by excessive blur, low contrast, glare, or dark lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'unreliable_image_quality',
      selectedCrop: 'Bell pepper',
      confidenceScore: 0,
      rawConfidence: null,
      qualityWarning:
        'The uploaded photograph is too blurry, overly dark, overexposed, or uniform for a reliable computer vision assessment. Inference was safely bypassed to prevent false certainty.',
      guidance: {
        description:
          'Image quality screener rejected this upload prior to model inference. Clean treatment advice is withheld until a clear photo is provided.',
      },
      disclaimer:
        'Automated pre-screening protects farmers from arbitrary classifications caused by poor photographic conditions.',
    },
  },
  {
    id: 'unsupported_crop',
    label: 'Unsupported Crop',
    shortLabel: 'Unsupported',
    badgeText: 'Out of Scope',
    icon: 'book',
    description: 'Explicit rejection of unlisted crops (e.g. Cassava) to prevent dangerous cross-species misdiagnosis.',
    previewUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'unsupported_crop',
      selectedCrop: 'Potato', // displayed as out of scope selection
      confidenceScore: 0,
      rawConfidence: null,
      disclaimer:
        'CropScan AI currently supports Tomato, Maize, Bell pepper, Citrus, and Potato. The requested crop variety is not yet within our validated model scope. Guidance and chemical treatments have been intentionally withheld.',
      guidance: {
        description:
          'The requested crop variety is outside the current 5-crop regional prototype catalog. Diagnostics are withheld to prevent dangerous misapplication.',
      },
    },
  },
  {
    id: 'not_a_leaf',
    label: 'Not a Leaf',
    shortLabel: 'Non-Leaf',
    badgeText: 'Not a Leaf',
    icon: 'image',
    description: 'Pre-screening validation rejecting background clutter, soil, walls, hands, or non-plant objects.',
    previewUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=82',
    result: {
      outcome: 'not_a_leaf',
      selectedCrop: 'Tomato',
      confidenceScore: 0,
      rawConfidence: null,
      qualityWarning:
        'Our computer vision screener could not detect sufficient crop leaf tissue in this photograph. The photo appears to capture soil, hands, fabric, walls, or non-plant clutter. Inference was stopped to prevent misleading diagnoses.',
      guidance: {
        description:
          'No assessable leaf tissue detected. Place a single symptomatic crop leaf in front of the lens in natural daylight.',
      },
    },
  },
  {
    id: 'request_error',
    label: 'Error View',
    shortLabel: 'Server Error',
    badgeText: 'Connection Error',
    icon: 'refresh',
    description: 'Resilient connection or timeout failure screen preserving user photos for seamless retry.',
    previewUrl: 'https://images.unsplash.com/photo-1529313780224-1a12b68bed16?auto=format&fit=crop&w=900&q=82',
    errorMessage:
      'Unable to connect to the CropScan AI prediction service. The server may be restarting or the connection timed out. Your photo and selections remain safe in memory.',
    result: {
      outcome: 'request_error',
      selectedCrop: 'Potato',
      confidenceScore: 0,
      rawConfidence: null,
      guidance: {
        description: 'Connection failure. Please verify backend availability and retry.',
      },
    },
  },
];

