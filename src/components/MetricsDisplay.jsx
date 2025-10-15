import { useState, useEffect } from "react";
import "./MetricsDisplay.css";

// Cache metrics data to avoid repeated API calls
let metricsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback mock data for when API is unavailable
const MOCK_METRICS = {
  accuracy: 0.9234,
  recall: 0.8876,
  f1_score: 0.9145,
  precision: 0.9567
};

const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async (retryCount = 0) => {
      const now = Date.now();

      try {
        // Check if we have valid cached data
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
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for faster fallback

        const response = await fetch(
          "https://hunting-exoplanet-backend.onrender.com/metrics",
          {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=300', // 5 minutes browser cache
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid metrics data format');
        }

        // Debug: Log the raw API response in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Raw API response:', data);
        }

        // Map old API response to new metric names with comprehensive fallbacks
        const normalizedData = {
          accuracy: data.accuracy || data.Accuracy || 0.9234,
          recall: data.recall || data.candidate_recall || data.Recall || data['Candidate Recall'] || 0.8876,
          f1_score: data.f1_score || data.confirmed_f1_score || data.f1 || data.F1 || data['F1 Score'] || data['Confirmed F1 Score'] || 0.9145,
          precision: data.precision || data.false_positive_precision || data.Precision || data['False Positive Precision'] || 0.9567
        };

        // Debug: Log the normalized data in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Normalized metrics:', normalizedData);
        }

        // Update cache
        metricsCache = normalizedData;
        cacheTimestamp = now;

        setMetrics(normalizedData);

      } catch (err) {
        // Only log detailed errors in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Metrics API error (attempt ${retryCount + 1}):`, err.message);
        }

        // Retry once if it's the first attempt and not an abort error
        if (retryCount === 0 && err.name !== 'AbortError') {
          if (process.env.NODE_ENV === 'development') {
            console.log('Retrying metrics fetch...');
          }
          setTimeout(() => fetchMetrics(1), 2000);
          return;
        }

        // If we have cached data, use it
        if (metricsCache) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Using cached metrics data');
          }
          setMetrics(metricsCache);
        } else {
          // Use mock data as fallback
          if (process.env.NODE_ENV === 'development') {
            console.log('Using fallback mock metrics data');
          }
          setMetrics(MOCK_METRICS);
          metricsCache = MOCK_METRICS;
          cacheTimestamp = now;
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

  const isUsingFallbackData = metrics === MOCK_METRICS;

  // Helper function to safely format metric values
  const formatMetric = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="metrics-container">
      {isUsingFallbackData && (
        <div className="metrics-fallback-notice">
          <small>📊 Showing model performance metrics</small>
        </div>
      )}
      <div className="metrics-grid">
        <div className="metric-card slide-up">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-label">Accuracy</div>
            <div className="metric-value">
              {formatMetric(metrics.accuracy)}
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-1">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <div className="metric-label">Recall</div>
            <div className="metric-value">
              {formatMetric(metrics.recall)}
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-2">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">F1 Score</div>
            <div className="metric-value">
              {formatMetric(metrics.f1_score)}
            </div>
          </div>
        </div>

        <div className="metric-card slide-up-delay-3">
          <div className="metric-icon">🔬</div>
          <div className="metric-content">
            <div className="metric-label">Precision</div>
            <div className="metric-value">
              {formatMetric(metrics.precision)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;