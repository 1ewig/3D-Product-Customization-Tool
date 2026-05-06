import { useState } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const MeshDebugger = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Zustand state and actions
  const modelMeshes = useCustomizationStore(state => state.modelMeshes)
  const highlightedMeshUuid = useCustomizationStore(state => state.highlightedMeshUuid)
  const setHighlightedMeshUuid = useCustomizationStore(state => state.setHighlightedMeshUuid)

  /**
   * Toggles selection highlight for a specific mesh.
   */
  const handleMeshClick = (uuid) => {
    if (highlightedMeshUuid === uuid) {
      setHighlightedMeshUuid(null) // deselect
    } else {
      setHighlightedMeshUuid(uuid) // select & highlight
    }
  }

  return (
    <div className="mesh-debugger-container">
      {/* ── Toggle Trigger Button ── */}
      <button 
        className={`mesh-debugger-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close Mesh Debugger" : "Open Mesh Debugger"}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </button>

      {/* ── Collapsible Debug Panel ── */}
      {isOpen && (
        <div className="mesh-debugger-panel">
          <div className="mesh-debugger-header">
            <span className="mesh-debugger-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Mesh Debugger
            </span>
            <span className="mesh-debugger-subtitle">
              {modelMeshes.length} items
            </span>
          </div>

          <div className="mesh-debugger-list">
            {modelMeshes.length > 0 ? (
              modelMeshes.map((mesh) => (
                <button
                  key={mesh.uuid}
                  className={`mesh-debugger-item ${highlightedMeshUuid === mesh.uuid ? 'active' : ''}`}
                  onClick={() => handleMeshClick(mesh.uuid)}
                  title={`Click to highlight: ${mesh.name}`}
                >
                  <span className="mesh-debugger-item-name" title={mesh.name}>
                    {mesh.name}
                  </span>
                  <span className="mesh-debugger-item-type">
                    {mesh.type.replace('BufferGeometry', '') || 'Mesh'}
                  </span>
                </button>
              ))
            ) : (
              <div className="mesh-debugger-empty">
                No meshes detected in model
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
