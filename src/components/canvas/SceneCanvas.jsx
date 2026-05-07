/**
 * Main 3D Scene Component
 * This component sets up the Three.js Canvas, lighting, camera, and controls.
 * It manages the coordination between the 3D model, overlays, and interactive gizmos.
 */

import { Suspense, useRef, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, PerspectiveCamera, TransformControls } from '@react-three/drei'
import { ShirtModel } from './ShirtModel'
import { TextOverlay } from './TextOverlay'
import { NumberOverlay } from './NumberOverlay'
import { LogoOverlay } from './LogoOverlay'
import { ViewportToolbar, MeshDebugger } from '../ui'
import { useCustomizationStore } from '../../store/useCustomizationStore'

export const SceneCanvas = () => {
  // ─── REFS ──────────────────────────────────────────────────────────────────
  const orbitRef = useRef()        // Reference to OrbitControls to enable/disable during drag
  const textMeshRef = useRef()     // Reference to the text overlay mesh for TransformControls
  const numberMeshRef = useRef()   // Reference to the player number overlay mesh for TransformControls
  const logoMeshRef = useRef()     // Reference to the logo overlay mesh for TransformControls

  // Local state to track when overlays are actually rendered in the DOM/Scene
  const [textMounted, setTextMounted] = useState(false)
  const [numberMounted, setNumberMounted] = useState(false)
  const [logoMounted, setLogoMounted] = useState(false)

  // ─── STORE STATE ───────────────────────────────────────────────────────────
  const selectedObject = useCustomizationStore(state => state.selectedObject)
  const setSelectedObject = useCustomizationStore(state => state.setSelectedObject)
  const transformMode = useCustomizationStore(state => state.transformMode)
  const textContent = useCustomizationStore(state => state.textContent)
  const numberContent = useCustomizationStore(state => state.numberContent)
  const logoUrl = useCustomizationStore(state => state.logoUrl)
  
  const setTextPosition = useCustomizationStore(state => state.setTextPosition)
  const setTextRotation = useCustomizationStore(state => state.setTextRotation)
  const setTextScale = useCustomizationStore(state => state.setTextScale)

  const setNumberPosition = useCustomizationStore(state => state.setNumberPosition)
  const setNumberRotation = useCustomizationStore(state => state.setNumberRotation)
  const setNumberScale = useCustomizationStore(state => state.setNumberScale)

  const setLogoPosition = useCustomizationStore(state => state.setLogoPosition)
  const setLogoRotation = useCustomizationStore(state => state.setLogoRotation)
  const setLogoScale = useCustomizationStore(state => state.setLogoScale)

  /**
   * Synchronizes the 3D mesh transformation back to the global store.
   * Called whenever the user manipulates the TransformControls gizmo.
   */
  const handleTransformChange = useCallback(() => {
    if (selectedObject === 'text' && textMeshRef.current) {
      const m = textMeshRef.current
      setTextPosition({ x: +m.position.x.toFixed(3), y: +m.position.y.toFixed(3), z: +m.position.z.toFixed(3) })
      setTextRotation(+m.rotation.z.toFixed(3))
      setTextScale(+m.scale.x.toFixed(3))
    } else if (selectedObject === 'number' && numberMeshRef.current) {
      const m = numberMeshRef.current
      setNumberPosition({ x: +m.position.x.toFixed(3), y: +m.position.y.toFixed(3), z: +m.position.z.toFixed(3) })
      setNumberRotation(+m.rotation.z.toFixed(3))
      setNumberScale(+m.scale.x.toFixed(3))
    } else if (selectedObject === 'logo' && logoMeshRef.current) {
      const m = logoMeshRef.current
      setLogoPosition({ x: +m.position.x.toFixed(3), y: +m.position.y.toFixed(3), z: +m.position.z.toFixed(3) })
      setLogoRotation(+m.rotation.z.toFixed(3))
      setLogoScale(+m.scale.x.toFixed(3))
    }
  }, [
    selectedObject,
    setTextPosition, setTextRotation, setTextScale,
    setNumberPosition, setNumberRotation, setNumberScale,
    setLogoPosition, setLogoRotation, setLogoScale
  ])


  // Disable camera rotation while the user is dragging the gizmo
  const handleDragStart = () => {
    if (orbitRef.current) orbitRef.current.enabled = false
  }
  
  // Re-enable camera rotation and sync final position when dragging ends
  const handleDragEnd = () => {
    if (orbitRef.current) orbitRef.current.enabled = true
    handleTransformChange()
  }

  // Deselect objects when clicking on empty space
  const handleCanvasPointerMissed = () => {
    setSelectedObject(null)
  }

  // Ref callbacks to trigger re-renders so TransformControls can attach to the nodes
  const textRefCallback = useCallback((node) => {
    textMeshRef.current = node
    setTextMounted(!!node)
  }, [])

  const numberRefCallback = useCallback((node) => {
    numberMeshRef.current = node
    setNumberMounted(!!node)
  }, [])

  const logoRefCallback = useCallback((node) => {
    logoMeshRef.current = node
    setLogoMounted(!!node)
  }, [])

  // Visibility logic for Transform Gizmos
  const showTextGizmo = selectedObject === 'text' && textContent && textMounted && textMeshRef.current
  const showNumberGizmo = selectedObject === 'number' && numberContent && numberMounted && numberMeshRef.current
  const showLogoGizmo = selectedObject === 'logo' && logoUrl && logoMounted && logoMeshRef.current

  return (
    <>
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onPointerMissed={handleCanvasPointerMissed}
      >
        {/* Camera and Lighting */}
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />

        {/* View Controls */}
        <OrbitControls
          ref={orbitRef}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={6}
        />

        <Suspense fallback={null}>
          {/* Main 3D Model centered in the viewport */}
          <Center>
            <ShirtModel />
          </Center>



          {/* Subtly illuminated Ground Studio Grid */}
          <gridHelper
            args={[8, 16, '#3b82f6', '#3b82f6']}
            position={[0, -0.85, 0]}
          >
            <lineBasicMaterial
              attach="material"
              color="#3b82f6"
              transparent
              opacity={0.06}
              depthWrite={false}
            />
          </gridHelper>

          {/* Overlays */}
          {textContent && <TextOverlay ref={textRefCallback} />}
          {numberContent && <NumberOverlay ref={numberRefCallback} />}
          {logoUrl && (
            <Suspense fallback={null}>
              <LogoOverlay ref={logoRefCallback} />
            </Suspense>
          )}

          {/* Interaction Gizmos (Translation/Rotation/Scaling tools) */}
          {showTextGizmo && (
            <TransformControls
              object={textMeshRef.current}
              mode={transformMode}
              showZ={false}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onChange={handleTransformChange}
            />
          )}

          {showNumberGizmo && (
            <TransformControls
              object={numberMeshRef.current}
              mode={transformMode}
              showZ={false}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onChange={handleTransformChange}
            />
          )}

          {showLogoGizmo && (
            <TransformControls
              object={logoMeshRef.current}
              mode={transformMode}
              showZ={false}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onChange={handleTransformChange}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Floating Toolbar for scene-level controls */}
      <ViewportToolbar orbitRef={orbitRef} />

      {/* Floating Mesh Debugger Panel in the top-left */}
      <MeshDebugger />
    </>
  )
}
