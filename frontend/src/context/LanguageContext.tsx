'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'English' | 'Yoruba';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  English: {
    'brand.tagline': 'Assistive crop disease detection for farmers & agronomists',
    'nav.overview': 'Overview',
    'nav.newScan': 'New Assessment',
    'nav.history': 'Assessment History',
    'nav.guide': 'Crop Guide',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'hero.badge': 'Assisting 10,000+ smallholder farmers across Nigeria',
    'hero.heading': 'Instant leaf disease diagnosis for healthier crops.',
    'hero.subheading': 'CropScan AI analyzes visual leaf symptoms across 5 key crops to deliver immediate condition insights, triage recommendations, and field prevention strategies.',
    'hero.ctaStart': 'Start Plant Assessment',
    'hero.ctaGuide': 'Browse Supported Crops',
    'hero.trust1': 'On-device initial check',
    'hero.trust2': '5 Major African crops',
    'hero.trust3': 'Dual English & Yoruba guidance',
    'hero.cardCondition': 'Early Blight Detected',
    'hero.cardConfidence': '94.2% diagnostic confidence',
    'hero.badgeLive': 'Field-ready diagnosis',
    'how.kicker': 'Streamlined 3-step workflow',
    'how.heading': 'How CropScan AI Works in Your Field',
    'how.subheading': 'Engineered for simplicity in low-connectivity rural environments.',
    'how.step1Title': '1. Capture Leaf Photo',
    'how.step1Desc': 'Snap a clear, close-up photograph of the symptomatic leaf under natural daylight.',
    'how.step2Title': '2. Select Crop & Submit',
    'how.step2Desc': 'Confirm the crop variety to enable specialized computer vision models and safety checks.',
    'how.step3Title': '3. Receive Actionable Guidance',
    'how.step3Desc': 'Get verified condition assessments, cultural control tactics, and spray guidance.',
    'crops.kicker': 'Specialized Crop Coverage',
    'crops.heading': 'Engineered for Five Core Regional Crops',
    'crops.subheading': 'Trained on tens of thousands of verified field specimens with localized disease profiles.',
    'responsible.kicker': 'Ethical Agricultural AI',
    'responsible.heading': 'Responsible by Design',
    'responsible.body': 'Our system strictly prioritizes farmer livelihoods through conservative safety guardrails, explicit uncertainty handling, and out-of-scope screening.',
    'responsible.item1Title': 'Triage Advisory Only',
    'responsible.item1Desc': 'Clear notifications emphasize that AI assessments are field aids, not infallible guarantees.',
    'responsible.item2Title': 'Low-Confidence Rejection',
    'responsible.item2Desc': 'Inconclusive scans prompt immediate re-taking rather than delivering false certainty.',
    'responsible.item3Title': 'Out-of-Scope Protection',
    'responsible.item3Desc': 'Leaves from non-supported crops are flagged to prevent dangerous cross-species misdiagnosis.',
    'footer.brand': 'CropScan AI empowers African farmers and field extension officers with accurate visual leaf health diagnosis.',
    'footer.disclaimer': 'Assistance tool only. Verify critical crop interventions with local agronomy officers.',
    'footer.copyright': '© 2026 CropScan AI. All rights reserved.',
  },
  Yoruba: {
    'brand.tagline': 'Ìrànwọ́ ìwádìí àìsàn ohun ọ̀gbìn fún àwọn àgbẹ̀',
    'nav.overview': 'Àkópọ̀',
    'nav.newScan': 'Ṣàyẹ̀wò Tuntun',
    'nav.history': 'Ìtàn Àyẹ̀wò',
    'nav.guide': 'Ìwé Ohun Ọ̀gbìn',
    'nav.settings': 'Ètò',
    'nav.help': 'Ìrànlọ́wọ́',
    'hero.badge': 'Ń ran àwọn àgbẹ̀ tó lé ní 10,000 lọ́wọ́ káàkiri Nàìjíríà',
    'hero.heading': 'Ìwádìí àìsàn ewé lẹ́sẹ̀kẹsẹ̀ fún irè oko tó nílera.',
    'hero.subheading': 'CropScan AI ń wo àwọn àmì àìsàn lára ewé ohun ọ̀gbìn 5 láti fún ọ ní ìmọ̀ràn lẹ́sẹ̀kẹsẹ̀, ọ̀nà ìtọ́jú, àti ètò ìdènà lórí oko.',
    'hero.ctaStart': 'Bẹ̀rẹ̀ Àyẹ̀wò Ohun Ọ̀gbìn',
    'hero.ctaGuide': 'Wo Àwọn Ohun Ọ̀gbìn Wa',
    'hero.trust1': 'Àyẹ̀wò lórí fóònù',
    'hero.trust2': 'Ohun ọ̀gbìn pàtàkì 5',
    'hero.trust3': 'Èdè Gẹ̀ẹ́sì àti Yorùbá',
    'hero.cardCondition': 'Àìsàn Early Blight Farahàn',
    'hero.cardConfidence': '94.2% ìdánilójú àyẹ̀wò',
    'hero.badgeLive': 'Àyẹ̀wò lórí oko',
    'how.kicker': 'Ọ̀nà Ìgbésẹ̀ mẹ́ta tí ó rọrùn',
    'how.heading': 'Bí CropScan AI Ṣe Ń Ṣiṣẹ́ Lórí Oko Rẹ',
    'how.subheading': 'A kọ́ ọ fún ìrọ̀rùn ní àwọn agbègbè igberiko láìsí ìṣòro.',
    'how.step1Title': '1. Ya Àwòrán Ewé',
    'how.step1Desc': 'Ya àwòrán ewé tí àìsàn wà lára rẹ̀ kedere lábẹ́ ìmọ́lẹ̀ oòrùn.',
    'how.step2Title': '2. Yan Ohun Ọ̀gbìn Rẹ',
    'how.step2Desc': 'Yan irú ohun ọ̀gbìn tí o yà láti lo ìmọ̀ ẹ̀rọ tó bá a mu wẹ́kú.',
    'how.step3Title': '3. Gba Ìmọ̀ràn Lẹ́sẹ̀kẹsẹ̀',
    'how.step3Desc': 'Gba àyẹ̀wò pípé, ọ̀nà ìtọ́jú ní oko, àti oògùn tó yẹ láti fún un.',
    'crops.kicker': 'Àwọn Ohun Ọ̀gbìn Pàtàkì',
    'crops.heading': 'A Kọ́ Ọ Fún Ohun Ọ̀gbìn Àgbègbè Wa Mẹ́fà/Márùn-ún',
    'crops.subheading': 'A kọ́ ẹ̀rọ yìí pẹ̀lú ẹgbẹẹgbẹ̀rún àwòrán ewé láti pèsè àyẹ̀wò tí ó péye.',
    'responsible.kicker': 'Ìmọ̀ Ẹ̀rọ Tó Lóye',
    'responsible.heading': 'A Kọ́ Ọ Pẹ̀lú Ìṣọ́ra Pípé',
    'responsible.body': 'A gbé ètò yìí kalẹ̀ láti dáàbò bo iṣẹ́ àgbẹ̀ pẹ̀lú ìṣọ́ra líle fún àyẹ̀wò tí kò ní àrídájú.',
    'responsible.item1Title': 'Ìmọ̀ràn Ìtọ́sọ́nà Nìkan',
    'responsible.item1Desc': 'Ẹ̀rọ yìí wà láti ran àgbẹ̀ lọ́wọ́, kì í ṣe láti dípò àyẹ̀wò ilé-ẹ̀kọ́ ní kíkún.',
    'responsible.item2Title': 'Kíkọ Àwòrán Tí Kò Dánilójú',
    'responsible.item2Desc': 'Tí àwòrán kò bá dánilójú, ẹ̀rọ yóò sọ fún ọ láti tún ya àwòrán mìíràn.',
    'responsible.item3Title': 'Ìdènà Ohun Ọ̀gbìn Mìíràn',
    'responsible.item3Desc': 'A kì í gba ewé ohun ọ̀gbìn tí kò sí lára àwọn márùn-ún wa láti dènà àṣìṣe eléwu.',
    'footer.brand': 'CropScan AI ń fún àwọn àgbẹ̀ Nàìjíríà ní agbára láti ṣe àyẹ̀wò ìlera ewé ní kánkán.',
    'footer.disclaimer': 'Èyí jẹ́ ohun èlò ìrànwọ́. Bèrè lọ́wọ́ àwọn agbóṣẹ́ àgbẹ̀ kí o tó lo oògùn tó lágbára.',
    'footer.copyright': '© 2026 CropScan AI. Gbogbo ẹ̀tọ́ wà ní ìpamọ́.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key: string) => key,
});

const STORAGE_KEY = 'cropscan_preferred_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('English');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === 'English' || saved === 'Yoruba')) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage availability issues in private browsing
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
