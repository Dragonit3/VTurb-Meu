import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carregar .env da pasta raiz do projeto (um nível acima)
  const env = loadEnv(mode, '../', '');
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true
    },
    envDir: '../', // Especifica onde procurar os arquivos .env
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL || 'http://localhost:3001'),
      'process.env.PLAYER_URL': JSON.stringify(env.PLAYER_URL || 'http://localhost:3002'),
      'process.env.DASHBOARD_URL': JSON.stringify(env.DASHBOARD_URL || 'http://localhost:3000'),
    }
  };
}); 