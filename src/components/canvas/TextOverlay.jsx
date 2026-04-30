/**
 * Text Overlay Component
 * Renders a dynamic text texture on a plane mesh in 3D space.
 * Uses a 2D Canvas to generate the text texture in real-time.
 */

import { useMemo, forwardRef } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { createTextTexture } from '../../utils/createTextTexture'

// ForwardRef allows the parent (SceneCanvas) to attach TransformControls to this mesh
export const TextOverlay = forwardRef(function TextOverlay(_, ref) {
  // Extract state from global store
  const {
    textContent,
    textColor,
    fontSize,
    textPosition,
    textRotation,
    textScale,
  } = useCustomizationStore()

  /**
   * Generates a Three.js CanvasTexture containing the rendered text.
   * Only updates when content, color, or font size changes.
   */
  const texture = useMemo(() => {
    if (!textContent) return null
    const tex = createTextTexture(textContent, fontSize, textColor)
    tex.needsUpdate = true
    return tex
  }, [textContent, textColor, fontSize])

  // Hide the overlay if there is no content
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
        depthWrite={false} // Prevents "box" outline artifacts on the model
        polygonOffset={true} // Z-fighting prevention
        polygonOffsetFactor={-1} // Moves the overlay slightly "forward" in the depth buffer
      />
    </mesh>
  )
})
