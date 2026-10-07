import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react'
import YouTubePlayer from '../player/YouTubePlayer.jsx'
import { useStoredState } from '../useStoredState.js'
import { findWordAt, sentenceOfWord, sentenceStartedBy } from './bookModel.js'
import { paginate } from './paginate.js'
import SettingsSheet from './SettingsSheet.jsx'
import './Reader.css'

// 읽기 화면: 소리에 맞춰 단어 형광펜, 문장을 누르면 그 부분부터 다시 듣기
function Reader({ book, onBack }) {
  const playerRef = useRef(null)
  const textRef = useRef(null)
  const measureRef = useRef(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [screens, setScreens] = useState(null) // 화면 페이지 목록 (paginate.js 참고)
  const [pageIndex, setPageIndex] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // 설정은 기기에 기억
  const [videoHidden, setVideoHidden] = useStoredState('reader.hideVideo', false)
  const [speed, setSpeed] = useStoredState('reader.speed', 1)
  const [textSize, setTextSize] = useStoredState('reader.textSize', 1)

  const wordIndex = findWordAt(book.words, time)
  const sentenceIndex = sentenceOfWord(book.sentences, wordIndex)

  // 글자 영역 크기·글씨 크기에 맞춰 화면 페이지 나누기 (바뀌면 다시)
  useLayoutEffect(() => {
    const textBox = textRef.current
    const measureBox = measureRef.current
    function measure() {
      const style = getComputedStyle(textBox)
      const lineHeight = parseFloat(style.lineHeight) || 48
      measureBox.style.width = textBox.clientWidth + 'px'
      // 끝까지 꽉 채우지 않고 한 줄 정도 여유를 둠
      setScreens(paginate(book, measureBox, textBox.clientHeight - lineHeight))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(textBox)
    window.addEventListener('resize', measure) // 아이패드 가로/세로 돌리기 등
    document.fonts.ready.then(measure) // 글꼴이 늦게 도착하면 글자 크기가 바뀌므로 다시
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [book, textSize])

  // 단어 번호 → 몇 번째 화면 페이지인지
  const screenOfWord = useMemo(() => {
    const map = new Array(book.words.length).fill(-1)
    screens?.forEach((sc, i) => sc.pieces.forEach((pc) => map.fill(i, pc.first, pc.last + 1)))
    return map
  }, [screens, book])

  // 재생 중에 읽는 단어가 다른 화면 페이지로 넘어가면 따라 넘김
  const liveScreen = wordIndex >= 0 ? screenOfWord[wordIndex] : -1
  const [followedScreen, setFollowedScreen] = useState(-1)
  if (playing && liveScreen >= 0 && liveScreen !== followedScreen) {
    setFollowedScreen(liveScreen)
    setPageIndex(liveScreen)
  }

  function playFromWord(wi) {
    playerRef.current?.seekTo(book.words[wi].start)
    playerRef.current?.play()
    // 멈춘 상태에서 다른 페이지 문장으로 이동해도 그 페이지를 보여줌
    const sc = screenOfWord[wi]
    if (sc >= 0) {
      setPageIndex(sc)
      setFollowedScreen(sc)
    }
  }

  function playSentence(i) {
    playFromWord(book.sentences[i].first)
  }

  // ⏮ 이전 문장: 지금 문장을 다 들은 뒤라면 그 문장을 다시, 듣는 중이면 그 앞 문장
  function prevSentence() {
    const cur = sentenceStartedBy(book, time)
    if (cur < 0) return playSentence(0)
    const curEnd = book.words[book.sentences[cur].last].end
    playSentence(time > curEnd + 0.3 ? cur : Math.max(0, cur - 1))
  }

  // ⏭ 다음 문장
  function nextSentence() {
    const cur = sentenceStartedBy(book, time)
    if (cur + 1 < book.sentences.length) playSentence(cur + 1)
  }

  const screen = screens?.[Math.min(pageIndex, screens.length - 1)]
  const isLast = screens ? pageIndex >= screens.length - 1 : true

  function goToPage(p) {
    setPageIndex(p)
    setFollowedScreen(p)
    // 재생 중이면 그 페이지 처음부터 이어서 듣기
    if (playing) playFromWord(screens[p].pieces[0].first)
  }

  function togglePlay() {
    if (playing) return playerRef.current?.pause()
    if (!screen) return
    // 멈춘 곳이 지금 페이지 안이면 이어서, 아니면 이 페이지 처음부터
    const startWord = screen.pieces[0].first
    const endWord = screen.pieces.at(-1).last
    if (time >= book.words[startWord].start && time <= book.words[endWord].end + 1) playerRef.current?.play()
    else playFromWord(startWord)
  }

  return (
    <main className="reader" style={{ '--text-scale': textSize }}>
      <div className="reader-top">
        <button className="corner-button back" onClick={onBack} aria-label="처음으로">
          ←
        </button>
        <div className="video-wrap">
          <YouTubePlayer
            ref={playerRef}
            videoId={book.videoId}
            onTime={setTime}
            onPlayingChange={setPlaying}
            playbackRate={speed}
          />
          {/* 영상만 가리는 덮개 (소리는 계속 나옴) */}
          {videoHidden && (
            <div className="video-cover" aria-hidden="true">
              <span className={playing ? 'bounce' : ''}>🎧</span>
            </div>
          )}
        </div>
        <button className="corner-button settings" onClick={() => setSettingsOpen(true)} aria-label="설정">
          ⚙️
        </button>
      </div>

      <section className="page-text" lang="en" ref={textRef}>
        {screen?.pieces.map((pc) => (
          <p
            key={`${pc.s}-${pc.first}`}
            className={'sentence' + (pc.s === sentenceIndex ? ' current' : '')}
            onClick={() => playFromWord(pc.first)}
          >
            {book.words.slice(pc.first, pc.last + 1).map((w, k) => {
              const wi = pc.first + k
              // 단어 뒤에 진짜 띄어쓰기를 넣어야 줄바꿈이 됨
              return (
                <Fragment key={wi}>
                  <span className={'word' + (wi === wordIndex ? ' lit' : '')}>{w.text}</span>{' '}
                </Fragment>
              )
            })}
          </p>
        ))}
      </section>
      {/* 페이지 나누기 계산용 보이지 않는 상자 */}
      <div className="page-text measure-box" lang="en" ref={measureRef} aria-hidden="true" />

      <nav className="reader-controls">
        <button className="step-button" onClick={prevSentence} aria-label="이전 문장">
          ⏮
        </button>
        <button className="play-button" onClick={togglePlay} aria-label={playing ? '멈춤' : '듣기'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="step-button" onClick={nextSentence} aria-label="다음 문장">
          ⏭
        </button>
      </nav>

      <nav className="page-bar">
        <button className="page-button" onClick={() => goToPage(pageIndex - 1)} disabled={pageIndex === 0} aria-label="이전 페이지">
          ◀
        </button>
        <span className="page-count">
          {screens ? `${pageIndex + 1} / ${screens.length}` : ''}
          {speed !== 1 && <span className="speed-badge">×{speed}</span>}
        </span>
        <button className="page-button" onClick={() => goToPage(pageIndex + 1)} disabled={isLast} aria-label="다음 페이지">
          ▶
        </button>
      </nav>

      {settingsOpen && (
        <SettingsSheet
          speed={speed}
          onSpeed={setSpeed}
          textSize={textSize}
          onTextSize={setTextSize}
          videoHidden={videoHidden}
          onVideoHidden={setVideoHidden}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  )
}

export default Reader
