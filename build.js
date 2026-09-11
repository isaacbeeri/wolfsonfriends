import { build } from 'vite';
import react from '@vitejs/plugin-react';

async function runBuild() {
  try {
    console.log('Building Wolfson Friends Medical Center website for production...');
    await build({
      configFile: false,
      plugins: [react()],
      base: './',
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        sourcemap: false,
        chunkSizeWarningLimit: 1500
      }
    });
    console.log('Production build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
