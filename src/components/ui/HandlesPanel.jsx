import { memo } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { useConfiguratorActions } from '../../hooks'

export const HandlesPanel = memo(() => {
  // ─── STATE SELECTIONS ──────────────────────────────────────────────────────
  const selectedObject = useCustomizationStore(state => state.selectedObject)
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)
  const transformMode = useCustomizationStore(state => state.transformMode)
  const setTransformMode = useCustomizationStore(state => state.setTransformMode)

  // Subscriptions for Text
  const textContent = useCustomizationStore(state => state.textContent)
  const fontSize = useCustomizationStore(state => state.fontSize)
  const textPosition = useCustomizationStore(state => state.textPosition)
  const textRotation = useCustomizationStore(state => state.textRotation)
  const textScale = useCustomizationStore(state => state.textScale)
  const setFontSize = useCustomizationStore(state => state.setFontSize)
  const setTextPosition = useCustomizationStore(state => state.setTextPosition)
  const setTextRotation = useCustomizationStore(state => state.setTextRotation)
  const setTextScale = useCustomizationStore(state => state.setTextScale)
  const resetText = useCustomizationStore(state => state.resetText)

  // Subscriptions for Number
  const numberContent = useCustomizationStore(state => state.numberContent)
  const numberFontSize = useCustomizationStore(state => state.numberFontSize)
  const numberPosition = useCustomizationStore(state => state.numberPosition)
  const numberRotation = useCustomizationStore(state => state.numberRotation)
  const numberScale = useCustomizationStore(state => state.numberScale)
  const setNumberFontSize = useCustomizationStore(state => state.setNumberFontSize)
  const setNumberPosition = useCustomizationStore(state => state.setNumberPosition)
  const setNumberRotation = useCustomizationStore(state => state.setNumberRotation)
  const setNumberScale = useCustomizationStore(state => state.setNumberScale)
  const resetNumber = useCustomizationStore(state => state.resetNumber)

  // Subscriptions for Logo
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)
  const setLogoPosition = useCustomizationStore(state => state.setLogoPosition)
  const setLogoRotation = useCustomizationStore(state => state.setLogoRotation)
  const setLogoScale = useCustomizationStore(state => state.setLogoScale)
  const resetLogo = useCustomizationStore(state => state.resetLogo)

  // ─── DELEGATED SAVE/DOWNLOAD ACTIONS ───────────────────────────────────────
  const { isSaving, handleSave, handleDownload } = useConfiguratorActions()

  // ─── DYNAMIC ASSIGNMENTS ACCORDING TO SELECTION ────────────────────────────
  // Clicking an element binds the active sliders directly to that element's variables.
  const hasSelection = !!selectedObject
  
  let activeName = ''
  let activeReset = () => {}
  let activeType = '' // 'text' | 'number' | 'logo'

  if (selectedObject === 'text') {
    activeName = 'Text Overlay'
    activeReset = resetText
    activeType = 'text'
  } else if (selectedObject === 'number') {
    activeName = 'Jersey Number Overlay'
    activeReset = resetNumber
    activeType = 'number'
  } else if (selectedObject === 'logo') {
    activeName = 'Logo Image Overlay'
    activeReset = resetLogo
    activeType = 'logo'
  }

  return (
    <div className="handles-panel-inner">
      <div className="panel-title-area">
        <h1>Transform Hub</h1>
        <p className="panel-subtitle">Manipulate, scale, and adjust 3D positions</p>
      </div>

      {/* ── Section 1: Overlay Layers Selector ── */}
      <div className="control-group border-bottom p-b-20">
        <label className="control-label uppercase tracking">Customizable Overlay Layers</label>
        <div className="layer-stack m-t-12">
          {/* Layer 1: Text */}
          <button
            className={`layer-item ${selectedObject === 'text' ? 'active text' : ''}`}
            onClick={() => setSelectedObject(selectedObject === 'text' ? null : 'text')}
            disabled={!textContent}
          >
            <div className="layer-icon text-icon">A</div>
            <div className="layer-meta">
              <span className="layer-title">Text Overlay</span>
              <span className="layer-subtitle">{textContent ? `"${textContent}"` : 'Disabled'}</span>
            </div>
            {textContent && <div className="layer-indicator" />}
          </button>

          {/* Layer 2: Number */}
          <button
            className={`layer-item ${selectedObject === 'number' ? 'active number' : ''}`}
            onClick={() => setSelectedObject(selectedObject === 'number' ? null : 'number')}
            disabled={!numberContent}
          >
            <div className="layer-icon number-icon">#</div>
            <div className="layer-meta">
              <span className="layer-title">Jersey Number</span>
              <span className="layer-subtitle">{numberContent ? `"${numberContent}"` : 'Disabled'}</span>
            </div>
            {numberContent && <div className="layer-indicator number" />}
          </button>

          {/* Layer 3: Logo */}
          <button
            className={`layer-item ${selectedObject === 'logo' ? 'active logo' : ''}`}
            onClick={() => setSelectedObject(selectedObject === 'logo' ? null : 'logo')}
            disabled={!logoUrl}
          >
            <div className="layer-icon logo-icon">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="layer-meta">
              <span className="layer-title">Logo Image</span>
              <span className="layer-subtitle">{logoUrl ? 'Custom Image Active' : 'Disabled'}</span>
            </div>
            {logoUrl && <div className="layer-indicator logo" />}
          </button>
        </div>
      </div>

      {/* ── Section 2: Active Sliders ── */}
      <div className="control-group flex-1">
        {!hasSelection ? (
          <div className="empty-selection-placeholder">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="placeholder-icon">
              <polygon points="12 2 2 7 12 12 22 7 12 2 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <p className="placeholder-text">Select a Layer overlay above or double-click the element directly on the 3D Model to show its sizing and positioning sliders.</p>
          </div>
        ) : (
          <div className="active-transform-group">
            <div className="transform-group-header">
              <span className="transform-title-highlight uppercase tracking">{activeName} Adjustments</span>
              <button className="btn-reset" onClick={activeReset} title="Reset Layer to Defaults">Reset</button>
            </div>

            {/* 1. Font Size / Logo Scale (Sizing dimension helper) */}
            {activeType !== 'logo' && (
              <div className="transform-slider-group">
                <div className="control-header">
                  <label className="control-label text-xs">Font Size: {activeType === 'text' ? fontSize : numberFontSize}px</label>
                </div>
                <input
                  type="range"
                  className="premium-range"
                  min="20"
                  max="150"
                  value={activeType === 'text' ? fontSize : numberFontSize}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    if (activeType === 'text') setFontSize(val)
                    else setNumberFontSize(val)
                  }}
                />
              </div>
            )}

            {/* 2. Position X */}
            <div className="transform-slider-group m-t-14">
              <div className="control-header">
                <label className="control-label text-xs">Horizontal (X) Position: {(activeType === 'text' ? textPosition.x : activeType === 'number' ? numberPosition.x : logoPosition.x).toFixed(2)}</label>
              </div>
              <input
                type="range"
                className="premium-range"
                min="-0.6"
                max="0.6"
                step="0.01"
                value={activeType === 'text' ? textPosition.x : activeType === 'number' ? numberPosition.x : logoPosition.x}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  if (activeType === 'text') setTextPosition({ ...textPosition, x: val })
                  else if (activeType === 'number') setNumberPosition({ ...numberPosition, x: val })
                  else setLogoPosition({ ...logoPosition, x: val })
                }}
              />
            </div>

            {/* 3. Position Y */}
            <div className="transform-slider-group m-t-14">
              <div className="control-header">
                <label className="control-label text-xs">Vertical (Y) Position: {(activeType === 'text' ? textPosition.y : activeType === 'number' ? numberPosition.y : logoPosition.y).toFixed(2)}</label>
              </div>
              <input
                type="range"
                className="premium-range"
                min="-0.6"
                max="0.6"
                step="0.01"
                value={activeType === 'text' ? textPosition.y : activeType === 'number' ? numberPosition.y : logoPosition.y}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  if (activeType === 'text') setTextPosition({ ...textPosition, y: val })
                  else if (activeType === 'number') setNumberPosition({ ...numberPosition, y: val })
                  else setLogoPosition({ ...logoPosition, y: val })
                }}
              />
            </div>

            {/* 4. Rotation */}
            <div className="transform-slider-group m-t-14">
              <div className="control-header">
                <label className="control-label text-xs">Rotation: {(activeType === 'text' ? textRotation : activeType === 'number' ? numberRotation : logoRotation).toFixed(2)} rad</label>
              </div>
              <input
                type="range"
                className="premium-range"
                min="-3.14"
                max="3.14"
                step="0.05"
                value={activeType === 'text' ? textRotation : activeType === 'number' ? numberRotation : logoRotation}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  if (activeType === 'text') setTextRotation(val)
                  else if (activeType === 'number') setNumberRotation(val)
                  else setLogoRotation(val)
                }}
              />
            </div>

            {/* 5. Scale */}
            <div className="transform-slider-group m-t-14">
              <div className="control-header">
                <label className="control-label text-xs">Overall Scale: {(activeType === 'text' ? textScale : activeType === 'number' ? numberScale : logoScale).toFixed(2)}x</label>
              </div>
              <input
                type="range"
                className="premium-range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={activeType === 'text' ? textScale : activeType === 'number' ? numberScale : logoScale}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  if (activeType === 'text') setTextScale(val)
                  else if (activeType === 'number') setNumberScale(val)
                  else setLogoScale(val)
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Global Action Footers ── */}
      <div className="handles-footer">
        <button 
          className="btn-footer secondary m-b-12"
          onClick={handleDownload}
          disabled={isSaving}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="m-r-6">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Snapshot
        </button>
        <button 
          className="btn-footer primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            'Saving to Cloud…'
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="m-r-6">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Design configuration
            </>
          )}
        </button>
      </div>
    </div>
  )
})

HandlesPanel.displayName = 'HandlesPanel'
