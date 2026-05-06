/**
 * Configurator Sidebar Component
 * This is the main UI hub that holds the tabs for Text, Image, and Library.
 * Handles the visual rendering of tabs and footers, delegating interaction actions.
 */

import { useCustomizationStore } from '../../store/useCustomizationStore'
import { TextControls } from './TextControls'
import { LogoControls } from './LogoControls'
import { LibrarySidebar } from './LibrarySidebar'
import { useConfiguratorActions } from '../../hooks'

export const Configurator = () => {
  // ─── STATE SELECTIONS ──────────────────────────────────────────────────────
  const activeTab = useCustomizationStore(state => state.activeTab)
  const setActiveTab = useCustomizationStore(state => state.setActiveTab)
  
  // ─── DELEGATED ACTIONS HOOK ────────────────────────────────────────────────
  const {
    modelInputRef,
    isSaving,
    handleSave,
    handleDownload,
    handleModelUpload
  } = useConfiguratorActions()

  return (
    <div className="glass-panel h-full flex-column">
      <div className="tab-container">
        <button 
          className={`tab-item ${activeTab === 'text' ? 'active text' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
          Text
        </button>
        <button 
          className={`tab-item ${activeTab === 'image' ? 'active image' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Image
        </button>
        <button 
          className={`tab-item ${activeTab === 'library' ? 'active library' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Library
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-24">
        {activeTab === 'text' && <TextControls />}
        {activeTab === 'image' && <LogoControls />}
        {activeTab === 'library' && <LibrarySidebar />}
      </div>

      {/* ── Footer / Actions ── */}
      <div className="configurator-footer">
        <input 
          type="file" 
          accept=".glb" 
          className="d-none" 
          ref={modelInputRef}
          onChange={handleModelUpload}
        />
        
        <div className="flex-row gap-8">
          <button 
            className="btn-select btn-secondary m-0" 
            onClick={() => modelInputRef.current.click()}
          >
            Import GLB
          </button>
          <button 
            className="btn-select btn-secondary m-0" 
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        <button 
          className="btn-select active text btn-primary-large m-0" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Design'}
        </button>
      </div>
    </div>
  )
}
