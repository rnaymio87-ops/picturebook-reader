import { useRef, useState } from 'react'

const LONG_PRESS_MS = 1500
const DOUBLE_TAP_MS = 350

/**
 * 영상 위에 올리는 투명한 터치 판.
 * - 두 번 톡톡: onDoubleTap (영상 보이기/가리기)
 * - 1.5초 꾹 누르기: onLongPress (유튜브로 이동). 누르는 동안 원이 차오름
 * 아이가 실수로 유튜브 화면을 눌러 다른 영상으로 넘어가는 것도 막아 줌.
 */
function VideoTouchLayer({ onDoubleTap, onLongPress }) {
  const pressTimer = useRef(null)
  const lastTap = useRef(0)
  const longPressed = useRef(false)
  const [pressing, setPressing] = useState(false)

  function cancelPress() {
    clearTimeout(pressTimer.current)
    setPressing(false)
  }

  function handleDown() {
    longPressed.current = false
    setPressing(true)
    pressTimer.current = setTimeout(() => {
      longPressed.current = true
      setPressing(false)
      onLongPress()
    }, LONG_PRESS_MS)
  }

  function handleUp() {
    cancelPress()
    if (longPressed.current) return
    const now = Date.now()
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0
      onDoubleTap()
    } else {
      lastTap.current = now
    }
  }

  return (
    <div
      className="video-touch"
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      {pressing && (
        <svg className="press-ring" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="16" />
        </svg>
      )}
    </div>
  )
}

export default VideoTouchLayer
