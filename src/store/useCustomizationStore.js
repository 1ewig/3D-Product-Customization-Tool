import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import defaultLogo from '../assets/default-logo.png'

export const useCustomizationStore = create(
  persist(
    (set) => ({
  // Text State
  textContent: 'CHAMPRO',
  textColor: '#000000',
  fontSize: 48,
  textPosition: { x: 0, y: 0.15, z: 0.35 },
  textRotation: 0,
  textScale: 1,

  // Logo State
  logoUrl: defaultLogo,
  logoPosition: { x: 0, y: -0.1, z: 0.36 },
  logoRotation: 0,
  logoScale: 0.6,

  // Interaction State
  // null | 'text' | 'logo'
  selectedObject: null,
  // 'translate' | 'rotate' | 'scale'
  transformMode: 'translate',
  // 'text' | 'image' | 'library'
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
    textContent: 'CHAMPRO',
    textColor: '#000000',
    fontSize: 48,
    textPosition: { x: 0, y: 0.15, z: 0.35 },
    textRotation: 0,
    textScale: 1,
    selectedObject: null
  }),

  resetLogo: () => set({
    logoUrl: defaultLogo,
    logoPosition: { x: 0, y: -0.1, z: 0.36 },
    logoRotation: 0,
    logoScale: 0.6,
    selectedObject: null
  }),
}), { name: 'product-customization-storage' }))
