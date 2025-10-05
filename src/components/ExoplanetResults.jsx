import { useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './ExoplanetResults.css'

const ExoplanetResults = ({ data }) => {
  const getPredictionStatus = (prediction) => {
    if (prediction === 'FALSE POSITIVE' || prediction === 'False Positive') {
      return { text: 'Not an Exoplanet', emoji: '❌', color: '#ef4444', description: 'This object is likely a false positive detection' }
    } else if (prediction === 'CANDIDATE' || prediction === 'Planetary Candidate') {
      return { text: 'Planetary Candidate', emoji: '🔍', color: '#f59e0b', description: 'This is an identified planetary candidate awaiting confirmation' }
    } else {
      return { text: 'Confirmed Exoplanet', emoji: '✅', color: '#10b981', description: 'This is a confirmed exoplanet' }
    }
  }

  const status = getPredictionStatus(data.prediction)

  const confidenceData = useMemo(() => {
    const confidence = parseFloat(data.confidence) || 0
    return [
      { name: 'Confidence', value: confidence },
      { name: 'Uncertainty', value: 100 - confidence }
    ]
  }, [data.confidence])

  const visualizationData = useMemo(() => {
    if (!data.visualization_data) return null
    
    return [
      { parameter: 'Orbital Distance', value: data.visualization_data.orbital_distance || 0, unit: 'million km' },
      { parameter: 'Planet Size', value: data.visualization_data.planet_size || 0, unit: 'Earth radii' }
    ]
  }, [data.visualization_data])

  const habitableZoneData = useMemo(() => [
    { zone: 'Too Cold', value: data.habitable_zone_status === 'Too Cold' ? 100 : 0 },
    { zone: 'Habitable', value: data.habitable_zone_status === 'Habitable Zone' ? 100 : 0 },
    { zone: 'Too Hot', value: data.habitable_zone_status === 'Too Hot' ? 100 : 0 }
  ], [data.habitable_zone_status])

  const COLORS = ['#10b981', '#94a3b8']
  const ZONE_COLORS = ['#3b82f6', '#10b981', '#ef4444']

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Analysis Results</h2>
      </div>

      <div className="status-card" style={{ borderColor: status.color }}>
        <div className="status-emoji">{status.emoji}</div>
        <h3 style={{ color: status.color }}>{status.text}</h3>
        <p>{status.description}</p>
        <div className="confidence-badge">
          Confidence: <strong>{data.confidence}</strong>
        </div>
      </div>

      {data.comparison_data && (
        <div className="comparison-card">
          <h3>🌟 Similar Known Exoplanet</h3>
          <div className="comparison-content">
            <h4>{data.comparison_data.name}</h4>
            <p className="comparison-description">{data.comparison_data.description}</p>
            <p className="comparison-text">{data.comparison_data.text}</p>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="zone" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip 
                contentStyle={{ background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.2)' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {habitableZoneData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ZONE_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="zone-status">
            Current Status: <strong style={{ color: status.color }}>{data.habitable_zone_status}</strong>
          </div>
        </div>

        {visualizationData && (
          <div className="chart-card full-width">
            <h3>Physical Parameters</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visualizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#cbd5e0" />
                <YAxis dataKey="parameter" type="category" stroke="#cbd5e0" width={150} />
                <Tooltip 
                  contentStyle={{ background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.2)' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value, name, props) => [`${value.toFixed(2)} ${props.payload.unit}`, 'Value']}
                />
                <Bar dataKey="value" fill="#667eea" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
  )
}

export default ExoplanetResults
