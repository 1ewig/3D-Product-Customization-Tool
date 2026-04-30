import { useCustomizationStore } from '../../store/useCustomizationStore'
import { LogoControls } from './LogoControls'

export const TextControls = () => {
  const {
    textContent,
    textColor,
    fontSize,
    textPosition,
    textRotation,
    textScale,
    selectedObject,
    transformMode,
    setTextContent,
    setTextColor,
    setFontSize,
    setTextPosition,
    setTextRotation,
    setTextScale,
    setSelectedObject,
    setTransformMode,
    resetText,
  } = useCustomizationStore()

  const isSelected = selectedObject === 'text'

  return (
    <div style={{ padding: '24px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Text Overlay</span>
        <button className="btn-reset" onClick={resetText} title="Reset All Text Properties">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* ── Selection & Transform Mode ── */}
      {textContent && (
        <div className="control-group">
          <button
            className={`btn-select ${isSelected ? 'active text' : 'inactive'}`}
            onClick={() => setSelectedObject(isSelected ? null : 'text')}
          >
            {isSelected ? '✓ Text Selected' : '⊕ Select to Transform'}
          </button>

          {isSelected && (
            <div className="mode-toggle-group">
              {['translate', 'rotate', 'scale'].map((mode) => (
                <button
                  key={mode}
                  className={`mode-btn ${transformMode === mode ? 'active text' : ''}`}
                  onClick={() => setTransformMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Text Input ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Text Input</label>
          <button className="btn-reset" onClick={() => setTextContent('')}>Clear</button>
        </div>
        <input
          type="text"
          className="premium-input"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Enter your text…"
        />
      </div>

      {/* ── Color ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Color</label>
          <button className="btn-reset" onClick={() => setTextColor('#ffffff')}>Reset</button>
        </div>
        <input
          type="color"
          className="color-picker"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      {/* ── Font Size ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Font Size: {fontSize}px</label>
          <button className="btn-reset" onClick={() => setFontSize(48)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="12"
          max="120"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>

      {/* ── Position ── */}
      {(['x', 'y', 'z']).map((axis) => (
        <div className="control-group" key={`text-pos-${axis}`}>
          <div className="control-header">
            <label className="control-label">{axis.toUpperCase()} Pos: {textPosition[axis].toFixed(2)}</label>
            <button
              className="btn-reset"
              onClick={() => setTextPosition({ ...textPosition, [axis]: axis === 'z' ? 0.3 : 0 })}
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            className="premium-range"
            min={axis === 'z' ? '0' : '-1'}
            max={axis === 'z' ? '1' : '1'}
            step="0.01"
            value={textPosition[axis]}
            onChange={(e) => setTextPosition({ ...textPosition, [axis]: parseFloat(e.target.value) })}
          />
        </div>
      ))}

      {/* ── Rotation ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Rotation: {textRotation.toFixed(2)} rad</label>
          <button className="btn-reset" onClick={() => setTextRotation(0)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="-3.14"
          max="3.14"
          step="0.01"
          value={textRotation}
          onChange={(e) => setTextRotation(parseFloat(e.target.value))}
        />
      </div>

      {/* ── Scale ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Scale: {textScale.toFixed(1)}x</label>
          <button className="btn-reset" onClick={() => setTextScale(1)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="0.1"
          max="3"
          step="0.1"
          value={textScale}
          onChange={(e) => setTextScale(parseFloat(e.target.value))}
        />
      </div>

      <LogoControls />
    </div>
  )
}
