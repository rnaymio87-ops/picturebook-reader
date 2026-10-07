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
 * - onTime(초): 재생 중 화면이 바뀔 때마다(1초에 약 60번) "지금 몇 초인지" 알려줌 (형광펜 맞추기에 사용)
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
    let frame = null

    // 유튜브가 알려주는 시간은 띄엄띄엄(약 0.1~0.25초 간격) 바뀜.
    // 마지막으로 바뀐 순간(base)부터 흐른 시간을 더해서 매 화면 갱신마다 부드러운 시간을 계산.
    let base = null // { t: 유튜브가 알려준 시간, at: 그때의 시계 }
    function tick() {
      const player = playerRef.current
      const now = performance.now()
      const reported = player.getCurrentTime()
      if (!base || reported !== base.t) base = { t: reported, at: now }
      const rate = player.getPlaybackRate?.() || 1
      onTimeRef.current?.(base.t + ((now - base.at) / 1000) * rate)
      frame = requestAnimationFrame(tick)
    }

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
            cancelAnimationFrame(frame)
            base = null
            if (playing) frame = requestAnimationFrame(tick)
          },
        },
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId])

  return <div ref={boxRef} className="yt-box" />
})

export default YouTubePlayer
