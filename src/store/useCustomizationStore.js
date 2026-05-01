/**
 * Global State Management - Zustand
 * This store manages the entire customization state of the product,
 * including text properties, logo data, and UI interaction states.
 * It uses 'persist' middleware to save the user's progress in LocalStorage.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import defaultLogo from '../assets/default-logo.png'

/**
 * Custom Debounced Storage Wrapper
 * Prevents expensive LocalStorage writes on every frame during slider movements.
 * This is critical when the state contains large Base64 model or image data.
 */
const createDebouncedStorage = (storage, wait = 250) => {
  let timeout
  return {
    getItem: (name) => storage.getItem(name),
    removeItem: (name) => storage.removeItem(name),
    setItem: (name, value) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        storage.setItem(name, value)
      }, wait)
    },
  }
}

export const useCustomizationStore = create(
  persist(
    (set) => ({
      // ─── PRODUCT / MODEL STATE ─────────────────────────────────────────────
      customModelUrl: null,               // URL or Base64 of a user-uploaded GLB model

      // ─── TEXT STATE ────────────────────────────────────────────────────────
      textContent: 'CHAMPRO',              // Current text content
      textColor: '#000000',               // Hex color of the text
      fontSize: 48,                       // Initial font size
      textPosition: { x: 0, y: 0.15, z: 0.35 }, // 3D coordinates for text placement
      textRotation: 0,                    // Rotation in radians
      textScale: 1,                       // Scale multiplier

      // ─── LOGO STATE ────────────────────────────────────────────────────────
      logoUrl: defaultLogo,               // Image URL (Remote or Base64)
      logoPosition: { x: 0, y: -0.1, z: 0.36 }, // 3D coordinates for logo placement
      logoRotation: 0,                    // Rotation in radians
      logoScale: 0.6,                     // Scale multiplier

      // ─── UI / INTERACTION STATE ────────────────────────────────────────────
      selectedObject: null,               // Currently selected for transform (null | 'text' | 'logo')
      transformMode: 'translate',         // Transformation mode ('translate' | 'rotate' | 'scale')
      activeTab: 'text',                  // Active sidebar tab ('text' | 'image' | 'library')

      // ─── SETTERS ───────────────────────────────────────────────────────────
      setCustomModelUrl: (customModelUrl) => set({ customModelUrl }),
      
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

      // ─── RESET ACTIONS ─────────────────────────────────────────────────────
      
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

      resetModel: () => set({
        customModelUrl: null
      }),
    }), 
    { 
      name: 'product-customization-storage',
      // Wrap the standard localStorage with our debouncer
      storage: createJSONStorage(() => createDebouncedStorage(localStorage, 500))
    }
  )
)

