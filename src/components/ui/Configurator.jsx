import { useCustomizationStore } from '../../store/useCustomizationStore'
import { TextControls } from './TextControls'
import { LogoControls } from './LogoControls'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

  // Fetch designs from server
  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/designs')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    }
  })

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

  const handleLoadDesign = (design) => {
    // Load Text
    setTextContent(design.text.textContent)
    setTextColor(design.text.textColor)
    setFontSize(design.text.fontSize)
    setTextPosition(design.text.textPosition)
    setTextRotation(design.text.textRotation)
    setTextScale(design.text.textScale)
    
    // Load Logo
    setLogoUrl(design.logo.logoUrl)
    setLogoPosition(design.logo.logoPosition)
    setLogoRotation(design.logo.logoRotation)
    setLogoScale(design.logo.logoScale)
    
    alert('🎨 Design loaded!')
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

        {/* ── Saved Designs List ── */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Saved Library</span>
            <button className="btn-reset" onClick={() => queryClient.invalidateQueries({ queryKey: ['designs'] })}>
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading library...</div>
          ) : designs?.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {designs.map((design) => (
                <button
                  key={design.id}
                  onClick={() => handleLoadDesign(design)}
                  className="premium-input"
                  style={{ 
                    textAlign: 'left', 
                    fontSize: '0.8rem', 
                    padding: '10px', 
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Design #{design.id.slice(-4)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(design.createdAt).toLocaleDateString()} at {new Date(design.createdAt).toLocaleTimeString()}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
              No designs saved yet.
            </div>
          )}
        </div>
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
