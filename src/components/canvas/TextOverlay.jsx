/**
 * Text Overlay Component
 * Renders a dynamic text texture on a plane mesh in 3D space.
 * Uses a 2D Canvas to generate the text texture in real-time.
 */

import { useMemo, forwardRef, useEffect, useRef, memo, useState } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { createTextTexture } from '../../utils/createTextTexture'

// ForwardRef allows the parent (SceneCanvas) to attach TransformControls to this mesh
export const TextOverlay = memo(forwardRef(function TextOverlay(_, ref) {
  // ─── SELECTIVE SUBSCRIPTIONS ───────────────────────────────────────────────
  const textContent = useCustomizationStore(state => state.textContent)
  const textColor = useCustomizationStore(state => state.textColor)
  const fontSize = useCustomizationStore(state => state.fontSize)
  const textPosition = useCustomizationStore(state => state.textPosition)
  const textRotation = useCustomizationStore(state => state.textRotation)
  const textScale = useCustomizationStore(state => state.textScale)

  // We use state for the texture itself so that the initial creation triggers a re-render.
  // Subsequent updates will mutate the texture in-place for performance.
  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(null)

  /**
   * Initializes and updates the texture without creating new objects.
   */
  useEffect(() => {
    if (!textContent) return

    if (!texture) {
      // First time creation - triggers state update and re-render
      const tex = createTextTexture(textContent, fontSize, textColor)
      canvasRef.current = tex.image
      setTexture(tex)
    } else {
      // Update existing canvas in-place - high performance, no re-render needed
      // because Three.js monitors 'needsUpdate'
      createTextTexture(textContent, fontSize, textColor, canvasRef.current)
      texture.needsUpdate = true
    }
  }, [textContent, textColor, fontSize, texture])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])

  // Hide the overlay if there is no content or texture is not yet ready
  if (!textContent || !texture) return null

  return (
    <mesh
      ref={ref}
      position={[textPosition.x, textPosition.y, textPosition.z]}
      rotation={[0, 0, textRotation]}
      scale={[textScale, textScale, textScale]}
    >
      <planeGeometry args={[1, 0.5]} />
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


