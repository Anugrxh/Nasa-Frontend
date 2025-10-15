// Preload critical resources based on user interaction
export const preloadCriticalResources = () => {
  // Preload prediction page components immediately when user shows intent
  const preloadPredictionPage = () => {
    Promise.all([
      import('../components/PredictionPage.jsx'),
      import('../components/ExoplanetForm.jsx'),
      import('../components/MetricsDisplay.jsx'),
      import('../components/ExoplanetResults.jsx')
    ]).catch(err => console.log('Preload failed:', err));
  };

  // Preload charts and heavy components
  const preloadCharts = () => {
    Promise.all([
      import('../components/SimpleCharts.jsx'),
      import('../components/LazyCharts.jsx')
    ]).catch(err => console.log('Chart preload failed:', err));
  };

  // Preload background components for better UX
  const preloadBackgroundComponents = () => {
    Promise.all([
      import('../components/AnimatedBackground.jsx'),
      import('../components/LightRays.jsx')
    ]).catch(err => console.log('Background preload failed:', err));
  };

  // Set up preloading triggers
  const setupPreloading = () => {
    // Preload prediction page on navigation hover or touch
    const predictionLink = document.querySelector('a[href="/prediction"]');
    if (predictionLink) {
      predictionLink.addEventListener('mouseenter', preloadPredictionPage, { once: true });
      predictionLink.addEventListener('touchstart', preloadPredictionPage, { once: true });
    }

    // Preload charts when user interacts with any form element
    const setupFormPreloading = () => {
      const forms = document.querySelectorAll('form, input, select, button');
      forms.forEach(element => {
        element.addEventListener('focus', preloadCharts, { once: true });
        element.addEventListener('click', preloadCharts, { once: true });
      });
    };

    // Preload background components immediately for better perceived performance
    setTimeout(preloadBackgroundComponents, 500);

    // Setup form preloading after a short delay
    setTimeout(setupFormPreloading, 1000);

    // Aggressive preloading for high-performance devices
    if (navigator.hardwareConcurrency >= 4 && navigator.connection?.effectiveType !== 'slow-2g') {
      setTimeout(preloadPredictionPage, 2000);
    }
  };

  // Initialize preloading after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPreloading);
  } else {
    setupPreloading();
  }
};

// Resource hints for critical assets
export const addResourceHints = () => {
  const head = document.head;

  // Preconnect to external resources
  const preconnectLinks = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    head.appendChild(link);
  });

  // DNS prefetch for actual API endpoints
  const dnsPrefetchLinks = [
    'https://hunting-exoplanet-backend.onrender.com'
  ];

  dnsPrefetchLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    head.appendChild(link);
  });
};

// Initialize performance optimizations
let isInitialized = false;
export const initPerformanceOptimizations = () => {
  if (isInitialized) {
    return;
  }
  
  isInitialized = true;
  addResourceHints();
  preloadCriticalResources();
  
  // Enable passive event listeners for better scroll performance
  const enablePassiveListeners = () => {
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(event => {
      document.addEventListener(event, () => {}, { passive: true });
    });
  };

  enablePassiveListeners();
};