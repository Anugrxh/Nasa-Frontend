import { useState, lazy, Suspense } from 'react';
import './ExoplanetResults.css';

const ExoplanetResultsLite = ({ data }) => {
  const [showCharts, setShowCharts] = useState(false);

  const getPredictionStatus = (prediction) => {
    if (prediction === "FALSE POSITIVE" || prediction === "False Positive") {
      return {
        text: "Not an Exoplanet",
        emoji: "❌",
        color: "#ef4444",
        description: "This object is likely a false positive detection",
      };
    } else if (prediction === "CANDIDATE" || prediction === "Candidate") {
      return {
        text: "Potential Exoplanet",
        emoji: "🌟",
        color: "#f59e0b",
        description: "This object shows promising signs of being an exoplanet",
      };
    } else {
      return {
        text: "Confirmed Exoplanet",
        emoji: "🪐",
        color: "#10b981",
        description: "This object is confirmed to be an exoplanet",
      };
    }
  };

  const status = getPredictionStatus(data.prediction);

  const loadFullResults = async () => {
    setShowCharts(true);
    // Dynamically import the full results component
    const { default: ExoplanetResults } = await import('./ExoplanetResults');
    return ExoplanetResults;
  };

  if (showCharts) {
    // Lazy load the full component with charts
    const ExoplanetResults = lazy(() => import('./ExoplanetResults'));
    return (
      <Suspense fallback={<div>Loading charts...</div>}>
        <ExoplanetResults data={data} />
      </Suspense>
    );
  }

  return (
    <div className="results-container">
      <div className="prediction-result">
        <div className="result-header">
          <span className="result-emoji" style={{ fontSize: '3rem' }}>
            {status.emoji}
          </span>
          <h2 className="result-title" style={{ color: status.color }}>
            {status.text}
          </h2>
          <p className="result-description">{status.description}</p>
        </div>

        <div className="confidence-section">
          <h3>Prediction Confidence</h3>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ 
                width: `${data.confidence * 100}%`,
                backgroundColor: status.color 
              }}
            />
          </div>
          <span className="confidence-text">
            {(data.confidence * 100).toFixed(1)}% confident
          </span>
        </div>

        <div className="data-summary">
          <h3>Key Measurements</h3>
          <div className="measurement-grid">
            <div className="measurement-item">
              <span className="measurement-label">Period (days)</span>
              <span className="measurement-value">{data.koi_period?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Depth (ppm)</span>
              <span className="measurement-value">{data.koi_depth?.toFixed(0) || 'N/A'}</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Duration (hours)</span>
              <span className="measurement-value">{data.koi_duration?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Impact Parameter</span>
              <span className="measurement-value">{data.koi_impact?.toFixed(3) || 'N/A'}</span>
            </div>
          </div>
        </div>

        <button 
          className="load-charts-btn"
          onClick={loadFullResults}
          style={{
            padding: '12px 24px',
            background: 'rgba(74, 144, 226, 0.2)',
            border: '1px solid rgba(74, 144, 226, 0.4)',
            borderRadius: '8px',
            color: '#4a90e2',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'all 0.3s ease'
          }}
        >
          📊 Load Detailed Charts & Analysis
        </button>
      </div>
    </div>
  );
};

export default ExoplanetResultsLite;