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
    coverage: {
      enabled: true, // This enables coverage collection, equivalent to `check-coverage`
      provider: 'v8', // Recommended for performance, but you can also use 'istanbul'
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
    }
  },
  server: {
    port: 3000,
  }
});