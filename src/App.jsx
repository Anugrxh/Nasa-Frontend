import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations();
  }, []);

  return (
    <Router>
      <div className="app">
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
