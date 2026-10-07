// ⚙️ 설정 창: 속도, 글씨 크기, 영상 보이기/가리기
export const SPEEDS = [
  { value: 0.5, label: '🐢 0.5' },
  { value: 0.75, label: '0.75' },
  { value: 1, label: '1' },
  { value: 1.25, label: '1.25 🐇' },
]

export const TEXT_SIZES = [
  { value: 0.8, label: '작게' },
  { value: 1, label: '보통' },
  { value: 1.25, label: '크게' },
]

function Choice({ options, value, onChange, renderLabel }) {
  return (
    <div className="choice-row">
      {options.map((o) => (
        <button
          key={String(o.value)}
          className={'choice' + (o.value === value ? ' selected' : '')}
          onClick={() => onChange(o.value)}
        >
          {renderLabel ? renderLabel(o) : o.label}
        </button>
      ))}
    </div>
  )
}

function SettingsSheet({ speed, onSpeed, textSize, onTextSize, videoHidden, onVideoHidden, onClose }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="설정">
        <h2>읽는 속도</h2>
        <Choice options={SPEEDS} value={speed} onChange={onSpeed} />

        <h2>글씨 크기</h2>
        <Choice
          options={TEXT_SIZES}
          value={textSize}
          onChange={onTextSize}
          renderLabel={(o) => <span style={{ fontSize: `${o.value * 1.2}em` }}>{o.label}</span>}
        />

        <h2>영상</h2>
        <Choice
          options={[
            { value: false, label: '📺 보이기' },
            { value: true, label: '🙈 가리기' },
          ]}
          value={videoHidden}
          onChange={onVideoHidden}
        />

        <button className="sheet-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default SettingsSheet
