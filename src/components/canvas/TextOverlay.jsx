/**
 * Text Overlay Component
 * Projects a dynamically-generated HTML5 Canvas text texture directly onto
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

export const TextOverlay = memo(forwardRef(function TextOverlay(_, ref) {
  // ─── SELECTIVE STORE SUBSCRIPTIONS ─────────────────────────────────────────
  const textContent = useCustomizationStore(state => state.textContent)
  const textColor = useCustomizationStore(state => state.textColor)
  const fontSize = useCustomizationStore(state => state.fontSize)
  const textPosition = useCustomizationStore(state => state.textPosition)
  const textRotation = useCustomizationStore(state => state.textRotation)
  const textScale = useCustomizationStore(state => state.textScale)
  const highlightedMeshUuid = useCustomizationStore(state => state.highlightedMeshUuid)
  const modelMeshes = useCustomizationStore(state => state.modelMeshes)

  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(null)

  // ─── CANVAS TEXTURE GENERATION ──────────────────────────────────────────────
  useEffect(() => {
    if (!textContent) return

    if (!texture) {
      // Create texture for the first time
      const tex = createTextTexture(textContent, fontSize, textColor)
      canvasRef.current = tex.image
      setTexture(tex)
    } else {
      // In-place context update for speed and performance
      createTextTexture(textContent, fontSize, textColor, canvasRef.current)
      texture.needsUpdate = true
    }
  }, [textContent, textColor, fontSize, texture])

  // Clean up texture when overlay unmounts
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])

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

    // 1. Convert world-space coordinates into the target mesh's local space
    // We lock the Z coordinate to 0 (the center of the model) to prevent the decal 
    // from being pulled away from the mesh surface.
    const worldPos = new THREE.Vector3(textPosition.x, textPosition.y, 0)
    const localPos = targetMesh.worldToLocal(worldPos.clone())

    // 2. Adjust local scale relative to target mesh's actual world scale.
    // The canvas is rendered in a 2:1 aspect ratio, so we scale the Y height by 0.5
    // relative to the uniform textScale width to keep the letters perfectly proportioned.
    const targetWorldScale = new THREE.Vector3()
    targetMesh.getWorldScale(targetWorldScale)

    const localScale = new THREE.Vector3(
      textScale / targetWorldScale.x,
      (textScale * 0.5) / targetWorldScale.y,
      0.6 // Thickness depth of projection box to capture curved surfaces cleanly
    )

    return {
      position: [localPos.x, localPos.y, localPos.z],
      scale: [localScale.x, localScale.y, localScale.z]
    }
  }, [targetMesh, textPosition, textScale])

  // Ensure content is loaded, a texture exists, and a valid target mesh is in the scene
  if (!textContent || !texture || !targetMesh) return null

  return (
    <>
      {/* 
        INVISIBLE PROXY ANCHOR
        Placed in world space at the exact position/rotation/scale of the text.
        TransformControls attaches to this mesh, allowing seamless gizmo manipulation 
        without dirtying the decal geometry during dragging.
      */}
      <mesh
        ref={ref}
        position={[textPosition.x, textPosition.y, 0]}
        rotation={[0, 0, textRotation]}
        scale={[textScale, textScale, textScale]}
        visible={false}
      >
        <boxGeometry args={[0.5, 0.25, 0.5]} />
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
          rotation={[0, 0, textRotation]}
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
