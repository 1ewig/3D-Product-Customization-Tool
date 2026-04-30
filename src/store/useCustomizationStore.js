/**
 * Global State Management - Zustand
 * This store manages the entire customization state of the product,
 * including text properties, logo data, and UI interaction states.
 * It uses 'persist' middleware to save the user's progress in LocalStorage.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import defaultLogo from '../assets/default-logo.png'

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
      
      /**
       * Resets text properties to professional default preset.
       */
      resetText: () => set({
        textContent: 'CHAMPRO',
        textColor: '#000000',
        fontSize: 48,
        textPosition: { x: 0, y: 0.15, z: 0.35 },
        textRotation: 0,
        textScale: 1,
        selectedObject: null
      }),

      /**
       * Resets logo properties to professional default preset.
       */
      resetLogo: () => set({
        logoUrl: defaultLogo,
        logoPosition: { x: 0, y: -0.1, z: 0.36 },
        logoRotation: 0,
        logoScale: 0.6,
        selectedObject: null
      }),

      /**
       * Clears custom model and returns to default.
       */
      resetModel: () => set({
        customModelUrl: null
      }),
    }), 
    { 
      name: 'product-customization-storage' // Key used in LocalStorage
    }
  )
)
