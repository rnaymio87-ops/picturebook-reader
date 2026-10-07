// 자막 공급자 ①: 붙여넣기
// Transcript YouTube 확장의 "Copy all text" 결과를 읽음. 모양:
//
//   영상 제목 - YouTube
//   https://www.youtube.com/watch?v=영상ID
//
//   (0:00) brown bear brown bear what do you see
//   (0:12) I see a red bird looking at me
//
// 그 밖에 "0:00 텍스트", "[00:00] 텍스트", 시간 다음 줄에 텍스트, SRT/VTT 자막 파일도 읽을 수 있게 함.
import { extractVideoId } from './CaptionSource.js'

const TIME = String.raw`(\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?`

function toSeconds(stamp) {
  const parts = stamp.replace(',', '.').split(':').map(Number)
  return parts.reduce((sum, p) => sum * 60 + p, 0)
}

// "[Music]", "(applause)" 같은 소리 설명은 읽을 글이 아니므로 뺌
function cleanText(text) {
  return text
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\((?:music|applause|laughter|laughs|singing|inaudible)[^)]*\)/gi, ' ')
    .replace(/<[^>]+>/g, ' ') // VTT 안의 꾸밈 태그
    .replace(/♪/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 붙여넣은 글 → { videoId, title, lines: [{ start, text }] } */
export function parsePastedTranscript(raw) {
  const text = String(raw).replace(/\r/g, '')
  const allLines = text.split('\n').map((l) => l.trim())
  const videoId = extractVideoId(text)

  // 제목: 첫 자막 줄보다 위에 있는, 시간·주소가 아닌 첫 줄 (" - YouTube", 알림 숫자 "(3) " 떼기)
  const timed = new RegExp(`^[\\[(]?${TIME}`)
  const firstTimed = allLines.findIndex((l) => timed.test(l))
  const header = firstTimed < 0 ? allLines : allLines.slice(0, firstTimed)
  const titleLine = header.find((l) => l && !extractVideoId(l) && !/^(WEBVTT|Kind:|Language:)/.test(l) && !/^\d+$/.test(l))
  const title = (titleLine || '')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/\s*-\s*YouTube\s*$/i, '')
    .trim()

  const lines = []
  const srtArrow = new RegExp(`^(${TIME})\\s*-->\\s*(${TIME})`)
  const stampFirst = new RegExp(`^[\\[(]?(${TIME})[\\])]?\\s*(.*)$`)

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i]
    if (!line) continue

    // SRT/VTT: "00:00:01,000 --> 00:00:03,000" 다음 줄들이 텍스트
    const arrow = line.match(srtArrow)
    if (arrow) {
      const body = []
      while (i + 1 < allLines.length && allLines[i + 1] && !srtArrow.test(allLines[i + 1])) body.push(allLines[++i])
      // SRT 번호 줄이 끝에 붙어 들어오면 제거
      if (body.length > 1 && /^\d+$/.test(body.at(-1))) body.pop()
      lines.push({ start: toSeconds(arrow[1]), text: body.join(' ') })
      continue
    }

    // "(0:12) 텍스트" / "0:12 텍스트" / "[00:12] 텍스트" / 시간만 있고 텍스트는 다음 줄
    const m = line.match(stampFirst)
    if (m && !extractVideoId(line)) {
      let body = m[3]
      if (!body && i + 1 < allLines.length && allLines[i + 1] && !stampFirst.test(allLines[i + 1])) body = allLines[++i]
      lines.push({ start: toSeconds(m[1]), text: body })
    }
  }

  const cleaned = lines.map((l) => ({ start: l.start, text: cleanText(l.text) })).filter((l) => l.text)
  cleaned.sort((a, b) => a.start - b.start)
  return { videoId, title, lines: cleaned }
}

// 그림책 낭독 속도 기준, 글자 하나 읽는 데 걸리는 대략적인 시간(초)
const SEC_PER_CHAR = 0.075

/**
 * 줄 단위 시간 → 단어별 시간 추정.
 * 한 줄의 단어들을 [그 줄 시작, 다음 줄 시작] 사이에 글자 수 비율로 나눠 줌.
 * 다음 줄까지 쉬는 시간이 길면(그림만 보여주는 구간 등) 말하는 데 필요한 만큼만 씀.
 */
export function estimateWordTimes(lines, { startShift = 0.3 } = {}) {
  const words = []
  lines.forEach((line, i) => {
    const tokens = line.text.split(' ').filter(Boolean)
    if (!tokens.length) return
    // Transcript YouTube 시간은 초 단위로 내림된 값이라 실제 시작은 평균 0.3~0.5초 뒤
    const start = line.start + startShift
    const chars = tokens.reduce((n, t) => n + t.length + 1, 0)
    const needed = Math.max(0.8, chars * SEC_PER_CHAR)
    const next = lines[i + 1] ? lines[i + 1].start + startShift : start + needed
    const gap = Math.max(0.3, next - start)
    const span = gap <= needed * 1.5 ? gap : needed * 1.2

    let t = start
    for (const tok of tokens) {
      const d = (span * (tok.length + 1)) / chars
      words.push({ text: tok, start: +t.toFixed(3), end: +(t + d).toFixed(3) })
      t += d
    }
  })
  return words
}

/** 자막 공급자 약속(CaptionSource.js)대로 결과 만들기 */
export function captionsFromPaste(raw) {
  const { videoId, title, lines } = parsePastedTranscript(raw)
  return { videoId, title, words: estimateWordTimes(lines), timing: 'line', lineCount: lines.length }
}
