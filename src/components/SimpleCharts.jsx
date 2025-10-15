import { useMemo } from 'react';
import './SimpleCharts.css';

// Simple chart components without external dependencies
export const SimplePieChart = ({ data, colors = ['#10b981', '#94a3b8'] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const segments = useMemo(() => {
    let currentAngle = 0;
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      
      return {
        ...item,
        percentage,
        angle,
        startAngle,
        color: colors[index % colors.length]
      };
    });
  }, [data, total, colors]);

  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="simple-pie-chart">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={createPath(100, 100, 80, segment.startAngle, segment.startAngle + segment.angle)}
            fill={segment.color}
            stroke="#1a1f3a"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="pie-legend">
        {segments.map((segment, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: segment.color }}
            ></div>
            <span>{segment.name}: {segment.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleBarChart = ({ data, colors = ['#3b82f6', '#10b981', '#ef4444'] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="simple-bar-chart">
      <div className="bars-container">
        {data.map((item, index) => (
          <div key={index} className="bar-group">
            <div className="bar-wrapper">
              <div 
                className="bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              >
                <div className="bar-value">{item.value}%</div>
              </div>
            </div>
            <div className="bar-label">{item.zone || item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleSHAPChart = ({ features }) => {
  const maxValue = Math.max(...features.map(f => Math.abs(f.value)));
  
  return (
    <div className="simple-shap-chart">
      <h4>Feature Importance Analysis</h4>
      
      {/* Mobile-optimized card layout */}
      <div className="shap-cards-mobile">
        {features.map((feature, index) => (
          <div key={index} className={`shap-card ${feature.contribution}`}>
            <div className="shap-card-header">
              <div className="feature-name-mobile">{feature.feature}</div>
              <div className={`impact-indicator ${feature.contribution}`}>
                {feature.contribution === 'positive' ? '↗️' : '↘️'}
              </div>
            </div>
            
            <div className="shap-card-body">
              <div className="contribution-text">
                {feature.contribution === 'positive' ? 'Supports' : 'Against'} Classification
              </div>
              
              <div className="shap-visual">
                <div className="shap-bar-mobile">
                  <div 
                    className={`shap-fill ${feature.contribution}`}
                    style={{ 
                      width: `${(Math.abs(feature.value) / maxValue) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="shap-value-mobile">{Math.abs(feature.value).toFixed(3)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop layout (hidden on mobile) */}
      <div className="shap-bars-desktop">
        {features.map((feature, index) => (
          <div key={index} className={`shap-item ${feature.contribution}`}>
            <div className="shap-label">
              <span className="feature-name">{feature.feature}</span>
              <span className={`contribution-badge ${feature.contribution}`}>
                {feature.contribution === 'positive' ? '↗️ Supports' : '↘️ Against'}
              </span>
            </div>
            <div className="shap-bar-container">
              <div 
                className={`shap-bar ${feature.contribution}`}
                style={{ 
                  width: `${(Math.abs(feature.value) / maxValue) * 100}%`
                }}
              >
                <span className="shap-value">{feature.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="shap-legend">
        <div className="legend-item">
          <div className="legend-color positive"></div>
          <span>Supports Classification</span>
        </div>
        <div className="legend-item">
          <div className="legend-color negative"></div>
          <span>Against Classification</span>
        </div>
      </div>
    </div>
  );
};