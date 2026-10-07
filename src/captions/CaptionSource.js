// ★ "자막 가져오기" 부분의 약속(인터페이스)
//
// 자막을 어디서 가져오든(붙여넣기, 자막 대행 서비스, 크롬 확장, 나중엔 음성인식 등)
// 결과는 항상 아래 모양으로 돌려줌. 앱의 나머지 부분은 이 모양만 알면 됨.
// → 자막 가져오는 방법을 바꿀 때는 이 폴더(src/captions/) 안의 파일만 바꾸면 됨.
//
// {
//   videoId: '유튜브 영상 ID (없으면 null)',
//   title:   '책 제목 (없으면 빈 문자열)',
//   words:   [{ text: 'Brown', start: 0.48, end: 1.14 }, ...],   // 시간 단위: 초
//   timing:  'word' | 'line',   // word = 단어별 진짜 시간, line = 줄 시간에서 추정한 단어 시간
// }

/** 유튜브 주소에서 영상 ID 뽑기 (watch?v=, youtu.be/, shorts/, embed/ 모두) */
export function extractVideoId(text) {
  const m = String(text).match(
    /(?:youtube\.com\/(?:watch\?(?:[^\s#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  )
  return m ? m[1] : null
}
