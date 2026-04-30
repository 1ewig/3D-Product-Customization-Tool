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

  return (
    <div style={{ marginTop: '24px' }}>
      <h2 className="section-header">Logo / Image</h2>

      {/* ── Upload ── */}
      <div className="control-group">
        <label className="control-label" style={{ marginBottom: '8px', display: 'block' }}>Upload Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          className="premium-input"
          style={{ padding: '8px' }}
        />
        {logoUrl && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--input-bg)', padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)' }}>
            <img
              src={logoUrl}
              alt="Logo preview"
              style={{ maxWidth: '48px', maxHeight: '48px', display: 'block', borderRadius: '4px' }}
            />
            <button
              onClick={() => { setLogoUrl(null); setSelectedObject(null) }}
              className="btn-reset"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', marginLeft: 'auto' }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* ── Selection & Transform Mode ── */}
      {logoUrl && (
        <div className="control-group">
          <button
            className={`btn-select ${isSelected ? 'active logo' : 'inactive'}`}
            onClick={() => setSelectedObject(isSelected ? null : 'logo')}
          >
            {isSelected ? '✓ Logo Selected' : '⊕ Select to Transform'}
          </button>

          {isSelected && (
            <div className="mode-toggle-group">
              {['translate', 'rotate', 'scale'].map((mode) => (
                <button
                  key={mode}
                  className={`mode-btn ${transformMode === mode ? 'active logo' : ''}`}
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
        <div className="control-group" key={`logo-pos-${axis}`}>
          <div className="control-header">
            <label className="control-label">{axis.toUpperCase()} Pos: {logoPosition[axis].toFixed(2)}</label>
            <button
              className="btn-reset"
              onClick={() => setLogoPosition({ ...logoPosition, [axis]: axis === 'z' ? 0.31 : 0 })}
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
            value={logoPosition[axis]}
            onChange={(e) => setLogoPosition({ ...logoPosition, [axis]: parseFloat(e.target.value) })}
          />
        </div>
      ))}

      {/* ── Rotation ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Rotation: {logoRotation.toFixed(2)} rad</label>
          <button className="btn-reset" onClick={() => setLogoRotation(0)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="-3.14"
          max="3.14"
          step="0.01"
          value={logoRotation}
          onChange={(e) => setLogoRotation(parseFloat(e.target.value))}
        />
      </div>

      {/* ── Scale ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label">Scale: {logoScale.toFixed(1)}x</label>
          <button className="btn-reset" onClick={() => setLogoScale(1)}>Reset</button>
        </div>
        <input
          type="range"
          className="premium-range"
          min="0.1"
          max="3"
          step="0.1"
          value={logoScale}
          onChange={(e) => setLogoScale(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}
