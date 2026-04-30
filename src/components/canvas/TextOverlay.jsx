import { useMemo, forwardRef } from 'react'
import { useCustomizationStore } from '../../store/useCustomizationStore'
import { createTextTexture } from '../../utils/createTextTexture'

// forwardRef so SceneCanvas can attach TransformControls to this mesh
export const TextOverlay = forwardRef(function TextOverlay(_, ref) {
  const {
    textContent,
    textColor,
    fontSize,
    textPosition,
    textRotation,
    textScale,
  } = useCustomizationStore()

  const texture = useMemo(() => {
    if (!textContent) return null
    const tex = createTextTexture(textContent, fontSize, textColor)
    tex.needsUpdate = true
    return tex
  }, [textContent, textColor, fontSize])

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
})
