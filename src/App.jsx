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
    
    // Scroll to top when route changes
    if (isMobile) {
      // Instant scroll for mobile for better performance
      window.scrollTo(0, 0);
    } else {
      // Smooth scroll for desktop
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

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
