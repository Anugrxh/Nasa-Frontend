import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import "./App.css";
import Navigation from './components/Navigation';
import { initPerformanceOptimizations } from './utils/preloader';

// Lazy load pages to reduce initial bundle size
const HomePage = lazy(() => import('./components/HomePage'));
const PredictionPage = lazy(() => import('./components/PredictionPage'));

// Simple loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    color: '#888'
  }}>
    Loading...
  </div>
);

// ScrollToTop component to handle page navigation
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Detect if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Comprehensive scroll to top function
    const scrollToTop = () => {
      // Multiple methods to ensure scrolling works
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Try scrolling specific containers that might have scroll
      const scrollableElements = document.querySelectorAll('.app, .home-page, .prediction-page, .results-container');
      scrollableElements.forEach(element => {
        if (element) {
          element.scrollTop = 0;
        }
      });
      
      // Force scroll for mobile
      if (isMobile) {
        // Additional mobile-specific scroll methods
        if (window.pageYOffset !== 0) {
          window.scrollTo(0, 0);
        }
      } else {
        // Smooth scroll for desktop after instant scroll
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }, 50);
      }
    };

    // Immediate scroll
    scrollToTop();
    
    // Multiple delayed scrolls to handle different loading scenarios
    const timeouts = [
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 150),
      setTimeout(scrollToTop, 300),
      setTimeout(scrollToTop, 500)
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [location.pathname, location.key]); // Added location.key for better detection

  return null;
};

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations();
  }, []);

  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prediction" element={<PredictionPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
