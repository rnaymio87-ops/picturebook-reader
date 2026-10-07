import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// 새 버전이 올라오면 자동으로 받아서 새로고침.
// 아이폰 홈 화면 앱은 껐다 켜도 예전 버전을 계속 보여줄 때가 많아서,
// 앱이 화면에 다시 나타날 때마다 새 버전이 있는지 확인함.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') registration.update()
    })
  },
})

// 실제로 보이는 화면 높이를 재서 CSS 변수 --app-h로 알려줌.
// 아이폰 홈 화면 앱에서는 CSS의 100dvh가 실제보다 크게 나와서 화면 아래가 잘릴 때가 있음.
function updateAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-h', `${Math.round(h)}px`)
}
updateAppHeight()
window.addEventListener('resize', updateAppHeight)
window.visualViewport?.addEventListener('resize', updateAppHeight)
window.addEventListener('orientationchange', () => {
  // 돌린 직후엔 크기가 아직 안 바뀌었을 수 있어서 조금 뒤에 한 번 더
  setTimeout(() => {
    updateAppHeight()
    window.scrollTo(0, 0)
  }, 300)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
