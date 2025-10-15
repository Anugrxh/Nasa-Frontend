import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { getDeviceCapability } from '../utils/performance';
import './HomePage.css';

// Lazy load components
const BlurText = lazy(() => import('./BlurText'));
const LightSplashCursor = lazy(() => import('./LightSplashCursor'));
const LightRays = lazy(() => import('./LightRays'));
const HeavySplashCursor = lazy(() => import('./SplashCursor'));

// Simplified - remove intersection observers that might cause double loading

const HomePage = () => {
    // Detect device capability
    const deviceCapability = getDeviceCapability();
    const shouldLoadHeavyComponents = deviceCapability.isHighPerformance || deviceCapability.isMediumPerformance;



    // Simple CSS-based pulse animation (no react-spring needed)
    const pulseStyle = {
        animation: 'pulse 1.5s ease-in-out infinite'
    };

    // Render with or without animations based on device capability
    const renderContent = () => (
        <>
            <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />}>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#4a90e2"
                    raysSpeed={deviceCapability.isMobile ? 0.6 : 0.8}
                    lightSpread={deviceCapability.isMobile ? 3.0 : 2.5}
                    rayLength={deviceCapability.isMobile ? 2.5 : 2.0}
                    pulsating={true}
                    fadeDistance={deviceCapability.isMobile ? 1.5 : 1.2}
                    saturation={deviceCapability.isMobile ? 1.2 : 1.0}
                    followMouse={!deviceCapability.isMobile}
                    mouseInfluence={deviceCapability.isMobile ? 0 : 0.15}
                    noiseAmount={0.1}
                    distortion={0.2}
                />
                {!deviceCapability.isMobile && shouldLoadHeavyComponents && HeavySplashCursor ? (
                    <HeavySplashCursor
                        DENSITY_DISSIPATION={1.5}
                        VELOCITY_DISSIPATION={1.0}
                        SPLAT_RADIUS={0.3}
                        SPLAT_FORCE={6000}
                        COLOR_UPDATE_SPEED={10}
                        SHADING={true}
                    />
                ) : !deviceCapability.isMobile ? (
                    <LightSplashCursor />
                ) : null}
            </Suspense>

            <header className="hero-section slide-up">
                <div className="hero-content">
                    <div className="slide-up-delay-1">
                        <Suspense fallback={<h1 className="hero-title">Discover Exoplanets</h1>}>
                            <BlurText
                                text="Discover Exoplanets"
                                delay={150}
                                className="hero-title"
                                animateBy="words"
                            />
                        </Suspense>
                    </div>
                    <p className="hero-subtitle slide-up-delay-2">
                        Journey into the cosmos and learn about planets beyond our solar system
                    </p>
                </div>
            </header>

            <main className="home-content">
                <section className="intro-section slide-up-delay-3">
                    <h2>What are Exoplanets?</h2>
                    <p>
                        Exoplanets, also called extrasolar planets, are planets that orbit stars outside our solar system.
                        Think of them as distant worlds that might be similar to Earth, Mars, or Jupiter, but they circle
                        other stars instead of our Sun.
                    </p>
                </section>

                <section className="facts-grid">
                    <div className="fact-card slide-up-delay-4">
                        <div className="fact-icon" style={pulseStyle}>🔭</div>
                        <h3>How We Find Them</h3>
                        <p>
                            Scientists use space telescopes like Kepler and TESS to detect tiny dips in starlight
                            when a planet passes in front of its star - like a mini eclipse!
                        </p>
                    </div>

                    <div className="fact-card slide-up-delay-5">
                        <div className="fact-icon" style={pulseStyle}>📊</div>
                        <h3>By the Numbers</h3>
                        <p>
                            Over 5,000 exoplanets have been confirmed so far, with thousands more candidates
                            waiting to be verified. New discoveries happen regularly!
                        </p>
                    </div>

                    <div className="fact-card slide-up-delay-6">
                        <div className="fact-icon" style={pulseStyle}>🌍</div>
                        <h3>Types of Exoplanets</h3>
                        <p>
                            From scorching hot gas giants to potentially habitable rocky worlds, exoplanets
                            come in amazing varieties - some unlike anything in our solar system.
                        </p>
                    </div>

                    <div className="fact-card slide-up-delay-7">
                        <div className="fact-icon" style={pulseStyle}>🔬</div>
                        <h3>The Search for Life</h3>
                        <p>
                            Scientists look for planets in the "habitable zone" - not too hot, not too cold -
                            where liquid water could exist on the surface.
                        </p>
                    </div>
                </section>

                <section className="kepler-section slide-up-delay-8">
                    <h2>The Kepler Mission</h2>
                    <div className="kepler-content">
                        <div className="kepler-text">
                            <p>
                                NASA's Kepler Space Telescope was a game-changer in exoplanet discovery.
                                Launched in 2009, it stared at over 150,000 stars simultaneously, looking
                                for the telltale dimming that occurs when a planet crosses in front of its star.
                            </p>
                            <p>
                                Kepler discovered thousands of exoplanet candidates, revolutionizing our
                                understanding of how common planets are in our galaxy. The data it collected
                                continues to yield new discoveries even today!
                            </p>
                        </div>
                    </div>
                </section>

                <section className="cta-section slide-up-delay-9">
                    <h2>Ready to Explore?</h2>
                    <p>
                        Use our prediction tool to analyze real Kepler mission data and help identify
                        potential exoplanets from the signals detected by the telescope.
                    </p>
                    <div>
                        <Link to="/prediction" className="cta-button">
                            🚀 Start Predicting Exoplanets
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );

    return <div className="home-page fade-in">{renderContent()}</div>;
};

export default HomePage;