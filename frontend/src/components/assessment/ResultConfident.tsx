import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { AssessmentResult } from '@/types/assessment';

interface ResultConfidentProps {
  result: AssessmentResult;
  previewUrl: string;
  crop: Crop;
  onScanAnother: () => void;
  onDashboard: () => void;
}

export function ResultConfident({
  result,
  previewUrl,
  crop,
  onScanAnother,
  onDashboard,
}: ResultConfidentProps) {
  const confidence = result.confidenceScore;
  const label = result.predictedCondition || 'Early Blight';

  return (
    <section className="result-page">
      <div className="result-heading">
        <div>
          <span className="success-badge">
            <Icon name="check" size={15} /> Assessment complete
          </span>
          <h1>Assessment Results</h1>
          <p>Review the computer vision model output and extension guidance carefully.</p>
        </div>
        <Button variant="outline" onClick={onScanAnother}>
          Scan Another Leaf
        </Button>
      </div>

      <div className="result-grid">
        <div className="result-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Assessed plant leaf" />
          <span>Uploaded leaf · {crop}</span>
        </div>

        <div className="prediction-card">
          <span className="ai-label">
            <Icon name="spark" size={15} /> AI assessment
          </span>
          <small>Predicted condition</small>
          <h2>{label}</h2>
          <div className="confidence">
            <div>
              <span>Model confidence</span>
              <strong>{confidence.toFixed(1)}%</strong>
            </div>
            <div className="confidence-track">
              <i style={{ width: `${Math.min(confidence, 100)}%` }} />
            </div>
            <p>Confidence reflects statistical model similarity, not 100% diagnostic certainty.</p>
          </div>
        </div>
      </div>

      <div className="guidance-grid">
        <article className="guidance-card">
          <span className="panel-icon">
            <Icon name="book" size={20} />
          </span>
          <h3>Available Guidance & Symptoms</h3>
          <p>
            {result.guidance?.description ||
              'Concentric dark rings and yellow halos visible on lower leaves. Spreads rapidly in warm, humid weather.'}
          </p>
          {result.guidance?.recommendations && result.guidance.recommendations.length > 0 && (
            <ul>
              {result.guidance.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </article>

        <article className="guidance-card">
          <span className="panel-icon">
            <Icon name="shield" size={20} />
          </span>
          <h3>Recommended Field Steps</h3>
          <p>
            Prune affected bottom leaves to improve canopy airflow. Avoid overhead sprinkler irrigation on foliage, and consult an extension officer before applying registered copper fungicides.
          </p>
        </article>
      </div>

      <div className="responsible-note">
        <Icon name="info" size={18} />
        <p>
          This is an AI-assisted screening result, not a confirmed agricultural diagnosis. Verify the result with a local agronomy extension professional before large-scale chemical applications.
        </p>
      </div>

      <div className="card-actions between">
        <Button variant="ghost" onClick={onDashboard}>
          Back to Dashboard
        </Button>
        <Button onClick={onScanAnother}>
          Scan Another Leaf
        </Button>
      </div>
    </section>
  );
}
