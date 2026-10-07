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

export const SettingsIcon = () => (
  <Svg>
    <path
      fillRule="evenodd"
      d="M10.3 2.6a1 1 0 0 1 1-.85h1.4a1 1 0 0 1 1 .85l.3 2a7.6 7.6 0 0 1 1.7 1l1.9-.7a1 1 0 0 1 1.2.45l.7 1.2a1 1 0 0 1-.23 1.28l-1.6 1.3a7.7 7.7 0 0 1 0 1.9l1.6 1.3a1 1 0 0 1 .23 1.28l-.7 1.2a1 1 0 0 1-1.2.45l-1.9-.7a7.6 7.6 0 0 1-1.7 1l-.3 2a1 1 0 0 1-1 .85h-1.4a1 1 0 0 1-1-.85l-.3-2a7.6 7.6 0 0 1-1.7-1l-1.9.7a1 1 0 0 1-1.2-.45l-.7-1.2a1 1 0 0 1 .23-1.28l1.6-1.3a7.7 7.7 0 0 1 0-1.9l-1.6-1.3a1 1 0 0 1-.23-1.28l.7-1.2a1 1 0 0 1 1.2-.45l1.9.7a7.6 7.6 0 0 1 1.7-1l.3-2zM12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"
    />
  </Svg>
)

export const HeadphonesIcon = () => (
  <Svg>
    <path d="M12 3a9 9 0 0 0-9 9v5.5A2.5 2.5 0 0 0 5.5 20H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5v-1a7 7 0 0 1 14 0v1h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5V12a9 9 0 0 0-9-9z" />
  </Svg>
)
