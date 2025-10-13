import React, { useState } from 'react';
import MetricsDisplay from './MetricsDisplay';
import ExoplanetForm from './ExoplanetForm';
import ExoplanetResults from './ExoplanetResults';
import AnimatedBackground from './AnimatedBackground';
import LightRays from './LightRays';
import './PredictionPage.css';

const PredictionPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (formData) => {
    console.log('Form submitted with data:', formData);
    setLoading(true);
    setError(null);
    setAnalysisData(null); // Clear previous results

    try {
      console.log('Sending request to backend...');
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch("https://hunting-exoplanet-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
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
      <header className="prediction-header">
        <h1>Exoplanet Prediction System</h1>
        <p>Analyze planetary candidates using real Kepler mission data</p>
      </header>
      
      <MetricsDisplay />
      
      <main className="prediction-main">
        <ExoplanetForm onSubmit={handleAnalysis} loading={loading} />

        {loading && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>🔄 Analyzing exoplanet data...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
            <p className="error-subtext">Please check your input values and try again</p>
          </div>
        )}

        {analysisData && !loading && (
          <>
            {/* Debug info - remove in production */}
            <div style={{ 
              background: 'rgba(0,0,0,0.5)', 
              padding: '1rem', 
              margin: '1rem', 
              borderRadius: '8px',
              fontSize: '12px',
              color: '#ccc'
            }}>
              <details>
                <summary>Debug: Response Data</summary>
                <pre>{JSON.stringify(analysisData, null, 2)}</pre>
              </details>
            </div>
            <ExoplanetResults data={analysisData} />
          </>
        )}
      </main>
    </div>
  );
};

export default PredictionPage;