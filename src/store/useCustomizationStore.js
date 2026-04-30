import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCustomizationStore = create(
  persist(
    (set) => ({
  // Text State
  textContent: '',
  textColor: '#000000',
  fontSize: 48,
  textPosition: { x: 0, y: 0, z: 0.3 },
  textRotation: 0,
  textScale: 1,

  // Logo State
  logoUrl: null,
  logoPosition: { x: 0, y: 0, z: 0.31 },
  logoRotation: 0,
  logoScale: 1,

  // Interaction State
  // null | 'text' | 'logo'
  selectedObject: null,
  // 'translate' | 'rotate' | 'scale'
  transformMode: 'translate',
  // 'text' | 'image'
  activeTab: 'text',

  // Setters
  setTextContent: (textContent) => set({ textContent }),
  setTextColor: (textColor) => set({ textColor }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTextPosition: (textPosition) => set({ textPosition }),
  setTextRotation: (textRotation) => set({ textRotation }),
  setTextScale: (textScale) => set({ textScale }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),
  setLogoPosition: (logoPosition) => set({ logoPosition }),
  setLogoRotation: (logoRotation) => set({ logoRotation }),
  setLogoScale: (logoScale) => set({ logoScale }),
  setSelectedObject: (selectedObject) => set({ selectedObject }),
  setTransformMode: (transformMode) => set({ transformMode }),
  setActiveTab: (activeTab) => set({ activeTab }),

  resetText: () => set({
    textContent: '',
    textColor: '#000000',
    fontSize: 48,
    textPosition: { x: 0, y: 0, z: 0.3 },
    textRotation: 0,
    textScale: 1,
    selectedObject: null
  }),

  resetLogo: () => set({
    logoUrl: null,
    logoPosition: { x: 0, y: 0, z: 0.31 },
    logoRotation: 0,
    logoScale: 1,
    selectedObject: null
  }),
}), { name: 'product-customization-storage' }))
