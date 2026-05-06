import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useCustomizationStore } from '../store/useCustomizationStore'

export const useLibraryActions = () => {
  // ─── STATE & ACTION SELECTIONS ─────────────────────────────────────────────
  const setCustomModelUrl = useCustomizationStore(state => state.setCustomModelUrl)
  const setCurrentModelIndex = useCustomizationStore(state => state.setCurrentModelIndex)
  const setTextContent = useCustomizationStore(state => state.setTextContent)
  const setTextColor = useCustomizationStore(state => state.setTextColor)
  const setFontSize = useCustomizationStore(state => state.setFontSize)
  const setTextPosition = useCustomizationStore(state => state.setTextPosition)
  const setTextRotation = useCustomizationStore(state => state.setTextRotation)
  const setTextScale = useCustomizationStore(state => state.setTextScale)
  const setLogoUrl = useCustomizationStore(state => state.setLogoUrl)
  const setLogoPosition = useCustomizationStore(state => state.setLogoPosition)
  const setLogoRotation = useCustomizationStore(state => state.setLogoRotation)
  const setLogoScale = useCustomizationStore(state => state.setLogoScale)

  const queryClient = useQueryClient()

  // ─── FETCH DESIGNS ─────────────────────────────────────────────────────────
  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const response = await fetch('/api/designs')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    }
  })

  // ─── DELETE MUTATION ───────────────────────────────────────────────────────
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
      console.error('Delete mutation failed:', error)
      toast.error('Error deleting: ' + error.message)
    }
  })

  /**
   * Fetches full serialized details of a design and applies them to state.
   */
  const handleLoadDesign = async (id) => {
    const loadingToast = toast.loading('Fetching design data...')
    
    try {
      const response = await fetch(`/api/designs/${id}`)
      if (!response.ok) throw new Error('Failed to fetch design details')
      
      const design = await response.json()
      
      // Update store parameters
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

      // Handle model selection
      if (design.model) {
        setCustomModelUrl(design.model.customModelUrl || null)
        setCurrentModelIndex(design.model.currentModelIndex || 0)
      } else {
        setCustomModelUrl(null)
        setCurrentModelIndex(0)
      }
      
      toast.success('Design loaded!', { id: loadingToast, icon: '🎨' })
    } catch (error) {
      toast.error('Error loading design: ' + error.message, { id: loadingToast })
    }
  }

  /**
   * Prompts and deletes a selected saved design.
   */
  const handleDeleteDesign = (id) => {
    if (confirm('Are you sure you want to delete this design?')) {
      deleteMutation.mutate(id)
    }
  }

  return {
    designs,
    isLoading,
    handleLoadDesign,
    handleDeleteDesign,
    refreshLibrary: () => queryClient.invalidateQueries({ queryKey: ['designs'] })
  }
}
