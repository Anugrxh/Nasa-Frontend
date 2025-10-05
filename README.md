# 🌌 Exoplanet Analysis System

A modern web application for analyzing exoplanet candidates using Kepler mission data. This application connects to a machine learning API to predict whether a celestial object is a confirmed exoplanet, a planetary candidate, or a false positive.

## Features

- **Interactive Form**: Input 13 different Kepler Object of Interest (KOI) parameters
- **Real-time Analysis**: Connect to ML API for instant predictions
- **Visual Analytics**: Multiple charts and graphs including:
  - Confidence level pie chart
  - Habitable zone status bar chart
  - Physical parameters visualization
  - System visualization from API
- **Classification System**:
  - ✅ **Confirmed Exoplanet**: Verified exoplanet detection
  - 🔍 **Planetary Candidate**: Identified candidate awaiting confirmation
  - ❌ **False Positive**: Not an actual exoplanet

## API Integration

The application connects to: `http://127.0.0.1:5000/predict`

### Request Format

```json
{
  "koi_period": 365.0,
  "koi_prad": 1.0,
  "koi_steff": 5778,
  "koi_duration": 10.0,
  "koi_depth": 1000,
  "koi_insol": 1.0,
  "koi_srad": 1.0,
  "koi_score": 0.95,
  "koi_fpflag_nt": 1,
  "koi_fpflag_ss": 0,
  "koi_fpflag_co": 0,
  "koi_teq": 288,
  "koi_model_snr": 12.5
}
```

### Response Format

```json
{
  "prediction": "Confirmed Exoplanet",
  "confidence": "55.00%",
  "habitable_zone_status": "Habitable Zone",
  "comparison_data": {
    "name": "Kepler-186f",
    "description": "The first Earth-sized planet...",
    "text": "Its orbital period of 365.0 days..."
  },
  "visualization_data": {
    "orbital_distance": 152.5392434157764,
    "planet_size": 1.0,
    "star_color": "#FFD700"
  },
  "plot_url": "base64_encoded_image"
}
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Technologies Used

- **React 19** - UI framework
- **Recharts** - Data visualization library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with glassmorphism effects

## Parameters Explained

- **Orbital Period**: Time for one complete orbit around the star (days)
- **Planet Radius**: Size relative to Earth
- **Stellar Effective Temperature**: Temperature of the host star (Kelvin)
- **Transit Duration**: How long the planet blocks the star's light (hours)
- **Transit Depth**: Amount of light blocked during transit (parts per million)
- **Insolation Flux**: Amount of stellar energy received (relative to Earth)
- **Stellar Radius**: Size of the host star (relative to Sun)
- **Disposition Score**: Confidence score from Kepler pipeline (0-1)
- **False Positive Flags**: Various flags indicating potential false positives
- **Equilibrium Temperature**: Estimated planet temperature (Kelvin)
- **Transit Signal-to-Noise**: Quality of the detection signal


