// 책 데이터에서 "지금 이 시간에 어느 단어/문장/페이지인지" 찾는 도우미들
//
// 책 데이터 모양:
//   words:     [{ text, start, end }]            단어와 시간(초)
//   sentences: [{ first, last, ko, vocab }]      first~last = 이 문장에 속한 단어 번호
//   pages:     [[문장번호, 문장번호, ...], ...]

// 단어가 끝난 뒤에도 다음 단어가 나올 때까지 형광펜을 이만큼(초) 더 유지
const HOLD_AFTER_WORD = 0.8

/** time(초)에 읽고 있는 단어 번호. 없으면 -1 */
export function findWordAt(words, time) {
  // 이진 탐색: start <= time 인 마지막 단어
  let lo = 0
  let hi = words.length - 1
  let found = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (words[mid].start <= time) {
      found = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  if (found < 0) return -1
  return time <= words[found].end + HOLD_AFTER_WORD ? found : -1
}

/** 단어 번호 → 문장 번호 */
export function sentenceOfWord(sentences, wordIndex) {
  if (wordIndex < 0) return -1
  return sentences.findIndex((s) => s.first <= wordIndex && wordIndex <= s.last)
}

/** 문장 번호 → 페이지 번호 */
export function pageOfSentence(pages, sentenceIndex) {
  if (sentenceIndex < 0) return -1
  return pages.findIndex((p) => p.includes(sentenceIndex))
}

/** 문장이 시작하는 시간(초) */
export function sentenceStart(book, sentenceIndex) {
  return book.words[book.sentences[sentenceIndex].first].start
}
