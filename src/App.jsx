import { useState } from "react";
import "./App.css";
import MetricsDisplay from "./components/MetricsDisplay";
import ExoplanetForm from "./components/ExoplanetForm";
import ExoplanetResults from "./components/ExoplanetResults";

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://hunting-exoplanet-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌌 Exoplanet Analysis System</h1>
        <p>Analyze planetary candidates using Kepler mission data</p>
      </header>
      <MetricsDisplay />
      <main className="app-main">
        <ExoplanetForm onSubmit={handleAnalysis} loading={loading} />

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {analysisData && <ExoplanetResults data={analysisData} />}
      </main>
    </div>
  );
}

export default App;
