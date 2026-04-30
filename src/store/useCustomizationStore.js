import { create } from 'zustand'

export const useCustomizationStore = create((set) => ({
  // Text State
  textContent: '',
  textColor: '#ffffff',
  fontSize: 48,
  textPosition: { x: 0, y: 0 },
  textRotation: 0,
  textScale: 1,

  // Logo State
  logoUrl: null,
  logoPosition: { x: 0, y: 0 },
  logoRotation: 0,
  logoScale: 1,

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
}))
