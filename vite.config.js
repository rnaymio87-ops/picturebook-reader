import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA: 홈 화면에 추가하면 앱처럼 열리게 해 주는 설정
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        name: '그림책 읽기 도우미',
        short_name: '그림책',
        description: '영어 그림책 read aloud를 들으며 따라 읽기',
        lang: 'ko',
        theme_color: '#FFD84D',
        background_color: '#FFF9E8',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  // host: true → 같은 와이파이의 핸드폰에서도 PC 주소로 접속 가능
  server: { host: true },
})
