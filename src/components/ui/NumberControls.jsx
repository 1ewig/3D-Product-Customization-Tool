import { memo } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const NumberControls = memo(() => {
  // ─── SELECTIVE SUBSCRIPTIONS ───────────────────────────────────────────────
  // We extract exactly what we need for the player number customization.
  const numberContent = useCustomizationStore(state => state.numberContent)
  const numberColor = useCustomizationStore(state => state.numberColor)
  const numberFontSize = useCustomizationStore(state => state.numberFontSize)
  const numberPosition = useCustomizationStore(state => state.numberPosition)
  const numberRotation = useCustomizationStore(state => state.numberRotation)
  const numberScale = useCustomizationStore(state => state.numberScale)
  const selectedObject = useCustomizationStore(state => state.selectedObject)
  const transformMode = useCustomizationStore(state => state.transformMode)
  
  const setNumberContent = useCustomizationStore(state => state.setNumberContent)
  const setNumberColor = useCustomizationStore(state => state.setNumberColor)
  const setNumberFontSize = useCustomizationStore(state => state.setNumberFontSize)
  const setNumberPosition = useCustomizationStore(state => state.setNumberPosition)
  const setNumberRotation = useCustomizationStore(state => state.setNumberRotation)
  const setNumberScale = useCustomizationStore(state => state.setNumberScale)
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)
  const setTransformMode = useCustomizationStore(state => state.setTransformMode)
  const resetNumber = useCustomizationStore(state => state.resetNumber)

  const isSelected = selectedObject === 'number'

  return (
    <div>
      <div className="section-header">
        <span>Number Overlay</span>
        <button className="btn-reset" onClick={resetNumber} title="Reset All Number Properties">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* ── Selection & Transform Mode ── */}
      {numberContent && (
        <div className="control-group">
          <button
            className={`btn-select ${isSelected ? 'active number' : 'inactive'}`}
            style={{ '--theme-color': 'var(--number-color, #10b981)' }} // Beautiful green theme for numbers
            onClick={() => {
              setSelectedObject(isSelected ? null : 'number')
              setTransformMode('translate')
            }}
          >
            {isSelected ? '✓ Number Selected' : '⊕ Select to Transform'}
          </button>
        </div>
      )}

      {/* ── Number Input ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Jersey Number</label>
          <button className="btn-reset" onClick={() => setNumberContent('')}>Clear</button>
        </div>
        <input
          type="text"
          maxLength="3"
          className="premium-input"
          value={numberContent}
          onChange={(e) => setNumberContent(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter number (e.g. 07, 23)…"
        />
      </div>

      {/* ── Color ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Number Color</label>
          <button className="btn-reset" onClick={() => setNumberColor('#000000')}>Reset</button>
        </div>
        <input
          type="color"
          className="color-picker"
          value={numberColor}
          onChange={(e) => setNumberColor(e.target.value)}
        />
      </div>

      {/* ── Font Size ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Font Size: {numberFontSize}px</label>
          <button className="btn-reset" onClick={() => setNumberFontSize(72)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="20"
          max="150"
          value={numberFontSize}
          onChange={(e) => setNumberFontSize(Number(e.target.value))}
        />
      </div>

      {/* ── Position (X & Y) ── */}
      {(['x', 'y']).map((axis) => (
        <div className="control-group" key={`num-pos-${axis}`}>
          <div className="control-header">
            <label className="control-label">{axis.toUpperCase()} Position: {numberPosition[axis].toFixed(2)}</label>
            <button
              className="btn-reset"
              onClick={() => setNumberPosition({ ...numberPosition, [axis]: axis === 'y' ? -0.15 : 0 })}
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            className="premium-range"
            min="-0.6"
            max="0.6"
            step="0.01"
            value={numberPosition[axis]}
            onChange={(e) => setNumberPosition({ ...numberPosition, [axis]: Number(e.target.value) })}
          />
        </div>
      ))}

      {/* ── Rotation ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Rotation: {numberRotation.toFixed(2)} rad</label>
          <button className="btn-reset" onClick={() => setNumberRotation(0)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="-3.14"
          max="3.14"
          step="0.05"
          value={numberRotation}
          onChange={(e) => setNumberRotation(Number(e.target.value))}
        />
      </div>

      {/* ── Scale ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Scale: {numberScale.toFixed(1)}x</label>
          <button className="btn-reset" onClick={() => setNumberScale(0.8)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="0.2"
          max="2.5"
          step="0.05"
          value={numberScale}
          onChange={(e) => setNumberScale(Number(e.target.value))}
        />
      </div>
    </div>
  )
})
