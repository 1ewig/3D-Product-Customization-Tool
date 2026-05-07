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
  const modelMeshes = useCustomizationStore(state => state.modelMeshes)

  // Use Drei's high-performance texture loader & caching hook
  const texture = useTexture(logoUrl)

  // ─── DYNAMIC TARGET MESHES IDENTIFICATION ────────────────────────────────────
  const { scene } = useThree()

  const targetMeshes = useMemo(() => {
    const meshes = []
    scene.traverse((child) => {
      if (child.isMesh && child.visible) {
        const name = child.name.toLowerCase()
        // Ignore decals, helpers, highlights, and wireframes
        if (
          !name.includes('decal') && 
          !name.includes('helper') && 
          !name.includes('highlight') && 
          !name.includes('wireframe')
        ) {
          meshes.push(child)
        }
      }
    })
    return meshes
  }, [scene, modelMeshes])

  // Ensure texture is fully loaded and at least one target mesh exists in the scene
  if (!logoUrl || !texture || targetMeshes.length === 0) return null

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
        MULTI-MESH DECAL PROJECTORS
        Loops through all active sub-meshes (collar, sleeves, front torso, etc.) 
        and projects the decal on each using shared world-space coordinates.
      */}
      {targetMeshes.map((mesh) => {
        // 1. Convert the store's world-space coordinates into this mesh's local coordinate system.
        // We lock the Z coordinate to 0 (the center of the model) to prevent the decal 
        // from being pulled away from the mesh surface.
        const worldPos = new THREE.Vector3(logoPosition.x, logoPosition.y, 0)
        const localPos = mesh.worldToLocal(worldPos.clone())

        // 2. Adjust local scale relative to this mesh's actual world scale,
        // and provide enough depth to the projection box (Z-axis) to pierce the mesh outer shell.
        const targetWorldScale = new THREE.Vector3()
        mesh.getWorldScale(targetWorldScale)

        const localScale = new THREE.Vector3(
          logoScale / targetWorldScale.x,
          logoScale / targetWorldScale.y,
          0.6 // Thickness depth of projection box to capture mesh surface curves cleanly
        )

        return (
          <group key={mesh.uuid}>
            {createPortal(
              <Decal
                mesh={{ current: mesh }}
                position={[localPos.x, localPos.y, localPos.z]}
                rotation={[0, 0, logoRotation]}
                scale={[localScale.x, localScale.y, localScale.z]}
                map={texture}
                transparent
                depthTest={true}
                depthWrite={false}
                side={THREE.FrontSide}
                polygonOffset={true}
                polygonOffsetFactor={-1}
              />,
              mesh
            )}
          </group>
        )
      })}
    </>
  )
}))
