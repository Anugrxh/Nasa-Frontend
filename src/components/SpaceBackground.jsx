import './SpaceBackground.css'

const SpaceBackground = () => {
  return (
    <div className="space-background">
      {/* Stars */}
      <div className="stars-layer">
        {[...Array(50)].map((_, i) => (
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

      {/* Shooting Stars/Meteors */}
      <div className="meteors-layer">
        {[...Array(5)].map((_, i) => (
          <div
            key={`meteor-${i}`}
            className="meteor"
            style={{
              top: `${Math.random() * 60}%`,
              animationDelay: `${i * 4}s`
            }}
          />
        ))}
      </div>

      {/* Rockets */}
      <div className="rockets-layer">
        <div className="rocket rocket-1">🚀</div>
        <div className="rocket rocket-2">🛸</div>
        <div className="rocket rocket-3">🚀</div>
      </div>

      {/* Floating Planets */}
      <div className="planets-layer">
        <div className="planet planet-1">🪐</div>
        <div className="planet planet-2">🌍</div>
        <div className="planet planet-3">🌙</div>
      </div>

      {/* Satellites */}
      <div className="satellites-layer">
        <div className="satellite satellite-1">🛰️</div>
        <div className="satellite satellite-2">🛰️</div>
      </div>

      {/* Comets */}
      <div className="comets-layer">
        <div className="comet comet-1">☄️</div>
        <div className="comet comet-2">☄️</div>
      </div>

      {/* Nebula clouds */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="nebula nebula-3"></div>
    </div>
  )
}

export default SpaceBackground
