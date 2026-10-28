'use client';

import React from 'react';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

interface FaqItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const faqs: FaqItem[] = [
    {
      question: isYo ? 'Àwọn ohun ọ̀gbìn wo ni CropScan AI tì lẹ́yìn?' : 'Which crops does CropScan AI support?',
      answer: isYo
        ? 'Tòmátì, àgbàdo, ata tàtáṣé, ọsàn, àti kùkùndùkú/pútátò. Má ṣe yan ohun ọ̀gbìn kan fún ohun ọ̀gbìn tí kò bá a mu.'
        : 'Tomato, maize, bell pepper, citrus, and potato. Never select a supported crop for a plant that does not belong to that category.',
    },
    {
      question: isYo ? 'Àwọn irú àwòrán wo ni mo le gbé sókè?' : 'What images can I upload?',
      answer: isYo
        ? 'Àwòrán JPG, PNG, tàbí WebP tó tó 10 MB. Àwòrán tí ó mọ́ dáadáa lábẹ́ ìmọ́lẹ̀ oòrùn ni ó dára jùlọ.'
        : 'JPG, PNG, and WebP files up to 10 MB. A clear, well-lit close-up photograph of one leaf works best.',
    },
    {
      question: isYo ? 'Kí ló fà á tí àyẹ̀wò mi kò fi dánilójú?' : 'Why was my result inconclusive?',
      answer: isYo
        ? 'Ẹ̀rọ náà kò rí ẹ̀rí tó tó láti dánilójú nípa àìsàn náà. Èyí kò túmọ̀ sí pé ohun ọ̀gbìn rẹ kò ní àìsàn.'
        : 'The model did not reach a sufficient confidence threshold. This does not mean your plant is healthy, and specific treatment guidance is intentionally withheld for safety.',
    },
    {
      question: isYo ? 'Kí ni ìtumọ̀ àyípadà ohun ọ̀gbìn (crop mismatch)?' : 'What does crop mismatch mean?',
      answer: isYo
        ? 'Ẹ̀rọ wa rí i pé ewé tí o gbé wá kò bá ohun ọ̀gbìn tí o yàn mu. A dá àyẹ̀wò dúró láti dènà àṣìṣe.'
        : 'The predicted plant category did not align with your selected crop. Review the crop selection or upload a different photograph.',
    },
    {
      question: isYo ? 'Ṣé mo le lo èyí bí àyẹ̀wò tó gbẹ̀yìn?' : 'Can I use this as a confirmed laboratory diagnosis?',
      answer: isYo
        ? 'Rárá. CropScan AI jẹ́ ohun èlò ìrànwọ́ lórí oko. Bèrè lọ́wọ́ àwọn agbóṣẹ́ àgbẹ̀ nígbà tí àmì àìsàn kò bá dánilójú.'
        : 'No. CropScan AI provides assistive visual screening. Consult a qualified agricultural extension officer or laboratory when symptoms are unclear or severe.',
    },
    {
      question: isYo ? 'Kí ló fà á tí a kò fi fi gbogbo ohun ọ̀gbìn síbẹ̀?' : 'Why are some crops unsupported?',
      answer: isYo
        ? 'A kọ́ ẹ̀rọ yìí fún àwọn ohun ọ̀gbìn márùn-ún wọ̀nyí nìkan láti rí i dájú pé àyẹ̀wò wa dánilójú.'
        : 'The model is specifically trained on five high-impact regional crop families. Unsupported crops should never be mislabeled to force a prediction.',
    },
  ];

  return (
    <div className="simple-page">
      <div className="page-intro">
        <div>
          <span className="kicker">{isYo ? 'Gbọ̀ngàn Ìrànlọ́wọ́' : 'Help centre'}</span>
          <h1>{isYo ? 'Ìdáhùn Kedere, Ìpinnu Tó Dáa' : 'Clear answers, safer decisions'}</h1>
          <p>
            {isYo
              ? 'Kọ́ bí o ṣe le gba àyẹ̀wò tó péye àti àwọn ààlà ìmọ̀ ẹ̀rọ wa.'
              : 'Learn how to get an accurate screening result and understand system limitations.'}
          </p>
        </div>
      </div>

      <div className="help-grid">
        <section className="faq-list">
          <h2>{isYo ? 'Àwọn Ìbéèrè Tó Wọ́pọ̀' : 'Frequently asked questions'}</h2>
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span>{faq.question}</span>
                <Icon name="chevron" size={17} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>

        <aside className="responsible-aside" id="responsible">
          <span>
            <Icon name="shield" size={26} />
          </span>
          <h2>{isYo ? 'Ìránnilétí Ìṣọ́ra' : 'Responsible-use reminder'}</h2>
          <p>
            {isYo
              ? 'Àwòrán tí kò mọ́ le ba àyẹ̀wò jẹ́. Àyẹ̀wò tí kò dánilójú kì í fún ọ ní ìmọ̀ràn oògùn láti dáàbò bo oko rẹ.'
              : 'Image quality directly affects results. AI predictions can be mistaken, and uncertain assessments intentionally withhold chemical or disease-specific advice.'}
          </p>
          <hr />
          <strong>{isYo ? 'Àwọn àmì àìsàn kò tíì yé ọ?' : 'Symptoms unclear or severe?'}</strong>
          <p>
            {isYo
              ? 'Bá àwọn agbóṣẹ́ àgbẹ̀ àdúgbò rẹ sọ̀rọ̀ kí o tó gbé ìgbésẹ̀ kankan.'
              : 'Speak with a qualified local agricultural extension officer before undertaking expensive chemical treatments.'}
          </p>
        </aside>
      </div>
    </div>
  );
}
