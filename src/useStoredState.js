import { useState } from 'react'

// useState와 같지만, 값을 이 기기에 기억해 둠 (앱을 껐다 켜도 유지)
// 저장이 막힌 환경(사생활 보호 모드 등)에서는 그냥 이번에만 적용
export function useStoredState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? defaultValue : JSON.parse(saved)
    } catch {
      return defaultValue
    }
  })

  function update(next) {
    setValue(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // 저장 실패해도 화면에는 적용됨
    }
  }

  return [value, update]
}
