import { toast } from 'react-hot-toast'
import { useCustomizationStore, BUILTIN_MODELS } from '../../store/useCustomizationStore'

export const ViewportToolbar = ({ orbitRef }) => {
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)
  const currentModelIndex = useCustomizationStore(state => state.currentModelIndex)
  const setCurrentModelIndex = useCustomizationStore(state => state.setCurrentModelIndex)
  const customModelUrl = useCustomizationStore(state => state.customModelUrl)
  const setCustomModelUrl = useCustomizationStore(state => state.setCustomModelUrl)

  const handleReset = () => {
    if (orbitRef.current) {
      orbitRef.current.reset()
    }
  }

  const handleZoomIn = () => {
    if (orbitRef.current) {
      const camera = orbitRef.current.object
      camera.position.multiplyScalar(0.9)
    }
  }

  const handleZoomOut = () => {
    if (orbitRef.current) {
      const camera = orbitRef.current.object
      camera.position.multiplyScalar(1.1)
    }
  }

  const handleDeselect = () => {
    setSelectedObject(null)
  }

  const handleCycleModel = () => {
    if (customModelUrl) {
      setCustomModelUrl(null)
    }
    const nextIndex = (currentModelIndex + 1) % BUILTIN_MODELS.length
    setCurrentModelIndex(nextIndex)
    toast.success(`Active Model: ${BUILTIN_MODELS[nextIndex].name}`, {
      icon: '👕',
      id: 'model-cycle-toast'
    })
  }

  return (
    <div className="viewport-toolbar">
      <button className="toolbar-btn" onClick={handleReset} title="Reset View">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      <button className="toolbar-btn" onClick={handleCycleModel} title="Cycle 3D Model">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 5v4a2 2 0 0 0 2 2h2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V11h2a2 2 0 0 0 2-2V5l-3-3H6z" />
          <path d="M10 2a2 2 0 0 0 4 0" />
        </svg>
      </button>
      
      <div className="toolbar-divider" />
      
      <button className="toolbar-btn" onClick={handleZoomIn} title="Zoom In">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      
      <button className="toolbar-btn" onClick={handleZoomOut} title="Zoom Out">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      
      <div className="toolbar-divider" />
      
      <button className="toolbar-btn" onClick={handleDeselect} title="Clear Selection">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
