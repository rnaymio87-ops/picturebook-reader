import { useState } from 'react'
import AddBook from './add-book/AddBook.jsx'
import Library from './library/Library.jsx'
import { getBook } from './library/libraryStore.js'
import Reader from './reader/Reader.jsx'
import './App.css'

// 화면 이동: 첫 화면 / 내 책장 / 새 책 만들기 / 읽기
function App() {
  const [screen, setScreen] = useState({ name: 'home' })
  const goHome = () => setScreen({ name: 'home' })
  const goLibrary = () => setScreen({ name: 'library' })

  if (screen.name === 'reader') {
    const book = getBook(screen.bookId)
    if (book) return <Reader key={book.id} book={book} onBack={goLibrary} />
  }

  if (screen.name === 'library') {
    return (
      <Library
        onBack={goHome}
        onOpen={(bookId) => setScreen({ name: 'reader', bookId })}
        onAdd={() => setScreen({ name: 'add' })}
      />
    )
  }

  if (screen.name === 'add') {
    return <AddBook onBack={goHome} onCreated={(book) => setScreen({ name: 'reader', bookId: book.id })} />
  }

  return (
    <main className="home">
      <header className="home-header">
        <img src="/icon.svg" alt="" className="home-logo" />
        <h1>그림책 읽기</h1>
        <p className="home-hello">Let&apos;s read together!</p>
      </header>

      <nav className="home-buttons">
        <button className="big-button yellow" onClick={goLibrary}>
          <span className="big-button-emoji">📚</span>
          내 책장
        </button>
        <button className="big-button pink" onClick={() => setScreen({ name: 'add' })}>
          <span className="big-button-emoji">📷</span>
          새 책 추가
        </button>
      </nav>

      <p className="app-version">버전 {__APP_VERSION__}</p>
    </main>
  )
}

export default App
