import { Fragment, useRef, useState } from 'react'
import YouTubePlayer from '../player/YouTubePlayer.jsx'
import { findWordAt, pageOfSentence, sentenceOfWord, sentenceStart } from './bookModel.js'
import './Reader.css'

// 읽기 화면: 소리에 맞춰 단어 형광펜, 문장을 누르면 그 문장부터 다시 듣기
function Reader({ book, onBack }) {
  const playerRef = useRef(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)

  const wordIndex = findWordAt(book.words, time)
  const sentenceIndex = sentenceOfWord(book.sentences, wordIndex)

  // 재생 중에 읽는 문장이 다른 페이지로 넘어가면 페이지도 따라 넘김
  const livePage = pageOfSentence(book.pages, sentenceIndex)
  const [followedPage, setFollowedPage] = useState(-1)
  if (playing && livePage >= 0 && livePage !== followedPage) {
    setFollowedPage(livePage)
    setPageIndex(livePage)
  }

  function playFromSentence(i) {
    playerRef.current?.seekTo(sentenceStart(book, i))
    playerRef.current?.play()
  }

  function goToPage(p) {
    setPageIndex(p)
    setFollowedPage(p)
    // 재생 중이면 그 페이지 첫 문장부터 이어서 듣기
    if (playing) playFromSentence(book.pages[p][0])
  }

  const page = book.pages[pageIndex]
  const isLast = pageIndex === book.pages.length - 1

  function togglePlay() {
    if (playing) return playerRef.current?.pause()
    // 멈춘 곳이 지금 페이지 안이면 이어서, 아니면 이 페이지 처음부터
    const pageStart = sentenceStart(book, page[0])
    const pageEnd = book.words[book.sentences[page.at(-1)].last].end + 1
    if (time >= pageStart && time <= pageEnd) playerRef.current?.play()
    else playFromSentence(page[0])
  }

  return (
    <main className="reader">
      <div className="reader-top">
        <button className="back-button" onClick={onBack} aria-label="처음으로">
          ←
        </button>
        <YouTubePlayer ref={playerRef} videoId={book.videoId} onTime={setTime} onPlayingChange={setPlaying} />
      </div>

      <section className="page-text" lang="en">
        {page.map((si) => {
          const s = book.sentences[si]
          return (
            <p
              key={si}
              className={'sentence' + (si === sentenceIndex ? ' current' : '')}
              onClick={() => playFromSentence(si)}
            >
              {book.words.slice(s.first, s.last + 1).map((w, k) => {
                const wi = s.first + k
                // 단어 뒤에 진짜 띄어쓰기를 넣어야 줄바꿈이 됨
                return (
                  <Fragment key={wi}>
                    <span className={'word' + (wi === wordIndex ? ' lit' : '')}>{w.text}</span>{' '}
                  </Fragment>
                )
              })}
            </p>
          )
        })}
      </section>

      <nav className="reader-controls">
        <button className="nav-button" onClick={() => goToPage(pageIndex - 1)} disabled={pageIndex === 0} aria-label="이전 페이지">
          ◀
        </button>
        <button
          className="play-button"
          onClick={togglePlay}
          aria-label={playing ? '멈춤' : '듣기'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button className="nav-button" onClick={() => goToPage(pageIndex + 1)} disabled={isLast} aria-label="다음 페이지">
          ▶
        </button>
      </nav>
      <p className="page-count">
        {pageIndex + 1} / {book.pages.length}
      </p>
    </main>
  )
}

export default Reader
