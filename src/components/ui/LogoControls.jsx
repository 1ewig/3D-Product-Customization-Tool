import { memo } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const LogoControls = memo(() => {
  // ─── SELECTIVE SUBSCRIPTIONS ───────────────────────────────────────────────
  // We extract exactly what we need. This prevents the entire UI from 
  // re-rendering when unrelated store values (like text content) change.
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)
  const selectedObject = useCustomizationStore(state => state.selectedObject)
  const transformMode = useCustomizationStore(state => state.transformMode)

  const setLogoUrl = useCustomizationStore(state => state.setLogoUrl)
  const setLogoPosition = useCustomizationStore(state => state.setLogoPosition)
  const setLogoRotation = useCustomizationStore(state => state.setLogoRotation)
  const setLogoScale = useCustomizationStore(state => state.setLogoScale)
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)
  const setTransformMode = useCustomizationStore(state => state.setTransformMode)
  const resetLogo = useCustomizationStore(state => state.resetLogo)


  const isSelected = selectedObject === 'logo'

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="section-header">
        <span>Logo / Image</span>
        <button className="btn-reset" onClick={resetLogo} title="Reset All Logo Properties">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* ── Upload ── */}
      <div className="control-group">
        <label className="control-label mb-8 d-block">Upload Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          className="premium-input p-8"
        />
        {logoUrl && (
          <div className="logo-preview-container">
            <img
              src={logoUrl}
              alt="Logo preview"
              className="logo-preview-img"
            />
            <button
              onClick={() => { setLogoUrl(null); setSelectedObject(null) }}
              className="btn-reset text-danger border-danger-subtle ml-auto"
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
            onClick={() => {
              setSelectedObject(isSelected ? null : 'logo')
              setTransformMode('translate')
            }}
          >
            {isSelected ? '✓ Logo Selected' : '⊕ Select to Transform'}
          </button>
        </div>
      )}

      {/* ── Position ── */}
      {(['x', 'y']).map((axis) => (
        <div className="control-group" key={`logo-pos-${axis}`}>
          <div className="control-header">
            <label className="control-label">{axis.toUpperCase()} Pos: {logoPosition[axis].toFixed(2)}</label>
            <button
              className="btn-reset"
              onClick={() => setLogoPosition({ ...logoPosition, [axis]: 0 })}
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            className="premium-range"
            min="-1"
            max="1"
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
})

