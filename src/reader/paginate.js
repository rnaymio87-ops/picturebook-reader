// 화면에 들어가는 만큼씩 "화면 페이지"로 나누기
//
// 책 페이지(book.pages)의 글이 화면보다 길면 여러 화면 페이지로 나눔.
// 결과: [{ bookPage, pieces: [{ s: 문장번호, first: 첫 단어번호, last: 끝 단어번호 }] }]
// (긴 문장은 중간에서 잘려 두 화면에 나뉠 수 있어서 "문장 조각(piece)" 단위)
//
// 방법: 화면과 같은 폭·글꼴의 보이지 않는 상자(measureBox)에 글을 실제로 넣어보며 높이를 잼.

export function paginate(book, measureBox, maxHeight) {
  const screens = []
  let pieces = []

  const fits = () => measureBox.scrollHeight <= maxHeight
  const newParagraph = () => {
    const p = document.createElement('p')
    p.className = 'sentence'
    measureBox.appendChild(p)
    return p
  }
  const addWord = (p, wi) => {
    const span = document.createElement('span')
    span.className = 'word'
    span.textContent = book.words[wi].text
    p.append(span, ' ')
  }
  const flush = (bookPage) => {
    if (pieces.length) screens.push({ bookPage, pieces })
    pieces = []
    measureBox.replaceChildren()
  }

  book.pages.forEach((sentenceIds, bookPage) => {
    for (const s of sentenceIds) {
      const { first, last } = book.sentences[s]

      // 1) 문장 전체가 지금 화면에 들어가면 그대로
      let p = newParagraph()
      for (let wi = first; wi <= last; wi++) addWord(p, wi)
      if (fits()) {
        pieces.push({ s, first, last })
        continue
      }

      // 2) 안 들어가면 다음 화면으로 넘겨서 다시 시도
      if (pieces.length) {
        flush(bookPage)
        p = newParagraph()
        for (let wi = first; wi <= last; wi++) addWord(p, wi)
        if (fits()) {
          pieces.push({ s, first, last })
          continue
        }
      }

      // 3) 빈 화면에도 안 들어갈 만큼 긴 문장 → 잘라서 여러 화면에
      //    되도록 쉼표 뒤에서 자름 ("a white dog, a" 처럼 어색하게 끊기지 않게)
      measureBox.replaceChildren()
      p = newParagraph()
      let pieceStart = first
      for (let wi = first; wi <= last; wi++) {
        addWord(p, wi)
        if (!fits() && wi > pieceStart) {
          let cut = wi - 1
          for (let b = wi - 1; b > pieceStart; b--) {
            if (/[,;:]$/.test(book.words[b].text)) {
              cut = b
              break
            }
          }
          pieces.push({ s, first: pieceStart, last: cut })
          flush(bookPage)
          p = newParagraph()
          for (let k = cut + 1; k <= wi; k++) addWord(p, k)
          pieceStart = cut + 1
        }
      }
      pieces.push({ s, first: pieceStart, last })
    }
    flush(bookPage)
  })

  return screens
}
