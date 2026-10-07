import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// 버전 번호 = 만든 시각(한국 시간). 첫 화면에 작게 표시해서 휴대폰이 최신 버전인지 확인용
const buildTime = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date())

// https://vite.dev/config/
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(buildTime) },
  plugins: [
    react(),
    // PWA: 홈 화면에 추가하면 앱처럼 열리게 해 주는 설정
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // 등록은 src/main.jsx에서 직접 (업데이트 확인을 더 자주 하려고)
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
