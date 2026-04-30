import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useCustomizationStore } from '../../store/useCustomizationStore'

// Primary default model
import defaultModelPath from '../../assets/t-shirt_low_poly.glb'

/**
 * Normalizes the scale and position of a GLTF scene so that it fits 
 * within a standard viewing volume and is centered at the origin.
 */
const NormalizedModel = ({ path, scale = 1.5 }) => {
  const { scene } = useGLTF(path)
  
  const clonedScene = useMemo(() => {
    // Clone to avoid mutation of cached scenes
    const clone = scene.clone(true)
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Normalize scale to fit a 1x1x1 volume
    const maxDim = Math.max(size.x, size.y, size.z)
    const normalizedScale = 1 / maxDim
    clone.scale.multiplyScalar(normalizedScale)

    // Re-calculate center and move to origin
    box.setFromObject(clone)
    box.getCenter(center)
    clone.position.sub(center)
    
    return clone
  }, [scene, path])

  return (
    <group scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  )
}

export const ShirtModel = () => {
  const { customModelUrl } = useCustomizationStore()

  // Use uploaded model if available, otherwise fallback to primary default
  const activePath = customModelUrl || defaultModelPath

  return <NormalizedModel key={activePath} path={activePath} />
}

// Pre-load default model
useGLTF.preload(defaultModelPath)
