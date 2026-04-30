import { Suspense, useRef, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, PerspectiveCamera, TransformControls } from '@react-three/drei'
import { ShirtModel } from './ShirtModel'
import { TextOverlay } from './TextOverlay'
import { LogoOverlay } from './LogoOverlay'
import { ViewportToolbar } from '../ui'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const SceneCanvas = () => {
  const orbitRef = useRef()
  const textMeshRef = useRef()
  const logoMeshRef = useRef()

  // We use local state to force a re-render after refs are populated
  const [textMounted, setTextMounted] = useState(false)
  const [logoMounted, setLogoMounted] = useState(false)

  const {
    selectedObject,
    setSelectedObject,
    transformMode,
    textContent,
    logoUrl,
    setTextPosition,
    setTextRotation,
    setTextScale,
    setLogoPosition,
    setLogoRotation,
    setLogoScale,
  } = useCustomizationStore()

  // Sync TransformControls changes back to the Zustand store
  const handleTransformChange = useCallback(() => {
    if (selectedObject === 'text' && textMeshRef.current) {
      const m = textMeshRef.current
      setTextPosition({ x: +m.position.x.toFixed(3), y: +m.position.y.toFixed(3), z: +m.position.z.toFixed(3) })
      setTextRotation(+m.rotation.z.toFixed(3))
      setTextScale(+m.scale.x.toFixed(3))
    } else if (selectedObject === 'logo' && logoMeshRef.current) {
      const m = logoMeshRef.current
      setLogoPosition({ x: +m.position.x.toFixed(3), y: +m.position.y.toFixed(3), z: +m.position.z.toFixed(3) })
      setLogoRotation(+m.rotation.z.toFixed(3))
      setLogoScale(+m.scale.x.toFixed(3))
    }
  }, [selectedObject, setTextPosition, setTextRotation, setTextScale, setLogoPosition, setLogoRotation, setLogoScale])

  // Disable OrbitControls while dragging the gizmo to prevent conflict
  const handleDragStart = () => {
    if (orbitRef.current) orbitRef.current.enabled = false
  }
  const handleDragEnd = () => {
    if (orbitRef.current) orbitRef.current.enabled = true
    handleTransformChange()
  }

  // Click on empty canvas to deselect
  const handleCanvasPointerMissed = () => {
    setSelectedObject(null)
  }

  // Ref callback for text mesh – triggers re-render so TransformControls can attach
  const textRefCallback = useCallback((node) => {
    textMeshRef.current = node
    setTextMounted(!!node)
  }, [])

  // Ref callback for logo mesh
  const logoRefCallback = useCallback((node) => {
    logoMeshRef.current = node
    setLogoMounted(!!node)
  }, [])

  const showTextGizmo = selectedObject === 'text' && textContent && textMounted && textMeshRef.current
  const showLogoGizmo = selectedObject === 'logo' && logoUrl && logoMounted && logoMeshRef.current

  return (
    <>
      <Canvas
      style={{ width: '100%', height: '100vh' }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={handleCanvasPointerMissed}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />

      <OrbitControls
        ref={orbitRef}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={6}
      />

      <Suspense fallback={null}>
        <Center>
          <ShirtModel />
        </Center>

        {textContent && <TextOverlay ref={textRefCallback} />}
        {logoUrl && <LogoOverlay ref={logoRefCallback} />}

        {showTextGizmo && (
          <TransformControls
            object={textMeshRef.current}
            mode={transformMode}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onChange={handleTransformChange}
          />
        )}

        {showLogoGizmo && (
          <TransformControls
            object={logoMeshRef.current}
            mode={transformMode}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onChange={handleTransformChange}
          />
        )}
      </Suspense>

      <ViewportToolbar orbitRef={orbitRef} />
    </>
  )
}
