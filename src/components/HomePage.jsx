import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';
import AnimatedBackground from './AnimatedBackground';
import BlurText from './BlurText';
import SplashCursor from './SplashCursor';
import LightRays from './LightRays';
import './HomePage.css';

const HomePage = () => {
    const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [factsRef, factsInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [keplerRef, keplerInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [ctaRef, ctaInView] = useInView({ threshold: 0.3, triggerOnce: true });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    // React Spring animations
    const floatingAnimation = useSpring({
        from: { transform: 'translateY(0px)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-10px)' });
                await next({ transform: 'translateY(0px)' });
            }
        },
        config: { duration: 2000 }
    });

    const pulseAnimation = useSpring({
        from: { scale: 1 },
        to: async (next) => {
            while (true) {
                await next({ scale: 1.05 });
                await next({ scale: 1 });
            }
        },
        config: { duration: 1500 }
    });

    return (
        <motion.div
            className="home-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <LightRays
                raysOrigin="top-center"
                raysColor="#4a90e2"
                raysSpeed={0.8}
                lightSpread={2}
                rayLength={1.5}
                pulsating={true}
                fadeDistance={0.8}
                saturation={0.7}
                followMouse={true}
                mouseInfluence={0.15}
                noiseAmount={0.1}
                distortion={0.2}
            />
            <SplashCursor
                DENSITY_DISSIPATION={1.8}
                VELOCITY_DISSIPATION={1.2}
                SPLAT_RADIUS={0.25}
                SPLAT_FORCE={8000}
                COLOR_UPDATE_SPEED={12}
                SHADING={true}
            />
            <AnimatedBackground />
            <motion.header
                className="hero-section"
                ref={heroRef}
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div className="hero-content">
                    <motion.div variants={itemVariants}>
                        <BlurText
                            text="Discover Exoplanets"
                            delay={150}
                            className="hero-title"
                            animateBy="words"
                        />
                    </motion.div>
                    <motion.p
                        className="hero-subtitle"
                        variants={itemVariants}
                    >
                        Journey into the cosmos and learn about planets beyond our solar system
                    </motion.p>
                </div>
            </motion.header>

            <main className="home-content">
                <motion.section
                    className="intro-section"
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants}>What are Exoplanets?</motion.h2>
                    <motion.p variants={itemVariants}>
                        Exoplanets, also called extrasolar planets, are planets that orbit stars outside our solar system.
                        Think of them as distant worlds that might be similar to Earth, Mars, or Jupiter, but they circle
                        other stars instead of our Sun.
                    </motion.p>
                </motion.section>

                <motion.section
                    className="facts-grid"
                    ref={factsRef}
                    initial="hidden"
                    animate={factsInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.div className="fact-card" variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }}>
                        <animated.div className="fact-icon" style={pulseAnimation}>🔭</animated.div>
                        <h3>How We Find Them</h3>
                        <p>
                            Scientists use space telescopes like Kepler and TESS to detect tiny dips in starlight
                            when a planet passes in front of its star - like a mini eclipse!
                        </p>
                    </motion.div>

                    <motion.div className="fact-card" variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }}>
                        <animated.div className="fact-icon" style={pulseAnimation}>📊</animated.div>
                        <h3>By the Numbers</h3>
                        <p>
                            Over 5,000 exoplanets have been confirmed so far, with thousands more candidates
                            waiting to be verified. New discoveries happen regularly!
                        </p>
                    </motion.div>

                    <motion.div className="fact-card" variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }}>
                        <animated.div className="fact-icon" style={pulseAnimation}>🌍</animated.div>
                        <h3>Types of Exoplanets</h3>
                        <p>
                            From scorching hot gas giants to potentially habitable rocky worlds, exoplanets
                            come in amazing varieties - some unlike anything in our solar system.
                        </p>
                    </motion.div>

                    <motion.div className="fact-card" variants={cardVariants} whileHover={{ scale: 1.05, y: -5 }}>
                        <animated.div className="fact-icon" style={pulseAnimation}>🔬</animated.div>
                        <h3>The Search for Life</h3>
                        <p>
                            Scientists look for planets in the "habitable zone" - not too hot, not too cold -
                            where liquid water could exist on the surface.
                        </p>
                    </motion.div>
                </motion.section>

                <motion.section
                    className="kepler-section"
                    ref={keplerRef}
                    initial="hidden"
                    animate={keplerInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants}>The Kepler Mission</motion.h2>
                    <div className="kepler-content">
                        <div className="kepler-text">
                            <motion.p variants={itemVariants}>
                                NASA's Kepler Space Telescope was a game-changer in exoplanet discovery.
                                Launched in 2009, it stared at over 150,000 stars simultaneously, looking
                                for the telltale dimming that occurs when a planet crosses in front of its star.
                            </motion.p>
                            <motion.p variants={itemVariants}>
                                Kepler discovered thousands of exoplanet candidates, revolutionizing our
                                understanding of how common planets are in our galaxy. The data it collected
                                continues to yield new discoveries even today!
                            </motion.p>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="cta-section"
                    ref={ctaRef}
                    initial="hidden"
                    animate={ctaInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants}>Ready to Explore?</motion.h2>
                    <motion.p variants={itemVariants}>
                        Use our prediction tool to analyze real Kepler mission data and help identify
                        potential exoplanets from the signals detected by the telescope.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/prediction" className="cta-button">
                                🚀 Start Predicting Exoplanets
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.section>
            </main>
        </motion.div>
    );
};

export default HomePage;