import { useState, useEffect, forwardRef } from 'react'
import * as THREE from 'three'
import { useCustomizationStore } from '../../store/useCustomizationStore'

// forwardRef so SceneCanvas can attach TransformControls to this mesh
export const LogoOverlay = forwardRef(function LogoOverlay(_, ref) {
  const { logoUrl, logoPosition, logoRotation, logoScale } = useCustomizationStore()
  const [texture, setTexture] = useState(null)

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
})
