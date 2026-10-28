# CropScan AI — Frontend Architecture and Scaffolding Plan (Phase 1)

**Project**: CropScan AI — Plant Disease Detection & Localized Agronomic Advisory  
**Document Version**: 2.0.0 (Next.js App Router Architecture)  
**Status**: Architecture Approved by User; Awaiting Phase 2 Scaffold Trigger  
**Date**: October 28, 2026  
**Target Scaffold Location**: `frontend/` (under workspace root `c:\Users\USER\Documents\COLDWANDE.DEV\CropScan-frontend-1`)  
**Backend Reference**: `https://github.com/nathanaelobaloluwa/cropscan-ai-backend` (commit `0ca87ae4e8b2006426a49e109733c8d37a87fc24`)  
**Design Reference**: `frontend-reference/` (read-only Figma Make prototype)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Verified Repository Findings (Flask Backend Inspection)](#2-verified-repository-findings-flask-backend-inspection)
3. [Figma Reference Findings (Design Inspection & Next.js Migration Strategy)](#3-figma-reference-findings-design-inspection--nextjs-migration-strategy)
4. [Assumptions and Unresolved Questions](#4-assumptions-and-unresolved-questions)
5. [Technology Stack and Rationale](#5-technology-stack-and-rationale)
6. [Complete Proposed Directory Tree](#6-complete-proposed-directory-tree)
7. [File-by-File Responsibility Matrix (Server vs. Client Components)](#7-file-by-file-responsibility-matrix-server-vs-client-components)
8. [Application Architecture and Component Relationships](#8-application-architecture-and-component-relationships)
9. [Page and User-Journey Specifications](#9-page-and-user-journey-specifications)
10. [Verified Backend API Contract](#10-verified-backend-api-contract)
11. [Environment and Configuration Plan](#11-environment-and-configuration-plan)
12. [Security, Accessibility, and Quality Requirements](#12-security-accessibility-and-quality-requirements)
13. [Testing Strategy](#13-testing-strategy)
14. [Implementation Roadmap and Acceptance Criteria](#14-implementation-roadmap-and-acceptance-criteria)
15. [Risks, Dependencies, and Decisions Requiring Approval](#15-risks-dependencies-and-decisions-requiring-approval)

---

## 1. Executive Summary

CropScan AI is an agricultural AI screening and localized advisory web application built to empower smallholder farmers and agricultural extension workers across West Africa (with an initial focus on Nigeria). The frontend allows users to submit or capture photographs of crop leaves, specify the target crop family, and receive inference results from a fine-tuned MobileNetV2 vision model alongside conservative, actionable management advice in **English** or **Yoruba**.

This document establishes the architecture and implementation specification for building the production frontend using **Next.js (App Router), TypeScript, and Tailwind CSS**.

### Key Architectural Principles
- **Next.js App Router Foundation**: Leverages Next.js Server Components (RSC) for marketing pages, SEO, layouts, and static documentation (Crop Guide, FAQ, About), while isolating client interactivity (`'use client'`) to the assessment wizard, camera capture, and language state.
- **Backend-for-Frontend (BFF) Pattern**: Implements Next.js API Route Handlers (`app/api/predict/route.ts` and `app/api/health/route.ts`) to proxy requests to the Flask backend. This eliminates CORS complexities, prevents backend exposure, enforces upload size limits, and sanitizes outgoing and incoming payloads.
- **Strict Backend Fidelity**: Completely realigns the frontend API payloads, parameter names, and response models with the verified Python/Flask backend (`app/routes/predict.py`).
- **Clean Separation from Prototype Reference**: Treats `frontend-reference/` as a strictly read-only reference for aesthetics and design tokens, without copying its proprietary Figma Make runtime plugins or monolithic structure.
- **Safety First (Non-Diagnostic Advisory)**: Enforces clear agricultural screening disclaimers. Whenever the model detects crop mismatches, inconclusive scores, or poor image quality, treatment advice is strictly withheld (`data: null`) to prevent chemical misapplication.

---

## 2. Verified Repository Findings (Flask Backend Inspection)

The backend repository (`https://github.com/nathanaelobaloluwa/cropscan-ai-backend`) was cloned into an isolated scratch directory and inspected across all source files, configurations, datasets, and automated tests.

### 2.1 Backend Structure & Application Entry Points
```text
cropscan-ai-backend/
├── app/
│   ├── __init__.py              # Application factory (create_app), error handlers, CORS setup
│   ├── config.py                # Environment configurations, port & confidence validation
│   ├── routes/
│   │   ├── __init__.py          # Blueprint registration
│   │   ├── health.py            # Liveness (/health) and readiness (/health/ready)
│   │   └── predict.py           # Upload & inference endpoint (/api/predict)
│   ├── services/
│   │   ├── __init__.py          # Service exports
│   │   ├── guidance.py          # GuidanceService (English & Yoruba knowledge base)
│   │   ├── image_screener.py    # Pre-inference luminance, contrast, texture & color checks
│   │   ├── image_validator.py   # In-memory PIL decoding, decompression bomb guards, MIME checks
│   │   └── predictor.py         # PredictionService (MobileNetV2 singleton inference)
│   └── data/
│       ├── class_indices.json   # 38-class model index mapping
│       ├── class_to_crop.json   # 38-class biological crop family mapping
│       ├── disease_info_en.json # Agronomic guidance catalog (English)
│       ├── disease_info_yo.json # Agronomic guidance catalog (Yoruba)
│       └── README.md            # Knowledge base architecture notes
├── tests/                       # 91 passing automated unit and integration tests
├── .env.example                 # Documented environment template
├── Procfile                     # Gunicorn WSGI process command for deployment
├── requirements.txt             # Pinned dependencies (Flask, Pillow, PyTorch, Transformers)
└── run.py                       # WSGI entrypoint callable 'app'
```

### 2.2 Application Factory & Runtime
- **Pattern**: Flask Application Factory (`create_app(config_name)` in `app/__init__.py`).
- **WSGI Entrypoint**: `run:app` in `run.py`.
- **Blueprints**:
  - `health_bp`: Registered at root (`/health`, `/health/ready`).
  - `predict_bp`: Registered with prefix `/api` (`/api/predict`).

### 2.3 Verified API Routes & Endpoints

#### 1. Liveness Probe (`GET /health`)
- **Status Code**: `200 OK`
- **Response Format**: `application/json`
- **Response Body**:
  ```json
  {
    "status": "healthy",
    "message": "CropScan AI Backend service is running",
    "version": "0.1.0",
    "model_ready": false
  }
  ```
- **Behavior**: Verifies that the Flask web application process is responsive. Reports `model_ready` truthfully without forcing model loading.

#### 2. Readiness Probe (`GET /health/ready`)
- **Status Codes**:
  - `200 OK`: Model is loaded in memory and ready for inference (`status: "ready"`).
  - `503 Service Unavailable`: Model is not yet loaded into memory (`status: "not_ready"`).
- **Response Body (Ready)**:
  ```json
  {
    "status": "ready",
    "model_ready": true,
    "model_name": "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
    "message": "Vision model is loaded into memory and ready for inference."
  }
  ```

#### 3. Prediction Endpoint (`POST /api/predict`)
- **Content-Type**: `multipart/form-data`
- **Request Parameters**:
  - `image` *(required, file)*: Raster image file (JPEG, PNG, or WebP). Maximum size: **10 MB** (`MAX_CONTENT_LENGTH = 10 * 1024 * 1024`).
  - `crop` *(required, string)*: User-selected target crop. Must normalize to one of 5 supported crops:
    - `tomato`
    - `maize` (aliases: `corn`, `agbado`)
    - `bell_pepper` (aliases: `bell pepper`, `pepper`, `tatase`)
    - `citrus` (aliases: `orange`, `osan`)
    - `potato` (aliases: `irish potato`, `poteto`)
  - `lang` *(optional, string)*: Output language. Must be `'en'` (English) or `'yo'` (Yoruba). Defaults to `'en'`.
- **Status Codes**:
  - `200 OK`: Successful inference request (includes confident predictions, crop mismatches, inconclusive scores, and screened poor-quality images).
  - `400 Bad Request`: Validation failure (`missing_crop`, `unsupported_crop`, `missing_image`, `empty_image`, `unsupported_format`, `invalid_language`, `corrupt_image`, `invalid_dimensions`).
  - `413 Payload Too Large`: Upload exceeds 10 MB (`payload_too_large`).
  - `500 Internal Server Error`: Unexpected inference failure (`inference_failed`, `unexpected_inference_error`, `internal_server_error`).
  - `503 Service Unavailable`: Vision model failed to load (`model_load_error`).

### 2.4 Pre-Inference Screening & Safety Safeguards
1. **Raster Validation (`app/services/image_validator.py`)**:
   - Decoded strictly in memory using Pillow without disk writes.
   - Enforces format check (`JPEG`, `PNG`, `WEBP` only).
   - Decompression bomb guard: Dimensions capped at 10,000 px (`MAX_IMAGE_DIMENSION`).
   - Truncated streams raise `corrupt_image` (400).
2. **Pre-Inference Quality Screening (`app/services/image_screener.py`)**:
   - Mean luminance $< 8.0$: `image_too_dark`.
   - Mean luminance $> 250.0$ and contrast $< 5.0$: `image_too_bright` (overexposed).
   - Contrast $< 5.0$ and vegetation ratio $< 0.01$: `image_lacks_features`.
   - When rejected, MobileNetV2 inference is bypassed, returning `200 OK` with `assessment_status: "unreliable_image_quality"`, and treatment advice is strictly withheld (`data: null`, `is_healthy: null`).
3. **Crop Mismatch Protection (`app/services/predictor.py`)**:
   - Maps 38 model output classes to biological crop families (`app/data/class_to_crop.json`).
   - If user selected `tomato` but the model predicts `Apple with Apple Scab` or `Corn with Common Rust`, backend sets `assessment_status: "crop_mismatch"` and `crop_match: false`.
   - Treatment recommendations are strictly withheld (`data: null`) to prevent dangerous chemical misapplication.
4. **Provisional Confidence Threshold**:
   - Baseline is `0.40` (`PREDICTION_CONFIDENCE_THRESHOLD`).
   - Predictions matching the crop but scoring $< 0.40$ return `assessment_status: "inconclusive_low_confidence"`, withholding treatment advice.
5. **CORS Configuration**:
   - In development, backend allows origins: `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:3000`, `http://127.0.0.1:5173`.
   - In production, backend default origins list is empty `[]` (requires explicit `CORS_ALLOWED_ORIGINS`).

---

## 3. Figma Reference Findings (Design Inspection & Next.js Migration Strategy)

The reference export in `frontend-reference/` was thoroughly reviewed.

### 3.1 Design Assets and Styling Approach
- **Typography**: Google Font `Inter`. In Next.js, this will be loaded using `next/font/google` for zero-layout-shift and optimal performance.
- **Color Tokens**:
  - Forest Green (`--green`): `#176b45` (Primary brand color, key action buttons)
  - Deep Botanical Green (`--deep`): `#104d35` (Hero headers, dark banners, badge text)
  - Leaf Accent (`--leaf`): `#7bc96f` (Vibrant accent, scan radar, success rings)
  - Soft Mint (`--mint`): `#eaf6ed` (Card icon backgrounds, light pills)
  - Organic Cream (`--cream`): `#f8f8f2` (Page background)
  - Pure White (`--white`): `#ffffff` (Card surfaces)
  - Deep Foliage Text (`--text`): `#172b22` (High-contrast typography)
  - Earth Muted (`--muted`): `#66756c` (Supporting descriptions, metadata)
  - Subtle Border (`--border`): `#dce5dd` (Hairlines and separators)
  - Warning Amber (`--amber`): `#e8a23a` (Confidence meters, mismatch alerts)
  - Danger Red (`--red`): `#c94747` (Validation and server error alerts)
- **Visual Design Elements**:
  - Hero image with animated leaf scanning radar (`scan-frame`, `scan-line`).
  - Stepped progress bar (Steps 1–4).
  - Photographic cards for the 5 supported crops.
  - Responsive layout: Desktop sidebar navigation (`width: 250px`), mobile sticky topbar, and mobile bottom tab navigation (`bottom-nav`).

### 3.2 Next.js App Router Migration Strategy
The Figma Make reference was exported as a single monolithic Vite file (`src/App.tsx`, 1,238 lines) with proprietary `.figma/` development plugins. The table below outlines how it is decomposed and modernized into Next.js App Router:

| Figma Reference Element | Reference Implementation | Next.js App Router Strategy |
| :--- | :--- | :--- |
| **Monolithic View Routing** | Single `App.tsx` toggling `page` state string | Distinct App Router file paths (`app/page.tsx`, `app/dashboard/page.tsx`, `app/scan/page.tsx`, etc.) |
| **Fonts & Asset Delivery** | `@import url(...)` in `index.css` | `next/font/google` (`Inter`) configured in root `app/layout.tsx` |
| **Shell & Layouts** | Monolithic `AppShell` in `App.tsx` | Nested `app/(workspace)/layout.tsx` providing desktop sidebar and mobile bottom nav |
| **API Proxying & CORS** | Client `fetch('/api/predict')` relying on Vite dev server proxy | Next.js API Route Handlers (`app/api/predict/route.ts` & `app/api/health/route.ts`) acting as secure BFF |
| **Icons** | 150+ lines of hardcoded SVG path definitions | Modern, tree-shaken `lucide-react` icon components |
| **Server vs. Client Rendering** | Entire app ran as client-side bundle | Static pages (Landing, Guide, Help) rendered as Server Components; wizard rendered as Client Components |

---

## 4. Assumptions and Unresolved Questions

### 4.1 Verified Assumptions
1. **Stateless Backend**: The Flask backend has no user accounts, database tables, or persistent scan histories. All frontend assessment history will be stored client-side in the browser (IndexedDB or LocalStorage) with a clear notification to the farmer that history resides on their current device.
2. **BFF Architecture**: Using Next.js Route Handlers (`app/api/predict/route.ts`) allows server-to-server communication with Flask, eliminating cross-origin browser issues and keeping internal network configurations secure.
3. **Conservative Guidance**: In compliance with agronomic safety standards, when the backend returns `data: null` (crop mismatch, poor image quality, or low confidence), the frontend will never invent or suggest chemical pesticide treatments.

### 4.2 Unresolved Questions for User Decision
1. **PWA / Offline Access**: Would you like to enable a Progressive Web App (PWA) service worker to cache the Crop Guide and past scans for offline field use? (Recommended for Phase 8).
2. **Audio Text-to-Speech (TTS)**: Would you like future phases to support Web Speech API or audio playback for Yoruba and English agronomic instructions? (Marked as a prospective enhancement).

---

## 5. Technology Stack and Rationale

| Layer | Chosen Technology | Architectural Justification |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+ (App Router)** | Mandatory. Provides React 19 support, Server Components for fast SEO-ready landing pages, API Route Handlers for BFF backend proxying, and built-in image/font optimization. |
| **Language** | **TypeScript 5.7+** | Provides strict typing across API contracts, crop catalogs, and wizard state models. |
| **Styling** | **Tailwind CSS v4** | Provides utility-first styling with zero-runtime overhead, seamlessly reproducing the design tokens and responsive breakpoints from the reference. |
| **Fonts** | **`next/font/google` (`Inter`)** | Self-hosts Google Font files automatically during build, eliminating render-blocking network requests and cumulative layout shift. |
| **Icons** | **Lucide React** (`lucide-react`) | Clean, accessible SVG icons replacing 150+ lines of raw SVG strings. |
| **State Management** | **React Context & Custom Hooks** | Lightweight, zero-dependency state management for wizard navigation and language toggling. |
| **Local Persistence** | **`idb-keyval` or LocalStorage** | Lightweight key-value store for saving scan history and user language preferences in the browser. |
| **Testing** | **Vitest** + **React Testing Library** | Fast unit and component testing environment matching Next.js App Router conventions. |

---

## 6. Complete Proposed Directory Tree

The complete production frontend structure under `frontend/`:

```text
frontend/
├── .env.example                       # Documented environment variables template
├── .env.local                         # Local environment overrides (git-ignored)
├── .gitignore                         # Standard Next.js and Node.js ignore rules
├── next.config.mjs                    # Next.js configuration (images, output, headers)
├── package.json                       # Scripts, dependencies, devDependencies
├── postcss.config.mjs                 # PostCSS configuration for Tailwind
├── tsconfig.json                      # Strict TypeScript compiler configuration
├── README.md                          # Frontend setup, development, and testing instructions
│
├── public/                            # Static public assets
│   ├── favicon.svg                    # SVG leaf favicon
│   ├── manifest.json                  # PWA Web App Manifest
│   └── robots.txt                     # SEO search engine crawling directives
│
├── src/
│   ├── app/                           # Next.js App Router root
│   │   ├── layout.tsx                 # Root layout (Inter font, language provider, metadata)
│   │   ├── page.tsx                   # Public Landing Page (Server Component)
│   │   ├── not-found.tsx              # Custom 404 Not Found page
│   │   ├── error.tsx                  # Global error boundary (Client Component)
│   │   ├── loading.tsx                # Global loading skeleton
│   │   │
│   │   ├── (workspace)/               # Authenticated/Active app route group
│   │   │   ├── layout.tsx             # Workspace layout with Sidebar, Topbar, BottomNav
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Dashboard view (Server Component with client widgets)
│   │   │   ├── scan/
│   │   │   │   └── page.tsx           # Assessment wizard view (Client Component)
│   │   │   ├── history/
│   │   │   │   └── page.tsx           # Past assessment records view (Client Component)
│   │   │   ├── guide/
│   │   │   │   └── page.tsx           # Crop encyclopedia view (Server Component)
│   │   │   ├── settings/
│   │   │   │   └── page.tsx           # Language & privacy preferences (Client Component)
│   │   │   └── help/
│   │   │       └── page.tsx           # FAQ & responsible use advisory (Server Component)
│   │   │
│   │   └── api/                       # Next.js BFF Route Handlers
│   │       ├── health/
│   │       │   └── route.ts           # Proxy handler for GET /health and /health/ready
│   │       └── predict/
│   │           └── route.ts           # Proxy handler for POST /api/predict (multipart)
│   │
│   ├── components/                    # Modular UI Component Library
│   │   ├── common/                    # Generic design-system components
│   │   │   ├── Button.tsx             # Accessible button with variants (Server/Client)
│   │   │   ├── Badge.tsx              # Status badge (success, warning, error, info)
│   │   │   ├── Icon.tsx               # Lucide SVG icon abstraction
│   │   │   ├── Logo.tsx               # Brand logo mark with leaf icon
│   │   │   ├── LanguageSelect.tsx     # Language toggle dropdown (Client Component)
│   │   │   ├── DisclaimerBanner.tsx   # Mandatory non-diagnostic advisory banner
│   │   │   └── LoadingSpinner.tsx     # Animated accessible loading indicator
│   │   │
│   │   ├── layout/                    # Layout navigation chrome
│   │   │   ├── PublicHeader.tsx       # Landing page sticky navigation header
│   │   │   ├── Sidebar.tsx            # Desktop dashboard navigation sidebar (Client)
│   │   │   ├── Topbar.tsx             # Desktop/mobile header with language selector (Client)
│   │   │   ├── BottomNav.tsx          # Mobile fixed bottom tab navigation (Client)
│   │   │   └── Footer.tsx             # Public marketing footer
│   │   │
│   │   └── assessment/                # Assessment wizard components
│   │       ├── ProgressBar.tsx        # 4-step wizard progress indicator (Client)
│   │       ├── StepPhotoUpload.tsx    # Step 1: Drag-and-drop & camera trigger (Client)
│   │       ├── StepCropSelect.tsx     # Step 2: 5 crop cards & search filter (Client)
│   │       ├── StepReview.tsx         # Step 3: Confirmation card before inference (Client)
│   │       ├── StepProcessing.tsx     # Step 4: Scanning radar animation (Client)
│   │       ├── ResultConfident.tsx    # Outcome: Confident diagnosis & guidance (Client)
│   │       ├── ResultCropMismatch.tsx # Outcome: Crop mismatch warning (Client)
│   │       ├── ResultInconclusive.tsx # Outcome: Low-confidence advisory (Client)
│   │       ├── ResultQualityReject.tsx# Outcome: Image quality screener rejection (Client)
│   │       └── ResultError.tsx        # Outcome: Network/server error with retry (Client)
│   │
│   ├── config/                        # Static configuration and environment constants
│   │   ├── constants.ts               # Crop lists, 10MB ceiling, allowed MIME types
│   │   └── env.ts                     # Validated server/client environment variables
│   │
│   ├── context/                       # Client state providers
│   │   ├── LanguageContext.tsx        # Active language state (English/Yoruba) & persistence
│   │   └── AssessmentContext.tsx      # Multi-step wizard state & non-destructive photo retention
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAssessment.ts           # Wizard navigation, photo validation, submission
│   │   ├── useLanguage.ts             # Language hook shortcut
│   │   ├── useBackendStatus.ts        # Polling hook for backend health/readiness
│   │   └── useHistory.ts              # LocalStorage/IndexedDB scan records hook
│   │
│   ├── services/                      # API client and storage services
│   │   ├── apiClient.ts               # Fetch client with timeout & error parsing
│   │   ├── predictService.ts          # Client service invoking /api/predict BFF
│   │   ├── healthService.ts           # Client service invoking /api/health BFF
│   │   └── historyStorage.ts          # LocalStorage persistence manager for scans
│   │
│   ├── styles/
│   │   └── globals.css                # Global styles, Tailwind imports, design token variables
│   │
│   ├── types/                         # TypeScript domain models
│   │   ├── api.ts                     # Strict backend API request/response types
│   │   ├── crops.ts                   # Crop definition and alias mappings
│   │   ├── assessment.ts              # Wizard step states and outcome models
│   │   └── i18n.ts                    # Translation keys and language types
│   │
│   └── utils/                         # Helper utilities
│       ├── formatters.ts              # Percentage, bytes, date formatters
│       ├── imageValidation.ts         # Client-side file size and format validator
│       └── cropHelpers.ts             # Crop slug normalization and alias resolution
│
└── tests/                             # Automated test suite
    ├── setup.ts                       # Test setup with jsdom and testing-library
    ├── unit/
    │   ├── imageValidation.test.ts    # Unit tests for 10MB and format checks
    │   ├── cropHelpers.test.ts        # Unit tests for crop alias resolution
    │   └── predictService.test.ts     # Unit tests for API client mapping
    └── components/
        ├── StepPhotoUpload.test.tsx   # Component tests for drag-and-drop
        ├── StepCropSelect.test.tsx    # Component tests for crop selection
        └── ResultConfident.test.tsx   # Component tests for guidance presentation
```

---

## 7. File-by-File Responsibility Matrix (Server vs. Client Components)

To take full advantage of Next.js App Router performance, every component is explicitly classified as either a **Server Component** (default, static, zero client JS) or a **Client Component** (`'use client'`, interactive):

| File Path | Component Type | Responsibility & Purpose | Main Exports / Interfaces | Dependencies | Phase |
| :--- | :---: | :--- | :--- | :--- | :---: |
| `frontend/next.config.mjs` | Config | Next.js configuration, environment setup, image domains | Default export config object | Next.js | Phase 2 |
| `frontend/src/styles/globals.css` | Style | Tailwind CSS imports, color tokens, animations | CSS tokens, `@keyframes` | Tailwind CSS | Phase 2 |
| `frontend/src/app/layout.tsx` | **Server** | Root layout, HTML shell, `Inter` font, LanguageProvider | `RootLayout`, `metadata` | `globals.css`, `LanguageProvider` | Phase 3 |
| `frontend/src/app/page.tsx` | **Server** | Public landing page (Hero, How It Works, Crops grid) | `LandingPage` | `PublicHeader`, `Footer`, `Button` | Phase 4 |
| `frontend/src/app/(workspace)/layout.tsx` | **Server** | Workspace layout wrapping dashboard, scan, guide | `WorkspaceLayout` | `Sidebar`, `Topbar`, `BottomNav` | Phase 4 |
| `frontend/src/app/(workspace)/dashboard/page.tsx` | **Server** | Workspace dashboard overview & quick-launch links | `DashboardPage` | `Button`, `Icon`, `constants.ts` | Phase 4 |
| `frontend/src/app/(workspace)/scan/page.tsx` | **Client** | Assessment wizard view coordinating steps 1–4 | `AssessmentPage` | `AssessmentProvider`, `Step*`, `Result*` | Phase 5 |
| `frontend/src/app/(workspace)/history/page.tsx` | **Client** | Local scan history view with filter by crop | `HistoryPage` | `useHistory`, `Button`, `Icon` | Phase 7 |
| `frontend/src/app/(workspace)/guide/page.tsx` | **Server** | Static crop encyclopedia for 5 supported crops | `CropGuidePage` | `constants.ts`, `Button` | Phase 4 |
| `frontend/src/app/(workspace)/settings/page.tsx` | **Client** | Language selection & data privacy preferences | `SettingsPage` | `useLanguage`, `LanguageSelect` | Phase 4 |
| `frontend/src/app/(workspace)/help/page.tsx` | **Server** | Frequently Asked Questions and responsible AI guide | `HelpPage` | `Icon`, `DisclaimerBanner` | Phase 4 |
| `frontend/src/app/api/predict/route.ts` | **Server (BFF)** | Proxy route handler receiving multipart upload from client, validating, and forwarding to Flask backend | `POST(request: NextRequest)` | `env.ts`, `constants.ts` | Phase 6 |
| `frontend/src/app/api/health/route.ts` | **Server (BFF)** | Proxy route handler querying Flask `/health` and `/health/ready` | `GET(request: NextRequest)` | `env.ts` | Phase 6 |
| `frontend/src/components/common/Button.tsx` | **Client** | Accessible button component with variants | `Button` | `Icon` | Phase 3 |
| `frontend/src/components/common/Badge.tsx` | **Server** | Status and severity badge pill | `Badge` | None | Phase 3 |
| `frontend/src/components/common/Icon.tsx` | **Server** | Accessible Lucide icon wrapper | `Icon` | `lucide-react` | Phase 3 |
| `frontend/src/components/common/Logo.tsx` | **Server** | CropScan AI branded logo | `Logo` | `Icon` | Phase 3 |
| `frontend/src/components/common/LanguageSelect.tsx` | **Client** | Language dropdown toggle (English / Yoruba) | `LanguageSelect` | `useLanguage` | Phase 4 |
| `frontend/src/components/common/DisclaimerBanner.tsx` | **Server** | Advisory agricultural disclaimer alert | `DisclaimerBanner` | `Icon` | Phase 3 |
| `frontend/src/components/common/LoadingSpinner.tsx` | **Server** | Accessible animated spinner | `LoadingSpinner` | None | Phase 3 |
| `frontend/src/components/layout/PublicHeader.tsx` | **Client** | Marketing sticky header with mobile menu toggle | `PublicHeader` | `Logo`, `LanguageSelect`, `Button` | Phase 4 |
| `frontend/src/components/layout/Sidebar.tsx` | **Client** | Desktop sidebar with active path highlighting | `Sidebar` | `Logo`, `Icon`, `usePathname` | Phase 4 |
| `frontend/src/components/layout/Topbar.tsx` | **Client** | Mobile/desktop header with language toggle | `Topbar` | `LanguageSelect`, `Logo` | Phase 4 |
| `frontend/src/components/layout/BottomNav.tsx` | **Client** | Mobile fixed bottom tab navigation | `BottomNav` | `Icon`, `usePathname` | Phase 4 |
| `frontend/src/components/layout/Footer.tsx` | **Server** | Marketing landing page footer | `Footer` | `Logo` | Phase 4 |
| `frontend/src/components/assessment/ProgressBar.tsx` | **Client** | 4-step wizard progress tracker | `ProgressBar` | `Icon` | Phase 5 |
| `frontend/src/components/assessment/StepPhotoUpload.tsx` | **Client** | Step 1: Drag-and-drop, file picker, camera trigger | `StepPhotoUpload` | `imageValidation`, `Button` | Phase 5 |
| `frontend/src/components/assessment/StepCropSelect.tsx` | **Client** | Step 2: 5 crop cards, search filter, unsupported alert | `StepCropSelect` | `constants.ts`, `Icon` | Phase 5 |
| `frontend/src/components/assessment/StepReview.tsx` | **Client** | Step 3: Confirmation card before inference | `StepReview` | `Button`, `DisclaimerBanner` | Phase 5 |
| `frontend/src/components/assessment/StepProcessing.tsx` | **Client** | Step 4: Loading state with radar scanning animation | `StepProcessing` | None | Phase 5 |
| `frontend/src/components/assessment/ResultConfident.tsx` | **Client** | Outcome: Confident diagnosis, symptoms & guidance | `ResultConfident` | `Badge`, `DisclaimerBanner` | Phase 6 |
| `frontend/src/components/assessment/ResultCropMismatch.tsx` | **Client** | Outcome: Crop mismatch warning & withheld advice | `ResultCropMismatch` | `Button`, `Icon` | Phase 6 |
| `frontend/src/components/assessment/ResultInconclusive.tsx` | **Client** | Outcome: Low confidence advisory & retake suggestions | `ResultInconclusive` | `Button`, `Icon` | Phase 6 |
| `frontend/src/components/assessment/ResultQualityReject.tsx` | **Client** | Outcome: Image quality screening rejection | `ResultQualityReject` | `Button`, `Icon` | Phase 6 |
| `frontend/src/components/assessment/ResultError.tsx` | **Client** | Outcome: Network/server error with retry button | `ResultError` | `Button`, `Icon` | Phase 6 |
| `frontend/src/config/constants.ts` | Utility | Supported crop list, max file size (10MB) | `SUPPORTED_CROPS`, `MAX_FILE_SIZE` | None | Phase 3 |
| `frontend/src/config/env.ts` | Utility | Validated client/server environment variables | `BACKEND_URL`, `IS_DEV` | `process.env` | Phase 3 |
| `frontend/src/context/LanguageContext.tsx` | **Client** | Language state provider (English/Yoruba) | `LanguageProvider`, `useLanguageContext` | React | Phase 4 |
| `frontend/src/context/AssessmentContext.tsx` | **Client** | Assessment wizard state & image retention | `AssessmentProvider`, `useAssessmentContext` | React | Phase 5 |
| `frontend/src/hooks/useAssessment.ts` | Hook | Wizard state and action dispatcher | `useAssessment` | `AssessmentContext`, `predictService` | Phase 5 |
| `frontend/src/hooks/useLanguage.ts` | Hook | Active language and translation strings | `useLanguage` | `LanguageContext` | Phase 4 |
| `frontend/src/hooks/useBackendStatus.ts` | Hook | Health and model readiness status check | `useBackendStatus` | `healthService` | Phase 4 |
| `frontend/src/hooks/useHistory.ts` | Hook | Local scan storage query and mutations | `useHistory` | `historyStorage` | Phase 7 |
| `frontend/src/services/apiClient.ts` | Service | Base fetch wrapper with timeout & JSON error parsing | `apiFetch`, `ApiError` | None | Phase 4 |
| `frontend/src/services/predictService.ts` | Service | Dispatches multipart prediction to BFF route | `submitPrediction` | `apiClient` | Phase 5 |
| `frontend/src/services/healthService.ts` | Service | Queries health probe from BFF route | `checkBackendHealth` | `apiClient` | Phase 4 |
| `frontend/src/services/historyStorage.ts` | Service | LocalStorage / IndexedDB CRUD for scans | `saveScan`, `getScans` | None | Phase 7 |
| `frontend/src/types/api.ts` | Types | TypeScript interfaces matching Flask API responses | `PredictApiResponse`, `ApiErrorResponse` | None | Phase 3 |
| `frontend/src/types/crops.ts` | Types | TypeScript interfaces for crop catalog & metadata | `CropId`, `CropDefinition` | None | Phase 3 |
| `frontend/src/types/assessment.ts` | Types | Wizard step states and outcome types | `AssessmentState`, `ResultStatus` | `api.ts`, `crops.ts` | Phase 3 |
| `frontend/src/types/i18n.ts` | Types | Language code types (`'en'`, `'yo'`) | `LanguageCode`, `Translations` | None | Phase 3 |
| `frontend/src/utils/imageValidation.ts` | Utility | Client-side file size and format screening | `validateImageFile` | `constants.ts` | Phase 5 |
| `frontend/src/utils/formatters.ts` | Utility | Percentage, file size, and timestamp formatting | `formatBytes`, `formatConfidence` | None | Phase 4 |
| `frontend/src/utils/cropHelpers.ts` | Utility | Crop slug normalization and Yoruba alias mapping | `normalizeCropSlug` | `constants.ts` | Phase 5 |

---

## 8. Application Architecture and Component Relationships

The Next.js App Router cleanly decouples static server-rendered presentation from client-side stateful interactive flows, communicating through Next.js Route Handlers:

```mermaid
graph TD
    subgraph Browser_Client [Browser Client Layer]
        Shell[Workspace Layout: Sidebar & Topbar]
        Lang[LanguageContext: 'en' | 'yo']
        Wizard[Assessment Wizard: useAssessment]
        
        Wizard --> Step1[Step 1: Photo Upload]
        Wizard --> Step2[Step 2: Crop Selection]
        Wizard --> Step3[Step 3: Review]
        Wizard --> Step4[Step 4: Submission Radar]
        
        Wizard --> Outcomes{Outcome Presentation}
        Outcomes --> R1[ResultConfident]
        Outcomes --> R2[ResultCropMismatch]
        Outcomes --> R3[ResultInconclusive]
        Outcomes --> R4[ResultQualityReject]
        Outcomes --> R5[ResultError]
    end

    subgraph NextJS_BFF [Next.js App Router BFF Layer]
        PredictRoute["/api/predict Route Handler (POST)"]
        HealthRoute["/api/health Route Handler (GET)"]
    end

    subgraph Flask_Backend [Flask Python Backend API]
        FlaskPredict["POST /api/predict (MobileNetV2)"]
        FlaskHealth["GET /health & GET /health/ready"]
    end

    Wizard -->|POST multipart/form-data| PredictRoute
    Shell -->|GET /api/health| HealthRoute
    PredictRoute -->|Server-to-Server POST| FlaskPredict
    HealthRoute -->|Server-to-Server GET| FlaskHealth
```

---

## 9. Page and User-Journey Specifications

### 9.1 Public Marketing Landing Page (`/`)
- **Server Component**: Fast initial load, optimized meta tags (`title`, `description`, `openGraph`), zero layout shift.
- **Hero Section**: High-impact agricultural typography, leaf scanning radar visual, and direct "Start a Scan" CTA routing to `/scan`.
- **How It Works**: Visual 3-step walkthrough explaining photo capture, crop selection, and guidance review.
- **Supported Crops Shelf**: Photographic cards showcasing Tomato, Maize, Bell Pepper, Citrus, and Potato.
- **Responsible Use Advisory**: Emphasizes that CropScan AI is a screening aid, not a clinical botanical diagnosis.

### 9.2 Workspace Dashboard (`/dashboard`)
- **Server Component Shell with Client Widgets**:
  - Localized greeting based on time of day.
  - Large "Start New Assessment" card.
  - Photo quality checklist (natural lighting, sharp focus, single leaf).
  - Quick-start crop shortcuts.
  - Recent activity card querying local browser storage.

### 9.3 Assessment Wizard Journey (`/scan`)
A stateful client wizard designed for reliable field use:

1. **Step 1: Add Leaf Photo (`StepPhotoUpload`)**:
   - Drag-and-drop zone, standard file picker, and native camera trigger (`capture="environment"`).
   - Immediate client-side validation: Blocks files $>10\text{ MB}$ or unsupported formats (`.gif`, `.bmp`).
   - Generates local preview URL using `URL.createObjectURL()`, safely revoked on file removal.
2. **Step 2: Select Matching Crop (`StepCropSelect`)**:
   - Selection cards for the 5 supported crops (`tomato`, `maize`, `bell_pepper`, `citrus`, `potato`).
   - Search filter supporting English and Yoruba aliases (`agbado`, `tatase`, `osan`, `poteto`).
   - If an unsupported crop (e.g. `cassava`, `yam`) is entered, displays an educational alert explaining why the 38-class model does not currently support it.
3. **Step 3: Review Before Submitting (`StepReview`)**:
   - Summary card showing leaf preview, selected crop, guidance language, and file size.
   - Non-diagnostic advisory reminder.
   - User can edit crop or photo without resetting previous inputs.
4. **Step 4: Submission & Inference Radar (`StepProcessing`)**:
   - Dispatches multipart request to Next.js BFF Route Handler.
   - Animated leaf radar scan line.
   - Prevents duplicate clicks or double-submissions.
5. **Outcome Presentation (5 Distinct States)**:
   - **Confident Diagnosis (`confident`)**: Condition title, pathogen scientific name, confidence meter, symptoms list, conservative cultural management (treatment) instructions, prevention practices, source citations, and "Extension Review Recommended" alert.
   - **Crop Mismatch (`crop_mismatch`)**: Amber warning explaining that the photo was submitted as Crop A, but model features resemble Crop B. Disease treatment advice is withheld (`data: null`) to prevent dangerous chemical misapplication.
   - **Inconclusive Low Confidence (`inconclusive_low_confidence`)**: Clear explanation that confidence fell below operational threshold (`0.40`). Does **not** claim the plant is healthy.
   - **Image Quality Rejection (`unreliable_image_quality`)**: Specific reason from pre-inference screener (`image_too_dark`, `image_too_bright`, `image_lacks_features`). Guidance on retaking photo.
   - **Server / Network Error (`request_error`)**: Non-destructive retry banner preserving the uploaded photo and crop selection.

### 9.4 Supporting Pages
- **Crop Guide (`/guide`)**: Static Server Component presenting agronomic information on the 5 supported crops.
- **Settings (`/settings`)**: Client Component allowing farmers to switch between English and Yoruba, persisted in browser storage.
- **Help Centre (`/help`)**: FAQ accordion and agricultural extension officer directory.

---

## 10. Verified Backend API Contract

### 10.1 Prediction Endpoint (`POST /api/predict`)

#### Request:
- **Client to Next.js BFF**: `POST /api/predict` (`multipart/form-data`)
- **Next.js BFF to Flask Backend**: `POST ${BACKEND_API_BASE_URL}/api/predict` (`multipart/form-data`)
- **Parameters**:
  - `image` *(File, required)*: JPEG, PNG, or WebP up to 10 MB.
  - `crop` *(string, required)*: `'tomato'`, `'maize'`, `'bell_pepper'`, `'citrus'`, or `'potato'`.
  - `lang` *(string, optional)*: `'en'` or `'yo'`.

#### Successful Response (HTTP 200 - Confident Prediction):
```json
{
  "status": "success",
  "selected_crop": "tomato",
  "language": "en",
  "image_metadata": {
    "format": "JPEG",
    "width": 800,
    "height": 600,
    "color_mode": "RGB",
    "size_bytes": 104520
  },
  "prediction": {
    "assessment_status": "confident",
    "crop_match": true,
    "selected_crop": "tomato",
    "predicted_crop": "tomato",
    "model_name": "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
    "class_index": 29,
    "class_label": "Tomato with Early Blight",
    "confidence": 0.8845,
    "confidence_threshold": 0.40,
    "is_provisional_threshold": true,
    "disclaimer": "Automated screening result only; not a confirmed agricultural diagnosis...",
    "guidance": {
      "status": "success",
      "class_index": 29,
      "model_class_id": "Tomato with Early Blight",
      "language": "en",
      "is_healthy": false,
      "message": "Guidance record retrieved successfully.",
      "data": {
        "disease_id": "tomato_early_blight",
        "crop": "Tomato",
        "display_name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "severity": "moderate",
        "description": "A common fungal foliar disease...",
        "symptoms": [
          "Dark brown to black spots with concentric rings on older leaves."
        ],
        "treatment": [
          "Prune and destroy infected lower leaves immediately."
        ],
        "prevention": [
          "Practice 3-year crop rotation avoiding Solanaceous crops."
        ],
        "expert_review_required": true,
        "sources": [
          "IITA Plant Health Guide: Tomato Pest & Disease Management in West Africa"
        ]
      }
    }
  }
}
```

#### Successful Response (HTTP 200 - Crop Mismatch):
```json
{
  "status": "success",
  "selected_crop": "potato",
  "language": "en",
  "image_metadata": { "format": "JPEG", "width": 640, "height": 480, "size_bytes": 98200 },
  "prediction": {
    "assessment_status": "crop_mismatch",
    "crop_match": false,
    "selected_crop": "potato",
    "predicted_crop": "maize",
    "class_index": 8,
    "class_label": "Corn (Maize) with Common Rust",
    "confidence": 0.9120,
    "confidence_threshold": 0.40,
    "is_provisional_threshold": true,
    "disclaimer": "Crop mismatch detected...",
    "guidance": {
      "status": "crop_mismatch",
      "selected_crop": "potato",
      "predicted_crop": "maize",
      "model_class_id": "Corn (Maize) with Common Rust",
      "language": "en",
      "is_healthy": null,
      "message": "Crop mismatch detected: guidance withheld.",
      "data": null
    }
  }
}
```

#### Successful Response (HTTP 200 - Quality Screener Rejection):
```json
{
  "status": "success",
  "selected_crop": "tomato",
  "language": "en",
  "image_metadata": { "format": "JPEG", "width": 640, "height": 480, "size_bytes": 18450 },
  "prediction": {
    "assessment_status": "unreliable_image_quality",
    "crop_match": null,
    "selected_crop": "tomato",
    "predicted_crop": null,
    "class_index": null,
    "class_label": null,
    "confidence": null,
    "screening_details": {
      "is_acceptable": false,
      "rejection_code": "image_too_dark",
      "message": "The uploaded image is extremely dark and lacks discernible visual features.",
      "metrics": {
        "mean_luminance": 2.14,
        "contrast": 1.25,
        "sharpness": 0.0,
        "green_pixel_ratio": 0.0,
        "vegetation_pixel_ratio": 0.0
      }
    },
    "disclaimer": "Image quality screening rejected this photograph...",
    "guidance": {
      "status": "unreliable_assessment",
      "data": null,
      "is_healthy": null
    }
  }
}
```

#### Error Response Format (HTTP 400, 413, 500, 503):
```json
{
  "error": "unsupported_crop",
  "message": "Unsupported crop 'cassava'. Supported crops are: 'tomato', 'maize', 'bell_pepper', 'citrus', 'potato'."
}
```

---

## 11. Environment and Configuration Plan

Next.js uses environment variables to configure backend connectivity:

| Variable Name | Environment | Required | Default | Purpose |
| :--- | :---: | :---: | :--- | :--- |
| `BACKEND_API_BASE_URL` | Server Only | **Yes** | `http://127.0.0.1:5000` | Target URL used by Next.js Route Handlers (`app/api/predict/route.ts`) to reach Flask API. |
| `NEXT_PUBLIC_APP_TITLE`| Client & Server | No | `"CropScan AI"` | Title used in page headers and meta tags. |
| `NEXT_PUBLIC_DEFAULT_LANG`| Client & Server | No | `"en"` | Default language code (`'en'` or `'yo'`). |

### `.env.example` Template
```bash
# Server-side connection to Flask backend (used by Route Handlers)
BACKEND_API_BASE_URL=http://127.0.0.1:5000

# Public application metadata
NEXT_PUBLIC_APP_TITLE="CropScan AI"
NEXT_PUBLIC_DEFAULT_LANG=en
```

---

## 12. Security, Accessibility, and Quality Requirements

### 12.1 Security & Privacy
1. **Zero Secret Leaks**: The frontend contains **no API keys, database credentials, or secret tokens**.
2. **Server-Side BFF Proxy**: The browser interacts only with Next.js route handlers (`/api/predict`), hiding the internal Flask backend network topology.
3. **Client-Side Upload Ceiling**: The frontend inspects file size before upload, immediately rejecting files $>10\text{ MB}$ to preserve farmer cellular data.
4. **Transient Image Lifecycle**: Uploaded photos are decoded in browser memory using Object URLs and explicitly revoked with `URL.revokeObjectURL()` to prevent memory leaks. Images are never transmitted to third-party telemetry.

### 12.2 Accessibility (WCAG 2.1 AA)
1. **Semantic HTML**: Proper landmarks (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`), valid `<h1>` through `<h3>` hierarchy.
2. **Accessible Form Controls**: File inputs, search fields, and crop radio buttons have associated labels and descriptive `aria-describedby` error texts.
3. **Keyboard Focus & Screen Readers**: All interactive elements have high-contrast `:focus-visible` rings (`outline: 3px solid rgba(57, 120, 184, 0.35)`). Non-text icons include `aria-hidden="true"`, and the scanning radar includes an `aria-live="polite"` status message.
4. **Motion Safety**: Full compliance with `@media (prefers-reduced-motion: reduce)` by disabling the scanning line and pulse animations.

---

## 13. Testing Strategy

1. **Unit Testing (Vitest)**:
   - `imageValidation.test.ts`: Verify rejection of $>10\text{ MB}$ files, GIF/SVG formats, and empty files.
   - `cropHelpers.test.ts`: Verify canonical mapping of Yoruba aliases (`agbado` $\to$ `maize`, `tatase` $\to$ `bell_pepper`).
   - `formatters.test.ts`: Verify percentage and byte size string formatters.
2. **Component Testing (React Testing Library)**:
   - `StepPhotoUpload.test.tsx`: Test drag-and-drop, camera button click, and preview generation.
   - `StepCropSelect.test.tsx`: Test search filtering and crop selection.
   - `ResultConfident.test.tsx`: Test rendering of symptoms, treatment, and prevention lists.
3. **Route Handler Integration Tests**:
   - Mock Flask server responses to verify that Next.js BFF (`/api/predict/route.ts`) correctly forwards multipart streams and handles upstream 503 or 400 errors.

---

## 14. Implementation Roadmap and Acceptance Criteria

```mermaid
gantt
    title CropScan AI Frontend Implementation Roadmap (Next.js)
    dateFormat  YYYY-MM-DD
    section Setup & Scaffold
    Phase 1: Architecture Plan (Completed)      :done, 2026-10-28, 1d
    Phase 2: Next.js Scaffold Creation         :2026-10-29, 1d
    Phase 3: Base App, Fonts & Tailwind v4     :2026-10-30, 1d
    section Core UI & Pages
    Phase 4: Shell, Navigation & Static Pages  :2026-10-31, 2d
    section Wizard & Integration
    Phase 5: Upload & Crop Wizard Setup        :2026-11-02, 2d
    Phase 6: Next.js BFF & Flask Integration   :2026-11-04, 2d
    Phase 7: Result Presentation & Safe States :2026-11-06, 2d
    section Polish & Verification
    Phase 8: Persistence, History & Yoruba i18n:2026-11-08, 1d
    Phase 9: Automated Testing & A11y Checks   :2026-11-09, 1d
    Phase 10: Production Build & Git Delivery  :2026-11-10, 1d
```

### Phase 1: Repository & Reference Inspection (Current Deliverable)
- **Deliverable**: `FRONTEND_SCAFFOLD_PLAN.md` (Version 2.0.0, Next.js).
- **Acceptance Criteria**: Approved by user. No code written yet.

### Phase 2: Next.js Scaffold Creation
- **Deliverable**: Initialized `frontend/` directory with `create-next-app` (Next.js 15+, App Router, TypeScript, Tailwind CSS, ESLint).
- **Acceptance Criteria**: `pnpm build` and `pnpm dev` run without errors. No proprietary Figma Make plugins present.

### Phase 3: Base App, Fonts & Design System
- **Deliverable**: `globals.css` with agricultural color tokens, `next/font/google` (`Inter`), and common UI components (`Button`, `Badge`, `Icon`, `Logo`).
- **Acceptance Criteria**: Brand tokens, focus states, and typography render accurately.

### Phase 4: Application Shell & Static Pages
- **Deliverable**: `PublicHeader`, `Sidebar`, `Topbar`, `BottomNav`, `LandingPage`, `DashboardPage`, `CropGuidePage`, `SettingsPage`, and `HelpPage`.
- **Acceptance Criteria**: Server Components render cleanly. Responsive layout transitions properly at mobile breakpoint ($<800\text{px}$).

### Phase 5: Assessment Wizard (Steps 1–3)
- **Deliverable**: `StepPhotoUpload`, `StepCropSelect`, `StepReview`, and `ProgressBar`.
- **Acceptance Criteria**: Files $>10\text{ MB}$ rejected client-side. Image preview renders. Crop search filters supported crops and warns on unsupported crops.

### Phase 6: Next.js BFF & Flask API Integration
- **Deliverable**: `app/api/predict/route.ts` and `app/api/health/route.ts` forwarding requests to Flask.
- **Acceptance Criteria**: Genuine leaf image uploaded from UI reaches MobileNetV2 backend and returns prediction JSON payload.

### Phase 7: Result Presentation & Safe States
- **Deliverable**: `ResultConfident`, `ResultCropMismatch`, `ResultInconclusive`, `ResultQualityReject`, and `ResultError`.
- **Acceptance Criteria**: All 5 outcome views render. Chemical treatment guidance is strictly withheld on mismatches, low confidence, and quality rejections.

### Phase 8: Local Persistence & Yoruba Localization
- **Deliverable**: Client-side scan history in browser storage; complete Yoruba localization toggle.
- **Acceptance Criteria**: Scans persist across page reloads. Language toggle updates interface text and advisory guidance.

### Phase 9: Automated Testing & Accessibility Verification
- **Deliverable**: Vitest unit and component test suites; accessibility audit.
- **Acceptance Criteria**: 100% test pass rate. Zero critical axe-core accessibility violations.

### Phase 10: Production Build & Git Handover
- **Deliverable**: Production bundle verified via `pnpm build` (`next build`).
- **Acceptance Criteria**: Static assets generate cleanly; `frontend-reference/` untouched; controlled Git commit created.

---

## 15. Risks, Dependencies, and Decisions Requiring Approval

### 15.1 Decisions Confirmed by User
1. **Framework Choice**: Next.js (App Router) with TypeScript and Tailwind CSS confirmed.
2. **Directory Name**: Production code located in `frontend/` confirmed.
3. **Overwrite Permission**: Explicit permission granted to overwrite `FRONTEND_SCAFFOLD_PLAN.md` with this Next.js plan.

### 15.2 Risk Management Matrix

| Risk | Impact | Mitigation Strategy |
| :--- | :---: | :--- |
| **Flask Model Cold-Start** | Medium | Next.js BFF polls `/health/ready` before submitting large images; UI displays descriptive loading state. |
| **Mobile Bandwidth Limits** | Medium | Client-side validation blocks $>10\text{ MB}$ files before sending any network bytes. |
| **Dangerous Chemical Misapplication** | Critical | Enforce strict guidance withholding (`data: null`) on crop mismatches or scores $< 0.40$. Non-diagnostic disclaimers displayed on all outcome views. |

---

*End of Document. Awaiting user approval to initiate Phase 2 (Next.js Scaffold Creation).*
