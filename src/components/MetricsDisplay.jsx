import { useState, useEffect } from "react";
import "./MetricsDisplay.css";

// Cache metrics data to avoid repeated API calls
let metricsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Check if we have valid cached data
        const now = Date.now();
        if (metricsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
          setMetrics(metricsCache);
          setLoading(false);
          return;
        }

        // Show cached data immediately while fetching new data
        if (metricsCache) {
          setMetrics(metricsCache);
          setLoading(false);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(
          "https://hunting-exoplanet-backend.onrender.com/metrics",
          { 
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=300' // 5 minutes browser cache
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        
        const data = await response.json();
        
        // Update cache
        metricsCache = data;
        cacheTimestamp = now;
        
        setMetrics(data);
      } catch (err) {
        // If we have cached data and there's a network error, use cached data
        if (metricsCache && err.name === 'AbortError') {
          setMetrics(metricsCache);
        } else {
          setError(err.message);
        }
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
        <div className="metric-card slide-up">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-label">Accuracy</div>
            <div className="metric-value">
              {(metrics.accuracy * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-1">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <div className="metric-label">Candidate Recall</div>
            <div className="metric-value">
              {(metrics.candidate_recall * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-2">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Confirmed F1 Score</div>
            <div className="metric-value">
              {(metrics.confirmed_f1_score * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-3">
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
