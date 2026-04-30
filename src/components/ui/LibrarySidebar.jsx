import { useCustomizationStore } from '../../store/useCustomizationStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const LibrarySidebar = () => {
  const { 
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

  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/designs')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    }
  })

  const handleLoadDesign = (design) => {
    setTextContent(design.text.textContent)
    setTextColor(design.text.textColor)
    setFontSize(design.text.fontSize)
    setTextPosition(design.text.textPosition)
    setTextRotation(design.text.textRotation)
    setTextScale(design.text.textScale)
    
    setLogoUrl(design.logo.logoUrl)
    setLogoPosition(design.logo.logoPosition)
    setLogoRotation(design.logo.logoRotation)
    setLogoScale(design.logo.logoScale)
    
    toast.success('Design loaded from library', { icon: '🎨' })
  }

  return (
    <div className="glass-panel library-container" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--glass-border)', borderLeft: 'none' }}>
      <div style={{ padding: '24px' }}>
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
                  padding: '12px', 
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>Design #{design.id.slice(-4)}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {new Date(design.createdAt).toLocaleDateString()}
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
  )
}
