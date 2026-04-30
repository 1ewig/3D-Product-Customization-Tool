import { useCustomizationStore } from '../../store/useCustomizationStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

  // Fetch designs
  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/designs')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:5000/api/designs/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Design removed from library')
      queryClient.invalidateQueries({ queryKey: ['designs'] })
    },
    onError: (error) => {
      toast.error('Error deleting: ' + error.message)
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
              <div key={design.id} style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleLoadDesign(design)}
                  className="premium-input"
                  style={{ 
                    flex: 1,
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Are you sure you want to delete this design?')) deleteMutation.mutate(design.id);
                  }}
                  className="toolbar-btn"
                  style={{ 
                    marginTop: 'auto', 
                    marginBottom: 'auto', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                  title="Delete Design"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
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
