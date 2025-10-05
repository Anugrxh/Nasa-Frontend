import './SpaceBackground.css'

const SpaceBackground = () => {
  return (
    <div className="space-background">
      {/* Stars - Static on mobile */}
      <div className="stars-layer">
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Shooting Stars - Desktop only */}
      <div className="meteors-layer desktop-only">
        {[...Array(3)].map((_, i) => (
          <div
            key={`meteor-${i}`}
            className="meteor"
            style={{
              top: `${20 + i * 20}%`,
              animationDelay: `${i * 5}s`
            }}
          />
        ))}
      </div>

      {/* Rockets - Desktop only */}
      <div className="rockets-layer desktop-only">
        <div className="rocket rocket-1">🚀</div>
        <div className="rocket rocket-2">🛸</div>
      </div>

      {/* Floating Planets - Minimal animation */}
      <div className="planets-layer">
        <div className="planet planet-1">🪐</div>
        <div className="planet planet-2">🌍</div>
      </div>

      {/* Nebula clouds - Static */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
    </div>
  )
}

export default SpaceBackground
