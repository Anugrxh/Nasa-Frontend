import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./ExoplanetResults.css";

const ExoplanetResults = ({ data }) => {
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

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Analysis Results</h2>
      </div>

      <div className="status-card" style={{ borderColor: status.color }}>
        <div className="status-emoji">{status.emoji}</div>
        <h3 style={{ color: status.color }}>{status.text}</h3>
        <p>{status.description}</p>
        <div className={`confidence-badge ${getConfidenceClass(data.confidence)}`}>
          Confidence: <strong>{data.confidence}</strong>
        </div>
      </div>

      {data.comparison_data && (
        <div className="comparison-card">
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
        <div className="explanation-card">
          <h3>🧠 Model Explanation</h3>
          <p className="explanation-subtitle">
            Understanding why the model classified this as: <strong>{data.explanation_data.predicted_class}</strong>
          </p>

          <div className="features-explanation">
            <h4>Key Contributing Features</h4>

            {/* SHAP Values Chart */}
            <div className="shap-chart-container">
              <h5 className="chart-title">Feature Importance Analysis</h5>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data.explanation_data.top_features.map((feature, index) => {
                    // Ensure minimum bar visibility by scaling values
                    const scaledValue = Math.max(Math.abs(feature.value), 0.5);
                    return {
                      name: feature.feature.replace('Koi ', '').replace('_', ' '),
                      value: scaledValue,
                      originalValue: feature.value,
                      contribution: feature.contribution,
                      fullName: feature.feature,
                      displayValue: feature.contribution === 'positive' ? scaledValue : -scaledValue
                    };
                  })}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis
                    dataKey="name"
                    stroke="#e2e8f0"
                    tick={{ fill: '#e2e8f0', fontSize: 11, angle: -45, textAnchor: 'end' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    height={60}
                  />
                  <YAxis
                    stroke="#e2e8f0"
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    domain={[0, 'dataMax + 0.5']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
                    }}
                    formatter={(value, name, props) => [
                      `Value: ${props.payload.originalValue}`,
                      `${props.payload.contribution === 'positive' ? '✅ Supports' : '❌ Against'} Classification`
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                    labelStyle={{ color: '#4a90e2', fontWeight: 'bold' }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                    minPointSize={10}
                    fill="#8884d8"
                  >
                    <LabelList
                      dataKey="originalValue"
                      position="top"
                      style={{
                        fill: '#e2e8f0',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                      formatter={(value) => `${value}`}
                    />
                    {data.explanation_data.top_features.map((feature, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={feature.contribution === 'positive'
                          ? '#10b981'
                          : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>

              <div className="shap-legend">
                <div className="legend-item">
                  <div className="legend-color legend-positive"></div>
                  <span>Supports Classification</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-negative"></div>
                  <span>Against Classification</span>
                </div>
              </div>
            </div>

            <div className="features-list">
              {data.explanation_data.top_features.map((feature, index) => (
                <div key={index} className={`feature-item ${feature.contribution}`}>
                  <div className="feature-header">
                    <span className="feature-name">{feature.feature}</span>
                    <span className={`contribution-badge ${feature.contribution}`}>
                      {feature.contribution === 'positive' ? '↗️ Supports' : '↘️ Against'}
                    </span>
                  </div>
                  <div className="feature-details">
                    <span className="feature-value">Value: {feature.value}</span>
                    <div className="feature-bar">
                      <div
                        className={`feature-bar-fill ${feature.contribution}`}
                        style={{
                          width: `${Math.abs(feature.value) * 10}%`,
                          maxWidth: '100%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
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

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Confidence Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {confidenceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Habitable Zone Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habitableZoneData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="zone" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                contentStyle={{
                  background: "#1a1f3a",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {habitableZoneData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ZONE_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
        <div className="visualization-card">
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
