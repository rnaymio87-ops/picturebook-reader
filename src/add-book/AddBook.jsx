import { useMemo, useState } from 'react'
import { extractVideoId } from '../captions/CaptionSource.js'
import { captionsFromPaste } from '../captions/pasteSource.js'
import { saveBook } from '../library/libraryStore.js'
import { buildBook } from '../processing/buildBook.js'
import { BackIcon } from '../reader/icons.jsx'
import './AddBook.css'

// 새 책 만들기 (지금은 "자막 붙여넣기" 방법)
// 9~10단계에서 "표지 사진 찍기 → 영상 고르기 → 자막 자동으로 받기"가 여기에 추가됨.
function AddBook({ onBack, onCreated }) {
  const [pasted, setPasted] = useState('')
  const [titleEdit, setTitleEdit] = useState(null) // null이면 자막에서 찾은 제목 사용
  const [urlEdit, setUrlEdit] = useState('')
  const [error, setError] = useState('')

  // 붙여넣는 즉시 영상·제목·줄 수를 알아냄
  const parsed = useMemo(() => (pasted.trim() ? captionsFromPaste(pasted) : null), [pasted])
  const videoId = parsed?.videoId || extractVideoId(urlEdit)
  const title = titleEdit ?? parsed?.title ?? ''

  async function pasteFromClipboard() {
    try {
      setPasted(await navigator.clipboard.readText())
    } catch {
      setError('붙여넣기 권한이 없어요. 아래 칸을 길게 눌러 "붙여넣기" 해주세요.')
    }
  }

  function create() {
    setError('')
    if (!parsed?.words.length) return setError('자막을 찾지 못했어요. Transcript YouTube에서 "Copy all text"로 복사한 글을 붙여넣어 주세요.')
    if (!videoId) return setError('유튜브 영상 주소를 찾지 못했어요. 아래 칸에 영상 주소를 넣어주세요.')
    try {
      const book = buildBook({ ...parsed, videoId, title: title.trim() })
      if (!saveBook(book)) return setError('이 기기에 저장 공간이 부족해서 저장하지 못했어요.')
      onCreated(book)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="add-book">
      <header className="add-top">
        <button className="corner-button" onClick={onBack} aria-label="처음으로">
          <BackIcon />
        </button>
        <h1>새 책 만들기</h1>
      </header>

      <section className="add-card">
        <h2>1. 자막 붙여넣기</h2>
        <p className="add-help">
          PC 크롬에서 유튜브 영상을 열고 <b>Transcript YouTube</b>의 <b>Copy all text</b>로 복사한 글을 붙여넣어요.
        </p>
        <button className="add-paste" onClick={pasteFromClipboard}>
          📋 복사한 글 붙여넣기
        </button>
        <textarea
          className="add-textarea"
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder={'여기를 길게 눌러 붙여넣어도 돼요\n\n(0:00) brown bear brown bear what do you see\n(0:12) I see a red bird looking at me'}
        />
        {parsed && (
          <p className="add-found">
            {parsed.lineCount ? `✅ 자막 ${parsed.lineCount}줄, 단어 ${parsed.words.length}개를 찾았어요` : '⚠️ 시간이 적힌 자막 줄을 찾지 못했어요'}
          </p>
        )}
      </section>

      <section className="add-card">
        <h2>2. 영상과 제목 확인</h2>
        {videoId ? (
          <img className="add-thumb" src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt="영상 미리보기" />
        ) : (
          <input
            className="add-input"
            value={urlEdit}
            onChange={(e) => setUrlEdit(e.target.value)}
            placeholder="유튜브 영상 주소 (자동으로 못 찾았을 때만)"
            inputMode="url"
          />
        )}
        <input className="add-input" value={title} onChange={(e) => setTitleEdit(e.target.value)} placeholder="책 제목" />
      </section>

      {error && <p className="add-error">{error}</p>}

      <button className="add-create" onClick={create} disabled={!parsed?.words.length}>
        📖 책 만들기
      </button>
    </main>
  )
}

export default AddBook
