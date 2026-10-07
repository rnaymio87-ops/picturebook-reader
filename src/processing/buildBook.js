// 자막(단어 + 시간) → 읽기 화면용 책 데이터 (문장, 페이지)
//
// 지금은 규칙으로 나눔. 6단계에서 Claude가 문장부호를 붙이고 다듬으면 더 정확해짐.
//  - 문장: 마침표·물음표·느낌표에서 나눔. 문장부호가 없는 자동자막이면 말이 잠깐 멈추는 곳에서 나눔
//  - 페이지: 말이 길게 멈추는 곳(책장을 넘기는 순간일 가능성이 큼)에서 나눔

// 마침표가 있어도 문장이 끝나지 않는 줄임말
const ABBREVIATIONS = new Set(['mr.', 'mrs.', 'ms.', 'dr.', 'jr.', 'sr.', 'st.', 'mt.', 'vs.', 'etc.'])

const SENTENCE_PAUSE = 0.6 // 문장부호가 없을 때 이만큼(초) 쉬면 문장이 끝난 것으로 봄
const MAX_SENTENCE_WORDS = 20 // 너무 긴 문장은 쉼표나 쉬는 곳에서 끊음
const PAGE_PAUSE = 1.8 // 이만큼 쉬면 책장을 넘긴 것으로 봄
const MAX_PAGE_SENTENCES = 4

const endsSentence = (w) => /[.!?]["')\]]*$/.test(w.text) && !ABBREVIATIONS.has(w.text.toLowerCase())
const pauseAfter = (words, i) => (i + 1 < words.length ? words[i + 1].start - words[i].end : Infinity)

function splitSentences(words) {
  const hasPunctuation = words.filter(endsSentence).length >= Math.max(2, words.length / 40)
  const sentences = []
  let first = 0
  for (let i = 0; i < words.length; i++) {
    const length = i - first + 1
    const pause = pauseAfter(words, i)
    const natural = hasPunctuation ? endsSentence(words[i]) : pause >= SENTENCE_PAUSE
    const tooLong = length >= MAX_SENTENCE_WORDS && (/,$/.test(words[i].text) || pause >= 0.3)
    if (natural || tooLong || i === words.length - 1) {
      sentences.push({ first, last: i })
      first = i + 1
    }
  }
  return sentences
}

function groupPages(words, sentences) {
  const pages = []
  let page = []
  sentences.forEach((s, i) => {
    page.push(i)
    const next = sentences[i + 1]
    const pause = next ? words[next.first].start - words[s.last].end : Infinity
    if (pause >= PAGE_PAUSE || page.length >= MAX_PAGE_SENTENCES) {
      pages.push(page)
      page = []
    }
  })
  if (page.length) pages.push(page)
  return pages
}

// 문장부호 없는 자동자막도 책처럼 보이게: 문장 첫 글자 대문자, "i" → "I"
function tidyWords(words, sentences) {
  const out = words.map((w) => ({ ...w, text: w.text === 'i' ? 'I' : w.text.replace(/^i'/, "I'") }))
  for (const s of sentences) {
    const w = out[s.first]
    w.text = w.text.charAt(0).toUpperCase() + w.text.slice(1)
  }
  return out
}

/** captions: CaptionSource 약속 모양 { videoId, title, words, timing } */
export function buildBook(captions, { author = '' } = {}) {
  const words = captions.words.filter((w) => w.text)
  if (!words.length) throw new Error('자막에서 읽을 글을 찾지 못했어요.')
  const sentences = splitSentences(words)
  return {
    id: `${captions.videoId || 'book'}-${Date.now().toString(36)}`,
    title: captions.title || '제목 없는 책',
    author,
    videoId: captions.videoId,
    timing: captions.timing,
    createdAt: new Date().toISOString(),
    words: tidyWords(words, sentences),
    sentences: sentences.map((s) => ({ ...s, ko: '', vocab: [] })),
    pages: groupPages(words, sentences),
  }
}
