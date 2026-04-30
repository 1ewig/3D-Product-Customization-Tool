import { create } from 'zustand'

export const useCustomizationStore = create((set) => ({
  // Text State
  textContent: '',
  textColor: '#ffffff',
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
}))
