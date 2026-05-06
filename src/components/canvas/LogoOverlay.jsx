/**
 * Logo Overlay Component
 * Projects a logo texture directly onto the surface of the target 3D model mesh.
 * Employs an Invisible Proxy Anchor pattern to cleanly decouple TransformControls 
 * gizmo interactions from the dynamic Drei <Decal> projection system.
 */

import { useMemo, forwardRef, memo } from 'react'
import * as THREE from 'three'
import { useThree, createPortal } from '@react-three/fiber'
import { Decal, useTexture } from '@react-three/drei'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const LogoOverlay = memo(forwardRef(function LogoOverlay(_, ref) {
  // ─── SELECTIVE STORE SUBSCRIPTIONS ─────────────────────────────────────────
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  const logoPosition = useCustomizationStore(state => state.logoPosition)
  const logoRotation = useCustomizationStore(state => state.logoRotation)
  const logoScale = useCustomizationStore(state => state.logoScale)
  const highlightedMeshUuid = useCustomizationStore(state => state.highlightedMeshUuid)
  const modelMeshes = useCustomizationStore(state => state.modelMeshes)

  // Use Drei's high-performance texture loader & caching hook
  const texture = useTexture(logoUrl)

  // ─── DYNAMIC TARGET MESH IDENTIFICATION ─────────────────────────────────────
  const { scene } = useThree()

  const targetMesh = useMemo(() => {
    let selected = null

    // 1. If a specific sub-mesh is selected/highlighted in the Mesh Debugger, target it
    if (highlightedMeshUuid) {
      scene.traverse((child) => {
        if (child.isMesh && child.uuid === highlightedMeshUuid) {
          selected = child
        }
      })
    }

    // 2. Otherwise, look for the main apparel body/fabric mesh of the active model
    if (!selected) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Ignore debug wireframes, helpers, and decals
          const name = child.name.toLowerCase()
          if (name.includes('decal') || name.includes('helper') || name.includes('highlight')) {
            return
          }
          // Prioritize standard body/shirt/shorts meshes
          if (name.includes('body') || name.includes('shirt') || name.includes('shorts') || name.includes('fabric')) {
            selected = child
          }
        }
      })
    }

    // 3. Fallback to the first valid mesh in the active model
    if (!selected) {
      scene.traverse((child) => {
        if (child.isMesh) {
          const name = child.name.toLowerCase()
          if (!name.includes('decal') && !name.includes('helper') && !name.includes('highlight')) {
            if (!selected) selected = child
          }
        }
      })
    }

    return selected
  }, [scene, highlightedMeshUuid, modelMeshes])

  // ─── COORDINATE CONVERSION (WORLD -> MESH-LOCAL) ───────────────────────────
  const decalParams = useMemo(() => {
    if (!targetMesh) return null

    // 1. Convert the store's world-space coordinates into the target mesh's local coordinate system.
    // We lock the Z coordinate to 0 (the center of the model) to prevent the decal 
    // from being pulled away from the mesh surface.
    const worldPos = new THREE.Vector3(logoPosition.x, logoPosition.y, 0)
    const localPos = targetMesh.worldToLocal(worldPos.clone())

    // 2. Adjust local scale relative to the target mesh's actual world scale,
    // and provide enough depth to the projection box (Z-axis) to pierce the model's outer shell.
    const targetWorldScale = new THREE.Vector3()
    targetMesh.getWorldScale(targetWorldScale)

    const localScale = new THREE.Vector3(
      logoScale / targetWorldScale.x,
      logoScale / targetWorldScale.y,
      0.6 // Thickness depth of projection box to capture mesh surface curves cleanly
    )

    return {
      position: [localPos.x, localPos.y, localPos.z],
      scale: [localScale.x, localScale.y, localScale.z]
    }
  }, [targetMesh, logoPosition, logoScale])

  // Ensure texture is fully loaded and a target mesh exists in the scene
  if (!logoUrl || !texture || !targetMesh) return null

  return (
    <>
      {/* 
        INVISIBLE PROXY ANCHOR
        Placed in world space at the exact position/rotation/scale of the logo.
        TransformControls attaches to this mesh, allowing seamless gizmo manipulation 
        without dirtying the decal geometry during dragging.
      */}
      <mesh
        ref={ref}
        position={[logoPosition.x, logoPosition.y, 0]}
        rotation={[0, 0, logoRotation]}
        scale={[logoScale, logoScale, logoScale]}
        visible={false}
      >
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 
        ACTUAL DECAL PROJECTOR
        Receives converted mesh-local position and scale parameters,
        projecting the texture onto the curved surface of the targetMesh dynamically.
      */}
      {decalParams && createPortal(
        <Decal
          mesh={{ current: targetMesh }}
          position={decalParams.position}
          rotation={[0, 0, logoRotation]}
          scale={decalParams.scale}
          map={texture}
          transparent
          depthTest={true}
          depthWrite={false}
          side={THREE.FrontSide}
        />,
        targetMesh
      )}
    </>
  )
}))
