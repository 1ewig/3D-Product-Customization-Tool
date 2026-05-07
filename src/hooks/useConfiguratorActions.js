import { useRef } from 'react'
import { useCustomizationStore } from '../store/useCustomizationStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const useConfiguratorActions = () => {
  const modelInputRef = useRef()
  const queryClient = useQueryClient()

  // ─── STATE & ACTION SELECTIONS ─────────────────────────────────────────────
  const customModelUrl = useCustomizationStore(state => state.customModelUrl)
  const setCustomModelUrl = useCustomizationStore(state => state.setCustomModelUrl)
  const currentModelIndex = useCustomizationStore(state => state.currentModelIndex)
  
  const textContent = useCustomizationStore(state => state.textContent)
  const textColor = useCustomizationStore(state => state.textColor)
  const fontSize = useCustomizationStore(state => state.fontSize)
  const textPosition = useCustomizationStore(state => state.textPosition)
  const textRotation = useCustomizationStore(state => state.textRotation)
  const textScale = useCustomizationStore(state => state.textScale)
  
  const numberContent = useCustomizationStore(state => state.numberContent)
  const numberColor = useCustomizationStore(state => state.numberColor)
  const numberFontSize = useCustomizationStore(state => state.numberFontSize)
  const numberPosition = useCustomizationStore(state => state.numberPosition)
  const numberRotation = useCustomizationStore(state => state.numberRotation)
  const numberScale = useCustomizationStore(state => state.numberScale)
  
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)

  // ─── SAVE MUTATION ──────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (designData) => {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
      })
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Design is too large to save on Vercel (Max 4.5MB). Try a smaller 3D model.')
        }
        throw new Error('Failed to save')
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success('Design saved to server!', { icon: '✨' })
      queryClient.invalidateQueries({ queryKey: ['designs'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  /**
   * Serializes current customization parameters and saves to library database.
   */
  const handleSave = () => {
    const designData = {
      text: { textContent, textColor, fontSize, textPosition, textRotation, textScale },
      number: { numberContent, numberColor, numberFontSize, numberPosition, numberRotation, numberScale },
      logo: { logoUrl, logoPosition, logoRotation, logoScale }
    }
    saveMutation.mutate(designData)
  }

  /**
   * Triggers browser download of a high-resolution snapshot of the WebGL canvas.
   */
  const handleDownload = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `custom-design-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      toast.success('Snapshot downloaded!', { icon: '📸' })
    }
  }

  /**
   * Processes uploaded .glb models, converts to Base64, and updates store state.
   */
  const handleModelUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.glb')) {
        toast.error('Please upload a .glb file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomModelUrl(reader.result)
        toast.success('Custom model imported!', { icon: '📦' })
      }
      reader.readAsDataURL(file)
    }
  }

  return {
    modelInputRef,
    isSaving: saveMutation.isPending,
    handleSave,
    handleDownload,
    handleModelUpload
  }
}
