import { memo, useRef } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { useConfiguratorActions, useLibraryActions } from '../../hooks'

export const InputPanel = memo(() => {
  // ─── STORE SUBSCRIPTIONS ───────────────────────────────────────────────────
  const textContent = useCustomizationStore(state => state.textContent)
  const textColor = useCustomizationStore(state => state.textColor)
  const numberContent = useCustomizationStore(state => state.numberContent)
  const numberColor = useCustomizationStore(state => state.numberColor)
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const customModelUrl = useCustomizationStore(state => state.customModelUrl)
  
  const setTextContent = useCustomizationStore(state => state.setTextContent)
  const setTextColor = useCustomizationStore(state => state.setTextColor)
  const setNumberContent = useCustomizationStore(state => state.setNumberContent)
  const setNumberColor = useCustomizationStore(state => state.setNumberColor)
  const setLogoUrl = useCustomizationStore(state => state.setLogoUrl)
  const setCustomModelUrl = useCustomizationStore(state => state.setCustomModelUrl)
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)

  // ─── DELEGATED ACTIONS HOOKS ────────────────────────────────────────────────
  const logoInputRef = useRef()
  const { modelInputRef, handleModelUpload } = useConfiguratorActions()
  const {
    designs,
    isLoading,
    handleLoadDesign,
    handleDeleteDesign
  } = useLibraryActions()

  // Preset logo list for instant selection
  const logoPresets = [
    { name: 'Bolt', path: '/assets/presets/bolt.png' },
    { name: 'Shield', path: '/assets/presets/shield.png' },
    { name: 'Star', path: '/assets/presets/star.png' },
  ]

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="input-panel-inner">
      <div className="panel-title-area">
        <h1>Design Lab</h1>
        <p className="panel-subtitle">Configure your product style and inputs</p>
      </div>

      {/* ── Section 1: Product Selection ── */}
      <div className="control-group">
        <label className="control-label uppercase tracking">Select Product Model</label>
        <div className="product-grid">
          <button
            className={`product-card ${customModelUrl ? 'active' : ''}`}
            onClick={() => modelInputRef.current?.click()}
          >
            <div className="product-card-dot upload" />
            <span>Upload GLB…</span>
          </button>
          <input
            type="file"
            accept=".glb"
            className="d-none"
            ref={modelInputRef}
            onChange={handleModelUpload}
          />
        </div>
      </div>

      {/* ── Section 2: Text Styling ── */}
      <div className="control-group">
        <label className="control-label uppercase tracking">Player Name / Text</label>
        <div className="flex spacing-md">
          <input
            type="text"
            className="premium-input flex-1"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter name (e.g. CHAMPRO)…"
          />
          <div className="color-picker-wrapper">
            <input
              type="color"
              className="color-circle-picker"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Number Styling ── */}
      <div className="control-group">
        <label className="control-label uppercase tracking">Jersey Number</label>
        <div className="flex spacing-md">
          <input
            type="text"
            maxLength="3"
            className="premium-input flex-1"
            value={numberContent}
            onChange={(e) => setNumberContent(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Enter jersey number (e.g. 07)…"
          />
          <div className="color-picker-wrapper">
            <input
              type="color"
              className="color-circle-picker"
              value={numberColor}
              onChange={(e) => setNumberColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: Image/Logo Styling ── */}
      <div className="control-group">
        <div className="control-header">
          <label className="control-label uppercase tracking">Team Logo Image</label>
          {logoUrl && <button className="btn-reset" onClick={() => setLogoUrl(null)}>Remove</button>}
        </div>
        <div className="flex spacing-md">
          <button 
            className="premium-input flex-1 upload-logo-btn text-left" 
            onClick={() => logoInputRef.current?.click()}
          >
            <span>{logoUrl ? 'Change Custom Logo…' : 'Upload Custom Image…'}</span>
          </button>
          <input
            type="file"
            accept="image/*"
            className="d-none"
            ref={logoInputRef}
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      {/* ── Section 5: Saved Library ── */}
      <div className="control-group flex-grow">
        <label className="control-label uppercase tracking">Saved Designs Library</label>
        <div className="library-content-area">
          {isLoading ? (
            <div className="text-muted-sm">Loading library...</div>
          ) : designs?.length > 0 ? (
            <div className="library-mini-list">
              {designs.map((design) => (
                <div key={design.id} className="library-mini-item">
                  <button
                    onClick={() => handleLoadDesign(design.id)}
                    className="library-mini-btn"
                  >
                    <span>Design #{design.id.slice(-4)}</span>
                    <span className="library-mini-date">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDesign(design.id);
                    }}
                    className="library-mini-delete"
                    title="Delete Design"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-sm italic">
              No designs saved yet. Hit "Save Design" on the right to store them.
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

InputPanel.displayName = 'InputPanel'
