// 내 책장 저장소 (지금은 이 기기에만 저장)
// 8단계에서 클라우드(Supabase)로 바꾸면 아이폰에서 만든 책이 아이패드에서도 보이게 됨.
// 바꿀 때는 이 파일의 함수 4개(listBooks, getBook, saveBook, deleteBook)만 바꾸면 됨.
import sampleBook from '../data/sample-brown-bear.json'

const KEY = 'library.books.v1'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

function writeAll(books) {
  try {
    localStorage.setItem(KEY, JSON.stringify(books))
    return true
  } catch {
    return false // 저장 공간이 꽉 찼거나 막힌 환경
  }
}

const SAMPLE = { ...sampleBook, sample: true }

/** 책장 목록 (최근에 만든 책이 먼저, 샘플 책은 맨 뒤) */
export function listBooks() {
  return [...readAll().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')), SAMPLE]
}

export function getBook(id) {
  return id === SAMPLE.id ? SAMPLE : readAll().find((b) => b.id === id) || null
}

/** 저장 성공하면 true */
export function saveBook(book) {
  const others = readAll().filter((b) => b.id !== book.id)
  return writeAll([...others, book])
}

export function deleteBook(id) {
  writeAll(readAll().filter((b) => b.id !== id))
}
