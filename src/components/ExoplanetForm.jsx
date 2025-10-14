import { useState, useMemo } from 'react'
import './ExoplanetForm.css'

// Default values as constants to avoid recreation
const DEFAULT_VALUES = {
  koi_period: 365.0,
  koi_prad: 1.0,
  koi_steff: 5778,
  koi_duration: 10.0,
  koi_depth: 1000,
  koi_insol: 1.0,
  koi_srad: 1.0,
  koi_score: 0.95,
  koi_fpflag_nt: 1,
  koi_fpflag_ss: 0,
  koi_fpflag_co: 0,
  koi_teq: 288,
  koi_model_snr: 12.5
};

const ExoplanetForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState(DEFAULT_VALUES)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Keep the value as string while typing to allow decimal input
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert all values to numbers before submitting
    const numericData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]) || 0
      return acc
    }, {})
    onSubmit(numericData)
  }

  // Memoize fields array to prevent recreation on every render
  const fields = useMemo(() => [
    { name: 'koi_period', label: 'Orbital Period (days)', min: 0, step: 'any' },
    { name: 'koi_prad', label: 'Planet Radius (Earth radii)', min: 0, step: 'any' },
    { name: 'koi_steff', label: 'Stellar Effective Temp (K)', min: 0, step: 'any' },
    { name: 'koi_duration', label: 'Transit Duration (hours)', min: 0, step: 'any' },
    { name: 'koi_depth', label: 'Transit Depth (ppm)', min: 0, step: 'any' },
    { name: 'koi_insol', label: 'Insolation Flux (Earth flux)', min: 0, step: 'any' },
    { name: 'koi_srad', label: 'Stellar Radius (Solar radii)', min: 0, step: 'any' },
    { name: 'koi_score', label: 'Disposition Score', min: 0, max: 1, step: 'any' },
    { name: 'koi_fpflag_nt', label: 'Not Transit-Like Flag', min: 0, max: 1, step: 1 },
    { name: 'koi_fpflag_ss', label: 'Stellar Eclipse Flag', min: 0, max: 1, step: 1 },
    { name: 'koi_fpflag_co', label: 'Centroid Offset Flag', min: 0, max: 1, step: 1 },
    { name: 'koi_teq', label: 'Equilibrium Temp (K)', min: 0, step: 'any' },
    { name: 'koi_model_snr', label: 'Transit Signal-to-Noise', min: 0, step: 'any' }
  ], [])

  return (
    <div className="exoplanet-form-container">
      <h2 className="slide-up">Enter Kepler Object Parameters</h2>
      <form onSubmit={handleSubmit} className="exoplanet-form">
        <div className="form-grid slide-up-delay-1">
          {fields.map((field, index) => (
            <div key={field.name} className={`form-field slide-up-delay-${Math.min(5, Math.floor(index / 3) + 2)}`}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" className="submit-btn slide-up-delay-5" disabled={loading}>
          {loading ? '🔄 Analyzing...' : '🚀 Analyze Exoplanet'}
        </button>
      </form>
    </div>
  )
}

export default ExoplanetForm
