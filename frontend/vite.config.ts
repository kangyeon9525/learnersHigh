import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        // 백엔드 기동 전/다운 시 ECONNREFUSED 스택을 쏟지 않고 깔끔한 503으로 응답한다.
        // (프론트 API 호출은 실패 시 fixture로 폴백)
        configure: (proxy) => {
          let warned = false;
          proxy.on('error', (err, _req, res) => {
            const serverRes = res as import('node:http').ServerResponse | undefined;
            if (!warned) {
              console.warn(
                `[vite] 백엔드(127.0.0.1:4000) 연결 대기 중 — ${err.message}. 준비되면 자동 복구됩니다.`,
              );
              warned = true;
            }
            if (serverRes && 'writeHead' in serverRes && !serverRes.headersSent) {
              serverRes.writeHead(503, { 'Content-Type': 'application/json' });
              serverRes.end(JSON.stringify({ error: 'backend_unavailable' }));
            }
          });
        },
      },
    },
  },
});
