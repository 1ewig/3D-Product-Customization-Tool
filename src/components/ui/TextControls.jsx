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
  } = useCustomizationStore()

  const isSelected = selectedObject === 'text'

  const panelStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    width: '280px',
    background: '#1a1a1a',
    color: 'white',
    padding: '16px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  }

  const controlStyle = {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  }

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  }

  const resetButtonStyle = {
    background: '#333',
    color: '#aaa',
    border: 'none',
    borderRadius: '3px',
    fontSize: '10px',
    padding: '2px 6px',
    cursor: 'pointer',
    marginLeft: 'auto',
  }

  const selectBtnStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    background: isSelected ? '#3b82f6' : '#2d2d2d',
    color: isSelected ? '#fff' : '#aaa',
    marginBottom: '12px',
    transition: 'background 0.2s',
  }

  const modeButtonStyle = (mode) => ({
    flex: 1,
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    background: isSelected && transformMode === mode ? '#3b82f6' : '#2d2d2d',
    color: isSelected && transformMode === mode ? '#fff' : '#888',
    transition: 'background 0.15s',
  })

  return (
    <div style={panelStyle}>
      <h2 style={{ marginTop: 0, borderBottom: '1px solid #2d2d2d', paddingBottom: '12px', fontSize: '16px' }}>
        Text Overlay
      </h2>

      {/* ── Selection & Transform Mode ── */}
      {textContent && (
        <div style={{ marginBottom: '20px' }}>
          <button
            style={selectBtnStyle}
            onClick={() => setSelectedObject(isSelected ? null : 'text')}
          >
            {isSelected ? '✓ Text Selected — Click to Deselect' : '⊕ Select Text to Transform'}
          </button>

          {isSelected && (
            <div style={{ display: 'flex', gap: '6px' }}>
              {['translate', 'rotate', 'scale'].map((mode) => (
                <button
                  key={mode}
                  style={modeButtonStyle(mode)}
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
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Text Input</label>
          <button style={resetButtonStyle} onClick={() => setTextContent('')}>Clear</button>
        </div>
        <input
          type="text"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Enter your text…"
          style={{
            padding: '8px',
            boxSizing: 'border-box',
            width: '100%',
            background: '#2d2d2d',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '13px',
          }}
        />
      </div>

      {/* ── Color ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Color</label>
          <button style={resetButtonStyle} onClick={() => setTextColor('#ffffff')}>Reset</button>
        </div>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          style={{ width: '100%', height: '36px', cursor: 'pointer', padding: 0, border: 'none', borderRadius: '4px' }}
        />
      </div>

      {/* ── Font Size ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Font Size: {fontSize}px</label>
          <button style={resetButtonStyle} onClick={() => setFontSize(48)}>Reset</button>
        </div>
        <input
          type="range"
          min="12"
          max="120"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* ── Position ── */}
      {(['x', 'y', 'z']).map((axis) => (
        <div style={controlStyle} key={`text-pos-${axis}`}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <label style={labelStyle}>{axis.toUpperCase()} Position: {textPosition[axis].toFixed(2)}</label>
            <button
              style={resetButtonStyle}
              onClick={() => setTextPosition({ ...textPosition, [axis]: axis === 'z' ? 0.3 : 0 })}
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            min={axis === 'z' ? '0' : '-1'}
            max={axis === 'z' ? '1' : '1'}
            step="0.01"
            value={textPosition[axis]}
            onChange={(e) => setTextPosition({ ...textPosition, [axis]: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>
      ))}

      {/* ── Rotation ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Rotation: {textRotation.toFixed(2)} rad</label>
          <button style={resetButtonStyle} onClick={() => setTextRotation(0)}>Reset</button>
        </div>
        <input
          type="range"
          min="-3.14"
          max="3.14"
          step="0.01"
          value={textRotation}
          onChange={(e) => setTextRotation(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* ── Scale ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Scale: {textScale.toFixed(1)}x</label>
          <button style={resetButtonStyle} onClick={() => setTextScale(1)}>Reset</button>
        </div>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={textScale}
          onChange={(e) => setTextScale(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <LogoControls />
    </div>
  )
}
