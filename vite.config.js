// vite.config.js 
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load .env files from the project root.
    // process.cwd() ensures Vite looks for .env files in the root of your project.
    // The third argument '' ensures all variables are loaded, not just those prefixed with VITE_.
    const env = loadEnv(mode, process.cwd(), '');

    return {
      define: {
        // This is the crucial part for fixing "process is not defined".
        // It replaces every instance of `process.env.API_KEY` in your client-side code
        // with the actual string value of `env.GEMINI_API_KEY` from your .env file.
        // JSON.stringify is important to ensure the value is correctly embedded as a string.
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),

        // If you had other environment variables to expose, you'd add them here:
        // 'process.env.ANOTHER_VARIABLE': JSON.stringify(env.ANOTHER_VARIABLE_FROM_DOTENV),
      },
      resolve: {
        alias: {
          // This allows you to use '@/' as an alias for your project's root directory.
          // Useful for cleaner import paths, e.g., import Something from '@/components/Something';
          '@': path.resolve(__dirname, '.'),
        }
      },
      plugins: [react()],
      // This is important if you are loading @google/genai from a CDN URL
      // directly in your ContentGenerationPage.tsx, as it tells Vite not to
      // try and bundle it from node_modules (where it might not be installed).
      optimizeDeps: {
        exclude: ['@google/genai']
      },
      // Optional: Server configuration
      // server: {
      //   port: 3000, // Example: set a specific port
      //   open: true, // Example: open browser on start
      // }
    };
});