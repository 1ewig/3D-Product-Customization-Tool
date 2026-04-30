/**
 * Logo Overlay Component
 * Handles the loading and display of user-uploaded logo images.
 * Supports standard URLs and Base64 encoded strings.
 */

import { useState, useEffect, forwardRef } from 'react'
import * as THREE from 'three'
import { useCustomizationStore } from '../../store/useCustomizationStore'

// ForwardRef allows the parent (SceneCanvas) to attach TransformControls to this mesh
export const LogoOverlay = forwardRef(function LogoOverlay(_, ref) {
  // Extract state from global store
  const { logoUrl, logoPosition, logoRotation, logoScale } = useCustomizationStore()
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
  }, [logoUrl])

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
        depthWrite={false} // Prevents "box" outline artifacts on the model
        polygonOffset={true} // Z-fighting prevention
        polygonOffsetFactor={-1} // Moves the overlay slightly "forward" in the depth buffer
      />
    </mesh>
  )
})
