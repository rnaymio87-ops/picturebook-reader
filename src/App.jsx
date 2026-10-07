import { useState } from 'react'
import PlayerTest from './reader/PlayerTest.jsx'
import './App.css'

// 첫 화면. 버튼들은 단계마다 하나씩 살아납니다.
function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'player-test') {
    return <PlayerTest onBack={() => setScreen('home')} />
  }

  return (
    <main className="home">
      <header className="home-header">
        <img src="/icon.svg" alt="" className="home-logo" />
        <h1>그림책 읽기</h1>
        <p className="home-hello">Let&apos;s read together!</p>
      </header>

      <nav className="home-buttons">
        <button className="big-button blue" onClick={() => setScreen('player-test')}>
          <span className="big-button-emoji">🎧</span>
          연습 듣기
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
    </main>
  )
}

export default App
