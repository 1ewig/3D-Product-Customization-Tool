/**
 * Global State Management - Zustand
 * This store manages the entire customization state of the product,
 * including text properties, logo data, and UI interaction states.
 * It uses 'persist' middleware to save the user's progress in LocalStorage.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import defaultLogo from '../assets/default-logo.png'

// import lowPolyTShirt from '../assets/models/t-shirt_low_poly.glb'
// import standardTShirt from '../assets/models/standard_t-shirt.glb'
// import oversizedTShirt from '../assets/models/oversized_t-shirt.glb'
// import womensShirt from '../assets/models/womens_shirt.glb'
// import collaredShirt from '../assets/models/shirt.glb'
import soccerShorts from '../assets/models/soccer_shorts.glb'
import soccerShirt from '../assets/models/soccer_shirt.glb'

export const BUILTIN_MODELS = [
  // { id: 'low-poly-tshirt', name: 'Classic Low-Poly T-Shirt', path: lowPolyTShirt },
  // { id: 'standard-tshirt', name: 'Standard T-Shirt', path: standardTShirt },
  // { id: 'oversized-tshirt', name: 'Oversized T-Shirt', path: oversizedTShirt },
  // { id: 'womens-shirt', name: 'Womens Shirt', path: womensShirt },
  // { id: 'collared-shirt', name: 'Collared Shirt', path: collaredShirt },
  { id: 'soccer-shirt', name: 'Soccer Shirt', path: soccerShirt },
  { id: 'soccer-shorts', name: 'Soccer Shorts', path: soccerShorts }
]

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
      currentModelIndex: 0,               // Index of the active built-in model
      
      // ─── TRANSIENT DEBUG / MESH DEBUGGER STATE ──────────────────────────────
      modelMeshes: [],                    // List of meshes detected in the loaded 3D model
      highlightedMeshUuid: null,          // UUID of currently highlighted mesh

      // ─── TEXT STATE ────────────────────────────────────────────────────────
      textContent: 'CHAMPRO',              // Current text content
      textColor: '#000000',               // Hex color of the text
      fontSize: 48,                       // Initial font size
      textPosition: { x: 0, y: 0.15, z: 0 }, // 3D coordinates for text placement
      textRotation: 0,                    // Rotation in radians
      textScale: 1,                       // Scale multiplier

      // ─── NUMBER STATE ──────────────────────────────────────────────────────
      numberContent: '07',                // Current player number content
      numberColor: '#000000',             // Hex color of the number
      numberFontSize: 72,                 // Initial number font size
      numberPosition: { x: 0, y: -0.15, z: 0 }, // 3D coordinates for number placement (positioned lower)
      numberRotation: 0,                  // Rotation in radians
      numberScale: 0.8,                   // Scale multiplier

      // ─── LOGO STATE ────────────────────────────────────────────────────────
      logoUrl: defaultLogo,               // Image URL (Remote or Base64)
      logoPosition: { x: 0, y: -0.1, z: 0 }, // 3D coordinates for logo placement
      logoRotation: 0,                    // Rotation in radians
      logoScale: 0.6,                     // Scale multiplier

      // ─── UI / INTERACTION STATE ────────────────────────────────────────────
      selectedObject: null,               // Currently selected for transform (null | 'text' | 'number' | 'logo')
      transformMode: 'translate',         // Transformation mode ('translate' | 'rotate' | 'scale')
      activeTab: 'text',                  // Active sidebar tab ('text' | 'number' | 'image' | 'library')

      // ─── SETTERS ───────────────────────────────────────────────────────────
      setCustomModelUrl: (customModelUrl) => set({ customModelUrl }),
      setCurrentModelIndex: (currentModelIndex) => set({ currentModelIndex }),
      setModelMeshes: (modelMeshes) => set({ modelMeshes }),
      setHighlightedMeshUuid: (highlightedMeshUuid) => set({ highlightedMeshUuid }),
      
      setTextContent: (textContent) => set({ textContent }),
      setTextColor: (textColor) => set({ textColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTextPosition: (textPosition) => set({ textPosition }),
      setTextRotation: (textRotation) => set({ textRotation }),
      setTextScale: (textScale) => set({ textScale }),

      setNumberContent: (numberContent) => set({ numberContent }),
      setNumberColor: (numberColor) => set({ numberColor }),
      setNumberFontSize: (numberFontSize) => set({ numberFontSize }),
      setNumberPosition: (numberPosition) => set({ numberPosition }),
      setNumberRotation: (numberRotation) => set({ numberRotation }),
      setNumberScale: (numberScale) => set({ numberScale }),
      
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
        textPosition: { x: 0, y: 0.15, z: 0 },
        textRotation: 0,
        textScale: 1,
        selectedObject: null
      }),

      resetTextTransform: () => set({
        fontSize: 48,
        textPosition: { x: 0, y: 0.15, z: 0 },
        textRotation: 0,
        textScale: 1
      }),

      resetNumber: () => set({
        numberContent: '07',
        numberColor: '#000000',
        numberFontSize: 72,
        numberPosition: { x: 0, y: -0.15, z: 0 },
        numberRotation: 0,
        numberScale: 0.8,
        selectedObject: null
      }),

      resetNumberTransform: () => set({
        numberFontSize: 72,
        numberPosition: { x: 0, y: -0.15, z: 0 },
        numberRotation: 0,
        numberScale: 0.8
      }),

      resetLogo: () => set({
        logoUrl: defaultLogo,
        logoPosition: { x: 0, y: -0.1, z: 0 },
        logoRotation: 0,
        logoScale: 0.6,
        selectedObject: null
      }),

      resetLogoTransform: () => set({
        logoPosition: { x: 0, y: -0.1, z: 0 },
        logoRotation: 0,
        logoScale: 0.6
      }),

      resetModel: () => set({
        customModelUrl: null,
        currentModelIndex: 0,
        modelMeshes: [],
        highlightedMeshUuid: null
      }),
    }), 
    { 
      name: 'product-customization-storage',
      // Wrap the standard localStorage with our debouncer
      storage: createJSONStorage(() => createDebouncedStorage(localStorage, 500)),
      // Exclude non-serializable and transient debug values from storage persistence
      partialize: (state) => {
        const { modelMeshes, highlightedMeshUuid, ...persistedState } = state
        return persistedState
      }
    }
  )
)

