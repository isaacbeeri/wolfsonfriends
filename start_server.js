import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

async function start() {
  const server = await createServer({
    configFile: false,
    plugins: [react()],
    server: {
      port: 3000,
      host: true
    }
  });
  await server.listen();
  server.printUrls();
  console.log('Wolfson Friends Medical Center website is live!');
}

start().catch(console.error);
