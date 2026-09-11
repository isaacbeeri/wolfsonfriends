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
    // Add .nojekyll to prevent Jekyll processing on GitHub Pages
    const fs = await import('fs');
    const path = await import('path');
    fs.writeFileSync(path.join('dist', '.nojekyll'), '');
    fs.copyFileSync(path.join('dist', 'index.html'), path.join('dist', '404.html'));
    console.log('Added .nojekyll and 404.html for GitHub Pages SPA compatibility.');
    console.log('Production build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
