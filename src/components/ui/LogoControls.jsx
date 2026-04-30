import { useCustomizationStore } from '../../store/useCustomizationStore'

export const LogoControls = () => {
  const {
    logoUrl,
    logoPosition,
    logoRotation,
    logoScale,
    selectedObject,
    transformMode,
    setLogoUrl,
    setLogoPosition,
    setLogoRotation,
    setLogoScale,
    setSelectedObject,
    setTransformMode,
  } = useCustomizationStore()

  const isSelected = selectedObject === 'logo'

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
      e.target.value = ''
    }
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
    background: isSelected ? '#10b981' : '#2d2d2d',
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
    background: isSelected && transformMode === mode ? '#10b981' : '#2d2d2d',
    color: isSelected && transformMode === mode ? '#fff' : '#888',
    transition: 'background 0.15s',
  })

  return (
    <div style={{ borderTop: '1px solid #2d2d2d', paddingTop: '16px', marginTop: '16px' }}>
      <h2 style={{ marginTop: 0, paddingBottom: '12px', fontSize: '16px', color: 'white' }}>
        Logo / Image
      </h2>

      {/* ── Upload ── */}
      <div style={controlStyle}>
        <label style={labelStyle}>Upload Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          style={{ width: '100%', color: '#aaa', fontSize: '12px' }}
        />
        {logoUrl && (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={logoUrl}
              alt="Logo preview"
              style={{ maxWidth: '64px', maxHeight: '64px', display: 'block', borderRadius: '4px', border: '1px solid #444' }}
            />
            <button
              onClick={() => { setLogoUrl(null); setSelectedObject(null) }}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* ── Selection & Transform Mode ── */}
      {logoUrl && (
        <div style={{ marginBottom: '20px' }}>
          <button
            style={selectBtnStyle}
            onClick={() => setSelectedObject(isSelected ? null : 'logo')}
          >
            {isSelected ? '✓ Logo Selected — Click to Deselect' : '⊕ Select Logo to Transform'}
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

      {/* ── Position ── */}
      {(['x', 'y', 'z']).map((axis) => (
        <div style={controlStyle} key={`logo-pos-${axis}`}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <label style={labelStyle}>{axis.toUpperCase()} Position: {logoPosition[axis].toFixed(2)}</label>
            <button
              style={resetButtonStyle}
              onClick={() => setLogoPosition({ ...logoPosition, [axis]: axis === 'z' ? 0.31 : 0 })}
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            min={axis === 'z' ? '0' : '-1'}
            max={axis === 'z' ? '1' : '1'}
            step="0.01"
            value={logoPosition[axis]}
            onChange={(e) => setLogoPosition({ ...logoPosition, [axis]: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>
      ))}

      {/* ── Rotation ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Rotation: {logoRotation.toFixed(2)} rad</label>
          <button style={resetButtonStyle} onClick={() => setLogoRotation(0)}>Reset</button>
        </div>
        <input
          type="range"
          min="-3.14"
          max="3.14"
          step="0.01"
          value={logoRotation}
          onChange={(e) => setLogoRotation(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* ── Scale ── */}
      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <label style={labelStyle}>Scale: {logoScale.toFixed(1)}x</label>
          <button style={resetButtonStyle} onClick={() => setLogoScale(1)}>Reset</button>
        </div>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={logoScale}
          onChange={(e) => setLogoScale(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
