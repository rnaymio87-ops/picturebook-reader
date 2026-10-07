import { useRef, useState } from 'react'
import YouTubePlayer from '../player/YouTubePlayer.jsx'
import './PlayerTest.css'

// 2단계 연습 화면: 유튜브 소리 재생 + 지금 몇 초인지 표시
const TEST_VIDEO_ID = 'Mc9My7TnxFU' // Brown Bear, Brown Bear, What Do You See?

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toFixed(1).padStart(4, '0')
  return `${m}:${s}`
}

function PlayerTest({ onBack }) {
  const playerRef = useRef(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)

  return (
    <main className="player-test">
      <button className="back-button" onClick={onBack} aria-label="처음으로">
        ←
      </button>

      <YouTubePlayer
        ref={playerRef}
        videoId={TEST_VIDEO_ID}
        onTime={setTime}
        onPlayingChange={setPlaying}
      />

      <p className="time-display">{formatTime(time)}</p>

      <div className="control-row">
        <button className="round-button" onClick={() => playerRef.current?.seekTo(Math.max(0, time - 5))}>
          ⏪
        </button>
        <button
          className="round-button main"
          onClick={() => (playing ? playerRef.current?.pause() : playerRef.current?.play())}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button className="round-button" onClick={() => playerRef.current?.seekTo(time + 5)}>
          ⏩
        </button>
      </div>
    </main>
  )
}

export default PlayerTest
