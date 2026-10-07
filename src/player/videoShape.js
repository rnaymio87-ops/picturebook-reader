// 영상의 가로:세로 비율 알아내기
// 영상마다 16:9(와이드), 4:3(옛날 TV) 등 모양이 달라서, 상자를 영상 모양에 맞추기 위함.
// 유튜브 공개 정보(oEmbed)에서 크기를 받아옴. 키 필요 없음. 실패하면 16:9로.

const cache = new Map()

export async function getVideoAspectRatio(videoId) {
  if (cache.has(videoId)) return cache.get(videoId)
  let ratio = 16 / 9
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`
    const info = await (await fetch(url)).json()
    if (info.width > 0 && info.height > 0) ratio = info.width / info.height
  } catch {
    // 인터넷이 약하거나 막혔을 때는 기본 16:9
  }
  // 너무 세로로 긴 영상(쇼츠 등)은 화면을 다 차지하지 않게 1:1까지만
  ratio = Math.max(1, ratio)
  cache.set(videoId, ratio)
  return ratio
}
