import { useCustomizationStore } from '../../store/useCustomizationStore'
import { TextControls } from './TextControls'
import { LogoControls } from './LogoControls'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const Configurator = () => {
  const { 
    activeTab, 
    setActiveTab,
    textContent,
    textColor,
    fontSize,
    textPosition,
    textRotation,
    textScale,
    logoUrl,
    logoPosition,
    logoRotation,
    logoScale
  } = useCustomizationStore()

  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: async (designData) => {
      const response = await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
      })
      if (!response.ok) throw new Error('Failed to save')
      return response.json()
    },
    onSuccess: () => {
      alert('✨ Design saved successfully to the server!')
      queryClient.invalidateQueries({ queryKey: ['designs'] })
    },
    onError: (error) => {
      alert('❌ Error saving design: ' + error.message)
    }
  })

  const handleSave = () => {
    const designData = {
      text: { textContent, textColor, fontSize, textPosition, textRotation, textScale },
      logo: { logoUrl, logoPosition, logoRotation, logoScale }
    }
    saveMutation.mutate(designData)
  }

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'text' ? <TextControls /> : <LogoControls />}
      </div>

      {/* ── Footer / Save Section ── */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
        <button 
          className="btn-select active text" 
          style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Design to Server'}
        </button>
      </div>
    </div>
  )
}
