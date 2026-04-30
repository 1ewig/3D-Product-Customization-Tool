import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ShirtModel } from './ShirtModel'

export const SceneCanvas = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enableZoom={true} enableRotate={true} />
      
      <Suspense fallback={null}>
        <ShirtModel />
      </Suspense>
    </Canvas>
  )
}
