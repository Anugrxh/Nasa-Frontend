import { useState, useEffect } from "react";
import "./MetricsDisplay.css";

const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "https://hunting-exoplanet-backend.onrender.com/metrics"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="metrics-container">
        <div className="metrics-loading">Loading model metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metrics-container">
        <div className="metrics-error">Unable to load metrics</div>
      </div>
    );
  }

  return (
    <div className="metrics-container">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-label">Accuracy</div>
            <div className="metric-value">
              {(metrics.accuracy * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <div className="metric-label">Candidate Recall</div>
            <div className="metric-value">
              {(metrics.candidate_recall * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Confirmed F1 Score</div>
            <div className="metric-value">
              {(metrics.confirmed_f1_score * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎲</div>
          <div className="metric-content">
            <div className="metric-label">False Positive Precision</div>
            <div className="metric-value">
              {(metrics.false_positive_precision * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
