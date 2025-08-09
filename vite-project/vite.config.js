import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Tell SWC to explicitly enable the JSX parser
      parserPlugins: ['jsx'],
    }),
  ],
  test: {
    globals: true, // makes describe, it, expect a  vailable globally
    environment: 'jsdom', // makes it possible to use DOM APIs
    setupFiles: './vitest.setup.js',
    coverage: {
      enabled: true, // This enables coverage collection, equivalent to `check-coverage`
      provider: 'v8', // Recommended for performance, but you can also use 'istanbul'
      include: ['src/main/**'],
      thresholds: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100,
      },
      reporter: [
        'html',
        'text-summary',
      ],
    },
  },
  resolve: {
    alias: {
      "main": path.resolve(__dirname, "./src/main"),
      "fixtures": path.resolve(__dirname, "./src/fixtures"),
      "tests": path.resolve(__dirname, "./src/tests"),
    }
  },
  server: {
    port: 3000,
  },

});