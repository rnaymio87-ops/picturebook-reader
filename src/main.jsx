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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
