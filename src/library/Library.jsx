import { useState } from 'react'
import { BackIcon } from '../reader/icons.jsx'
import { deleteBook, listBooks } from './libraryStore.js'
import './Library.css'

// 📚 내 책장: 만든 책들을 표지(영상 썸네일)로 보여줌. 누르면 바로 읽기
function Library({ onBack, onOpen, onAdd }) {
  const [books, setBooks] = useState(listBooks)

  function remove(book) {
    if (!window.confirm(`"${book.title}" 책을 지울까요?`)) return
    deleteBook(book.id)
    setBooks(listBooks())
  }

  return (
    <main className="library">
      <header className="library-top">
        <button className="corner-button" onClick={onBack} aria-label="처음으로">
          <BackIcon />
        </button>
        <h1>내 책장</h1>
      </header>

      <div className="shelf">
        {books.map((book) => (
          <div key={book.id} className="shelf-book">
            <button className="shelf-open" onClick={() => onOpen(book.id)}>
              <img src={`https://i.ytimg.com/vi/${book.videoId}/mqdefault.jpg`} alt="" loading="lazy" />
              <span className="shelf-title">{book.title}</span>
            </button>
            {!book.sample && (
              <button className="shelf-delete" onClick={() => remove(book)} aria-label={`${book.title} 지우기`}>
                ✕
              </button>
            )}
          </div>
        ))}

        <button className="shelf-add" onClick={onAdd}>
          <span>＋</span>새 책 만들기
        </button>
      </div>
    </main>
  )
}

export default Library
