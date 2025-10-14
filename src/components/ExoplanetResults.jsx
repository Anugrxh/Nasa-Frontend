import { useMemo, useEffect, useState } from "react";
import { SimplePieChart, SimpleBarChart, SimpleSHAPChart } from './SimpleCharts';
import "./ExoplanetResults.css";

const ExoplanetResults = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Add data validation to prevent rendering issues
  if (!data) {
    return (
      <div className="results-container">
        <div className="error-message">
          <p>No data available to display results.</p>
        </div>
      </div>
    );
  }

  const getPredictionStatus = (prediction) => {
    if (prediction === "FALSE POSITIVE" || prediction === "False Positive") {
      return {
        text: "Not an Exoplanet",
        emoji: "❌",
        color: "#ef4444",
        description: "This object is likely a false positive detection",
      };
    } else if (
      prediction === "CANDIDATE" ||
      prediction === "Planetary Candidate"
    ) {
      return {
        text: "Planetary Candidate",
        emoji: "🔍",
        color: "#f59e0b",
        description:
          "This is an identified planetary candidate awaiting confirmation",
      };
    } else {
      return {
        text: "Confirmed Exoplanet",
        emoji: "✅",
        color: "#10b981",
        description: "This is a confirmed exoplanet",
      };
    }
  };

  const status = getPredictionStatus(data.prediction);

  const getHabitableZoneColor = (zoneStatus) => {
    switch (zoneStatus) {
      case "Habitable Zone":
        return "#10b981"; // Green for habitable
      case "Too Hot":
        return "#ef4444"; // Red for too hot
      case "Too Cold":
        return "#3b82f6"; // Blue for too cold
      default:
        return "#94a3b8"; // Gray for unknown
    }
  };

  const getHabitableZoneClass = (zoneStatus) => {
    switch (zoneStatus) {
      case "Habitable Zone":
        return "habitable";
      case "Too Hot":
        return "too-hot";
      case "Too Cold":
        return "too-cold";
      default:
        return "";
    }
  };

  const getConfidenceClass = (confidence) => {
    const conf = parseFloat(confidence) || 0;
    if (conf >= 80) return "high-confidence";
    if (conf >= 60) return "medium-confidence";
    return "low-confidence";
  };

  const getStarType = (color) => {
    if (!color) return "G-type (Sun-like)";

    const colorLower = color.toLowerCase();

    // Map colors to star types
    if (colorLower.includes('blue') || colorLower === '#0000ff' || colorLower === '#4169e1') {
      return "O/B-type (Hot Blue)";
    } else if (colorLower.includes('white') || colorLower === '#ffffff' || colorLower === '#f5f5f5') {
      return "A-type (White)";
    } else if (colorLower.includes('yellow') || colorLower === '#ffff00' || colorLower === '#ffd700') {
      return "G-type (Sun-like)";
    } else if (colorLower.includes('orange') || colorLower === '#ffa500' || colorLower === '#ff8c00') {
      return "K-type (Orange)";
    } else if (colorLower.includes('red') || colorLower === '#ff0000' || colorLower === '#dc143c') {
      return "M-type (Red Dwarf)";
    } else {
      // Try to determine by hex color
      const hex = color.replace('#', '');
      if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        if (b > r && b > g) return "O/B-type (Hot Blue)";
        if (r > 200 && g > 200 && b > 200) return "A-type (White)";
        if (r > 200 && g > 150 && b < 100) return "K-type (Orange)";
        if (r > 150 && g < 100 && b < 100) return "M-type (Red Dwarf)";
        if (r > 200 && g > 200 && b < 150) return "G-type (Sun-like)";
      }

      return "Unknown Type";
    }
  };

  const confidenceData = useMemo(() => {
    const confidence = parseFloat(data.confidence) || 0;
    return [
      { name: "Confidence", value: confidence },
      { name: "Uncertainty", value: 100 - confidence },
    ];
  }, [data.confidence]);

  const visualizationData = useMemo(() => {
    if (!data.visualization_data) return null;

    return [
      {
        parameter: "Orbital Distance",
        value: data.visualization_data.orbital_distance || 0,
        unit: "million km",
      },
      {
        parameter: "Planet Size",
        value: data.visualization_data.planet_size || 0,
        unit: "Earth radii",
      },
    ];
  }, [data.visualization_data]);

  const habitableZoneData = useMemo(
    () => [
      {
        zone: "Too Cold",
        value: data.habitable_zone_status === "Too Cold" ? 100 : 0,
      },
      {
        zone: "Habitable",
        value: data.habitable_zone_status === "Habitable Zone" ? 100 : 0,
      },
      {
        zone: "Too Hot",
        value: data.habitable_zone_status === "Too Hot" ? 100 : 0,
      },
    ],
    [data.habitable_zone_status]
  );

  const COLORS = ["#10b981", "#94a3b8"];
  const ZONE_COLORS = ["#3b82f6", "#10b981", "#ef4444"];

  // Ensure visibility and handle animation fallbacks
  useEffect(() => {
    // Make elements visible immediately, then add animations
    setIsVisible(true);

    // Fallback to ensure all elements become visible
    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('.slide-up, [class*="slide-up-delay"]');
      animatedElements.forEach(element => {
        if (element.style.opacity === '0' || window.getComputedStyle(element).opacity === '0') {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
      });
    }, 1500); // Fallback after 1.5 seconds

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className={`results-container ${isVisible ? 'visible' : ''}`}>
      <div className={`results-header ${isVisible ? 'slide-up' : 'no-animation'}`}>
        <h2>Analysis Results</h2>
      </div>

      <div className={`status-card ${isVisible ? 'slide-up-delay-1' : 'no-animation'}`} style={{ borderColor: status.color }}>
        <div className="status-emoji">{status.emoji}</div>
        <h3 style={{ color: status.color }}>{status.text}</h3>
        <p>{status.description}</p>
        <div className={`confidence-badge ${getConfidenceClass(data.confidence)}`}>
          Confidence: <strong>{data.confidence}</strong>
        </div>
      </div>

      {data.comparison_data && (
        <div className="comparison-card slide-up-delay-2">
          <h3>🌟 Similar Known Exoplanet</h3>
          <div className="comparison-content">
            <h4>{data.comparison_data.name}</h4>
            <p className="comparison-description">
              {data.comparison_data.description}
            </p>
            <p className="comparison-text">{data.comparison_data.text}</p>
          </div>
        </div>
      )}

      {data.explanation_data && data.explanation_data.top_features && data.explanation_data.top_features.length > 0 && (
        <div className="explanation-card slide-up-delay-3">
          <h3>🧠 Model Explanation</h3>
          <p className="explanation-subtitle">
            Understanding why the model classified this as: <strong>{data.explanation_data.predicted_class}</strong>
          </p>

          <div className="features-explanation">
            <h4>Key Contributing Features</h4>

            {/* SHAP Values Chart */}
            <div className="shap-chart-container">
              <SimpleSHAPChart features={data.explanation_data.top_features} />
            </div>


          </div>

          <div className="explanation-summary">
            <div className="summary-icon">🔍</div>
            <div className="summary-text">
              <h4>SHAP Analysis Summary</h4>
              <p>
                The model's decision is based on the combined influence of these features.
                Positive contributions support the "{data.explanation_data.predicted_class}" classification,
                while negative contributions work against it.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="charts-grid slide-up-delay-4">
        <div className="chart-card">
          <h3>Confidence Level</h3>
          <SimplePieChart data={confidenceData} colors={COLORS} />
        </div>

        <div className="chart-card">
          <h3>Habitable Zone Status</h3>
          <SimpleBarChart data={habitableZoneData} colors={ZONE_COLORS} />
          <div className={`zone-status ${getHabitableZoneClass(data.habitable_zone_status)}`}>
            Current Status:{" "}
            <strong style={{ color: getHabitableZoneColor(data.habitable_zone_status) }}>
              {data.habitable_zone_status}
            </strong>
          </div>
        </div>

        {data.visualization_data && (
          <div className="chart-card full-width">
            <h3>Physical Parameters</h3>
            <div className="planet-visualization">
              <div className="star-planet-system">
                {/* Star */}
                <div
                  className="star dynamic-star"
                  style={{
                    '--star-color': data.visualization_data.star_color || "#FFD700",
                    background: `radial-gradient(circle, ${data.visualization_data.star_color || "#FFD700"}, ${data.visualization_data.star_color || "#FFD700"}dd)`,
                    boxShadow: `0 0 40px ${data.visualization_data.star_color || "#FFD700"}80, 0 0 80px ${data.visualization_data.star_color || "#FFD700"}40`,
                  }}
                >
                  <div
                    className="star-glow"
                    style={{
                      background: `radial-gradient(circle, ${data.visualization_data.star_color || "#FFD700"}30, transparent)`,
                    }}
                  ></div>
                  <span className="star-label">⭐ Host Star</span>
                </div>

                {/* Orbital path */}
                <div className="orbital-path"></div>

                {/* Planet */}
                <div
                  className="exoplanet"
                  style={{
                    width: `${Math.max(
                      30,
                      Math.min(120, data.visualization_data.planet_size * 60)
                    )}px`,
                    height: `${Math.max(
                      30,
                      Math.min(120, data.visualization_data.planet_size * 60)
                    )}px`,
                    left: `${Math.min(
                      70,
                      30 + data.visualization_data.orbital_distance / 10
                    )}%`,
                  }}
                >
                  <div className="planet-surface"></div>
                  <div className="planet-atmosphere"></div>
                  <span className="planet-label">🪐 Exoplanet</span>
                </div>
              </div>

              {/* Info display */}
              <div className="planet-info">
                <div className="info-item">
                  <span className="info-label">Orbital Distance:</span>
                  <span className="info-value">
                    {data.visualization_data.orbital_distance?.toFixed(2)}{" "}
                    million km
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Planet Size:</span>
                  <span className="info-value">
                    {data.visualization_data.planet_size?.toFixed(2)} Earth
                    radii
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Star Type:</span>
                  <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: data.visualization_data.star_color || "#FFD700",
                        boxShadow: `0 0 8px ${data.visualization_data.star_color || "#FFD700"}80`,
                      }}
                    ></div>
                    {getStarType(data.visualization_data.star_color)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {data.plot_url && (
        <div className="visualization-card slide-up-delay-5">
          <h3>System Visualization</h3>
          <div className="plot-container">
            <img
              src={`data:image/png;base64,${data.plot_url}`}
              alt="Exoplanet System Visualization"
              className="plot-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExoplanetResults;
