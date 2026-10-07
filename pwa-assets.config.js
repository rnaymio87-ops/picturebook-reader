// 앱 아이콘(public/icon.svg)으로 홈 화면용 PNG 아이콘들을 자동으로 만들어 주는 설정
import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: minimal2023Preset,
  images: ['public/icon.svg'],
})
