/**
 * Logo Overlay Component
 * Handles the loading and display of user-uploaded logo images.
 * Supports standard URLs and Base64 encoded strings.
 */

import { useState, useEffect, forwardRef, memo } from 'react'
import * as THREE from 'three'
import { useCustomizationStore } from '../../store/useCustomizationStore'

// ForwardRef allows the parent (SceneCanvas) to attach TransformControls to this mesh
export const LogoOverlay = memo(forwardRef(function LogoOverlay(_, ref) {
  // ─── SELECTIVE SUBSCRIPTIONS ───────────────────────────────────────────────
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)
  
  const [texture, setTexture] = useState(null)

  /**
   * Loads the image into a Three.js Texture whenever the URL changes.
   */
  useEffect(() => {
    if (!logoUrl) {
      setTexture(null)
      return
    }
    
    const loader = new THREE.TextureLoader()
    loader.load(logoUrl, (loadedTexture) => {
      loadedTexture.needsUpdate = true
      setTexture(loadedTexture)
    })

    return () => {
      // Note: We don't dispose here because the next texture is loading
    }
  }, [logoUrl])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (texture) texture.dispose()
    }
  }, [texture])

  // Don't render until the texture is fully loaded
  if (!logoUrl || !texture) return null

  return (
    <mesh
      ref={ref}
      position={[logoPosition.x, logoPosition.y, logoPosition.z]}
      rotation={[0, 0, logoRotation]}
      scale={[logoScale, logoScale, logoScale]}
    >
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-1}
      />
    </mesh>
  )
}))

