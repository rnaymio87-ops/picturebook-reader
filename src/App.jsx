import './App.css'

// 첫 화면: 지금은 뼈대만. 버튼들은 다음 단계에서 하나씩 살아납니다.
function App() {
  return (
    <main className="home">
      <header className="home-header">
        <img src="/icon.svg" alt="" className="home-logo" />
        <h1>그림책 읽기</h1>
        <p className="home-hello">Let&apos;s read together!</p>
      </header>

      <nav className="home-buttons">
        <button className="big-button yellow" disabled>
          <span className="big-button-emoji">📚</span>
          내 책장
        </button>
        <button className="big-button pink" disabled>
          <span className="big-button-emoji">📷</span>
          새 책 추가
        </button>
      </nav>

      <p className="home-note">준비 중이에요 (1단계 완료!)</p>
    </main>
  )
}

export default App
