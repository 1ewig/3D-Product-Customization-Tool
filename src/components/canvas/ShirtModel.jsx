import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useCustomizationStore, BUILTIN_MODELS } from '../../store/useCustomizationStore'

/**
 * Normalizes the scale and position of a GLTF scene so that it fits 
 * within a standard viewing volume and is centered at the origin.
 */
const NormalizedModel = ({ path, scale = 1.5 }) => {
  const { scene } = useGLTF(path)
  
  const setModelMeshes = useCustomizationStore(state => state.setModelMeshes)
  const highlightedMeshUuid = useCustomizationStore(state => state.highlightedMeshUuid)

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

  // Scan and parse all meshes inside the 3D model whenever a new scene is loaded
  useEffect(() => {
    if (!clonedScene) return

    const meshes = []
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        meshes.push({
          uuid: child.uuid,
          name: child.name || `Mesh (${child.geometry?.type || 'Geometry'})`,
          type: child.geometry?.type || 'Unknown'
        })
      }
    })

    setModelMeshes(meshes)

    return () => {
      setModelMeshes([])
    }
  }, [clonedScene, setModelMeshes])

  // Apply a glowing neon blue highlight material to the selected mesh in-place (very safe!)
  useEffect(() => {
    if (!clonedScene) return

    // Keep track of original materials we replaced to restore them cleanly
    const originalMaterials = new Map()

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (highlightedMeshUuid && child.uuid === highlightedMeshUuid) {
          // Store original material
          originalMaterials.set(child.uuid, child.material)
          
          // Apply a standard material configured as an emissive wireframe
          child.material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            roughness: 0.1,
            metalness: 0.8,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.5
          })
        }
      }
    })

    return () => {
      // Restore original materials when highlighted mesh changes or component unmounts
      clonedScene.traverse((child) => {
        if (child.isMesh && originalMaterials.has(child.uuid)) {
          child.material = originalMaterials.get(child.uuid)
        }
      })
    }
  }, [clonedScene, highlightedMeshUuid])

  return (
    <group scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  )
}

export const ShirtModel = () => {
  const customModelUrl = useCustomizationStore(state => state.customModelUrl)
  const currentModelIndex = useCustomizationStore(state => state.currentModelIndex)

  // Use uploaded model if available, otherwise fallback to active built-in model
  const activePath = customModelUrl || BUILTIN_MODELS[currentModelIndex]?.path || BUILTIN_MODELS[0].path

  return <NormalizedModel key={activePath} path={activePath} />
}

// Pre-load all available built-in models to prevent dynamic loading flicker
BUILTIN_MODELS.forEach((model) => {
  if (model.path) {
    useGLTF.preload(model.path)
  }
})
