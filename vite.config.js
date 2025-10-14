import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          
          // Heavy component chunks (lazy loaded)
          'charts': ['./src/components/SimpleCharts.jsx', './src/components/LazyCharts.jsx'],
          'results': ['./src/components/ExoplanetResults.jsx', './src/components/ExoplanetResultsLite.jsx'],
          'effects': ['./src/components/AnimatedBackground.jsx', './src/components/LightRays.jsx'],
          
          // Prediction page essentials
          'prediction-core': [
            './src/components/PredictionPage.jsx',
            './src/components/ExoplanetForm.jsx',
            './src/components/MetricsDisplay.jsx'
          ],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Enable code splitting
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['recharts', 'framer-motion', 'ogl', 'es-toolkit']
  },
  
  // Server configuration for development
  server: {
    hmr: {
      overlay: false
    }
  }
});
