import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { AssessmentResult } from '@/types/assessment';
import { useLanguage } from '@/context/LanguageContext';

interface ResultConfidentProps {
  result: AssessmentResult;
  previewUrl: string;
  crop: Crop;
  isSample?: boolean;
  onScanAnother: () => void;
  onDashboard: () => void;
}

export function ResultConfident({
  result,
  previewUrl,
  crop,
  isSample = false,
  onScanAnother,
  onDashboard,
}: ResultConfidentProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba' || result.language === 'yo';
  const isHealthy = result.outcome === 'healthy' || Boolean(result.guidance?.is_healthy);
  const confidence = result.confidenceScore;
  const isSampleData = isSample || confidence === 94.6 || confidence === 96.2;

  const label =
    result.predictedCondition ||
    (isYo
      ? isHealthy
        ? 'Ewé Tó Nílera'
        : 'Àrùn Tí A Mọ̀'
      : isHealthy
      ? 'Healthy Foliage'
      : 'Condition Identified');
  const cropDisplay = isYo ? result.selectedCropYoruba || crop : crop;

  return (
    <section className="result-page" aria-labelledby="assessment-result-heading">
      {/* Top Header with Status Pill and Prominent Action */}
      <div className="result-heading">
        <div>
          <span
            className="success-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              borderRadius: 999,
              background: isHealthy ? 'rgba(34, 197, 94, 0.12)' : 'var(--mint)',
              color: isHealthy ? '#15803d' : 'var(--green)',
              border: isHealthy ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--border)',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            <Icon name={isHealthy ? 'shield' : 'check'} size={15} />{' '}
            {isYo
              ? isHealthy
                ? 'Ewé tó nílera · Àyẹ̀wò parí'
                : 'Àyẹ̀wò parí · Ìbáramu wà'
              : isHealthy
              ? 'Healthy Foliage · Screening Clear'
              : 'Assessment Complete · Pattern Identified'}
          </span>
          <h1 id="assessment-result-heading" style={{ margin: '6px 0 8px', fontSize: 32, letterSpacing: '-0.02em' }}>
            {isYo
              ? isHealthy
                ? 'Àbájáde: Ewé Tó Nílera'
                : 'Àbájáde Àyẹ̀wò'
              : isHealthy
              ? 'Assessment: Healthy Foliage'
              : 'Assessment Results'}
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, maxWidth: 640, lineHeight: 1.55 }}>
            {isYo
              ? isHealthy
                ? `Àwòṣe ìmọ̀ ẹ̀rọ fìdí rẹ̀ múlẹ̀ pé ewé ${cropDisplay} yìí nílera dáradára láìsí àmì àrùn tó ṣeé fojú rí.`
                : `Àwòṣe ìmọ̀ ẹ̀rọ ṣe àwárí àwọn àmì tó bá ${label} mu lórí ewé ${cropDisplay}. Ṣàyẹ̀wò àwọn àmì tí a fojú rí àti ìtọ́sọ́nà lórí oko ní ìsàlẹ̀ dáradára.`
              : isHealthy
              ? `Computer vision analysis indicates healthy, vigorous foliage with no visible signs of targeted disease on ${cropDisplay}.`
              : `Computer vision analysis detected leaf patterns matching ${label} on ${cropDisplay}. Review observed symptoms and agricultural extension recommendations below.`}
          </p>
        </div>
        <div style={{ flexShrink: 0, marginTop: 12 }}>
          <Button variant="outline" icon="camera" onClick={onScanAnother}>
            {isYo ? 'Ṣàyẹ̀wò Àwòrán Mìíràn' : 'Analyze Another Image'}
          </Button>
        </div>
      </div>

      {/* Two-column Result Summary Grid */}
      <div className="result-grid" style={{ marginBottom: 28 }}>
        {/* Uploaded Leaf Photo Display */}
        <div className="result-photo" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Assessed ${cropDisplay} leaf specimen`}
            style={{ width: '100%', height: 320, objectFit: 'cover' }}
          />
          <div
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
              {isYo ? `Ewé tí a gbé wọlé · ${cropDisplay}` : `Uploaded Leaf · ${cropDisplay}`}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '3px 9px',
                borderRadius: 6,
                background: isHealthy ? 'rgba(34, 197, 94, 0.1)' : 'var(--cream)',
                color: isHealthy ? '#15803d' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {cropDisplay}
            </span>
          </div>
        </div>

        {/* Prediction & Illustrative Score Card */}
        <div className="prediction-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="ai-label" style={{ margin: 0 }}>
              <Icon name="spark" size={15} /> {isYo ? 'Àyẹ̀wò Ìmọ̀ Ẹ̀rọ AI' : 'Computer Vision Assessment'}
            </span>
            {isSampleData && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Icon name="alert" size={12} />
                {isYo ? 'Àpẹẹrẹ Àfihàn (Sample Data)' : 'Sample Data · Not Live'}
              </span>
            )}
          </div>

          <small>
            {isYo
              ? isHealthy
                ? 'Ipò ewé tí a fìdí rẹ̀ múlẹ̀'
                : 'Àrùn tí a ṣe àwárí rẹ̀'
              : isHealthy
              ? 'Identified Leaf Condition'
              : 'Predicted Leaf Condition'}
          </small>
          <h2 style={{ fontSize: 26, margin: '8px 0 20px', color: 'var(--text)' }}>{label}</h2>

          {/* Model Confidence Metric Card */}
          <div
            className="confidence"
            style={{
              background: '#fbfcfb',
              padding: '16px 18px',
              borderRadius: 14,
              border: isSampleData ? '1px dashed #f59e0b' : '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                    {isSampleData
                      ? (isYo ? 'Ìwọ̀n Àpẹẹrẹ Àfihàn' : 'Illustrative Sample Score')
                      : (isYo ? 'Ìwọ̀n Ìdánilójú Àwòṣe' : 'Model Confidence Score')}
                  </span>
                  {isSampleData && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                      }}
                    >
                      Sample Data
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
                  {isSampleData
                    ? (isYo
                        ? '(Àpẹẹrẹ àfihàn nìkan — kì í ṣe àbájáde ẹ̀rọ tòótọ́)'
                        : '(Illustrative demo metric — not a live model prediction)')
                    : (isYo
                        ? '(Ìwọ̀n ìbáramu àwòṣe, kì í ṣe àrídájú 100%)'
                        : '(Statistical pattern similarity, not diagnostic certainty)')}
                </span>
              </div>
              <strong style={{ fontSize: 22, color: isHealthy ? '#15803d' : 'var(--green)' }}>
                {confidence.toFixed(1)}%
              </strong>
            </div>
            <div className="confidence-track" style={{ height: 8, margin: '12px 0 10px', background: '#e2e8e3' }}>
              <i
                style={{
                  width: `${Math.min(confidence, 100)}%`,
                  background: isHealthy ? '#22c55e' : 'var(--green)',
                  borderRadius: 999,
                }}
              />
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: isSampleData ? '#92400e' : 'var(--muted)', margin: 0 }}>
              {isSampleData
                ? (isYo
                    ? 'Àkíyèsí: Ìwọ̀n yìí jẹ́ àpẹẹrẹ àfihàn (Sample data). Kì í ṣe àbájáde ẹ̀rọ tòótọ́ lórí ewé rẹ.'
                    : 'Sample Data Notice: This illustrative score is a representative demonstration metric for design evaluation and must not be interpreted as a live model prediction.')
                : (isYo
                    ? 'Ìdánilójú yìí fihàn ìwọ̀n ìbáramu àwòṣe ìmọ̀ ẹ̀rọ pẹ̀lú àkójọ àwòrán rẹ̀, kì í ṣe àrídájú 100% pé àrùn náà wà.'
                    : 'Confidence reflects statistical visual pattern similarity in training data, not 100% diagnostic certainty.')}
            </p>
          </div>
        </div>
      </div>

      {/* Structural Distinction: Observations vs Recommendations */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>
          {isYo ? 'Àkópọ̀ Ìtọ́sọ́nà Lórí Oko' : 'Field Guidance & Clinical Observations'}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          {isYo
            ? 'Àwọn àmì tí a fojú rí lórí ewé àti àwọn ìgbésẹ̀ tí a dámọ̀ràn fún àgbẹ̀.'
            : 'Clear separation between visible specimen observations and recommended agronomic actions.'}
        </p>
      </div>

      {/* Three Detailed Guidance Cards */}
      <div
        className="guidance-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 20,
          marginTop: 16,
        }}
      >
        {/* Card 1: Observed Symptoms (Observations) */}
        <article
          className="guidance-card"
          style={{
            border: '1px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            background: '#ffffff',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="book" size={18} />
            </span>
            <div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#2563eb',
                }}
              >
                {isYo ? 'ÀWỌN ÀMÌ TÍ A RÍ' : 'OBSERVATIONS'}
              </span>
              <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>
                {isYo ? 'Àwọn Àmì Tí A Fojú Rí' : 'Observed Symptoms & Diagnosis'}
              </h4>
            </div>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 14px' }}>
            {result.guidance?.description ||
              (isYo
                ? 'Kò sí àlàyé kíkún fún àbájáde yìí nínú àkójọ wa.'
                : 'No detailed condition description is available in the catalog for this result.')}
          </p>

          {result.guidance?.symptoms && result.guidance.symptoms.length > 0 && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
              <strong style={{ display: 'block', fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>
                {isYo ? 'Àwọn àmì pàtàkì lórí ewé:' : 'Key visual indicators:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                {result.guidance.symptoms.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Card 2: Recommended Next Steps & Treatment (Recommendations) */}
        <article
          className="guidance-card highlight"
          style={{
            border: '1px solid #fed7aa',
            borderTop: '4px solid #f97316',
            background: '#ffffff',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="shield" size={18} />
            </span>
            <div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#ea580c',
                }}
              >
                {isYo ? 'ÌGBÉSẸ̀ LÓRÍ OKO' : 'RECOMMENDED ACTIONS'}
              </span>
              <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>
                {isYo ? 'Àwọn Ìgbésẹ̀ Lórí Oko' : 'Recommended Field Steps'}
              </h4>
            </div>
          </div>

          {result.guidance?.treatment && result.guidance.treatment.length > 0 ? (
            <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {result.guidance.treatment.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : isHealthy ? (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 14px' }}>
              {isYo
                ? 'Kò nílò ìtọ́jú oògùn kankan fún ohun ọ̀gbìn tó nílera. Tẹ̀síwájú láti máa ṣàyẹ̀wò oko rẹ déédéé àti pípèsè omi tó tọ́.'
                : 'No chemical treatments required for healthy foliage. Continue regular field scouting and maintain balanced organic fertilization.'}
            </p>
          ) : (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 14px' }}>
              {isYo
                ? 'Kò sí ìtọ́jú oògùn kan pàtó tí a dámọ̀ràn láìsí àyẹ̀wò lórí oko. Jọ̀wọ́ kan sí òṣìṣẹ́ àgbẹ̀ agbègbè rẹ.'
                : 'No specific chemical treatment is recommended automatically. Consult a local agricultural extension officer before applying chemical sprays.'}
            </p>
          )}

          {/* Cautious Chemical Application Note */}
          <div
            style={{
              marginTop: 'auto',
              padding: '10px 12px',
              borderRadius: 10,
              background: '#fefce8',
              border: '1px solid #fef08a',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: '#ca8a04', marginTop: 1, flexShrink: 0 }}>
              <Icon name="alert" size={15} />
            </span>
            <span style={{ fontSize: 12, color: '#854d0e', lineHeight: 1.45 }}>
              {isYo
                ? 'Ìkìlọ̀: Má ṣe fọ́n oògùn kemika láìgbọ́ràn sí òṣìṣẹ́ àgbẹ̀ agbègbè rẹ.'
                : 'Exercise caution: Always consult your local extension officer before purchasing or applying synthetic fungicides.'}
            </span>
          </div>
        </article>

        {/* Card 3: Field Prevention Strategies (Prevention) */}
        <article
          className="guidance-card"
          style={{
            border: '1px solid #bbf7d0',
            borderTop: '4px solid #16a34a',
            background: '#ffffff',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="leaf" size={18} />
            </span>
            <div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#16a34a',
                }}
              >
                {isYo ? 'ÌDÈNÀ TÍ Ń PẸ́' : 'LONG-TERM PREVENTION'}
              </span>
              <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>
                {isYo ? 'Àwọn Ọ̀nà Ìdènà Àrùn' : 'Field Prevention Strategies'}
              </h4>
            </div>
          </div>

          {result.guidance?.prevention && result.guidance.prevention.length > 0 ? (
            <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {result.guidance.prevention.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              <li>
                {isYo
                  ? 'Gbin ohun ọ̀gbìn ní àlàfo tó tọ́ láti jẹ́ kí afẹ́fẹ́ fẹ́ kọjá láàárín wọn'
                  : 'Maintain proper crop spacing to ensure continuous canopy airflow and sun exposure'}
              </li>
              <li>
                {isYo
                  ? 'Lo omi ẹ̀rọ abẹ́lẹ̀ (drip irrigation) dípò fífọ́n omi lórí ewé'
                  : 'Use drip irrigation at the soil line instead of overhead sprinkler watering'}
              </li>
              <li>
                {isYo
                  ? 'Pa àwọn ewéko búburú mọ́ kúrò ní àyíká oko'
                  : 'Keep field borders free from weeds that host fungal pathogens and insect vectors'}
              </li>
            </ul>
          )}

          <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              {isYo
                ? 'Ìdènà tó tọ́ ń dín àdánù oko kù nípa àbójútó àyíká tó mọ́.'
                : 'Proactive cultural management reduces pathogen inoculum pressure without recurring chemical costs.'}
            </span>
          </div>
        </article>
      </div>

      {/* Safety Screening Disclaimer Notice */}
      <div
        className="responsible-note"
        style={{
          marginTop: 24,
          padding: '16px 20px',
          borderRadius: 14,
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <span style={{ color: 'var(--green)', marginTop: 2, flexShrink: 0 }}>
          <Icon name="shield" size={18} />
        </span>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--text)', display: 'inline', fontWeight: 600 }}>
            {isYo ? 'Àkíyèsí Ààbò Ṣàyẹ̀wò: ' : 'Screening Notice: '}
          </strong>
          {result.disclaimer ||
            (isYo
              ? 'Àbájáde àyẹ̀wò ìmọ̀ ẹ̀rọ nìkan ni èyí; kì í ṣe àyẹ̀wò àrídájú lórí oko. Máa kan sí àwọn agbóṣẹ́ àgbẹ̀ agbègbè rẹ kí o tó lo oògùn ètò ìtọ́jú.'
              : 'CropScan AI provides automated preliminary screening assistance, not a laboratory-confirmed agricultural diagnosis. Always confirm disease symptoms with your local agricultural extension service or certified agronomist before initiating significant chemical or pesticide interventions.')}
        </p>
      </div>

      {/* Prominent Action Bar */}
      <div
        className="card-actions between"
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Button variant="ghost" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="camera" onClick={onScanAnother}>
          {isYo ? 'Ṣàyẹ̀wò Àwòrán Mìíràn' : 'Analyze Another Image'}
        </Button>
      </div>
    </section>
  );
}
