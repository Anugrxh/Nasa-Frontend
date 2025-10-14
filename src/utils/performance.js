// Performance monitoring utilities
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if device can handle heavy animations
export const getDeviceCapability = () => {
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 2;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return {
    cores,
    memory,
    isMobile,
    isHighPerformance: cores >= 4 && memory >= 4 && !isMobile,
    isMediumPerformance: cores >= 2 && memory >= 2,
    isLowPerformance: cores < 2 || memory < 2 || isMobile
  };
};

// Preload critical resources
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Optimize images for performance
export const optimizeImage = (src, width, height) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/webp', 0.8));
    };
    img.src = src;
  });
};

// Track page load performance
export const trackPageLoad = (pageName) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      console.log(`${pageName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          page_name: pageName,
          load_time: Math.round(loadTime)
        });
      }
      
      return loadTime;
    }
  };
};

// Prediction page specific optimizations
export const optimizePredictionPage = () => {
  const capability = getDeviceCapability();
  
  return {
    shouldUseHeavyAnimations: capability.isHighPerformance,
    shouldPreloadCharts: capability.isMediumPerformance || capability.isHighPerformance,
    shouldUseWebGL: capability.isHighPerformance && !capability.isMobile,
    maxConcurrentRequests: capability.isHighPerformance ? 6 : capability.isMediumPerformance ? 4 : 2,
    animationDuration: capability.isLowPerformance ? 0.3 : 0.6
  };
};

// API request optimization
export const createOptimizedFetch = () => {
  const requestQueue = [];
  let activeRequests = 0;
  const maxConcurrent = optimizePredictionPage().maxConcurrentRequests;
  
  const processQueue = () => {
    if (requestQueue.length === 0 || activeRequests >= maxConcurrent) {
      return;
    }
    
    const { url, options, resolve, reject } = requestQueue.shift();
    activeRequests++;
    
    fetch(url, options)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeRequests--;
        processQueue();
      });
  };
  
  return (url, options = {}) => {
    return new Promise((resolve, reject) => {
      requestQueue.push({ url, options, resolve, reject });
      processQueue();
    });
  };
};