import { useEffect, useRef, useState } from 'react'
import './VideoLab.css'

// 임시 "영상 테스트" 화면: 아이폰 가로 화면에서 영상이 잘리는 문제를 고칠 방법 고르기용.
// 같은 영상을 서로 다른 방법으로 5개 띄워서, 어떤 방법이 안 잘리는지 눈으로 비교.
// (문제 해결 후 지울 화면)
const VIDEO_ID = 'Mc9My7TnxFU'
const EMBED = `https://www.youtube.com/embed/${VIDEO_ID}?playsinline=1&rel=0`

const VARIANTS = [
  { key: 'A', label: 'A 그대로', note: '보정 없음' },
  { key: 'B', label: 'B 여백보정', note: '여백만큼 넓힘' },
  { key: 'C', label: 'C 모서리X', note: '둥근 모서리·자르기 없음' },
  { key: 'D', label: 'D 액자', note: '한 번 더 감싸기' },
  { key: 'E', label: 'E 레이어', note: '따로 그리기' },
]

function useSafeAreaInsets() {
  const probe = useRef(null)
  const [insets, setInsets] = useState('')
  useEffect(() => {
    function read() {
      const s = getComputedStyle(probe.current)
      setInsets(
        `왼${parseFloat(s.paddingLeft)} 오${parseFloat(s.paddingRight)} 위${parseFloat(s.paddingTop)} 아래${parseFloat(s.paddingBottom)} · 화면 ${innerWidth}×${innerHeight}`,
      )
    }
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])
  return [probe, insets]
}

function VideoLab({ onBack }) {
  const [probe, insets] = useSafeAreaInsets()

  return (
    <main className="lab">
      <div ref={probe} className="lab-probe" />
      <header className="lab-header">
        <button onClick={onBack}>← 처음으로</button>
        <span>카메라 여백: {insets}</span>
      </header>
      <p className="lab-help">폰을 가로로 돌리고, 영상을 하나씩 눌러 재생한 뒤 화면 사진을 보내주세요.</p>
      <div className="lab-grid">
        {VARIANTS.map((v) => (
          <figure key={v.key} className={`lab-cell lab-${v.key}`}>
            <div className="lab-box">
              {v.key === 'D' ? (
                <iframe src={`/yt-frame.html?v=${VIDEO_ID}`} title={v.label} />
              ) : (
                <iframe src={EMBED} title={v.label} allow="autoplay; encrypted-media; picture-in-picture" />
              )}
            </div>
            <figcaption>
              <b>{v.label}</b> {v.note}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}

export default VideoLab
