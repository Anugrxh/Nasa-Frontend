import { useState, lazy, Suspense, useEffect } from 'react';
import { trackPageLoad, optimizePredictionPage } from '../utils/performance';
import './PredictionPage.css';

// Lazy load heavy components
const MetricsDisplay = lazy(() => import('./MetricsDisplay'));
const ExoplanetForm = lazy(() => import('./ExoplanetForm'));
const ExoplanetResults = lazy(() => import('./ExoplanetResults'));
const AnimatedBackground = lazy(() => import('./AnimatedBackground'));
const LightRays = lazy(() => import('./LightRays'));

// Lightweight loading components
const ComponentLoader = ({ text = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#888',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    margin: '1rem 0'
  }}>
    <div style={{ marginRight: '0.5rem' }}>⏳</div>
    {text}
  </div>
);

const PredictionPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Performance tracking
  useEffect(() => {
    const pageTracker = trackPageLoad('PredictionPage');
    
    // Cleanup and track when component unmounts or page changes
    return () => {
      pageTracker.end();
    };
  }, []);

  const handleAnalysis = async (formData) => {
    console.log('Form submitted with data:', formData);
    setLoading(true);
    setError(null);
    setAnalysisData(null); // Clear previous results

    try {
      console.log('Sending request to backend...');
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch("https://hunting-exoplanet-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      // Ensure we have the required data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      setAnalysisData(data);
      
      // Smooth scroll to results after a short delay
      setTimeout(() => {
        const resultsElement = document.querySelector('.results-wrapper');
        if (resultsElement) {
          resultsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#7b68ee"
          raysSpeed={1.2}
          lightSpread={1.5}
          rayLength={2.5}
          pulsating={false}
          fadeDistance={1.2}
          saturation={1.0}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.0}
          distortion={0.0}
          className="light-rays-clear"
        />
        <AnimatedBackground />
      </Suspense>
      
      <header className="prediction-header slide-up">
        <h1>Exoplanet Prediction System</h1>
        <p>Analyze planetary candidates using real Kepler mission data</p>
      </header>
      
      <div className="slide-up-delay-1">
        <Suspense fallback={<ComponentLoader text="Loading metrics..." />}>
          <MetricsDisplay />
        </Suspense>
      </div>
      
      <main className="prediction-main">
        <div className="slide-up-delay-2">
          <Suspense fallback={<ComponentLoader text="Loading form..." />}>
            <ExoplanetForm onSubmit={handleAnalysis} loading={loading} />
          </Suspense>
        </div>

        {loading && (
          <div className="slide-up-delay-3">
            <Suspense fallback={<ComponentLoader text="Loading analysis..." />}>
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>🔄 Analyzing exoplanet data...</p>
                <p className="loading-subtext">This may take a few moments</p>
              </div>
            </Suspense>
          </div>
        )}

        {error && (
          <div className="error-message slide-up-delay-3">
            <p>❌ Error: {error}</p>
            <p className="error-subtext">Please check your input values and try again</p>
          </div>
        )}

        {analysisData && !loading && (
          <div className="results-wrapper slide-up-delay-4">
            <Suspense fallback={<ComponentLoader text="Loading results..." />}>
              <ExoplanetResults data={analysisData} />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
};

export default PredictionPage;