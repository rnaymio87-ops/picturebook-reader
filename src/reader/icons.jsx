// 버튼용 아이콘 (그림 문자 대신 깔끔한 선 그림. 색은 글자색을 따라감)
function Svg({ children, size = '1em' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  )
}

export const PlayIcon = () => (
  <Svg>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </Svg>
)

export const PauseIcon = () => (
  <Svg>
    <rect x="6" y="5" width="4.2" height="14" rx="1.6" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.6" />
  </Svg>
)

// 이전 문장: 막대 + 왼쪽 삼각형
export const PrevSentenceIcon = () => (
  <Svg>
    <rect x="5" y="5.5" width="2.6" height="13" rx="1.2" />
    <path d="M19 6.6v10.8a.9.9 0 0 1-1.4.75L9.9 12.75a.9.9 0 0 1 0-1.5l7.7-5.4A.9.9 0 0 1 19 6.6z" />
  </Svg>
)

// 다음 문장: 오른쪽 삼각형 + 막대
export const NextSentenceIcon = () => (
  <Svg>
    <path d="M5 6.6v10.8a.9.9 0 0 0 1.4.75l7.7-5.4a.9.9 0 0 0 0-1.5L6.4 5.85A.9.9 0 0 0 5 6.6z" />
    <rect x="16.4" y="5.5" width="2.6" height="13" rx="1.2" />
  </Svg>
)

export const ChevronLeftIcon = () => (
  <Svg>
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const ChevronRightIcon = () => (
  <Svg>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const BackIcon = () => (
  <Svg>
    <path d="M19 12H6m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

// 톱니바퀴: 똑같은 톱니 8개를 45도씩 돌려 붙여서 완전히 대칭
export const SettingsIcon = () => (
  <Svg>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <rect key={deg} x="9.6" y="1.6" width="4.8" height="5" rx="1.4" transform={`rotate(${deg} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="6.3" fill="none" stroke="currentColor" strokeWidth="3.6" />
  </Svg>
)

export const HeadphonesIcon = () => (
  <Svg>
    <path d="M12 3a9 9 0 0 0-9 9v5.5A2.5 2.5 0 0 0 5.5 20H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5v-1a7 7 0 0 1 14 0v1h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5V12a9 9 0 0 0-9-9z" />
  </Svg>
)
