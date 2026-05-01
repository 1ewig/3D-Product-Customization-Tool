/**
 * Configurator Sidebar Component
 * This is the main UI hub that holds the tabs for Text, Image, and Library.
 * It also handles the API mutation for saving designs to the backend.
 */

import { useRef } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { TextControls } from './TextControls'
import { LogoControls } from './LogoControls'
import { LibrarySidebar } from './LibrarySidebar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const Configurator = () => {
  const modelInputRef = useRef()
  // ─── SELECTIVE SUBSCRIPTIONS ───────────────────────────────────────────────

  const customModelUrl = useCustomizationStore(state => state.customModelUrl)
  const setCustomModelUrl = useCustomizationStore(state => state.setCustomModelUrl)
  const activeTab = useCustomizationStore(state => state.activeTab)
  const setActiveTab = useCustomizationStore(state => state.setActiveTab)
  
  // These are needed for the handleSave function
  const textContent = useCustomizationStore(state => state.textContent)
  const textColor = useCustomizationStore(state => state.textColor)
  const fontSize = useCustomizationStore(state => state.fontSize)
  const textPosition = useCustomizationStore(state => state.textPosition)
  const textRotation = useCustomizationStore(state => state.textRotation)
  const textScale = useCustomizationStore(state => state.textScale)
  
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)


  const queryClient = useQueryClient()

  // ─── API MUTATION ──────────────────────────────────────────────────────────
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

  const handleSave = () => {
    const designData = {
      text: { textContent, textColor, fontSize, textPosition, textRotation, textScale },
      logo: { logoUrl, logoPosition, logoRotation, logoScale },
      model: { customModelUrl }
    }
    saveMutation.mutate(designData)
  }

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

  const handleModelUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.glb')) {
        toast.error('Please upload a .glb file')
        return
      }

      // We convert to Base64 so the model is actually part of the design data.
      // This allows the model to "load" from the design library.
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomModelUrl(reader.result)
        toast.success('Custom model imported!', { icon: '📦' })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="glass-panel h-full flex-column">
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

      <div className="flex-1 overflow-y-auto p-24">
        {activeTab === 'text' && <TextControls />}
        {activeTab === 'image' && <LogoControls />}
        {activeTab === 'library' && <LibrarySidebar />}
      </div>

      {/* ── Footer / Actions ── */}
      <div className="configurator-footer">
        <input 
          type="file" 
          accept=".glb" 
          className="d-none" 
          ref={modelInputRef}
          onChange={handleModelUpload}
        />
        
        <div className="flex-row gap-8">
          <button 
            className="btn-select btn-secondary m-0" 
            onClick={() => modelInputRef.current.click()}
          >
            Import GLB
          </button>
          <button 
            className="btn-select btn-secondary m-0" 
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        <button 
          className="btn-select active text btn-primary-large m-0" 
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Design'}
        </button>
      </div>
    </div>
  )
}
