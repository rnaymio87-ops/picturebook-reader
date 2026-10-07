import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// 유튜브 공식 IFrame Player API 스크립트를 한 번만 불러오는 함수
let apiPromise = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      window.onYouTubeIframeAPIReady = () => resolve(window.YT)
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    })
  }
  return apiPromise
}

/**
 * 유튜브 플레이어 감싸기.
 * - onTime(초): 재생 중 1초에 약 10번 "지금 몇 초인지" 알려줌 (형광펜 맞추기에 사용)
 * - onPlayingChange(true/false): 재생/멈춤 상태가 바뀔 때
 * - ref로 play(), pause(), seekTo(초), getTime() 사용 가능
 */
const YouTubePlayer = forwardRef(function YouTubePlayer({ videoId, onTime, onPlayingChange }, ref) {
  const boxRef = useRef(null)
  const playerRef = useRef(null)
  // 콜백은 최신 것으로 유지 (플레이어를 다시 만들지 않기 위해)
  const onTimeRef = useRef(onTime)
  const onPlayingRef = useRef(onPlayingChange)
  onTimeRef.current = onTime
  onPlayingRef.current = onPlayingChange

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo(),
    pause: () => playerRef.current?.pauseVideo(),
    seekTo: (sec) => {
      playerRef.current?.seekTo(sec, true)
      onTimeRef.current?.(sec)
    },
    getTime: () => playerRef.current?.getCurrentTime?.() ?? 0,
  }))

  useEffect(() => {
    let cancelled = false
    let timer = null

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      const target = document.createElement('div')
      boxRef.current.appendChild(target)
      playerRef.current = new YT.Player(target, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          playsinline: 1, // 아이폰에서 전체화면으로 튀어나가지 않게
          rel: 0, // 끝나고 다른 채널 영상 추천 줄이기
        },
        events: {
          onError: (e) => console.warn('[YouTubePlayer] 오류 코드', e.data),
          onStateChange: (e) => {
            const playing = e.data === YT.PlayerState.PLAYING
            onPlayingRef.current?.(playing)
            clearInterval(timer)
            if (playing) {
              timer = setInterval(() => {
                onTimeRef.current?.(playerRef.current.getCurrentTime())
              }, 100)
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearInterval(timer)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId])

  return <div ref={boxRef} className="yt-box" />
})

export default YouTubePlayer
