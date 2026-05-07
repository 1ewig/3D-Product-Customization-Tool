/**
 * Number Overlay Component
 * Projects a dynamically-generated HTML5 Canvas number texture directly onto
 * the surface of the target 3D model mesh.
 * Employs the Invisible Proxy Anchor pattern to cleanly decouple TransformControls 
 * gizmo interactions from the Drei <Decal> projection system.
 */

import { useMemo, forwardRef, useEffect, useRef, memo, useState } from 'react'
import * as THREE from 'three'
import { useThree, createPortal } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { createTextTexture } from '../../utils/createTextTexture'

export const NumberOverlay = memo(forwardRef(function NumberOverlay(_, ref) {
  // ─── SELECTIVE STORE SUBSCRIPTIONS ─────────────────────────────────────────
  const numberContent = useCustomizationStore(state => state.numberContent)
  const numberColor = useCustomizationStore(state => state.numberColor)
  const numberFontSize = useCustomizationStore(state => state.numberFontSize)
  const numberPosition = useCustomizationStore(state => state.numberPosition)
  const numberRotation = useCustomizationStore(state => state.numberRotation)
  const numberScale = useCustomizationStore(state => state.numberScale)
  const modelMeshes = useCustomizationStore(state => state.modelMeshes)

  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(null)

  // ─── CANVAS TEXTURE GENERATION ──────────────────────────────────────────────
  useEffect(() => {
    if (!numberContent) return

    if (!texture) {
      // Create texture for the first time
      const tex = createTextTexture(numberContent, numberFontSize, numberColor)
      canvasRef.current = tex.image
      setTexture(tex)
    } else {
      // In-place context update for speed and performance
      createTextTexture(numberContent, numberFontSize, numberColor, canvasRef.current)
      texture.needsUpdate = true
    }
  }, [numberContent, numberColor, numberFontSize, texture])

  // Clean up texture when overlay unmounts
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])

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

  // Ensure content is loaded, a texture exists, and at least one valid target mesh exists in the scene
  if (!numberContent || !texture || targetMeshes.length === 0) return null

  return (
    <>
      {/* 
        INVISIBLE PROXY ANCHOR
        Placed in world space at the exact position/rotation/scale of the number.
        TransformControls attaches to this mesh, allowing seamless gizmo manipulation 
        without dirtying the decal geometry during dragging.
      */}
      <mesh
        ref={ref}
        position={[numberPosition.x, numberPosition.y, 0]}
        rotation={[0, 0, numberRotation]}
        scale={[numberScale, numberScale, numberScale]}
        visible={false}
      >
        <boxGeometry args={[0.5, 0.125, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 
        MULTI-MESH DECAL PROJECTORS
        Loops through all active sub-meshes (collar, sleeves, front torso, etc.) 
        and projects the decal on each using shared world-space coordinates.
      */}
      {targetMeshes.map((mesh) => {
        // 1. Convert world-space coordinates into this mesh's local space
        const worldPos = new THREE.Vector3(numberPosition.x, numberPosition.y, 0)
        const localPos = mesh.worldToLocal(worldPos.clone())

        // 2. Adjust local scale relative to target mesh's actual world scale.
        const targetWorldScale = new THREE.Vector3()
        mesh.getWorldScale(targetWorldScale)

        const localScale = new THREE.Vector3(
          numberScale / targetWorldScale.x,
          (numberScale * 0.25) / targetWorldScale.y,
          0.6 // Thickness depth of projection box to capture curved surfaces cleanly
        )

        return (
          <group key={mesh.uuid}>
            {createPortal(
              <Decal
                mesh={{ current: mesh }}
                position={[localPos.x, localPos.y, localPos.z]}
                rotation={[0, 0, numberRotation]}
                scale={[localScale.x, localScale.y, localScale.z]}
                map={texture}
                transparent
                depthTest={true}
                depthWrite={false}
                side={THREE.FrontSide}
                polygonOffset={true}
                polygonOffsetFactor={-2}
              />,
              mesh
            )}
          </group>
        )
      })}
    </>
  )
}))
