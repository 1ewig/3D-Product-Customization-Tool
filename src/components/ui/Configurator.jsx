import { useCustomizationStore } from '../../store/useCustomizationStore'
import { TextControls } from './TextControls'
import { LogoControls } from './LogoControls'
import { LibrarySidebar } from './LibrarySidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

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
    logoScale,
    setTextContent,
    setTextColor,
    setFontSize,
    setTextPosition,
    setTextRotation,
    setTextScale,
    setLogoUrl,
    setLogoPosition,
    setLogoRotation,
    setLogoScale
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
      toast.success('Design saved to server!', { icon: '✨' })
      queryClient.invalidateQueries({ queryKey: ['designs'] })
    },
    onError: (error) => {
      toast.error('Failed to save design: ' + error.message)
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'text' && <TextControls />}
        {activeTab === 'image' && <LogoControls />}
        {activeTab === 'library' && <LibrarySidebar />}
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
