import { memo } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const LibrarySidebar = memo(() => {
  const { 
    setCustomModelUrl,
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
      const response = await fetch('/api/designs')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/designs/${id}`, {
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
      console.error('Delete mutation failed:', error);
      toast.error('Error deleting: ' + error.message)
    }
  })

  const handleLoadDesign = async (id) => {
    const loadingToast = toast.loading('Fetching design data...')
    
    try {
      const response = await fetch(`/api/designs/${id}`)
      if (!response.ok) throw new Error('Failed to fetch design details')
      
      const design = await response.json()
      
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

      // Apply model if it was saved in this design payload
      if (design.model) {
        setCustomModelUrl(design.model.customModelUrl || null)
      } else {
        setCustomModelUrl(null)
      }
      
      toast.success('Design loaded!', { id: loadingToast, icon: '🎨' })
    } catch (error) {
      toast.error('Error loading design: ' + error.message, { id: loadingToast })
    }
  }


  return (
    <div className="library-content-area">
      <div className="section-header">
        <span>Saved Library</span>
        <button className="btn-reset" onClick={() => queryClient.invalidateQueries({ queryKey: ['designs'] })}>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-sm">Loading library...</div>
      ) : designs?.length > 0 ? (
        <div className="library-grid">
          {designs.map((design) => (
            <div key={design.id} className="library-item">
              <button
                onClick={() => handleLoadDesign(design.id)}
                className="premium-input library-btn"
              >
                <div className="library-btn-title">Design #{design.id.slice(-4)}</div>
                <div className="library-btn-meta">
                  {new Date(design.createdAt).toLocaleDateString()}
                </div>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm('Are you sure you want to delete this design?')) deleteMutation.mutate(design.id);
                }}
                className="toolbar-btn btn-delete-item"
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
        <div className="text-muted-sm italic">
          No designs saved yet.
        </div>
      )}
    </div>
  )
})

