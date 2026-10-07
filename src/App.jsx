import { useState } from 'react'
import Reader from './reader/Reader.jsx'
import sampleBook from './data/sample-brown-bear.json'
import VideoLab from './lab/VideoLab.jsx'
import './App.css'

// 첫 화면. 버튼들은 단계마다 하나씩 살아납니다.
function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'sample') {
    return <Reader book={sampleBook} onBack={() => setScreen('home')} />
  }

  if (screen === 'lab') {
    return <VideoLab onBack={() => setScreen('home')} />
  }

  return (
    <main className="home">
      <header className="home-header">
        <img src="/icon.svg" alt="" className="home-logo" />
        <h1>그림책 읽기</h1>
        <p className="home-hello">Let&apos;s read together!</p>
      </header>

      <nav className="home-buttons">
        <button className="big-button blue" onClick={() => setScreen('sample')}>
          <span className="big-button-emoji">🐻</span>
          Brown Bear 읽기
        </button>
        <button className="big-button yellow" disabled>
          <span className="big-button-emoji">📚</span>
          내 책장
        </button>
        <button className="big-button pink" disabled>
          <span className="big-button-emoji">📷</span>
          새 책 추가
        </button>
      </nav>

      {/* 임시: 아이폰 가로 영상 잘림 문제 해결용 테스트 화면 (해결 후 삭제) */}
      <button className="lab-link" onClick={() => setScreen('lab')}>
        🧪 영상 테스트
      </button>
      <p className="app-version">버전 {__APP_VERSION__}</p>
    </main>
  )
}

export default App
